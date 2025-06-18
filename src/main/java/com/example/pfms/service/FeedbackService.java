package com.example.pfms.service;

import com.example.pfms.dto.ChartDataDTO;
import com.example.pfms.entity.Feedback;
import com.example.pfms.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    public long getTotalFeedback() {
        return feedbackRepository.count();
    }

    public long getFeedbackCountByType(String type) {
        return feedbackRepository.countByType(type);
    }

    public List<ChartDataDTO> getFeedbackByWeek(LocalDate startDate, LocalDate endDate) {
        // Convert LocalDate to LocalDateTime
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        List<Feedback> feedbacks = feedbackRepository.findByCreatedAtBetween(startDateTime, endDateTime);
        WeekFields weekFields = WeekFields.of(Locale.getDefault());

        // Group feedbacks by week
        Map<Integer, List<Feedback>> feedbacksByWeek = feedbacks.stream()
                .collect(Collectors.groupingBy(f -> f.getCreatedAt().get(weekFields.weekOfWeekBasedYear())));

        List<ChartDataDTO> chartData = new ArrayList<>();

        // Process each week
        for (int week = startDate.get(weekFields.weekOfWeekBasedYear()); week <= endDate
                .get(weekFields.weekOfWeekBasedYear()); week++) {

            List<Feedback> weekFeedbacks = feedbacksByWeek.getOrDefault(week, new ArrayList<>());

            ChartDataDTO weekData = new ChartDataDTO();
            weekData.setWeek(week);
            weekData.setComplaints(countByType(weekFeedbacks, "complaint"));
            weekData.setSuggestions(countByType(weekFeedbacks, "suggestion"));
            weekData.setCompliments(countByType(weekFeedbacks, "compliment"));

            chartData.add(weekData);
        }

        return chartData;
    }

    private long countByType(List<Feedback> feedbacks, String type) {
        return feedbacks.stream()
                .filter(f -> f.getType().equals(type))
                .count();
    }
}