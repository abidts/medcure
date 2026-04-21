package com.sehat24x7.service;

import com.sehat24x7.model.Doctor;
import com.sehat24x7.model.VideoCallRate;
import com.sehat24x7.repository.VideoCallRateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class VideoCallRateService {

    @Autowired
    private VideoCallRateRepository videoCallRateRepository;

    /**
     * Get or create video call rate for doctor
     */
    public VideoCallRate getOrCreateRate(Doctor doctor) {
        return videoCallRateRepository.findByDoctor(doctor)
                .orElseGet(() -> {
                    VideoCallRate rate = new VideoCallRate();
                    rate.setDoctor(doctor);
                    rate.setRatePerMinute(10.0); // Default Rs.10 per minute
                    rate.setMinimumDuration(10);
                    return videoCallRateRepository.save(rate);
                });
    }

    /**
     * Get video call rate by doctor ID
     */
    public Optional<VideoCallRate> getRateByDoctorId(Long doctorId) {
        return videoCallRateRepository.findByDoctorId(doctorId);
    }

    /**
     * Update video call rate
     */
    public VideoCallRate updateRate(Doctor doctor, Double ratePerMinute, Integer minimumDuration) {
        VideoCallRate rate = getOrCreateRate(doctor);
        rate.setRatePerMinute(ratePerMinute);
        if (minimumDuration != null && minimumDuration > 0) {
            rate.setMinimumDuration(minimumDuration);
        }
        return videoCallRateRepository.save(rate);
    }

    /**
     * Calculate call cost for given duration
     */
    public Double calculateCallCost(Long doctorId, Integer durationMinutes) {
        VideoCallRate rate = getOrCreateRate(doctorRepository.findById(doctorId).orElse(null));
        return rate.getRatePerMinute() * durationMinutes;
    }

    @Autowired
    private com.sehat24x7.repository.DoctorRepository doctorRepository;
}
