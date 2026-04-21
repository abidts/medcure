package com.sehat24x7.service;

import com.sehat24x7.model.Review;

import java.util.List;
import java.util.Optional;

public interface ReviewService {
    List<Review> getAllReviews();
    List<Review> getReviewsByDoctorId(Long doctorId);
    Optional<Review> getReviewById(Long id);
    Review createReview(Review review);
    Review updateReview(Long id, Review review);
    void deleteReview(Long id);
    Double getAverageRatingForDoctor(Long doctorId);
    Long getReviewCountForDoctor(Long doctorId);
}
