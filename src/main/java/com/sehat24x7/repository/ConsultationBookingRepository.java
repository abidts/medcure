package com.sehat24x7.repository;

import com.sehat24x7.model.ConsultationBooking;
import com.sehat24x7.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConsultationBookingRepository extends JpaRepository<ConsultationBooking, Long> {
    Optional<ConsultationBooking> findByMobileNumber(String mobileNumber);
    List<ConsultationBooking> findByPatient(Patient patient);
    List<ConsultationBooking> findByStatus(ConsultationBooking.BookingStatus status);
    Optional<ConsultationBooking> findByIdAndVerificationCode(Long id, String verificationCode);
}
