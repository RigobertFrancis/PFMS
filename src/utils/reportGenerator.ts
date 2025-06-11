
import { ReportTemplate } from '@/lib/types';

export const generateReport = async (
  reportType: string,
  department: string,
  dateRange: string,
  format: string
): Promise<Blob> => {
  // Simulate report generation with actual templates
  const template = getReportTemplate(reportType);
  const data = getReportData(reportType, department, dateRange);
  
  if (format === 'pdf') {
    return generatePDFReport(template, data);
  } else if (format === 'excel') {
    return generateExcelReport(template, data);
  } else {
    return generateCSVReport(template, data);
  }
};

const getReportTemplate = (reportType: string): string => {
  const templates = {
    'feedback-summary': `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Feedback Summary Report</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 40px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }
            .container {
              background: white;
              border-radius: 12px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header { 
              background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); 
              color: white; 
              padding: 30px; 
              text-align: center;
            }
            .header h1 { margin: 0; font-size: 2.5em; font-weight: 300; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 1.1em; }
            .content { padding: 30px; }
            .metrics-grid { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
              gap: 20px; 
              margin: 30px 0; 
            }
            .metric { 
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); 
              border: 1px solid #e2e8f0; 
              padding: 25px; 
              border-radius: 10px; 
              text-align: center;
              position: relative;
              overflow: hidden;
            }
            .metric::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #4f46e5, #7c3aed);
            }
            .metric h3 { margin: 0 0 15px 0; color: #1e293b; font-size: 1.1em; }
            .metric .value { font-size: 2.5em; font-weight: bold; color: #4f46e5; margin: 10px 0; }
            .metric .change { color: #059669; font-weight: 600; }
            .chart-section { margin: 40px 0; }
            .chart-placeholder { 
              background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); 
              height: 300px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              border-radius: 10px;
              border: 2px dashed #cbd5e1;
              color: #64748b;
              font-size: 1.2em;
              font-weight: 500;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 30px 0; 
              background: white;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            th, td { padding: 15px; text-align: left; border-bottom: 1px solid #e2e8f0; }
            th { 
              background: linear-gradient(135deg, #1e293b 0%, #334155 100%); 
              color: white; 
              font-weight: 600;
            }
            tr:hover { background: #f8fafc; }
            .section-title { 
              font-size: 1.8em; 
              margin: 40px 0 20px 0; 
              color: #1e293b; 
              border-bottom: 3px solid #4f46e5; 
              padding-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Feedback Summary Report</h1>
              <p>Generated on {{date}} | Department: {{department}} | Period: {{dateRange}}</p>
            </div>
            
            <div class="content">
              <h2 class="section-title">Key Performance Metrics</h2>
              <div class="metrics-grid">
                <div class="metric">
                  <h3>Total Feedback Received</h3>
                  <div class="value">{{totalFeedback}}</div>
                  <div class="change">{{totalChange}} from previous period</div>
                </div>
                <div class="metric">
                  <h3>Complaints Received</h3>
                  <div class="value">{{complaints}}</div>
                  <div class="change">{{complaintsChange}} from previous period</div>
                </div>
                <div class="metric">
                  <h3>Suggestions Received</h3>
                  <div class="value">{{suggestions}}</div>
                  <div class="change">{{suggestionsChange}} from previous period</div>
                </div>
                <div class="metric">
                  <h3>Compliments Received</h3>
                  <div class="value">{{compliments}}</div>
                  <div class="change">{{complimentsChange}} from previous period</div>
                </div>
              </div>
              
              <h2 class="section-title">Visual Analytics</h2>
              <div class="chart-section">
                <div class="chart-placeholder">📈 Feedback Trend Analysis Chart</div>
              </div>
              <div class="chart-section">
                <div class="chart-placeholder">🍰 Department Distribution Pie Chart</div>
              </div>
              
              <h2 class="section-title">Detailed Department Breakdown</h2>
              <table>
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Total Feedback</th>
                    <th>Complaints</th>
                    <th>Suggestions</th>
                    <th>Compliments</th>
                    <th>Response Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {{departmentRows}}
                </tbody>
              </table>
            </div>
          </div>
        </body>
      </html>
    `,
    'department-performance': `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Department Performance Report</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 40px; 
              background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
              min-height: 100vh;
            }
            .container {
              background: white;
              border-radius: 12px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header { 
              background: linear-gradient(135deg, #e74c3c 0%, #f39c12 100%); 
              color: white; 
              padding: 30px; 
              text-align: center;
            }
            .header h1 { margin: 0; font-size: 2.5em; font-weight: 300; }
            .content { padding: 30px; }
            .scorecard { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
              gap: 25px; 
              margin: 30px 0; 
            }
            .score { 
              background: linear-gradient(135deg, #fff5f5 0%, #fef2f2 100%); 
              border: 1px solid #fecaca; 
              padding: 30px; 
              border-radius: 15px; 
              text-align: center;
              position: relative;
              overflow: hidden;
            }
            .score::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 5px;
              background: linear-gradient(90deg, #e74c3c, #f39c12);
            }
            .score h3 { margin: 0 0 20px 0; color: #1f2937; font-size: 1.2em; }
            .score .value { font-size: 3em; font-weight: bold; color: #e74c3c; margin: 15px 0; }
            .score .change { color: #059669; font-weight: 600; font-size: 1.1em; }
            .chart-placeholder { 
              background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%); 
              height: 250px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              margin: 25px 0; 
              border-radius: 15px;
              border: 2px dashed #f87171;
              color: #dc2626;
              font-size: 1.3em;
              font-weight: 600;
            }
            .section-title { 
              font-size: 1.8em; 
              margin: 40px 0 20px 0; 
              color: #1f2937; 
              border-bottom: 3px solid #e74c3c; 
              padding-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Department Performance Scorecard</h1>
              <p>Generated on {{date}} | Department: {{department}} | Period: {{dateRange}}</p>
            </div>
            
            <div class="content">
              <h2 class="section-title">Performance Indicators</h2>
              <div class="scorecard">
                <div class="score">
                  <h3>📋 Patient Satisfaction Score</h3>
                  <div class="value">{{satisfactionScore}}/10</div>
                  <div class="change">{{satisfactionChange}} from last period</div>
                </div>
                <div class="score">
                  <h3>⏱️ Average Response Time</h3>
                  <div class="value">{{responseTime}}h</div>
                  <div class="change">{{responseTimeChange}} improvement</div>
                </div>
                <div class="score">
                  <h3>✅ Resolution Rate</h3>
                  <div class="value">{{resolutionRate}}%</div>
                  <div class="change">{{resolutionRateChange}} increase</div>
                </div>
              </div>
              
              <h2 class="section-title">Performance Analysis</h2>
              <div class="chart-placeholder">📊 Department Performance Comparison Chart</div>
              <div class="chart-placeholder">📈 Monthly Trend Analysis</div>
            </div>
          </div>
        </body>
      </html>
    `,
    'response-times': `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Response Time Analysis</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 40px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }
            .container {
              background: white;
              border-radius: 12px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header { 
              background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); 
              color: white; 
              padding: 30px; 
              text-align: center;
            }
            .content { padding: 30px; }
            .metrics { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
              gap: 25px; 
              margin: 30px 0; 
            }
            .metric { 
              background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); 
              border: 1px solid #bae6fd; 
              padding: 25px; 
              border-radius: 12px;
              position: relative;
            }
            .metric::before {
              content: '⏰';
              position: absolute;
              top: 15px;
              right: 15px;
              font-size: 2em;
            }
            .metric h3 { margin: 0 0 15px 0; color: #0f172a; }
            .metric .value { font-size: 2.2em; font-weight: bold; color: #0369a1; }
            .chart-placeholder { 
              background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); 
              height: 280px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              margin: 25px 0; 
              border-radius: 12px;
              border: 2px dashed #0ea5e9;
              color: #0369a1;
              font-size: 1.2em;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Response Time Analysis</h1>
              <p>Generated on {{date}} | Department: {{department}} | Period: {{dateRange}}</p>
            </div>
            
            <div class="content">
              <div class="metrics">
                <div class="metric">
                  <h3>Average Response Time</h3>
                  <p class="value">{{avgResponseTime}} hours</p>
                  <p>Change: <strong>{{responseTimeChange}}</strong></p>
                </div>
                <div class="metric">
                  <h3>SLA Compliance Rate</h3>
                  <p class="value">{{slaCompliance}}%</p>
                  <p>Change: <strong>{{slaChange}}</strong></p>
                </div>
              </div>
              
              <div class="chart-placeholder">📊 Response Time Trends Over Time</div>
              <div class="chart-placeholder">🎯 SLA Performance Dashboard</div>
            </div>
          </div>
        </body>
      </html>
    `,
    'satisfaction-scores': `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Patient Satisfaction Analysis</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 40px; 
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              min-height: 100vh;
            }
            .container {
              background: white;
              border-radius: 12px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header { 
              background: linear-gradient(135deg, #059669 0%, #047857 100%); 
              color: white; 
              padding: 30px; 
              text-align: center;
            }
            .content { padding: 30px; }
            .scores { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
              gap: 25px; 
              margin: 30px 0; 
            }
            .score { 
              background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); 
              border: 1px solid #bbf7d0; 
              padding: 30px; 
              border-radius: 15px; 
              text-align: center;
              position: relative;
            }
            .score::before {
              content: '😊';
              position: absolute;
              top: 15px;
              right: 15px;
              font-size: 2em;
            }
            .score h3 { margin: 0 0 15px 0; color: #14532d; }
            .score .value { font-size: 3em; font-weight: bold; color: #059669; }
            .chart-placeholder { 
              background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); 
              height: 300px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              margin: 25px 0; 
              border-radius: 15px;
              border: 2px dashed #22c55e;
              color: #059669;
              font-size: 1.3em;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>😊 Patient Satisfaction Analysis</h1>
              <p>Generated on {{date}} | Department: {{department}} | Period: {{dateRange}}</p>
            </div>
            
            <div class="content">
              <div class="scores">
                <div class="score">
                  <h3>Overall Satisfaction</h3>
                  <div class="value">{{overallScore}}/10</div>
                </div>
                <div class="score">
                  <h3>Recommendation Rate</h3>
                  <div class="value">{{recommendScore}}%</div>
                </div>
              </div>
              
              <div class="chart-placeholder">📈 Satisfaction Trends Over Time</div>
              <div class="chart-placeholder">🔍 Category Breakdown Analysis</div>
            </div>
          </div>
        </body>
      </html>
    `,
    'trending-issues': `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Trending Issues Report</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 40px; 
              background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
              min-height: 100vh;
            }
            .container {
              background: white;
              border-radius: 12px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header { 
              background: linear-gradient(135deg, #d97706 0%, #b45309 100%); 
              color: white; 
              padding: 30px; 
              text-align: center;
            }
            .content { padding: 30px; }
            .issues { margin: 30px 0; }
            .issue { 
              background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); 
              border: 1px solid #fde68a; 
              padding: 20px; 
              margin: 15px 0; 
              border-radius: 12px;
              position: relative;
            }
            .issue::before {
              content: '⚠️';
              position: absolute;
              top: 15px;
              right: 15px;
              font-size: 1.5em;
            }
            .issue h3 { margin: 0 0 10px 0; color: #92400e; }
            .issue .count { font-size: 1.5em; font-weight: bold; color: #d97706; }
            .chart-placeholder { 
              background: linear-gradient(135deg, #fffbeb 0%, #fde68a 100%); 
              height: 280px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              margin: 25px 0; 
              border-radius: 12px;
              border: 2px dashed #f59e0b;
              color: #d97706;
              font-size: 1.2em;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Trending Issues Report</h1>
              <p>Generated on {{date}} | Department: {{department}} | Period: {{dateRange}}</p>
            </div>
            
            <div class="content">
              <h2>🔥 Top Reported Issues</h2>
              <div class="issues">
                <div class="issue">
                  <h3>Long Wait Times</h3>
                  <p class="count">{{waitTimeReports}} reports ({{waitTimeChange}})</p>
                </div>
                <div class="issue">
                  <h3>Parking Issues</h3>
                  <p class="count">{{parkingReports}} reports ({{parkingChange}})</p>
                </div>
              </div>
              
              <div class="chart-placeholder">📊 Issue Frequency Analysis</div>
              <div class="chart-placeholder">🌡️ Priority Heatmap</div>
            </div>
          </div>
        </body>
      </html>
    `
  };
  
  return templates[reportType as keyof typeof templates] || templates['feedback-summary'];
};

const getReportData = (reportType: string, department: string, dateRange: string) => {
  // Enhanced mock data for report generation
  return {
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    department: department === 'all' ? 'All Departments' : department.charAt(0).toUpperCase() + department.slice(1),
    dateRange: dateRange.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    totalFeedback: '1,247',
    totalChange: '+12%',
    complaints: '156',
    complaintsChange: '-8%',
    suggestions: '423',
    suggestionsChange: '+15%',
    compliments: '668',
    complimentsChange: '+18%',
    satisfactionScore: '8.9',
    satisfactionChange: '+0.3',
    responseTime: '4.2',
    responseTimeChange: '-1.3 hours',
    resolutionRate: '87',
    resolutionRateChange: '+5%',
    avgResponseTime: '4.2',
    slaCompliance: '87',
    slaChange: '+5%',
    overallScore: '8.9',
    recommendScore: '92',
    waitTimeReports: '34',
    waitTimeChange: '+12',
    parkingReports: '28',
    parkingChange: '+8',
    departmentRows: `
      <tr><td>Emergency</td><td>324</td><td>45</td><td>123</td><td>156</td><td>94%</td></tr>
      <tr><td>Surgery</td><td>198</td><td>23</td><td>89</td><td>86</td><td>97%</td></tr>
      <tr><td>Pediatrics</td><td>156</td><td>12</td><td>67</td><td>77</td><td>99%</td></tr>
      <tr><td>Cardiology</td><td>145</td><td>18</td><td>72</td><td>55</td><td>92%</td></tr>
      <tr><td>Radiology</td><td>123</td><td>15</td><td>58</td><td>50</td><td>88%</td></tr>
    `
  };
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
