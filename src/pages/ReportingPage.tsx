import React, { useState } from 'react';
import ReportStats from '@/components/ReportStats';
import ReportGenerator from '@/components/ReportGenerator';
import ReportPreview from '@/components/ReportPreview';
import ScheduledReports from '@/components/ScheduledReports';
import ReportSharing from '@/components/ReportSharing';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, BarChart3, Share2, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ReportingPage: React.FC = () => {
  const [reportType, setReportType] = useState('feedback-summary');
  const [department, setDepartment] = useState('all');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [format, setFormat] = useState('pdf');
  const [generatedReport, setGeneratedReport] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  
  const handleGenerateReport = async () => {
    if (!reportType || !department || !dateRange || !format) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate a report.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Import the generateReport function
      const { generateReport } = await import('@/utils/reportGenerator');
      const blob = await generateReport(reportType, department, dateRange, format);
      setGeneratedReport(blob);
      
      toast({
        title: "Report Generated Successfully",
        description: `Your ${reportType} report for ${department} is ready.`,
      });
      
      // Switch to preview tab
      setActiveTab('preview');
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error Generating Report",
        description: "Failed to generate the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareReport = async (recipients: string[], message: string) => {
    try {
      // Here you would typically send the report via email or save to a sharing service
      console.log('Sharing report with:', recipients);
      console.log('Message:', message);
      
      // For demo purposes, we'll just show a success message
      toast({
        title: "Report Shared Successfully",
        description: `Report has been shared with ${recipients.length} recipient(s).`,
      });
    } catch (error) {
      toast({
        title: "Error Sharing Report",
        description: "Failed to share the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getReportTypeInfo = () => {
    const types = {
      'feedback-summary': {
        name: 'Feedback Summary',
        description: 'Comprehensive overview of patient feedback across departments',
        icon: FileText,
        color: 'bg-blue-100 text-blue-800'
      },
      'department-performance': {
        name: 'Department Performance',
        description: 'Detailed performance metrics and KPIs by department',
        icon: BarChart3,
        color: 'bg-orange-100 text-orange-800'
      }
    };
    return types[reportType] || types['feedback-summary'];
  };

  const reportInfo = getReportTypeInfo();
  const IconComponent = reportInfo.icon;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reporting Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Generate, preview, and share comprehensive reports for departments
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <IconComponent className="h-4 w-4 mr-2" />
          {reportInfo.name}
        </Badge>
      </div>
      
      <ReportStats />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="share" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Scheduled
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconComponent className="h-5 w-5" />
                Generate {reportInfo.name} Report
              </CardTitle>
              <p className="text-sm text-gray-600">{reportInfo.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ReportGenerator 
                  reportType={reportType}
                  setReportType={setReportType}
                  department={department}
                  setDepartment={setDepartment}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  format={format}
                  setFormat={setFormat}
                  onGenerate={handleGenerateReport}
                  isGenerating={isGenerating}
                />
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Report Features</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Comprehensive metrics and analytics</li>
                      <li>• Department-specific insights</li>
                      <li>• Trend analysis and comparisons</li>
                      <li>• Actionable recommendations</li>
                      <li>• Professional formatting</li>
                      <li>• Multiple export formats (PDF, Excel, CSV)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-blue-900">Enhanced Templates</h3>
                    <p className="text-sm text-blue-700">
                      Our new enhanced templates provide professional, department-specific reports with 
                      detailed metrics, visual charts, and actionable insights for better decision-making.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          {generatedReport ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Report Preview</h2>
                <Badge variant="secondary" className="text-sm">
                  Generated successfully
                </Badge>
              </div>
              <ReportPreview 
                reportType={reportType} 
                department={department}
                dateRange={dateRange}
                format={format}
                reportBlob={generatedReport}
              />
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Report Generated</h3>
                <p className="text-gray-600 mb-4">
                  Generate a report first to see the preview and sharing options.
                </p>
                <button
                  onClick={() => setActiveTab('generate')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Go to Generate Tab →
                </button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="share" className="space-y-6">
          {generatedReport ? (
            <ReportSharing
              reportType={reportType}
              department={department}
              dateRange={dateRange}
              format={format}
              reportBlob={generatedReport}
              onShare={handleShareReport}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Report to Share</h3>
                <p className="text-gray-600 mb-4">
                  Generate a report first to access sharing options.
                </p>
                <button
                  onClick={() => setActiveTab('generate')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Generate Report →
                </button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <ScheduledReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportingPage;
