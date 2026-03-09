package com.tabib24x7.service;

import com.tabib24x7.model.MedicalReport;
import com.tabib24x7.model.Patient;
import com.tabib24x7.repository.MedicalReportRepository;
import com.tabib24x7.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class MedicalReportService {

    @Autowired
    private MedicalReportRepository medicalReportRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    public MedicalReport uploadReport(Long patientId, String reportName, MultipartFile file) throws IOException {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // Upload to Cloudinary
        Map uploadResult = cloudinaryService.upload(file, "medical_reports/" + patientId);

        String url = (String) uploadResult.get("secure_url");
        String publicId = (String) uploadResult.get("public_id");
        String format = (String) uploadResult.get("format");

        MedicalReport report = new MedicalReport();
        report.setPatient(patient);
        report.setReportName(reportName);
        report.setFileUrl(url);
        report.setPublicId(publicId);
        report.setFileType(format != null && format.equalsIgnoreCase("pdf") ? "pdf" : "image");

        return medicalReportRepository.save(report);
    }

    public List<MedicalReport> getReportsByPatient(Long patientId) {
        return medicalReportRepository.findByPatientIdOrderByUploadDateDesc(patientId);
    }

    public void deleteReport(Long reportId) throws IOException {
        MedicalReport report = medicalReportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        // Delete from Cloudinary
        cloudinaryService.delete(report.getPublicId());

        // Delete from Database
        medicalReportRepository.delete(report);
    }
}
