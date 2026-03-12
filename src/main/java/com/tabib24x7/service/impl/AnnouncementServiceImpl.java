package com.tabib24x7.service.impl;

import com.tabib24x7.model.Announcement;
import com.tabib24x7.repository.AnnouncementRepository;
import com.tabib24x7.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AnnouncementServiceImpl implements AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Override
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByDisplayOrderAscCreatedAtDesc();
    }

    @Override
    public List<Announcement> getActiveAnnouncements() {
        return announcementRepository.findActiveAnnouncements(LocalDateTime.now());
    }

    @Override
    public Optional<Announcement> getAnnouncementById(Long id) {
        return announcementRepository.findById(id);
    }

    @Override
    public Announcement createAnnouncement(Announcement announcement) {
        if (announcement.getDisplayOrder() == null) {
            announcement.setDisplayOrder(0);
        }
        if (announcement.getDisplayDuration() == null) {
            announcement.setDisplayDuration(5000); // Default 5 seconds
        }
        if (announcement.getType() == null) {
            announcement.setType("info");
        }
        if (announcement.getIsActive() == null) {
            announcement.setIsActive(true);
        }
        return announcementRepository.save(announcement);
    }

    @Override
    public Announcement updateAnnouncement(Long id, Announcement announcementDetails) {
        Optional<Announcement> optionalAnnouncement = announcementRepository.findById(id);
        if (optionalAnnouncement.isPresent()) {
            Announcement announcement = optionalAnnouncement.get();
            
            if (announcementDetails.getText() != null) {
                announcement.setText(announcementDetails.getText());
            }
            if (announcementDetails.getType() != null) {
                announcement.setType(announcementDetails.getType());
            }
            if (announcementDetails.getDisplayOrder() != null) {
                announcement.setDisplayOrder(announcementDetails.getDisplayOrder());
            }
            if (announcementDetails.getDisplayDuration() != null) {
                announcement.setDisplayDuration(announcementDetails.getDisplayDuration());
            }
            if (announcementDetails.getIsActive() != null) {
                announcement.setIsActive(announcementDetails.getIsActive());
            }
            if (announcementDetails.getStartDate() != null) {
                announcement.setStartDate(announcementDetails.getStartDate());
            }
            if (announcementDetails.getEndDate() != null) {
                announcement.setEndDate(announcementDetails.getEndDate());
            }
            
            return announcementRepository.save(announcement);
        }
        return null;
    }

    @Override
    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }

    @Override
    public void activateAnnouncement(Long id) {
        Optional<Announcement> optionalAnnouncement = announcementRepository.findById(id);
        if (optionalAnnouncement.isPresent()) {
            Announcement announcement = optionalAnnouncement.get();
            announcement.setIsActive(true);
            announcementRepository.save(announcement);
        }
    }

    @Override
    public void deactivateAnnouncement(Long id) {
        Optional<Announcement> optionalAnnouncement = announcementRepository.findById(id);
        if (optionalAnnouncement.isPresent()) {
            Announcement announcement = optionalAnnouncement.get();
            announcement.setIsActive(false);
            announcementRepository.save(announcement);
        }
    }

    @Override
    public List<Announcement> getAnnouncementsByType(String type) {
        return announcementRepository.findByIsActiveTrueAndTypeOrderByDisplayOrderAsc(type);
    }
}
