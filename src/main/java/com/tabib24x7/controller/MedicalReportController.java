package com.tabib24x7.controller;

import com.tabib24x7.model.MedicalReport;
import com.tabib24x7.service.MedicalReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/patient/reports")
public class MedicalReportController {

    @Autowired
    private MedicalReportService medicalReportService;

    @GetMapping
    public String listReports(@RequestParam Long patientId, Model model) {
        List<MedicalReport> reports = medicalReportService.getReportsByPatient(patientId);
        model.addAttribute("reports", reports);
        model.addAttribute("patientId", patientId);
        return "patient-reports";
    }

    @PostMapping("/upload")
    public String uploadReport(@RequestParam Long patientId,
                               @RequestParam String reportName,
                               @RequestParam MultipartFile file,
                               RedirectAttributes redirectAttributes) {
        try {
            if (file.isEmpty()) {
                redirectAttributes.addFlashAttribute("error", "Please select a file to upload");
                return "redirect:/patient/reports?patientId=" + patientId;
            }

            // Check file type
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.startsWith("image/") && !contentType.equals("application/pdf"))) {
                redirectAttributes.addFlashAttribute("error", "Only JPG, PNG and PDF files are allowed");
                return "redirect:/patient/reports?patientId=" + patientId;
            }

            medicalReportService.uploadReport(patientId, reportName, file);
            redirectAttributes.addFlashAttribute("success", "Report uploaded successfully");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Failed to upload report: " + e.getMessage());
        }
        return "redirect:/patient/reports?patientId=" + patientId;
    }

    @PostMapping("/delete/{reportId}")
    public String deleteReport(@PathVariable Long reportId,
                               @RequestParam Long patientId,
                               RedirectAttributes redirectAttributes) {
        try {
            medicalReportService.deleteReport(reportId);
            redirectAttributes.addFlashAttribute("success", "Report deleted successfully");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Failed to delete report: " + e.getMessage());
        }
        return "redirect:/patient/reports?patientId=" + patientId;
    }
}
