import { ReportTemplate } from '@/lib/types';
import { getEnhancedReportTemplate, getChangeClass } from './reportTemplates';

export const generateReport = async (
  reportType: string,
  department: string,
  dateRange: string,
  format: string
): Promise<Blob> => {
  // Get enhanced template
  const template = getEnhancedReportTemplate(reportType, department, dateRange);
  const data = getEnhancedReportData(reportType, department, dateRange);
  
  if (format === 'pdf') {
    return generatePDFReport(template, data);
  } else if (format === 'excel') {
    return generateExcelReport(template, data);
  } else {
    return generateCSVReport(template, data);
  }
};

// Enhanced data generation with more realistic and comprehensive data
const getEnhancedReportData = (reportType: string, department: string, dateRange: string) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (reportType === 'feedback-summary') {
    return getFeedbackSummaryData(department, dateRange, currentDate);
  } else if (reportType === 'department-performance') {
    return getDepartmentPerformanceData(department, dateRange, currentDate);
  }

  // Fallback to basic data
  return {
    date: currentDate,
    department: department === 'all' ? 'All Departments' : department,
    dateRange: getDateRangeLabel(dateRange),
    totalFeedback: '1,247',
    complaints: '156',
    suggestions: '423',
    compliments: '668',
    responseRate: '94%',
    avgResolutionTime: '2.3 days'
  };
};

const getFeedbackSummaryData = (department: string, dateRange: string, currentDate: string) => {
  const departmentData = getDepartmentFeedbackData(department);
  const dateRangeLabel = getDateRangeLabel(dateRange);
  
  return {
    date: currentDate,
    department: department === 'all' ? 'All Departments' : department,
    dateRange: dateRangeLabel,
    
    // Metrics with realistic data
    totalFeedback: departmentData.totalFeedback.toLocaleString(),
    totalChange: '+12%',
    totalChangeClass: getChangeClass('+12%'),
    
    complaints: departmentData.complaints.toLocaleString(),
    complaintsChange: '-8%',
    complaintsChangeClass: getChangeClass('-8%'),
    
    suggestions: departmentData.suggestions.toLocaleString(),
    suggestionsChange: '+15%',
    suggestionsChangeClass: getChangeClass('+15%'),
    
    compliments: departmentData.compliments.toLocaleString(),
    complimentsChange: '+18%',
    complimentsChangeClass: getChangeClass('+18%'),
    
    responseRate: '94%',
    responseRateChange: '+3%',
    responseRateChangeClass: getChangeClass('+3%'),
    
    avgResolutionTime: '2.3 days',
    resolutionTimeChange: '-0.5 days',
    resolutionTimeChangeClass: getChangeClass('-0.5 days'),
    
    // Department breakdown table
    departmentRows: generateDepartmentRows(),
    
    // Key insights
    topDepartment: 'Pediatrics',
    topDepartmentScore: '9.5/10',
    mostImproved: 'Emergency Department',
    improvementPercentage: '15%',
    priorityAreas: 'Billing and Pharmacy',
    overallTrend: 'improved by 8%'
  };
};

const getDepartmentPerformanceData = (department: string, dateRange: string, currentDate: string) => {
  const performanceData = getDepartmentPerformanceMetrics(department);
  const dateRangeLabel = getDateRangeLabel(dateRange);
  
  return {
    date: currentDate,
    department: department === 'all' ? 'All Departments' : department,
    dateRange: dateRangeLabel,
    
    // Overall score
    overallScore: performanceData.overallScore,
    overallChange: '+0.3',
    overallChangeClass: getChangeClass('+0.3'),
    
    // Performance metrics
    patientSatisfaction: performanceData.patientSatisfaction,
    satisfactionChange: '+0.2',
    satisfactionChangeClass: getChangeClass('+0.2'),
    
    staffPerformance: performanceData.staffPerformance,
    staffChange: '+0.4',
    staffChangeClass: getChangeClass('+0.4'),
    
    responseTime: performanceData.responseTime,
    responseTimeChange: '-0.8 hours',
    responseTimeChangeClass: getChangeClass('-0.8 hours'),
    
    cleanlinessRating: performanceData.cleanlinessRating,
    cleanlinessChange: '+0.1',
    cleanlinessChangeClass: getChangeClass('+0.1'),
    
    communicationQuality: performanceData.communicationQuality,
    communicationChange: '+0.3',
    communicationChangeClass: getChangeClass('+0.3'),
    
    waitTimeSatisfaction: performanceData.waitTimeSatisfaction,
    waitTimeChange: '-0.2',
    waitTimeChangeClass: getChangeClass('-0.2'),
    
    // Performance breakdown table
    performanceRows: generatePerformanceRows(performanceData),
    
    // Insights and recommendations
    strengths: generateStrengths(department),
    improvements: generateImprovements(department),
    recommendations: generateRecommendations(department)
  };
};

// Helper functions for generating realistic data
const getDepartmentFeedbackData = (department: string) => {
  const baseData = {
    totalFeedback: 1247,
    complaints: 156,
    suggestions: 423,
    compliments: 668
  };

  if (department === 'all') {
    return baseData;
  }

  // Department-specific multipliers
  const multipliers = {
    'emergency': { total: 1.2, complaints: 1.3, suggestions: 1.1, compliments: 0.9 },
    'outpatient-clinic': { total: 1.0, complaints: 0.9, suggestions: 1.0, compliments: 1.1 },
    'inpatient-ward': { total: 0.8, complaints: 0.8, suggestions: 0.9, compliments: 0.8 },
    'radiology': { total: 0.6, complaints: 0.7, suggestions: 0.8, compliments: 0.6 },
    'laboratory': { total: 0.7, complaints: 0.6, suggestions: 0.7, compliments: 0.7 },
    'pharmacy': { total: 0.5, complaints: 0.8, suggestions: 0.6, compliments: 0.5 },
    'billing': { total: 0.8, complaints: 1.2, suggestions: 0.8, compliments: 0.6 },
    'maternity': { total: 0.4, complaints: 0.4, suggestions: 0.5, compliments: 0.4 }
  };

  const multiplier = multipliers[department] || { total: 1, complaints: 1, suggestions: 1, compliments: 1 };

  return {
    totalFeedback: Math.round(baseData.totalFeedback * multiplier.total),
    complaints: Math.round(baseData.complaints * multiplier.complaints),
    suggestions: Math.round(baseData.suggestions * multiplier.suggestions),
    compliments: Math.round(baseData.compliments * multiplier.compliments)
  };
};

const getDepartmentPerformanceMetrics = (department: string) => {
  const baseMetrics = {
    overallScore: 8.7,
    patientSatisfaction: 8.9,
    staffPerformance: 9.1,
    responseTime: '4.2 hours',
    cleanlinessRating: 8.7,
    communicationQuality: 8.8,
    waitTimeSatisfaction: 7.8
  };

  if (department === 'all') {
    return baseMetrics;
  }

  // Department-specific performance adjustments
  const adjustments = {
    'emergency': { overall: 0.2, satisfaction: 0.1, staff: 0.3, response: -1.0, cleanliness: 0.1, communication: 0.2, waitTime: -0.5 },
    'outpatient-clinic': { overall: 0.1, satisfaction: 0.2, staff: 0.1, response: -0.5, cleanliness: 0.2, communication: 0.1, waitTime: 0.1 },
    'inpatient-ward': { overall: 0.3, satisfaction: 0.3, staff: 0.4, response: -0.3, cleanliness: 0.3, communication: 0.3, waitTime: 0.2 },
    'radiology': { overall: 0.0, satisfaction: 0.0, staff: 0.1, response: 0.2, cleanliness: 0.1, communication: 0.0, waitTime: 0.0 },
    'laboratory': { overall: 0.1, satisfaction: 0.1, staff: 0.2, response: 0.1, cleanliness: 0.2, communication: 0.1, waitTime: 0.1 },
    'pharmacy': { overall: -0.2, satisfaction: -0.1, staff: 0.0, response: 0.5, cleanliness: 0.0, communication: -0.1, waitTime: -0.3 },
    'billing': { overall: -0.3, satisfaction: -0.2, staff: -0.1, response: 1.0, cleanliness: 0.0, communication: -0.2, waitTime: -0.4 },
    'maternity': { overall: 0.4, satisfaction: 0.4, staff: 0.5, response: -0.2, cleanliness: 0.4, communication: 0.4, waitTime: 0.3 }
  };

  const adjustment = adjustments[department] || { overall: 0, satisfaction: 0, staff: 0, response: 0, cleanliness: 0, communication: 0, waitTime: 0 };

  return {
    overallScore: Math.max(0, Math.min(10, baseMetrics.overallScore + adjustment.overall)),
    patientSatisfaction: Math.max(0, Math.min(10, baseMetrics.patientSatisfaction + adjustment.satisfaction)),
    staffPerformance: Math.max(0, Math.min(10, baseMetrics.staffPerformance + adjustment.staff)),
    responseTime: adjustResponseTime(baseMetrics.responseTime, adjustment.response),
    cleanlinessRating: Math.max(0, Math.min(10, baseMetrics.cleanlinessRating + adjustment.cleanliness)),
    communicationQuality: Math.max(0, Math.min(10, baseMetrics.communicationQuality + adjustment.communication)),
    waitTimeSatisfaction: Math.max(0, Math.min(10, baseMetrics.waitTimeSatisfaction + adjustment.waitTime))
  };
};

const adjustResponseTime = (baseTime: string, adjustment: number): string => {
  const hours = parseFloat(baseTime.split(' ')[0]) + adjustment;
  return `${Math.max(0.1, hours).toFixed(1)} hours`;
};

const generateDepartmentRows = () => {
  const departments = [
    { name: 'Emergency', total: 1582, complaints: 203, suggestions: 645, compliments: 279, responseRate: '96%', avgRating: '8.9' },
    { name: 'Outpatient Clinic', total: 1102, complaints: 281, suggestions: 506, compliments: 312, responseRate: '94%', avgRating: '9.1' },
    { name: 'Inpatient Ward', total: 876, complaints: 203, suggestions: 358, compliments: 179, responseRate: '93%', avgRating: '9.0' },
    { name: 'Radiology', total: 643, complaints: 131, suggestions: 236, complaints: 97, responseRate: '91%', avgRating: '8.7' },
    { name: 'Laboratory', total: 732, complaints: 128, suggestions: 235, complaints: 128, responseRate: '92%', avgRating: '8.8' },
    { name: 'Pharmacy', total: 589, complaints: 137, suggestions: 163, complaints: 74, responseRate: '89%', avgRating: '8.5' },
    { name: 'Billing', total: 954, complaints: 374, suggestions: 330, complaints: 138, responseRate: '87%', avgRating: '8.4' },
    { name: 'Maternity', total: 456, complaints: 53, suggestions: 105, complaints: 53, responseRate: '95%', avgRating: '9.3' }
  ];

  return departments.map(dept => 
    `<tr>
      <td><strong>${dept.name}</strong></td>
      <td>${dept.total.toLocaleString()}</td>
      <td>${dept.complaints.toLocaleString()}</td>
      <td>${dept.suggestions.toLocaleString()}</td>
      <td>${dept.compliments.toLocaleString()}</td>
      <td>${dept.responseRate}</td>
      <td>${dept.avgRating}/10</td>
    </tr>`
  ).join('');
};

const generatePerformanceRows = (performanceData: any) => {
  const metrics = [
    { name: 'Patient Satisfaction', current: performanceData.patientSatisfaction, previous: performanceData.patientSatisfaction - 0.2, target: 9.0, status: 'On Track' },
    { name: 'Staff Performance', current: performanceData.staffPerformance, previous: performanceData.staffPerformance - 0.4, target: 9.0, status: 'Exceeding' },
    { name: 'Response Time', current: performanceData.responseTime, previous: '5.0 hours', target: '4.0 hours', status: 'On Track' },
    { name: 'Cleanliness Rating', current: performanceData.cleanlinessRating, previous: performanceData.cleanlinessRating - 0.1, target: 9.0, status: 'Needs Attention' },
    { name: 'Communication Quality', current: performanceData.communicationQuality, previous: performanceData.communicationQuality - 0.3, target: 9.0, status: 'On Track' },
    { name: 'Wait Time Satisfaction', current: performanceData.waitTimeSatisfaction, previous: performanceData.waitTimeSatisfaction + 0.2, target: 8.5, status: 'Below Target' }
  ];

  return metrics.map(metric => {
    const change = typeof metric.current === 'number' && typeof metric.previous === 'number' 
      ? (metric.current - metric.previous).toFixed(1)
      : 'N/A';
    const changeClass = getChangeClass(change.startsWith('-') ? change : `+${change}`);
    
    return `<tr>
      <td><strong>${metric.name}</strong></td>
      <td>${metric.current}${typeof metric.current === 'number' ? '/10' : ''}</td>
      <td>${metric.previous}${typeof metric.previous === 'number' ? '/10' : ''}</td>
      <td class="${changeClass}">${change.startsWith('-') ? change : `+${change}`}</td>
      <td>${metric.target}${typeof metric.target === 'number' ? '/10' : ''}</td>
      <td><span class="status-${metric.status.toLowerCase().replace(' ', '-')}">${metric.status}</span></td>
    </tr>`;
  }).join('');
};

const generateStrengths = (department: string) => {
  const strengths = {
    'emergency': [
      'Excellent response time for critical cases',
      'High staff satisfaction scores',
      'Strong communication protocols'
    ],
    'outpatient-clinic': [
      'Consistent appointment scheduling',
      'Good patient flow management',
      'High cleanliness ratings'
    ],
    'inpatient-ward': [
      'Excellent patient care quality',
      'Strong staff-patient relationships',
      'High overall satisfaction scores'
    ],
    'default': [
      'Consistent service delivery',
      'Good staff training programs',
      'Effective feedback collection'
    ]
  };

  return (strengths[department] || strengths.default).map(strength => `<li>${strength}</li>`).join('');
};

const generateImprovements = (department: string) => {
  const improvements = {
    'emergency': [
      'Reduce wait times for non-critical cases',
      'Improve facility navigation signage',
      'Enhance patient communication during busy periods'
    ],
    'outpatient-clinic': [
      'Streamline appointment booking process',
      'Improve parking availability',
      'Enhance follow-up communication'
    ],
    'inpatient-ward': [
      'Reduce noise levels during night hours',
      'Improve meal service timing',
      'Enhance visitor management'
    ],
    'default': [
      'Improve response times',
      'Enhance communication protocols',
      'Optimize resource allocation'
    ]
  };

  return (improvements[department] || improvements.default).map(improvement => `<li>${improvement}</li>`).join('');
};

const generateRecommendations = (department: string) => {
  const recommendations = {
    'emergency': [
      'Implement triage optimization system',
      'Add more staff during peak hours',
      'Improve facility layout and signage'
    ],
    'outpatient-clinic': [
      'Implement online appointment booking',
      'Add parking management system',
      'Enhance patient education materials'
    ],
    'inpatient-ward': [
      'Implement quiet hours protocol',
      'Optimize meal service scheduling',
      'Improve visitor management system'
    ],
    'default': [
      'Implement performance monitoring dashboard',
      'Enhance staff training programs',
      'Optimize resource allocation based on demand'
    ]
  };

  return (recommendations[department] || recommendations.default).map(recommendation => `<li>${recommendation}</li>`).join('');
};

const getDateRangeLabel = (dateRange: string) => {
  const labels = {
    'last-7-days': 'Last 7 Days',
    'last-30-days': 'Last 30 Days',
    'last-90-days': 'Last 90 Days',
    'this-year': 'This Year',
    'custom': 'Custom Range'
  };
  return labels[dateRange] || dateRange;
};

const generatePDFReport = async (template: string, data: any): Promise<Blob> => {
  // Replace template variables with actual data
  let html = template;
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, data[key]);
  });
  
  // Return HTML blob (in production, you would use a library like Puppeteer to generate actual PDF)
  return new Blob([html], { type: 'text/html' });
};

const generateExcelReport = async (template: string, data: any): Promise<Blob> => {
  // Create a comprehensive CSV format for Excel compatibility
  const csvContent = `Hospital Feedback Report - ${data.department}
Generated on: ${data.date}
Period: ${data.dateRange}

Summary Metrics:
Metric,Value,Change
Total Feedback,${data.totalFeedback},${data.totalChange}
Complaints,${data.complaints},${data.complaintsChange}
Suggestions,${data.suggestions},${data.suggestionsChange}
Compliments,${data.compliments},${data.complimentsChange}
Satisfaction Score,${data.satisfactionScore}/10,${data.satisfactionChange}
Response Time,${data.responseTime}h,${data.responseTimeChange}
Resolution Rate,${data.resolutionRate}%,${data.resolutionRateChange}

Department Breakdown:
Department,Total Feedback,Complaints,Suggestions,Compliments,Response Rate
Emergency,324,45,123,156,94%
Surgery,198,23,89,86,97%
Pediatrics,156,12,67,77,99%
Cardiology,145,18,72,55,92%
Radiology,123,15,58,50,88%`;
  
  return new Blob([csvContent], { type: 'text/csv' });
};

const generateCSVReport = async (template: string, data: any): Promise<Blob> => {
  const csvContent = `Report Type,${data.department} Report
Generated,${data.date}
Period,${data.dateRange}

Metric,Value,Change
Total Feedback,${data.totalFeedback},${data.totalChange}
Complaints,${data.complaints},${data.complaintsChange}
Suggestions,${data.suggestions},${data.suggestionsChange}
Compliments,${data.compliments},${data.complimentsChange}
Satisfaction Score,${data.satisfactionScore},${data.satisfactionChange}
Response Time,${data.responseTime},${data.responseTimeChange}
Resolution Rate,${data.resolutionRate},${data.resolutionRateChange}`;
  
  return new Blob([csvContent], { type: 'text/csv' });
};

export const downloadReport = (blob: Blob, filename: string, format: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  const extension = format === 'excel' ? 'csv' : format === 'pdf' ? 'html' : 'csv';
  link.download = `${filename}.${extension}`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
