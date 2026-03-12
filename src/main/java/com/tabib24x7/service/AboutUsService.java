package com.tabib24x7.service;

import com.tabib24x7.model.AboutUs;

import java.util.Optional;

public interface AboutUsService {
    
    Optional<AboutUs> getActiveAboutUs();
    
    AboutUs saveAboutUs(AboutUs aboutUs);
    
    void deactivateAboutUs();
}
