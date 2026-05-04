package com.sehat24x7.service.impl;

import com.sehat24x7.model.HeroBanner;
import com.sehat24x7.repository.HeroBannerRepository;
import com.sehat24x7.service.HeroBannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class HeroBannerServiceImpl implements HeroBannerService {

    private static final String DEFAULT_TITLE_COLOR = "#FFFFFF";
    private static final String DEFAULT_SUBTITLE_COLOR = "#E2E8F0";
    private static final String DEFAULT_DESCRIPTION_COLOR = "#F8FAFC";
    private static final Pattern HEX_COLOR_PATTERN = Pattern.compile("^#(?:[0-9a-fA-F]{3}){1,2}$");

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
        banner.setTitleColor(normalizeColor(banner.getTitleColor(), DEFAULT_TITLE_COLOR));
        banner.setSubtitleColor(normalizeColor(banner.getSubtitleColor(), DEFAULT_SUBTITLE_COLOR));
        banner.setDescriptionColor(normalizeColor(banner.getDescriptionColor(), DEFAULT_DESCRIPTION_COLOR));
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
        if (bannerDetails.getTitleColor() != null) banner.setTitleColor(normalizeColor(bannerDetails.getTitleColor(), DEFAULT_TITLE_COLOR));
        if (bannerDetails.getSubtitleColor() != null) banner.setSubtitleColor(normalizeColor(bannerDetails.getSubtitleColor(), DEFAULT_SUBTITLE_COLOR));
        if (bannerDetails.getDescriptionColor() != null) banner.setDescriptionColor(normalizeColor(bannerDetails.getDescriptionColor(), DEFAULT_DESCRIPTION_COLOR));
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

    private String normalizeColor(String color, String fallback) {
        if (color == null || color.isBlank()) {
            return fallback;
        }
        String trimmed = color.trim();
        if (!HEX_COLOR_PATTERN.matcher(trimmed).matches()) {
            return fallback;
        }
        return trimmed.toUpperCase();
    }
}
