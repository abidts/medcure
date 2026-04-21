package com.sehat24x7.repository;

import com.sehat24x7.model.Patient;
import com.sehat24x7.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {
    Optional<Wallet> findByPatientId(Long patientId);
    Optional<Wallet> findByPatient(Patient patient);

    @Query("SELECT w FROM Wallet w LEFT JOIN FETCH w.transactions WHERE w.id = :id")
    Optional<Wallet> findByIdWithTransactions(@Param("id") Long id);
}
