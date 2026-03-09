package com.tabib24x7.repository;

import com.tabib24x7.model.MedicalReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicalReportRepository extends JpaRepository<MedicalReport, Long> {
    List<MedicalReport> findByPatientIdOrderByUploadDateDesc(Long patientId);
}
