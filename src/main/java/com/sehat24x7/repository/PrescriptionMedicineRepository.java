package com.sehat24x7.repository;

import com.sehat24x7.model.Prescription;
import com.sehat24x7.model.PrescriptionMedicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionMedicineRepository extends JpaRepository<PrescriptionMedicine, Long> {
    List<PrescriptionMedicine> findByPrescription(Prescription prescription);
    
    @Query("SELECT pm FROM PrescriptionMedicine pm WHERE pm.prescription.id = :prescriptionId")
    List<PrescriptionMedicine> findByPrescriptionId(@Param("prescriptionId") Long prescriptionId);
    
    void deleteByPrescription(Prescription prescription);
}
