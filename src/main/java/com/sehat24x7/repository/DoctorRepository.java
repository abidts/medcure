package com.sehat24x7.repository;

import com.sehat24x7.model.Doctor;
import com.sehat24x7.model.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByEmail(String email);
    List<Doctor> findBySpecialization(Specialization specialization);
    List<Doctor> findByAvailableTrue();
    List<Doctor> findBySpecializationAndAvailableTrue(Specialization specialization);

    @Query("SELECT d FROM Doctor d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Doctor> searchByName(@Param("name") String name);

    @Query("SELECT d FROM Doctor d WHERE d.consultationFee BETWEEN :minFee AND :maxFee")
    List<Doctor> findByConsultationFeeBetween(@Param("minFee") Double minFee, @Param("maxFee") Double maxFee);

    Optional<Doctor> findByUserId(Long userId);

    @Query("SELECT d FROM Doctor d WHERE d.user.id IN :userIds")
    List<Doctor> findByUserIdIn(@Param("userIds") List<Long> userIds);
}
