package com.sehat24x7.controller;

import com.sehat24x7.model.InstantConsultationQueue;
import com.sehat24x7.service.InstantConsultationService;
import com.sehat24x7.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/instant-consultation")
@CrossOrigin(origins = "*")
public class InstantConsultationController {

    @Autowired
    private InstantConsultationService instantConsultationService;

    @Autowired
    private DoctorRepository doctorRepository;

    // Patient joins queue
    @PostMapping("/join-queue")
    public ResponseEntity<?> joinQueue(@RequestBody Map<String, Long> request) {
        try {
            Long doctorId = request.get("doctorId");
            Long patientId = request.get("patientId");
            
            InstantConsultationQueue queueEntry = instantConsultationService.joinQueue(doctorId, patientId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("queuePosition", queueEntry.getQueuePosition());
            response.put("queueLength", instantConsultationService.getQueueLength(doctorId));
            response.put("message", "You have joined the queue");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Patient leaves queue
    @DeleteMapping("/leave-queue")
    public ResponseEntity<?> leaveQueue(@RequestParam Long doctorId, @RequestParam Long patientId) {
        try {
            instantConsultationService.leaveQueue(doctorId, patientId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "You have left the queue");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get patient's queue position
    @GetMapping("/queue-position")
    public ResponseEntity<?> getQueuePosition(@RequestParam Long doctorId, @RequestParam Long patientId) {
        try {
            Long position = instantConsultationService.getQueuePosition(doctorId, patientId);
            Long queueLength = instantConsultationService.getQueueLength(doctorId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("queuePosition", position);
            response.put("queueLength", queueLength);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Doctor gets waiting queue
    @GetMapping("/doctor/{doctorId}/queue")
    public ResponseEntity<?> getDoctorQueue(@PathVariable Long doctorId) {
        try {
            List<InstantConsultationQueue> queue = instantConsultationService.getWaitingQueue(doctorId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("queue", queue);
            response.put("queueLength", queue.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Doctor accepts patient
    @PostMapping("/accept/{queueId}")
    public ResponseEntity<?> acceptPatient(@PathVariable Long queueId) {
        try {
            InstantConsultationQueue queueEntry = instantConsultationService.acceptPatient(queueId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("queueEntry", queueEntry);
            response.put("message", "Patient accepted");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Start consultation
    @PostMapping("/start/{queueId}")
    public ResponseEntity<?> startConsultation(@PathVariable Long queueId) {
        try {
            InstantConsultationQueue queueEntry = instantConsultationService.startConsultation(queueId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("queueEntry", queueEntry);
            response.put("message", "Consultation started");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Complete consultation
    @PostMapping("/complete/{queueId}")
    public ResponseEntity<?> completeConsultation(@PathVariable Long queueId) {
        try {
            InstantConsultationQueue queueEntry = instantConsultationService.completeConsultation(queueId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("queueEntry", queueEntry);
            response.put("message", "Consultation completed");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
