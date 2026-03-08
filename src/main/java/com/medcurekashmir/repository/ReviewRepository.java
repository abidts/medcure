package com.medcurekashmir.repository;

import com.medcurekashmir.model.Doctor;
import com.medcurekashmir.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByDoctor(Doctor doctor);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.doctor = :doctor")
    Double getAverageRatingByDoctor(@Param("doctor") Doctor doctor);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.doctor = :doctor")
    Long getCountByDoctor(@Param("doctor") Doctor doctor);
}
