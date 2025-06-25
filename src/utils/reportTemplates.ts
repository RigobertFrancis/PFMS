export const getTemplateData = (reportType: string) => {
  switch (reportType) {
    case 'feedback-summary':
      return {
        title: 'Feedback Summary Report',
        description: 'Comprehensive overview of patient feedback across all departments',
        data: [
          { metric: 'Total Feedback', value: '1,247', change: '+12%', period: 'Last 30 days' },
          { metric: 'Complaints', value: '156', change: '-8%', period: 'Last 30 days' },
          { metric: 'Suggestions', value: '423', change: '+15%', period: 'Last 30 days' },
          { metric: 'Compliments', value: '668', change: '+18%', period: 'Last 30 days' },
          { metric: 'Response Rate', value: '94%', change: '+3%', period: 'Last 30 days' },
          { metric: 'Average Resolution Time', value: '2.3 days', change: '-0.5 days', period: 'Last 30 days' }
        ],
        charts: [
          { name: 'Feedback Trend', type: 'line' },
          { name: 'Department Distribution', type: 'pie' },
          { name: 'Response Times', type: 'bar' }
        ]
      };
    case 'department-performance':
      return {
        title: 'Department Performance Scorecard',
        description: 'Key performance indicators and metrics by department',
        data: [
          { metric: 'Emergency Department', value: '8.7/10', change: '+0.3', period: 'Patient Satisfaction' },
          { metric: 'Surgery', value: '9.2/10', change: '+0.1', period: 'Patient Satisfaction' },
          { metric: 'Pediatrics', value: '9.5/10', change: '+0.2', period: 'Patient Satisfaction' },
          { metric: 'Cardiology', value: '8.9/10', change: '-0.1', period: 'Patient Satisfaction' },
          { metric: 'Oncology', value: '9.1/10', change: '+0.4', period: 'Patient Satisfaction' },
          { metric: 'Maternity', value: '9.3/10', change: '+0.2', period: 'Patient Satisfaction' }
        ],
        charts: [
          { name: 'Performance Comparison', type: 'bar' },
          { name: 'Trend Analysis', type: 'line' },
          { name: 'Department Rankings', type: 'horizontal-bar' }
        ]
      };
    case 'response-times':
      return {
        title: 'Response Time Analysis',
        description: 'Detailed analysis of response times across departments and issue types',
        data: [
          { metric: 'Average Response Time', value: '4.2 hours', change: '-1.3 hours', period: 'All Departments' },
          { metric: 'Emergency Complaints', value: '1.1 hours', change: '-0.2 hours', period: 'Critical Issues' },
          { metric: 'General Inquiries', value: '6.8 hours', change: '-2.1 hours', period: 'Standard Issues' },
          { metric: 'SLA Compliance', value: '87%', change: '+5%', period: 'Within Target' },
          { metric: 'Escalated Cases', value: '23', change: '-7', period: 'This Month' },
          { metric: 'Same Day Resolution', value: '78%', change: '+12%', period: 'This Month' }
        ],
        charts: [
          { name: 'Response Time Trends', type: 'line' },
          { name: 'SLA Performance', type: 'gauge' },
          { name: 'Department Comparison', type: 'bar' }
        ]
      };
    case 'satisfaction-scores':
      return {
        title: 'Patient Satisfaction Analysis',
        description: 'Comprehensive view of patient satisfaction scores and trends',
        data: [
          { metric: 'Overall Satisfaction', value: '8.9/10', change: '+0.3', period: 'Average Score' },
          { metric: 'Would Recommend', value: '92%', change: '+4%', period: 'Patients' },
          { metric: 'Staff Friendliness', value: '9.1/10', change: '+0.2', period: 'Average Score' },
          { metric: 'Facility Cleanliness', value: '8.7/10', change: '+0.1', period: 'Average Score' },
          { metric: 'Wait Time Satisfaction', value: '7.8/10', change: '-0.2', period: 'Average Score' },
          { metric: 'Communication Quality', value: '8.8/10', change: '+0.4', period: 'Average Score' }
        ],
        charts: [
          { name: 'Satisfaction Trends', type: 'line' },
          { name: 'Category Breakdown', type: 'radar' },
          { name: 'Department Scores', type: 'bar' }
        ]
      };
    case 'trending-issues':
      return {
        title: 'Trending Issues Report',
        description: 'Analysis of recurring issues and emerging trends',
        data: [
          { metric: 'Long Wait Times', value: '34 reports', change: '+12', period: 'This Month' },
          { metric: 'Parking Issues', value: '28 reports', change: '+8', period: 'This Month' },
          { metric: 'Billing Concerns', value: '22 reports', change: '-3', period: 'This Month' },
          { metric: 'Staff Communication', value: '19 reports', change: '+5', period: 'This Month' },
          { metric: 'Appointment Scheduling', value: '16 reports', change: '+2', period: 'This Month' },
          { metric: 'Facility Navigation', value: '14 reports', change: '+6', period: 'This Month' }
        ],
        charts: [
          { name: 'Issue Frequency', type: 'bar' },
          { name: 'Trend Analysis', type: 'line' },
          { name: 'Priority Heatmap', type: 'heatmap' }
        ]
      };
    default:
      return null;
  }
};

// Enhanced report templates with better formatting and department-specific data
export const getEnhancedReportTemplate = (reportType: string, department: string, dateRange: string) => {
  const baseTemplate = {
    feedbackSummary: `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Feedback Summary Report - {{department}}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Inter', sans-serif; 
              background: #f8fafc; 
              color: #1e293b;
              line-height: 1.6;
            }
            .container {
              max-width: 1200px;
              margin: 0 auto;
              background: white;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
              border-radius: 16px;
              overflow: hidden;
            }
            .header { 
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
              color: white; 
              padding: 40px;
              text-align: center;
            }
            .header h1 { 
              font-size: 2.5rem; 
              font-weight: 700; 
              margin-bottom: 8px;
            }
            .header .subtitle { 
              font-size: 1.1rem; 
              opacity: 0.9; 
              font-weight: 400;
            }
            .content { padding: 40px; }
            .metrics-grid { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
              gap: 24px; 
              margin: 32px 0; 
            }
            .metric { 
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); 
              border: 1px solid #e2e8f0; 
              padding: 28px; 
              border-radius: 12px; 
              text-align: center;
              position: relative;
              transition: transform 0.2s ease;
            }
            .metric:hover { transform: translateY(-2px); }
            .metric::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #3b82f6, #1d4ed8);
            }
            .metric h3 { 
              font-size: 1rem; 
              font-weight: 600; 
              color: #64748b; 
              margin-bottom: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .metric .value { 
              font-size: 2.5rem; 
              font-weight: 700; 
              color: #1e293b; 
              margin: 8px 0;
            }
            .metric .change { 
              font-size: 0.9rem; 
              font-weight: 600;
              padding: 4px 12px;
              border-radius: 20px;
              display: inline-block;
            }
            .change.positive { background: #dcfce7; color: #166534; }
            .change.negative { background: #fee2e2; color: #991b1b; }
            .change.neutral { background: #f1f5f9; color: #475569; }
            
            .section { margin: 48px 0; }
            .section-title { 
              font-size: 1.75rem; 
              font-weight: 700; 
              color: #1e293b; 
              margin-bottom: 24px;
              padding-bottom: 12px;
              border-bottom: 3px solid #3b82f6;
            }
            
            .chart-container { 
              background: #f8fafc; 
              border: 2px dashed #cbd5e1; 
              border-radius: 12px;
              height: 300px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              margin: 24px 0;
              color: #64748b;
              font-size: 1.1rem;
              font-weight: 500;
            }
            
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 24px 0; 
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }
            th, td { 
              padding: 16px; 
              text-align: left; 
              border-bottom: 1px solid #e2e8f0; 
            }
            th { 
              background: linear-gradient(135deg, #1e293b 0%, #334155 100%); 
              color: white; 
              font-weight: 600;
              font-size: 0.9rem;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            tr:hover { background: #f8fafc; }
            tr:nth-child(even) { background: #f8fafc; }
            
            .footer {
              background: #f1f5f9;
              padding: 24px 40px;
              text-align: center;
              color: #64748b;
              font-size: 0.9rem;
            }
            
            .print-button {
              position: fixed;
              top: 20px;
              right: 20px;
              background: #3b82f6;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 600;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            }
            
            @media print {
              .print-button { display: none; }
              body { background: white; }
              .container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <button class="print-button" onclick="window.print()">🖨️ Print Report</button>
          <div class="container">
            <div class="header">
              <h1>📊 Feedback Summary Report</h1>
              <p class="subtitle">{{department}} • {{dateRange}} • Generated on {{date}}</p>
            </div>
            
            <div class="content">
              <div class="section">
                <h2 class="section-title">📈 Key Performance Metrics</h2>
                <div class="metrics-grid">
                  <div class="metric">
                    <h3>Total Feedback</h3>
                    <div class="value">{{totalFeedback}}</div>
                    <div class="change {{totalChangeClass}}">{{totalChange}}</div>
                  </div>
                  <div class="metric">
                    <h3>Complaints</h3>
                    <div class="value">{{complaints}}</div>
                    <div class="change {{complaintsChangeClass}}">{{complaintsChange}}</div>
                  </div>
                  <div class="metric">
                    <h3>Suggestions</h3>
                    <div class="value">{{suggestions}}</div>
                    <div class="change {{suggestionsChangeClass}}">{{suggestionsChange}}</div>
                  </div>
                  <div class="metric">
                    <h3>Compliments</h3>
                    <div class="value">{{compliments}}</div>
                    <div class="change {{complimentsChangeClass}}">{{complimentsChange}}</div>
                  </div>
                  <div class="metric">
                    <h3>Response Rate</h3>
                    <div class="value">{{responseRate}}</div>
                    <div class="change {{responseRateChangeClass}}">{{responseRateChange}}</div>
                  </div>
                  <div class="metric">
                    <h3>Avg Resolution Time</h3>
                    <div class="value">{{avgResolutionTime}}</div>
                    <div class="change {{resolutionTimeChangeClass}}">{{resolutionTimeChange}}</div>
                  </div>
                </div>
              </div>
              
              <div class="section">
                <h2 class="section-title">📊 Visual Analytics</h2>
                <div class="chart-container">
                  📈 Feedback Trend Analysis Chart<br>
                  <small>Interactive chart showing feedback trends over time</small>
                </div>
                <div class="chart-container">
                  🍰 Department Distribution Pie Chart<br>
                  <small>Breakdown of feedback by department</small>
                </div>
              </div>
              
              <div class="section">
                <h2 class="section-title">📋 Detailed Breakdown</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Total Feedback</th>
                      <th>Complaints</th>
                      <th>Suggestions</th>
                      <th>Compliments</th>
                      <th>Response Rate</th>
                      <th>Avg Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {{departmentRows}}
                  </tbody>
                </table>
              </div>
              
              <div class="section">
                <h2 class="section-title">🎯 Key Insights</h2>
                <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px;">
                  <ul style="margin-left: 20px; line-height: 1.8;">
                    <li><strong>Top Performing Department:</strong> {{topDepartment}} with {{topDepartmentScore}} satisfaction rating</li>
                    <li><strong>Most Improved:</strong> {{mostImproved}} showing {{improvementPercentage}} improvement</li>
                    <li><strong>Priority Areas:</strong> {{priorityAreas}} require immediate attention</li>
                    <li><strong>Trend:</strong> Overall satisfaction has {{overallTrend}} over the reporting period</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="footer">
              <p>This report was generated automatically by the Patient Feedback Management System</p>
              <p>For questions or support, please contact the system administrator</p>
            </div>
          </div>
        </body>
      </html>
    `,
    
    departmentPerformance: `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Department Performance Report - {{department}}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Inter', sans-serif; 
              background: #fef7f0; 
              color: #1e293b;
              line-height: 1.6;
            }
            .container {
              max-width: 1200px;
              margin: 0 auto;
              background: white;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
              border-radius: 16px;
              overflow: hidden;
            }
            .header { 
              background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
              color: white; 
              padding: 40px;
              text-align: center;
            }
            .header h1 { 
              font-size: 2.5rem; 
              font-weight: 700; 
              margin-bottom: 8px;
            }
            .header .subtitle { 
              font-size: 1.1rem; 
              opacity: 0.9; 
              font-weight: 400;
            }
            .content { padding: 40px; }
            
            .scorecard { 
              background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); 
              border: 2px solid #f59e0b; 
              border-radius: 16px; 
              padding: 32px; 
              margin: 32px 0;
              text-align: center;
            }
            .scorecard .score { 
              font-size: 4rem; 
              font-weight: 700; 
              color: #92400e; 
              margin: 16px 0;
            }
            .scorecard .label { 
              font-size: 1.2rem; 
              color: #92400e; 
              font-weight: 600;
            }
            
            .metrics-grid { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
              gap: 24px; 
              margin: 32px 0; 
            }
            .metric { 
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); 
              border: 1px solid #e2e8f0; 
              padding: 28px; 
              border-radius: 12px; 
              text-align: center;
              position: relative;
            }
            .metric::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #f59e0b, #d97706);
            }
            .metric h3 { 
              font-size: 1rem; 
              font-weight: 600; 
              color: #64748b; 
              margin-bottom: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .metric .value { 
              font-size: 2rem; 
              font-weight: 700; 
              color: #1e293b; 
              margin: 8px 0;
            }
            .metric .change { 
              font-size: 0.9rem; 
              font-weight: 600;
              padding: 4px 12px;
              border-radius: 20px;
              display: inline-block;
            }
            .change.positive { background: #dcfce7; color: #166534; }
            .change.negative { background: #fee2e2; color: #991b1b; }
            .change.neutral { background: #f1f5f9; color: #475569; }
            
            .section { margin: 48px 0; }
            .section-title { 
              font-size: 1.75rem; 
              font-weight: 700; 
              color: #1e293b; 
              margin-bottom: 24px;
              padding-bottom: 12px;
              border-bottom: 3px solid #f59e0b;
            }
            
            .chart-container { 
              background: #fef7f0; 
              border: 2px dashed #fbbf24; 
              border-radius: 12px;
              height: 300px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              margin: 24px 0;
              color: #92400e;
              font-size: 1.1rem;
              font-weight: 500;
            }
            
            .performance-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 24px 0; 
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }
            .performance-table th, .performance-table td { 
              padding: 16px; 
              text-align: left; 
              border-bottom: 1px solid #e2e8f0; 
            }
            .performance-table th { 
              background: linear-gradient(135deg, #92400e 0%, #78350f 100%); 
              color: white; 
              font-weight: 600;
              font-size: 0.9rem;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .performance-table tr:hover { background: #fef7f0; }
            .performance-table tr:nth-child(even) { background: #fef7f0; }
            
            .rating-bar {
              background: #e2e8f0;
              border-radius: 10px;
              height: 20px;
              overflow: hidden;
              margin: 8px 0;
            }
            .rating-fill {
              height: 100%;
              background: linear-gradient(90deg, #f59e0b, #d97706);
              border-radius: 10px;
              transition: width 0.3s ease;
            }
            
            .footer {
              background: #fef7f0;
              padding: 24px 40px;
              text-align: center;
              color: #92400e;
              font-size: 0.9rem;
            }
            
            .print-button {
              position: fixed;
              top: 20px;
              right: 20px;
              background: #f59e0b;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 600;
              box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
            }
            
            @media print {
              .print-button { display: none; }
              body { background: white; }
              .container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <button class="print-button" onclick="window.print()">🖨️ Print Report</button>
          <div class="container">
            <div class="header">
              <h1>🏆 Department Performance Report</h1>
              <p class="subtitle">{{department}} • {{dateRange}} • Generated on {{date}}</p>
            </div>
            
            <div class="content">
              <div class="scorecard">
                <div class="label">Overall Performance Score</div>
                <div class="score">{{overallScore}}/10</div>
                <div class="change {{overallChangeClass}}">{{overallChange}}</div>
              </div>
              
              <div class="section">
                <h2 class="section-title">📊 Performance Metrics</h2>
                <div class="metrics-grid">
                  <div class="metric">
                    <h3>Patient Satisfaction</h3>
                    <div class="value">{{patientSatisfaction}}/10</div>
                    <div class="change {{satisfactionChangeClass}}">{{satisfactionChange}}</div>
                  </div>
                  <div class="metric">
                    <h3>Staff Performance</h3>
                    <div class="value">{{staffPerformance}}/10</div>
                    <div class="change {{staffChangeClass}}">{{staffChange}}</div>
                  </div>
                  <div class="metric">
                    <h3>Response Time</h3>
                    <div class="value">{{responseTime}}</div>
                    <div class="change {{responseTimeChangeClass}}">{{responseTimeChange}}</div>
                  </div>
                  <div class="metric">
                    <h3>Cleanliness Rating</h3>
                    <div class="value">{{cleanlinessRating}}/10</div>
                    <div class="change {{cleanlinessChangeClass}}">{{cleanlinessChange}}</div>
                  </div>
                  <div class="metric">
                    <h3>Communication Quality</h3>
                    <div class="value">{{communicationQuality}}/10</div>
                    <div class="change {{communicationChangeClass}}">{{communicationChange}}</div>
                  </div>
                  <div class="metric">
                    <h3>Wait Time Satisfaction</h3>
                    <div class="value">{{waitTimeSatisfaction}}/10</div>
                    <div class="change {{waitTimeChangeClass}}">{{waitTimeChange}}</div>
                  </div>
                </div>
              </div>
              
              <div class="section">
                <h2 class="section-title">📈 Performance Trends</h2>
                <div class="chart-container">
                  📊 Performance Trend Analysis<br>
                  <small>Monthly performance trends over the reporting period</small>
                </div>
                <div class="chart-container">
                  🏆 Department Ranking Comparison<br>
                  <small>Performance comparison with other departments</small>
                </div>
              </div>
              
              <div class="section">
                <h2 class="section-title">📋 Detailed Performance Breakdown</h2>
                <table class="performance-table">
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Current Score</th>
                      <th>Previous Period</th>
                      <th>Change</th>
                      <th>Target</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {{performanceRows}}
                  </tbody>
                </table>
              </div>
              
              <div class="section">
                <h2 class="section-title">🎯 Key Insights & Recommendations</h2>
                <div style="background: #fef7f0; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px;">
                  <h3 style="color: #92400e; margin-bottom: 16px;">Strengths</h3>
                  <ul style="margin-left: 20px; line-height: 1.8; margin-bottom: 20px;">
                    {{strengths}}
                  </ul>
                  
                  <h3 style="color: #dc2626; margin-bottom: 16px;">Areas for Improvement</h3>
                  <ul style="margin-left: 20px; line-height: 1.8; margin-bottom: 20px;">
                    {{improvements}}
                  </ul>
                  
                  <h3 style="color: #059669; margin-bottom: 16px;">Recommendations</h3>
                  <ul style="margin-left: 20px; line-height: 1.8;">
                    {{recommendations}}
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="footer">
              <p>This performance report was generated automatically by the Patient Feedback Management System</p>
              <p>For questions or support, please contact the system administrator</p>
            </div>
          </div>
        </body>
      </html>
    `
  };

  return baseTemplate[reportType] || baseTemplate.feedbackSummary;
};

export const getReportIcon = (type: string) => {
  switch (type) {
    case 'feedback-summary':
      return 'FileText';
    case 'department-performance':
      return 'FileChartColumn';
    case 'satisfaction-scores':
      return 'FileChartPie';
    case 'response-times':
      return 'Clock';
    case 'trending-issues':
      return 'TrendingUp';
    default:
      return 'File';
  }
};

export const getChangeColor = (change: string) => {
  if (change.startsWith('+')) return 'text-green-600';
  if (change.startsWith('-')) return 'text-red-600';
  return 'text-gray-600';
};

// Helper function to get change class for CSS
export const getChangeClass = (change: string) => {
  if (change.startsWith('+')) return 'positive';
  if (change.startsWith('-')) return 'negative';
  return 'neutral';
};
