package com.tabib24x7.service.impl;

import com.tabib24x7.model.Doctor;
import com.tabib24x7.model.Patient;
import com.tabib24x7.model.Review;
import com.tabib24x7.repository.DoctorRepository;
import com.tabib24x7.repository.PatientRepository;
import com.tabib24x7.repository.ReviewRepository;
import com.tabib24x7.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @Override
    public List<Review> getReviewsByDoctorId(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return reviewRepository.findByDoctor(doctor);
    }

    @Override
    public Optional<Review> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }

    @Override
    public Review createReview(Review review) {
        if (review.getPatient() != null && review.getPatient().getId() != null) {
            Patient patient = patientRepository.findById(review.getPatient().getId())
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            review.setPatient(patient);
        }
        if (review.getDoctor() != null && review.getDoctor().getId() != null) {
            Doctor doctor = doctorRepository.findById(review.getDoctor().getId())
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            review.setDoctor(doctor);
        }
        return reviewRepository.save(review);
    }

    @Override
    public Review updateReview(Long id, Review review) {
        if (reviewRepository.existsById(id)) {
            review.setId(id);
            return reviewRepository.save(review);
        }
        throw new RuntimeException("Review not found with id: " + id);
    }

    @Override
    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    @Override
    public Double getAverageRatingForDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        Double avg = reviewRepository.getAverageRatingByDoctor(doctor);
        return avg != null ? avg : 0.0;
    }

    @Override
    public Long getReviewCountForDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return reviewRepository.getCountByDoctor(doctor);
    }
}
