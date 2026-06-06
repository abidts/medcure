package com.sehat24x7.controller;

import com.sehat24x7.model.Appointment;
import com.sehat24x7.model.Doctor;
import com.sehat24x7.model.DoctorAvailability;
import com.sehat24x7.model.DoctorEducation;
import com.sehat24x7.model.DoctorStatus;
import com.sehat24x7.repository.AppointmentRepository;
import com.sehat24x7.repository.DoctorRepository;
import com.sehat24x7.service.CloudinaryService;
import com.sehat24x7.service.DoctorAvailabilityService;
import com.sehat24x7.service.DoctorEducationService;
import com.sehat24x7.service.DoctorServicesService;
import com.sehat24x7.service.DoctorService;
import com.sehat24x7.service.DoctorStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@RestController
@RequestMapping("/api/doctor/dashboard")
@CrossOrigin(origins = "*")
public class DoctorDashboardController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorStatusService doctorStatusService;

    @Autowired
    private com.sehat24x7.service.MedicalReportService medicalReportService;

    @Autowired
    private DoctorAvailabilityService availabilityService;

    @Autowired
    private DoctorEducationService educationService;

    @Autowired
    private DoctorServicesService doctorServicesService;

    @Autowired
    private CloudinaryService cloudinaryService;

    // Get patient medical reports
    @GetMapping("/patient/{patientId}/reports")
    public ResponseEntity<?> getPatientReports(@PathVariable Long patientId) {
        try {
            List<com.sehat24x7.model.MedicalReport> reports = medicalReportService.getReportsByPatient(patientId);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get doctor profile by user ID
    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getDoctorProfile(@PathVariable Long userId) {
        Optional<Doctor> doctorOpt = doctorService.getDoctorByUserId(userId);
        if (doctorOpt.isPresent()) {
            Doctor doctor = doctorOpt.get();
            // Add education and services to the response
            Map<String, Object> response = new HashMap<>();
            response.put("id", doctor.getId());
            response.put("name", doctor.getName());
            response.put("email", doctor.getEmail());
            response.put("phone", doctor.getPhone());
            response.put("qualification", doctor.getQualification());
            response.put("experience", doctor.getExperience());
            response.put("clinicAddress", doctor.getClinicAddress());
            response.put("consultationFee", doctor.getConsultationFee());
            response.put("specializations", doctor.getSpecializations());
            response.put("image", doctor.getImage());
            response.put("educations", educationService.getEducationsByDoctorId(doctor.getId()));
            response.put("services", doctorServicesService.getServicesByDoctorId(doctor.getId()));
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    // Update doctor profile
    @PutMapping("/profile/{doctorId}")
    public ResponseEntity<?> updateDoctorProfile(@PathVariable Long doctorId, @RequestBody Map<String, Object> profileData) {
        try {
            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));

            // Update basic fields
            if (profileData.containsKey("name")) doctor.setName((String) profileData.get("name"));
            if (profileData.containsKey("phone")) doctor.setPhone((String) profileData.get("phone"));
            if (profileData.containsKey("qualification")) doctor.setQualification((String) profileData.get("qualification"));
            if (profileData.containsKey("experience")) doctor.setExperience((String) profileData.get("experience"));
            if (profileData.containsKey("clinicAddress")) doctor.setClinicAddress((String) profileData.get("clinicAddress"));
            if (profileData.containsKey("consultationFee")) {
                Object fee = profileData.get("consultationFee");
                if (fee instanceof Number) {
                    doctor.setConsultationFee(((Number) fee).doubleValue());
                }
            }
            if (profileData.containsKey("specializations")) doctor.setSpecializations((String) profileData.get("specializations"));
            if (profileData.containsKey("image")) doctor.setImage((String) profileData.get("image"));

            doctor = doctorRepository.save(doctor);

            // Update educations
            if (profileData.containsKey("educations")) {
                educationService.deleteEducationsByDoctorId(doctorId);
                List<Map<String, Object>> educations = (List<Map<String, Object>>) profileData.get("educations");
                for (Map<String, Object> edu : educations) {
                    DoctorEducation education = new DoctorEducation();
                    education.setDoctor(doctor);
                    education.setInstitute((String) edu.get("institute"));
                    education.setDegreeCourse((String) edu.get("degreeCourse"));
                    education.setYear(((Number) edu.get("year")).intValue());
                    educationService.createEducation(education);
                }
            }

            // Update services
            if (profileData.containsKey("services")) {
                doctorServicesService.deleteServicesByDoctorId(doctorId);
                List<Map<String, Object>> services = (List<Map<String, Object>>) profileData.get("services");
                for (Map<String, Object> svc : services) {
                    com.sehat24x7.model.DoctorService service = new com.sehat24x7.model.DoctorService();
                    service.setDoctor(doctor);
                    service.setServiceName((String) svc.get("serviceName"));
                    service.setDescription((String) svc.get("description"));
                    doctorServicesService.createService(service);
                }
            }

            return ResponseEntity.ok(doctor);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/profile/{doctorId}/image")
    public ResponseEntity<?> uploadProfileImage(@PathVariable Long doctorId, @RequestParam("file") MultipartFile file) {
        try {
            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));

            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Please select an image"));
            }

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Only image files are allowed"));
            }

            Map uploadResult = cloudinaryService.upload(file, "doctor-profile");
            String imageUrl = (String) uploadResult.get("secure_url");
            doctor.setImage(imageUrl);
            doctorRepository.save(doctor);

            return ResponseEntity.ok(Map.of("success", true, "image", imageUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/profile/{doctorId}/image")
    public ResponseEntity<?> removeProfileImage(@PathVariable Long doctorId) {
        try {
            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            doctor.setImage(null);
            doctorRepository.save(doctor);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get all availabilities for a doctor
    @GetMapping("/availability/{doctorId}")
    public ResponseEntity<List<DoctorAvailability>> getAvailabilities(@PathVariable Long doctorId) {
        List<DoctorAvailability> availabilities = availabilityService.getActiveAvailabilities(doctorId);
        return ResponseEntity.ok(availabilities);
    }

    // Create availability
    @PostMapping("/availability")
    public ResponseEntity<?> createAvailability(@RequestBody Map<String, Object> availabilityData) {
        try {
            Long doctorId = ((Number) availabilityData.get("doctorId")).longValue();
            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            
            DoctorAvailability availability = new DoctorAvailability();
            availability.setDoctor(doctor);
            availability.setDayOfWeek(java.time.DayOfWeek.valueOf((String) availabilityData.get("dayOfWeek")));
            availability.setStartTime(java.time.LocalTime.parse((String) availabilityData.get("startTime")));
            availability.setEndTime(java.time.LocalTime.parse((String) availabilityData.get("endTime")));
            availability.setConsultationType(DoctorAvailability.ConsultationType.valueOf((String) availabilityData.get("consultationType")));
            availability.setSlotDurationMinutes(((Number) availabilityData.get("slotDurationMinutes")).intValue());
            availability.setIsActive(availabilityData.get("isActive") != null ? (Boolean) availabilityData.get("isActive") : true);
            
            DoctorAvailability created = availabilityService.createAvailability(availability);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Update availability
    @PutMapping("/availability/{id}")
    public ResponseEntity<?> updateAvailability(@PathVariable Long id, @RequestBody DoctorAvailability availability) {
        try {
            DoctorAvailability updated = availabilityService.updateAvailability(id, availability);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete availability
    @DeleteMapping("/availability/{id}")
    public ResponseEntity<?> deleteAvailability(@PathVariable Long id) {
        try {
            availabilityService.deleteAvailability(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get appointments by date range
    @GetMapping("/appointments/{doctorId}")
    public ResponseEntity<Map<String, Object>> getAppointments(
            @PathVariable Long doctorId,
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        List<Appointment> appointments;
        LocalDate today = LocalDate.now();

        switch (filter != null ? filter : "today") {
            case "today":
                appointments = appointmentRepository.findByDoctorAndAppointmentDate(doctor, today);
                break;
            case "tomorrow":
                appointments = appointmentRepository.findByDoctorAndAppointmentDate(doctor, today.plusDays(1));
                break;
            case "upcoming":
                appointments = appointmentRepository.findUpcomingAppointments(doctor, today);
                break;
            case "all":
                appointments = appointmentRepository.findByDoctor(doctor);
                break;
            case "range":
                if (startDate == null || endDate == null) {
                    throw new RuntimeException("Start date and end date are required for range filter");
                }
                appointments = appointmentRepository.findAppointmentsInDateRange(doctor, startDate, endDate);
                break;
            default:
                appointments = appointmentRepository.findByDoctorAndAppointmentDate(doctor, today);
        }

        // Sort by date and time
        appointments.sort(Comparator.comparing(Appointment::getAppointmentDate)
                .thenComparing(Appointment::getAppointmentTime));

        Map<String, Object> response = new HashMap<>();
        response.put("appointments", appointments);
        response.put("count", appointments.size());
        response.put("filter", filter != null ? filter : "today");

        return ResponseEntity.ok(response);
    }

    // Update appointment status
    @PutMapping("/appointments/{appointmentId}/status")
    public ResponseEntity<?> updateAppointmentStatus(
            @PathVariable Long appointmentId,
            @RequestBody Map<String, String> statusUpdate) {

        try {
            Appointment appointment = appointmentRepository.findById(appointmentId)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));

            String statusStr = statusUpdate.get("status");
            Appointment.AppointmentStatus status = Appointment.AppointmentStatus.valueOf(statusStr);
            appointment.setStatus(status);

            // Add notes if provided
            if (statusUpdate.containsKey("notes")) {
                appointment.setNotes(statusUpdate.get("notes"));
            }

            Appointment updated = appointmentRepository.save(appointment);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Check if time slot is available
    @GetMapping("/check-availability/{doctorId}")
    public ResponseEntity<Map<String, Object>> checkTimeSlotAvailability(
            @PathVariable Long doctorId,
            @RequestParam DayOfWeek dayOfWeek,
            @RequestParam String time,
            @RequestParam DoctorAvailability.ConsultationType type) {

        LocalTime localTime = LocalTime.parse(time);
        boolean isAvailable = availabilityService.isTimeSlotAvailable(doctorId, dayOfWeek, localTime, type);

        Map<String, Object> response = new HashMap<>();
        response.put("available", isAvailable);
        response.put("dayOfWeek", dayOfWeek);
        response.put("time", time);
        response.put("consultationType", type);

        return ResponseEntity.ok(response);
    }

    // Toggle doctor online status
    @PostMapping("/toggle-online/{doctorId}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<Map<String, Object>> toggleDoctorOnlineStatus(@PathVariable Long doctorId) {
        try {
            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));

            doctor.setOnlineStatus(!Boolean.TRUE.equals(doctor.getOnlineStatus()));
            doctorRepository.save(doctor);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("onlineStatus", doctor.getOnlineStatus());
            response.put("message", Boolean.TRUE.equals(doctor.getOnlineStatus()) ? "You are now online" : "You are now offline");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error toggling status: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Get doctor online status
    @GetMapping("/online-status/{doctorId}")
    public ResponseEntity<Map<String, Object>> getDoctorOnlineStatus(@PathVariable Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        Map<String, Object> response = new HashMap<>();
        response.put("onlineStatus", doctor.getOnlineStatus());
        
        return ResponseEntity.ok(response);
    }

    // Get dashboard statistics
    @GetMapping("/stats/{doctorId}")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@PathVariable Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        LocalDate today = LocalDate.now();
        List<Appointment> todayAppointments = appointmentRepository.findByDoctorAndAppointmentDate(doctor, today);
        List<Appointment> pendingAppointments = appointmentRepository.findByDoctorAndStatus(doctor, Appointment.AppointmentStatus.PENDING);
        List<Appointment> completedAppointments = appointmentRepository.findByDoctorAndStatus(doctor, Appointment.AppointmentStatus.COMPLETED);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAppointments", appointmentRepository.findByDoctor(doctor).size());
        stats.put("todayAppointments", todayAppointments.size());
        stats.put("pendingAppointments", pendingAppointments.size());
        stats.put("completedAppointments", completedAppointments.size());
        stats.put("activeAvailabilities", availabilityService.getActiveAvailabilities(doctorId).size());

        return ResponseEntity.ok(stats);
    }

    // Toggle doctor online/offline status
    @PostMapping("/toggle-status/{doctorId}")
    public ResponseEntity<Map<String, Object>> toggleDoctorStatus(@PathVariable Long doctorId) {
        try {
            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));

            DoctorStatus updatedStatus = doctorStatusService.toggleStatus(doctor);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("status", updatedStatus.getStatus().toString());
            response.put("isOnline", updatedStatus.getStatus() == DoctorStatus.Status.ONLINE);
            response.put("message", updatedStatus.getStatus() == DoctorStatus.Status.ONLINE ?
                "You are now online and available for consultations" :
                "You are now offline");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Get available time slots for a specific date (for patient booking)
    @GetMapping("/available-slots/{doctorId}")
    public ResponseEntity<Map<String, Object>> getAvailableTimeSlots(
            @PathVariable Long doctorId,
            @RequestParam LocalDate date,
            @RequestParam(required = false) DoctorAvailability.ConsultationType type) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        List<DoctorAvailability> availabilities = type != null ?
                availabilityService.getAvailabilitiesByType(doctorId, type) :
                availabilityService.getActiveAvailabilities(doctorId);

        // Filter by day of week
        java.time.DayOfWeek dayOfWeek = date.getDayOfWeek();
        List<DoctorAvailability> dayAvailabilities = availabilities.stream()
                .filter(a -> a.getDayOfWeek() == dayOfWeek && a.getIsActive())
                .toList();

        // Get already booked slots for the date
        List<Appointment> bookedAppointments = appointmentRepository.findByDoctorAndAppointmentDate(doctor, date);
        List<LocalTime> bookedTimes = bookedAppointments.stream()
                .filter(a -> a.getStatus() != Appointment.AppointmentStatus.CANCELLED)
                .map(Appointment::getAppointmentTime)
                .toList();

        // Generate available slots
        List<Map<String, Object>> availableSlots = new ArrayList<>();
        for (DoctorAvailability availability : dayAvailabilities) {
            LocalTime currentTime = availability.getStartTime();
            LocalTime endTime = availability.getEndTime();
            final int duration = availability.getSlotDurationMinutes();

            while (currentTime.isBefore(endTime)) {
                final LocalTime currentSlot = currentTime;
                LocalTime slotEnd = currentSlot.plusMinutes(duration);
                if (!slotEnd.isAfter(endTime)) {
                    boolean isBooked = bookedTimes.stream()
                            .anyMatch(bt -> !bt.isBefore(currentSlot) && bt.isBefore(slotEnd));

                    if (!isBooked) {
                        Map<String, Object> slot = new HashMap<>();
                        slot.put("startTime", currentSlot.toString());
                        slot.put("endTime", slotEnd.toString());
                        slot.put("consultationType", availability.getConsultationType().toString());
                        availableSlots.add(slot);
                    }
                }
                currentTime = slotEnd;
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("date", date);
        response.put("doctorId", doctorId);
        response.put("availableSlots", availableSlots);
        response.put("slotCount", availableSlots.size());

        return ResponseEntity.ok(response);
    }
}
