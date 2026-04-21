package com.sehat24x7.controller;

import com.sehat24x7.model.Appointment;
import com.sehat24x7.model.Appointment.AppointmentStatus;
import com.sehat24x7.model.Doctor;
import com.sehat24x7.model.Patient;
import com.sehat24x7.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public List<Appointment> getAppointmentsByPatient(@PathVariable Long patientId) {
        return appointmentService.getAppointmentsByPatientId(patientId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Appointment> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        return appointmentService.getAppointmentsByDoctorId(doctorId);
    }

    @GetMapping("/date")
    public List<Appointment> getAppointmentsByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return appointmentService.getAppointmentsByDate(date);
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody Map<String, Object> payload) {
        try {
            Appointment appointment = new Appointment();

            // Accept both old nested payload ({patient:{id},doctor:{id},...})
            // and current frontend payload ({patientId, doctorId, date, time, type, ...}).
            Long patientId = null;
            Long doctorId = null;

            if (payload.get("patientId") != null) {
                patientId = Long.valueOf(payload.get("patientId").toString());
            } else if (payload.get("patient") instanceof Map<?, ?> patientMap && patientMap.get("id") != null) {
                patientId = Long.valueOf(patientMap.get("id").toString());
            }

            if (payload.get("doctorId") != null) {
                doctorId = Long.valueOf(payload.get("doctorId").toString());
            } else if (payload.get("doctor") instanceof Map<?, ?> doctorMap && doctorMap.get("id") != null) {
                doctorId = Long.valueOf(doctorMap.get("id").toString());
            }

            String date = payload.get("date") != null ? payload.get("date").toString()
                    : payload.get("appointmentDate") != null ? payload.get("appointmentDate").toString() : null;
            String time = payload.get("time") != null ? payload.get("time").toString()
                    : payload.get("appointmentTime") != null ? payload.get("appointmentTime").toString() : null;
            String type = payload.get("type") != null ? payload.get("type").toString()
                    : payload.get("consultationType") != null ? payload.get("consultationType").toString() : "CLINIC";

            if (patientId == null || doctorId == null || date == null || time == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", "Missing required booking fields (patientId, doctorId, date, time)."
                ));
            }

            Patient patient = new Patient();
            patient.setId(patientId);
            appointment.setPatient(patient);

            Doctor doctor = new Doctor();
            doctor.setId(doctorId);
            appointment.setDoctor(doctor);

            appointment.setAppointmentDate(LocalDate.parse(date));
            appointment.setAppointmentTime(LocalTime.parse(time));
            appointment.setConsultationType(Appointment.ConsultationType.valueOf(type));
            appointment.setReason(payload.get("reason") != null ? payload.get("reason").toString() : null);

            if (payload.get("status") != null) {
                appointment.setStatus(AppointmentStatus.valueOf(payload.get("status").toString()));
            }

            Appointment created = appointmentService.createAppointment(appointment);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Booking failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam AppointmentStatus status) {
        try {
            return ResponseEntity.ok(appointmentService.updateAppointmentStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok().build();
    }
}
