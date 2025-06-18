package com.example.pfms.dto;

import lombok.Data;

@Data
public class FeedbackSummaryDTO {
    private long total;
    private FeedbackTypeCount byType;

    @Data
    public static class FeedbackTypeCount {
        private long complaints;
        private long suggestions;
        private long compliments;
    }
} 