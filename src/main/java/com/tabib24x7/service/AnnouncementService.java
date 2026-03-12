package com.tabib24x7.service;

import com.tabib24x7.model.Announcement;

import java.util.List;
import java.util.Optional;

public interface AnnouncementService {
    
    List<Announcement> getAllAnnouncements();
    
    List<Announcement> getActiveAnnouncements();
    
    Optional<Announcement> getAnnouncementById(Long id);
    
    Announcement createAnnouncement(Announcement announcement);
    
    Announcement updateAnnouncement(Long id, Announcement announcement);
    
    void deleteAnnouncement(Long id);
    
    void activateAnnouncement(Long id);
    
    void deactivateAnnouncement(Long id);
    
    List<Announcement> getAnnouncementsByType(String type);
}
