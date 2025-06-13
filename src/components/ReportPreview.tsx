
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, FileChartColumn, FileChartPie, Clock, TrendingUp, File, Edit, X, BarChart3, PieChart } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getTemplateData, getChangeColor } from '@/utils/reportTemplates';
import { useToast } from '@/hooks/use-toast';

interface ReportPreviewProps {
  reportType: string;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ reportType }) => {
  const { toast } = useToast();
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

  const handleEditVisualization = (chartName: string) => {
    toast({
      title: "Edit Visualization",
      description: `Editing ${chartName} configuration.`,
    });
  };

  const handleDisableVisualization = (chartName: string) => {
    toast({
      title: "Visualization Disabled",
      description: `${chartName} has been disabled for this report.`,
      variant: "destructive",
    });
  };

  // Sample data for charts
  const chartData = [
    { name: 'Week 1', value: 120 },
    { name: 'Week 2', value: 150 },
    { name: 'Week 3', value: 180 },
    { name: 'Week 4', value: 200 },
  ];

  const pieData = [
    { name: 'Complaints', value: 400, color: '#ff6b6b' },
    { name: 'Suggestions', value: 300, color: '#4dabf7' },
    { name: 'Compliments', value: 200, color: '#40c057' }
  ];

  const renderVisualization = (chart: any, index: number) => {
    const chartComponent = () => {
      switch (chart.type) {
        case 'bar':
          return (
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4dabf7" />
              </BarChart>
            </ResponsiveContainer>
          );
        case 'pie':
          return (
            <ResponsiveContainer width="100%" height={120}>
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          );
        default:
          return (
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#4dabf7" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          );
      }
    };

    return (
      <div key={index} className="p-4 border rounded-lg bg-gray-50 relative group">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {chart.type === 'bar' ? <BarChart3 size={16} className="text-gray-600" /> :
             chart.type === 'pie' ? <PieChart size={16} className="text-gray-600" /> :
             <FileChartColumn size={16} className="text-gray-600" />}
            <span className="text-sm font-medium">{chart.name}</span>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditVisualization(chart.name)}
              className="h-6 w-6 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDisableVisualization(chart.name)}
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="h-32 bg-white rounded border">
          {chartComponent()}
        </div>
      </div>
    );
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
                {templateData.charts.map((chart, idx) => renderVisualization(chart, idx))}
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
