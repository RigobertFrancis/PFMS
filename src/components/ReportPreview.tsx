
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, FileChartColumn, FileChartPie, Clock, TrendingUp, File } from 'lucide-react';
import { getTemplateData, getChangeColor } from '@/utils/reportTemplates';

interface ReportPreviewProps {
  reportType: string;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ reportType }) => {
  const templateData = getTemplateData(reportType);

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'feedback-summary':
        return <FileText size={16} />;
      case 'department-performance':
        return <FileChartColumn size={16} />;
      case 'satisfaction-scores':
        return <FileChartPie size={16} />;
      case 'response-times':
        return <Clock size={16} />;
      case 'trending-issues':
        return <TrendingUp size={16} />;
      default:
        return <File size={16} />;
    }
  };

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getReportIcon(reportType)}
          {templateData?.title || 'Report Preview'}
        </CardTitle>
        {templateData?.description && (
          <p className="text-sm text-gray-600">{templateData.description}</p>
        )}
      </CardHeader>
      <CardContent>
        {templateData ? (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templateData.data.map((item, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{item.metric}</p>
                        <p className="text-2xl font-bold">{item.value}</p>
                        <p className="text-xs text-gray-500">{item.period}</p>
                      </div>
                      <div className={`text-sm font-medium ${getChangeColor(item.change)}`}>
                        {item.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Visualizations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templateData.charts.map((chart, idx) => (
                  <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <FileChartColumn size={16} className="text-gray-600" />
                      <span className="text-sm font-medium">{chart.name}</span>
                    </div>
                    <div className="h-24 bg-white rounded border flex items-center justify-center">
                      <span className="text-xs text-gray-400">{chart.type.charAt(0).toUpperCase() + chart.type.slice(1)} Chart</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Table */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Detailed Data</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Period</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templateData.data.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{item.metric}</TableCell>
                      <TableCell>{item.value}</TableCell>
                      <TableCell className={getChangeColor(item.change)}>{item.change}</TableCell>
                      <TableCell className="text-sm text-gray-600">{item.period}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Select a report type to view template</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportPreview;
