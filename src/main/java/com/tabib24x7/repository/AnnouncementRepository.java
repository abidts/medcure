package com.tabib24x7.repository;

import com.tabib24x7.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    
    List<Announcement> findAllByOrderByDisplayOrderAscCreatedAtDesc();
    
    List<Announcement> findByIsActiveTrueOrderByDisplayOrderAscCreatedAtDesc();
    
    List<Announcement> findByIsActiveTrueAndStartDateBeforeAndEndDateAfterOrderByDisplayOrderAsc(
        LocalDateTime startDate, LocalDateTime endDate);
    
    List<Announcement> findByIsActiveTrueAndTypeOrderByDisplayOrderAsc(String type);
    
    @Query("SELECT a FROM Announcement a WHERE a.isActive = true " +
           "AND (a.startDate IS NULL OR a.startDate <= :now) " +
           "AND (a.endDate IS NULL OR a.endDate >= :now) " +
           "ORDER BY a.displayOrder ASC, a.createdAt DESC")
    List<Announcement> findActiveAnnouncements(LocalDateTime now);
}
