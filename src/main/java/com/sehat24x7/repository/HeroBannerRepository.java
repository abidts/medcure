package com.sehat24x7.repository;

import com.sehat24x7.model.HeroBanner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HeroBannerRepository extends JpaRepository<HeroBanner, Long> {
    List<HeroBanner> findAllByOrderByDisplayOrderAscCreatedAtDesc();

    @Query("SELECT hb FROM HeroBanner hb WHERE hb.isActive = true " +
            "AND (hb.startDate IS NULL OR hb.startDate <= :now) " +
            "AND (hb.endDate IS NULL OR hb.endDate >= :now) " +
            "ORDER BY hb.displayOrder ASC, hb.createdAt DESC")
    List<HeroBanner> findActiveBanners(LocalDateTime now);
}
