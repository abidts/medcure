package com.sehat24x7.service.impl;

import com.sehat24x7.model.AboutUs;
import com.sehat24x7.repository.AboutUsRepository;
import com.sehat24x7.service.AboutUsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AboutUsServiceImpl implements AboutUsService {

    @Autowired
    private AboutUsRepository aboutUsRepository;

    @Override
    public Optional<AboutUs> getActiveAboutUs() {
        return aboutUsRepository.findFirstByIsActiveTrueOrderByCreatedAtDesc();
    }

    @Override
    public AboutUs saveAboutUs(AboutUs aboutUs) {
        // Deactivate any existing AboutUs first
        aboutUsRepository.findAll().forEach(existing -> {
            existing.setIsActive(false);
            aboutUsRepository.save(existing);
        });
        
        aboutUs.setIsActive(true);
        return aboutUsRepository.save(aboutUs);
    }

    @Override
    public void deactivateAboutUs() {
        aboutUsRepository.findAll().forEach(existing -> {
            existing.setIsActive(false);
            aboutUsRepository.save(existing);
        });
    }
}
