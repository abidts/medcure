package com.tabib24x7.controller;

import com.tabib24x7.model.Appointment;
import com.tabib24x7.model.Patient;
import com.tabib24x7.service.AppointmentService;
import com.tabib24x7.service.PatientService;
import com.tabib24x7.service.VideoCallRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/patient")
public class PatientPortalController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private VideoCallRequestService videoCallRequestService;

    // Patient Dashboard
    @GetMapping("/dashboard")
    public String patientDashboard(@RequestParam Long patientId, Model model) {
        Patient patient = patientService.getPatientById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        List<Appointment> appointments = appointmentService.getAppointmentsByPatientId(patientId);

        // Calculate statistics
        long totalAppointments = appointments.size();
        long pendingAppointments = appointments.stream()
                .filter(a -> a.getStatus() == Appointment.AppointmentStatus.PENDING)
                .count();
        long confirmedAppointments = appointments.stream()
                .filter(a -> a.getStatus() == Appointment.AppointmentStatus.CONFIRMED)
                .count();
        long completedAppointments = appointments.stream()
                .filter(a -> a.getStatus() == Appointment.AppointmentStatus.COMPLETED)
                .count();

        model.addAttribute("patient", patient);
        model.addAttribute("appointments", appointments);
        model.addAttribute("totalAppointments", totalAppointments);
        model.addAttribute("pendingAppointments", pendingAppointments);
        model.addAttribute("confirmedAppointments", confirmedAppointments);
        model.addAttribute("completedAppointments", completedAppointments);

        return "patient-dashboard";
    }

    // Patient Profile
    @GetMapping("/profile")
    public String patientProfile(@RequestParam Long patientId, Model model) {
        Patient patient = patientService.getPatientById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        model.addAttribute("patient", patient);
        return "patient-profile";
    }

    // Update Patient Profile
    @PostMapping("/profile/update")
    public String updateProfile(@RequestParam Long patientId,
                                @ModelAttribute Patient patient,
                                RedirectAttributes redirectAttributes) {
        try {
            patientService.updatePatient(patientId, patient);
            redirectAttributes.addFlashAttribute("success", "Profile updated successfully");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Failed to update profile");
        }
        return "redirect:/patient/profile?patientId=" + patientId;
    }

    // Cancel Appointment
    @PostMapping("/appointment/cancel")
    @ResponseBody
    public ResponseEntity<?> cancelAppointment(@RequestParam Long appointmentId,
                                               @RequestParam Long patientId) {
        try {
            Appointment appointment = appointmentService.getAppointmentById(appointmentId)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));

            if (!appointment.getPatient().getId().equals(patientId)) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Unauthorized"));
            }

            appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
            appointment.setNotes("Cancelled by patient");
            appointmentService.updateAppointment(appointmentId, appointment);

            return ResponseEntity.ok(Map.of("success", true, "message", "Appointment cancelled"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Patient waiting room for video call requests
     */
    @GetMapping("/video-call-waiting")
    public String videoCallWaiting(@RequestParam Long requestId, Model model) {
        try {
            com.tabib24x7.model.VideoCallRequest request =
                videoCallRequestService.getRequestById(requestId)
                    .orElseThrow(() -> new RuntimeException("Request not found"));

            model.addAttribute("requestId", requestId);
            model.addAttribute("patientId", request.getPatient().getId());
            model.addAttribute("doctorName", request.getDoctor().getName());

            return "patient-video-waiting";
        } catch (Exception e) {
            model.addAttribute("error", "Video call request not found");
            return "error";
        }
    }

    // Video Call Room (for Appointments)
    @GetMapping(value = "/video-call", params = "appointmentId")
    public String videoCallRoom(@RequestParam Long appointmentId,
                                @RequestParam Long patientId,
                                Model model) {
        Appointment appointment = appointmentService.getAppointmentById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Verify patient owns this appointment
        if (!appointment.getPatient().getId().equals(patientId)) {
            throw new RuntimeException("Unauthorized access");
        }

        // Generate video call room ID
        String roomId = "room_" + appointmentId + "_" + LocalDate.now().toString().replace("-", "");
        String videoCallLink = "https://meet.jit.si/" + roomId;

        model.addAttribute("appointment", appointment);
        model.addAttribute("videoCallLink", videoCallLink);
        model.addAttribute("roomId", roomId);

        return "patient-video-call";
    }

    /**
     * Get video call request status
     */
    @GetMapping("/video-call/request/{requestId}/status")
    public ResponseEntity<?> getRequestStatus(@PathVariable Long requestId) {
        try {
            com.tabib24x7.model.VideoCallRequest request =
                videoCallRequestService.getRequestById(requestId)
                    .orElseThrow(() -> new RuntimeException("Request not found"));

            System.out.println("=== STATUS CHECK ===");
            System.out.println("Request ID: " + requestId);
            System.out.println("Status: " + request.getStatus().name());
            System.out.println("Call Room ID: " + request.getCallRoomId());
            System.out.println("===================");

            Map<String, Object> response = new HashMap<>();
            response.put("status", request.getStatus().name());
            response.put("requestId", requestId);
            response.put("callRoomId", request.getCallRoomId());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Patient video call page for instant video calls
     */
    @GetMapping(value = "/video-call", params = "requestId")
    public String patientVideoCall(@RequestParam Long requestId, Model model) {
        model.addAttribute("requestId", requestId);
        return "patient-video-call";
    }

    /**
     * Cancel video call request
     */
    @PostMapping("/video-call/request/{requestId}/cancel")
    public ResponseEntity<?> cancelRequest(@PathVariable Long requestId) {
        try {
            videoCallRequestService.rejectRequest(requestId, "Cancelled by patient");
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
