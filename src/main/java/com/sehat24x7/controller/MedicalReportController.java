package com.sehat24x7.controller;

import com.sehat24x7.model.MedicalReport;
import com.sehat24x7.service.MedicalReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patient/reports")
@CrossOrigin(origins = "*")
public class MedicalReportController {

    @Autowired
    private MedicalReportService medicalReportService;

    @GetMapping
    public ResponseEntity<List<MedicalReport>> listReports(@RequestParam Long patientId) {
        return ResponseEntity.ok(medicalReportService.getReportsByPatient(patientId));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadReport(@RequestParam Long patientId,
                                       @RequestParam String reportName,
                                       @RequestParam MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (file.isEmpty()) {
                response.put("success", false);
                response.put("message", "Please select a file to upload");
                return ResponseEntity.badRequest().body(response);
            }

            // Check file type
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.startsWith("image/") && !contentType.equals("application/pdf"))) {
                response.put("success", false);
                response.put("message", "Only JPG, PNG and PDF files are allowed");
                return ResponseEntity.badRequest().body(response);
            }

            medicalReportService.uploadReport(patientId, reportName, file);
            response.put("success", true);
            response.put("message", "Report uploaded successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to upload report: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @DeleteMapping("/{reportId}")
    public ResponseEntity<?> deleteReport(@PathVariable Long reportId) {
        Map<String, Object> response = new HashMap<>();
        try {
            medicalReportService.deleteReport(reportId);
            response.put("success", true);
            response.put("message", "Report deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to delete report: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
