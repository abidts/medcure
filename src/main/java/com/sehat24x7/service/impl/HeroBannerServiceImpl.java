package com.sehat24x7.service.impl;

import com.sehat24x7.model.HeroBanner;
import com.sehat24x7.repository.HeroBannerRepository;
import com.sehat24x7.service.HeroBannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class HeroBannerServiceImpl implements HeroBannerService {

    @Autowired
    private HeroBannerRepository heroBannerRepository;

    @Override
    public List<HeroBanner> getAllBanners() {
        return heroBannerRepository.findAllByOrderByDisplayOrderAscCreatedAtDesc();
    }

    @Override
    public List<HeroBanner> getActiveBanners() {
        return heroBannerRepository.findActiveBanners(LocalDateTime.now());
    }

    @Override
    public Optional<HeroBanner> getBannerById(Long id) {
        return heroBannerRepository.findById(id);
    }

    @Override
    public HeroBanner createBanner(HeroBanner banner) {
        if (banner.getDisplayOrder() == null) {
            banner.setDisplayOrder(0);
        }
        if (banner.getIsActive() == null) {
            banner.setIsActive(true);
        }
        if (banner.getImagePosition() == null) {
            banner.setImagePosition(HeroBanner.ImagePosition.CENTER);
        }
        return heroBannerRepository.save(banner);
    }

    @Override
    public HeroBanner updateBanner(Long id, HeroBanner bannerDetails) {
        Optional<HeroBanner> optionalBanner = heroBannerRepository.findById(id);
        if (optionalBanner.isEmpty()) {
            return null;
        }

        HeroBanner banner = optionalBanner.get();
        if (bannerDetails.getTitle() != null) banner.setTitle(bannerDetails.getTitle());
        if (bannerDetails.getSubtitle() != null) banner.setSubtitle(bannerDetails.getSubtitle());
        if (bannerDetails.getDescription() != null) banner.setDescription(bannerDetails.getDescription());
        if (bannerDetails.getImageUrl() != null) banner.setImageUrl(bannerDetails.getImageUrl());
        if (bannerDetails.getImagePosition() != null) banner.setImagePosition(bannerDetails.getImagePosition());
        if (bannerDetails.getPrimaryLinkText() != null) banner.setPrimaryLinkText(bannerDetails.getPrimaryLinkText());
        if (bannerDetails.getPrimaryLinkUrl() != null) banner.setPrimaryLinkUrl(bannerDetails.getPrimaryLinkUrl());
        if (bannerDetails.getSecondaryLinkText() != null) banner.setSecondaryLinkText(bannerDetails.getSecondaryLinkText());
        if (bannerDetails.getSecondaryLinkUrl() != null) banner.setSecondaryLinkUrl(bannerDetails.getSecondaryLinkUrl());
        if (bannerDetails.getDisplayOrder() != null) banner.setDisplayOrder(bannerDetails.getDisplayOrder());
        if (bannerDetails.getIsActive() != null) banner.setIsActive(bannerDetails.getIsActive());
        if (bannerDetails.getStartDate() != null) banner.setStartDate(bannerDetails.getStartDate());
        if (bannerDetails.getEndDate() != null) banner.setEndDate(bannerDetails.getEndDate());

        return heroBannerRepository.save(banner);
    }

    @Override
    public void deleteBanner(Long id) {
        heroBannerRepository.deleteById(id);
    }

    @Override
    public void activateBanner(Long id) {
        heroBannerRepository.findById(id).ifPresent(banner -> {
            banner.setIsActive(true);
            heroBannerRepository.save(banner);
        });
    }

    @Override
    public void deactivateBanner(Long id) {
        heroBannerRepository.findById(id).ifPresent(banner -> {
            banner.setIsActive(false);
            heroBannerRepository.save(banner);
        });
    }
}
