package com.sehat24x7.service;

import com.sehat24x7.model.HeroBanner;

import java.util.List;
import java.util.Optional;

public interface HeroBannerService {
    List<HeroBanner> getAllBanners();

    List<HeroBanner> getActiveBanners();

    Optional<HeroBanner> getBannerById(Long id);

    HeroBanner createBanner(HeroBanner banner);

    HeroBanner updateBanner(Long id, HeroBanner bannerDetails);

    void deleteBanner(Long id);

    void activateBanner(Long id);

    void deactivateBanner(Long id);
}
