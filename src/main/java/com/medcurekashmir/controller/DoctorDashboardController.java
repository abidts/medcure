package com.medcurekashmir.controller;

import com.medcurekashmir.model.Appointment;
import com.medcurekashmir.model.Doctor;
import com.medcurekashmir.model.DoctorAvailability;
import com.medcurekashmir.model.DoctorStatus;
import com.medcurekashmir.repository.AppointmentRepository;
import com.medcurekashmir.repository.DoctorRepository;
import com.medcurekashmir.service.DoctorAvailabilityService;
import com.medcurekashmir.service.DoctorService;
import com.medcurekashmir.service.DoctorStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    private DoctorAvailabilityService availabilityService;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorStatusService doctorStatusService;

    // Get doctor profile by user ID
    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getDoctorProfile(@PathVariable Long userId) {
        Optional<Doctor> doctorOpt = doctorService.getDoctorByUserId(userId);
        return doctorOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update doctor profile
    @PutMapping("/profile/{doctorId}")
    public ResponseEntity<?> updateDoctorProfile(@PathVariable Long doctorId, @RequestBody Doctor doctor) {
        try {
            Doctor updated = doctorService.updateDoctor(doctorId, doctor);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
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
    public ResponseEntity<?> createAvailability(@RequestBody DoctorAvailability availability) {
        try {
            DoctorAvailability created = availabilityService.createAvailability(availability);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
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
