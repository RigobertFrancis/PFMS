
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
