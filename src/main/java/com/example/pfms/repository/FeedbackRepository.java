package com.example.pfms.repository;

import com.example.pfms.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    long countByType(String type);

    List<Feedback> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}