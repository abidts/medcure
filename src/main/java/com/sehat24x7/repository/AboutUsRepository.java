package com.sehat24x7.repository;

import com.sehat24x7.model.AboutUs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AboutUsRepository extends JpaRepository<AboutUs, Long> {
    
    Optional<AboutUs> findByIsActiveTrue();
    
    Optional<AboutUs> findFirstByIsActiveTrueOrderByCreatedAtDesc();
}
