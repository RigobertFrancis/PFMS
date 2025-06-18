package com.example.pfms.dto;

import lombok.Data;

@Data
public class ChartDataDTO {
    private int week;
    private long complaints;
    private long suggestions;
    private long compliments;
} 