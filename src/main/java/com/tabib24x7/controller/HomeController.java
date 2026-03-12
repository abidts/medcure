package com.tabib24x7.controller;

import com.tabib24x7.model.Appointment;
import com.tabib24x7.model.Doctor;
import com.tabib24x7.model.DoctorEducation;
import com.tabib24x7.model.Patient;
import com.tabib24x7.model.Specialization;
import com.tabib24x7.service.AppointmentService;
import com.tabib24x7.service.DoctorService;
import com.tabib24x7.service.PatientService;
import com.tabib24x7.service.SpecializationService;
import com.tabib24x7.service.DoctorAvailabilityService;
import com.tabib24x7.service.DoctorEducationService;
import com.tabib24x7.service.DoctorServicesService;
import com.tabib24x7.service.AboutUsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Controller
public class HomeController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private SpecializationService specializationService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private DoctorAvailabilityService availabilityService;

    @Autowired
    private DoctorEducationService educationService;

    @Autowired
    private DoctorServicesService doctorServicesService;

    @Autowired
    private AboutUsService aboutUsService;

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("doctors", doctorService.getAvailableDoctors());
        model.addAttribute("specializations", specializationService.getAllSpecializations());
        return "home";
    }

    @GetMapping("/doctors")
    public String doctors(@RequestParam(required = false) Long specializationId,
                          @RequestParam(required = false) String city,
                          @RequestParam(required = false) String specialization,
                          @RequestParam(required = false) Double lat,
                          @RequestParam(required = false) Double lon,
                          Model model) {
        List<Doctor> doctors;

        // Search by GPS coordinates
        if (lat != null && lon != null) {
            doctors = doctorService.getAvailableDoctors(); // Will be filtered by JS
        }
        // Search by city
        else if (city != null && !city.isEmpty()) {
            doctors = doctorService.getAvailableDoctors().stream()
                    .filter(d -> city.equalsIgnoreCase(d.getCity()))
                    .toList();
        }
        // Search by specialization name
        else if (specialization != null && !specialization.isEmpty()) {
            doctors = doctorService.getAvailableDoctors().stream()
                    .filter(d -> d.getSpecialization() != null &&
                            d.getSpecialization().getName().toLowerCase()
                                    .contains(specialization.toLowerCase()))
                    .toList();
        }
        // Search by specialization ID
        else if (specializationId != null) {
            doctors = doctorService.getDoctorsBySpecialization(specializationId);
        }
        // Show all available doctors
        else {
            doctors = doctorService.getAvailableDoctors();
        }

        model.addAttribute("doctors", doctors);
        model.addAttribute("specializations", specializationService.getAllSpecializations());
        return "doctors";
    }

    @GetMapping("/doctors/{id}")
    public String doctorDetail(@PathVariable Long id, Model model) {
        Doctor doctor = doctorService.getDoctorById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        model.addAttribute("doctor", doctor);
        
        // Fetch and add doctor's education, services, and specializations
        List<DoctorEducation> educations = educationService.getEducationsByDoctorId(id);
        model.addAttribute("educations", educations);
        
        List<com.tabib24x7.model.DoctorService> services = doctorServicesService.getServicesByDoctorId(id);
        model.addAttribute("services", services);
        
        List<Specialization> specializations = specializationService.getAllSpecializations();
        model.addAttribute("allSpecializations", specializations);
        
        return "doctor-detail";
    }

    @GetMapping("/appointments/new")
    public String newAppointmentForm(@RequestParam Long doctorId, Model model) {
        Doctor doctor = doctorService.getDoctorById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        model.addAttribute("doctor", doctor);
        model.addAttribute("appointment", new Appointment());
        model.addAttribute("patients", patientService.getAllPatients());
        model.addAttribute("availabilities", availabilityService.getActiveAvailabilities(doctorId));
        return "appointment-form";
    }

    @GetMapping("/appointments")
    public String listAppointments(Model model) {
        model.addAttribute("appointments", appointmentService.getAllAppointments());
        return "appointments";
    }

    @PostMapping("/appointments")
    public String createAppointment(@ModelAttribute Appointment appointment,
                                    @RequestParam Long patientId,
                                    @RequestParam Long doctorId,
                                    @RequestParam String appointmentDate,
                                    @RequestParam String appointmentTime,
                                    @RequestParam(required = false) String consultationType,
                                    RedirectAttributes redirectAttributes) {
        Patient patient = patientService.getPatientById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorService.getDoctorById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        LocalDate date = LocalDate.parse(appointmentDate);
        LocalTime time = LocalTime.parse(appointmentTime);

        // Validate against doctor's availability
        com.tabib24x7.model.DoctorAvailability.ConsultationType availType =
            consultationType != null ?
            com.tabib24x7.model.DoctorAvailability.ConsultationType.valueOf(consultationType) :
            com.tabib24x7.model.DoctorAvailability.ConsultationType.CLINIC;

        boolean isAvailable = availabilityService.isTimeSlotAvailable(
            doctorId, date.getDayOfWeek(), time, availType);

        if (!isAvailable) {
            redirectAttributes.addFlashAttribute("error",
                "The selected time slot is not available. Please choose a time within the doctor's available hours.");
            redirectAttributes.addFlashAttribute("doctor", doctor);
            redirectAttributes.addFlashAttribute("patients", patientService.getAllPatients());
            return "redirect:/appointments/new?doctorId=" + doctorId;
        }

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(date);
        appointment.setAppointmentTime(time);

        // Convert DoctorAvailability.ConsultationType to Appointment.ConsultationType
        appointment.setConsultationType(Appointment.ConsultationType.valueOf(availType.name()));

        appointmentService.createAppointment(appointment);

        // Redirect to success page with appointment ID
        return "redirect:/appointments/success?appointmentId=" + appointment.getId();
    }

    @GetMapping("/appointments/success")
    public String appointmentSuccess(Model model, @RequestParam(required = false) Long appointmentId) {
        // Load appointment if ID is provided
        if (appointmentId != null) {
            appointmentService.getAppointmentById(appointmentId).ifPresent(appointment ->
                model.addAttribute("appointment", appointment));
        }
        return "appointment-success";
    }

    @GetMapping("/patients/register")
    public String patientRegistrationForm(Model model) {
        model.addAttribute("patient", new Patient());
        return "patient-register";
    }

    @PostMapping("/patients")
    public String registerPatient(@ModelAttribute Patient patient,
                                  @RequestParam String password,
                                  RedirectAttributes redirectAttributes) {
        // Check if email already exists
        if (patientService.getPatientByEmail(patient.getEmail()).isPresent()) {
            redirectAttributes.addFlashAttribute("error", "Email already registered");
            return "redirect:/patients/register";
        }

        patient.setPassword("HASH_" + password);
        patient.setRegistrationDate(LocalDate.now());
        patientService.createPatient(patient);
        return "redirect:/patient/login?registered=true";
    }

    // New routes for authentication and dashboards
    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/doctor-register")
    public String doctorRegisterPage() {
        return "doctor-register";
    }

    @GetMapping("/about-us")
    public String aboutUsPage(Model model) {
        aboutUsService.getActiveAboutUs().ifPresent(aboutUs -> 
            model.addAttribute("aboutUs", aboutUs));
        return "about-us";
    }

    @GetMapping("/doctor-dashboard")
    public String doctorDashboardPage(@RequestParam(required = false) Long doctorId, Model model) {
        if (doctorId != null) {
            model.addAttribute("doctorId", doctorId);
        }
        return "doctor-dashboard";
    }

    @GetMapping("/staff/dashboard")
    public String staffDashboardPage() {
        return "staff-dashboard";
    }

    @GetMapping("/admin-panel")
    public String adminPanelPage() {
        return "admin-panel";
    }

    // Also support .html extension for direct access
    @GetMapping("/login.html")
    public String loginPageHtml() {
        return "redirect:/login";
    }

    @GetMapping("/doctor-register.html")
    public String doctorRegisterPageHtml() {
        return "redirect:/doctor-register";
    }

    @GetMapping("/doctor-dashboard.html")
    public String doctorDashboardPageHtml() {
        return "redirect:/doctor-dashboard";
    }

    @GetMapping("/admin-panel.html")
    public String adminPanelPageHtml() {
        return "redirect:/admin-panel";
    }

    /**
     * API endpoint to get doctors by district
     */
    @GetMapping("/api/home/doctors/by-district")
    @ResponseBody
    public List<Doctor> getDoctorsByDistrict(@RequestParam String district) {
        return doctorService.getAvailableDoctors().stream()
                .filter(d -> district.equalsIgnoreCase(d.getDistrict()))
                .toList();
    }

    /**
     * API endpoint to get all districts with doctors
     */
    @GetMapping("/api/home/districts")
    @ResponseBody
    public List<String> getAllDistricts() {
        return doctorService.getAvailableDoctors().stream()
                .map(Doctor::getDistrict)
                .filter(d -> d != null && !d.isEmpty())
                .distinct()
                .sorted()
                .toList();
    }

    /**
     * Video call page for an appointment
     * Only accessible to the doctor and patient of that appointment
     *
     * NOTE: For production, add HTTPS requirement and proper authentication check.
     * Browsers require HTTPS for camera/microphone access (except on localhost).
     */
    @GetMapping("/appointments/{id}/call")
    public String videoCall(@PathVariable Long id, Model model) {
        Appointment appointment = appointmentService.getAppointmentById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        model.addAttribute("appointment", appointment);
        model.addAttribute("appointmentId", id);

        return "video-call";
    }

    /**
     * Video call page for instant video call requests
     */
    @GetMapping("/doctor/video-call")
    public String doctorVideoCallRequest(@RequestParam Long requestId, Model model) {
        model.addAttribute("requestId", requestId);
        return "video-call";
    }
}
