package com.example.pfms.controller;

import com.example.pfms.dto.FeedbackSummaryDTO;
import com.example.pfms.dto.ChartDataDTO;
import com.example.pfms.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/feedbacks")
@CrossOrigin(origins = "http://localhost:8080")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping("/total")
    public ResponseEntity<Long> getTotalFeedback() {
        return ResponseEntity.ok(feedbackService.getTotalFeedback());
    }

    @GetMapping("/summary")
    public ResponseEntity<FeedbackSummaryDTO> getFeedbackSummary() {
        FeedbackSummaryDTO summary = new FeedbackSummaryDTO();
        summary.setTotal(feedbackService.getTotalFeedback());

        FeedbackSummaryDTO.FeedbackTypeCount byType = new FeedbackSummaryDTO.FeedbackTypeCount();
        byType.setComplaints(feedbackService.getFeedbackCountByType("complaint"));
        byType.setSuggestions(feedbackService.getFeedbackCountByType("suggestion"));
        byType.setCompliments(feedbackService.getFeedbackCountByType("compliment"));

        summary.setByType(byType);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/chart-data")
    public ResponseEntity<List<ChartDataDTO>> getChartData() {
        LocalDate now = LocalDate.now();
        WeekFields weekFields = WeekFields.of(Locale.getDefault());

        List<ChartDataDTO> chartData = feedbackService.getFeedbackByWeek(now.minusWeeks(3), now);
        return ResponseEntity.ok(chartData);
    }
}