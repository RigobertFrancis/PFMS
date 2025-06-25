import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Share2, 
  Mail, 
  Printer, 
  Download, 
  Copy, 
  Check,
  Users,
  Calendar,
  FileText
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ReportSharingProps {
  reportType: string;
  department: string;
  dateRange: string;
  format: string;
  reportBlob?: Blob;
  onShare?: (recipients: string[], message: string) => void;
}

interface Recipient {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  selected: boolean;
}

const ReportSharing: React.FC<ReportSharingProps> = ({
  reportType,
  department,
  dateRange,
  format,
  reportBlob,
  onShare
}) => {
  const [recipients, setRecipients] = useState<Recipient[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@hospital.com',
      role: 'Department Head',
      department: 'Emergency',
      selected: false
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      email: 'michael.chen@hospital.com',
      role: 'Department Head',
      department: 'Outpatient Clinic',
      selected: false
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@hospital.com',
      role: 'Department Head',
      department: 'Inpatient Ward',
      selected: false
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      email: 'james.wilson@hospital.com',
      role: 'Department Head',
      department: 'Radiology',
      selected: false
    },
    {
      id: '5',
      name: 'Dr. Lisa Thompson',
      email: 'lisa.thompson@hospital.com',
      role: 'Department Head',
      department: 'Laboratory',
      selected: false
    },
    {
      id: '6',
      name: 'Dr. Robert Davis',
      email: 'robert.davis@hospital.com',
      role: 'Department Head',
      department: 'Pharmacy',
      selected: false
    },
    {
      id: '7',
      name: 'Dr. Maria Garcia',
      email: 'maria.garcia@hospital.com',
      role: 'Department Head',
      department: 'Billing',
      selected: false
    },
    {
      id: '8',
      name: 'Dr. David Brown',
      email: 'david.brown@hospital.com',
      role: 'Department Head',
      department: 'Maternity',
      selected: false
    }
  ]);

  const [customEmails, setCustomEmails] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const filteredRecipients = department === 'all' 
    ? recipients 
    : recipients.filter(r => r.department.toLowerCase() === department.toLowerCase());

  const selectedRecipients = recipients.filter(r => r.selected);
  const totalRecipients = selectedRecipients.length + (customEmails ? customEmails.split(',').filter(email => email.trim()).length : 0);

  const handleRecipientToggle = (id: string) => {
    setRecipients(prev => 
      prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r)
    );
  };

  const handleSelectAll = () => {
    setRecipients(prev => 
      prev.map(r => ({ ...r, selected: true }))
    );
  };

  const handleDeselectAll = () => {
    setRecipients(prev => 
      prev.map(r => ({ ...r, selected: false }))
    );
  };

  const handleShare = async () => {
    if (totalRecipients === 0) {
      toast({
        title: "No recipients selected",
        description: "Please select at least one recipient or add custom email addresses.",
        variant: "destructive",
      });
      return;
    }

    setIsSharing(true);
    try {
      const selectedEmails = selectedRecipients.map(r => r.email);
      const customEmailList = customEmails.split(',').map(email => email.trim()).filter(email => email);
      const allRecipients = [...selectedEmails, ...customEmailList];

      // Simulate sharing
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (onShare) {
        onShare(allRecipients, message);
      }

      toast({
        title: "Report shared successfully",
        description: `Report has been shared with ${totalRecipients} recipient(s).`,
      });
    } catch (error) {
      toast({
        title: "Error sharing report",
        description: "Failed to share the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handlePrint = () => {
    if (reportBlob) {
      const url = URL.createObjectURL(reportBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}-${department}-${dateRange}.${format}`;
      link.click();
      URL.revokeObjectURL(url);
    }
    window.print();
  };

  const handleCopyLink = () => {
    const reportLink = `${window.location.origin}/reports/${reportType}/${department}/${dateRange}`;
    navigator.clipboard.writeText(reportLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Link copied",
      description: "Report link has been copied to clipboard.",
    });
  };

  const getDefaultMessage = () => {
    const reportName = reportType === 'feedback-summary' ? 'Feedback Summary Report' : 'Department Performance Report';
    const deptName = department === 'all' ? 'All Departments' : department;
    
    return `Please find attached the ${reportName} for ${deptName} covering ${dateRange}. 

This report contains key performance metrics, trends, and insights that may be relevant to your department's operations and improvement initiatives.

Please review the findings and let me know if you have any questions or require additional analysis.

Best regards,
Patient Feedback Management System`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-gray-600" />
            <span className="font-medium">Report Details</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Type:</span>
              <div className="font-medium">{reportType === 'feedback-summary' ? 'Feedback Summary' : 'Department Performance'}</div>
            </div>
            <div>
              <span className="text-gray-600">Department:</span>
              <div className="font-medium">{department === 'all' ? 'All Departments' : department}</div>
            </div>
            <div>
              <span className="text-gray-600">Period:</span>
              <div className="font-medium">{dateRange}</div>
            </div>
            <div>
              <span className="text-gray-600">Format:</span>
              <div className="font-medium uppercase">{format}</div>
            </div>
          </div>
        </div>

        {/* Recipients Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Select Recipients</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                Clear All
              </Button>
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto border rounded-lg p-4 space-y-2">
            {filteredRecipients.map((recipient) => (
              <div key={recipient.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                <Checkbox
                  id={recipient.id}
                  checked={recipient.selected}
                  onCheckedChange={() => handleRecipientToggle(recipient.id)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{recipient.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {recipient.role}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">{recipient.email}</div>
                  <div className="text-xs text-gray-500">{recipient.department}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Emails */}
          <div className="space-y-2">
            <Label htmlFor="custom-emails">Additional Email Addresses</Label>
            <Input
              id="custom-emails"
              placeholder="Enter email addresses separated by commas"
              value={customEmails}
              onChange={(e) => setCustomEmails(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Add email addresses not in the list above, separated by commas
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{totalRecipients} recipient(s) selected</span>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message">Message (Optional)</Label>
          <Textarea
            id="message"
            placeholder="Add a personal message to accompany the report..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setMessage(getDefaultMessage())}
            className="text-xs"
          >
            Use Default Message
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={handleShare} 
            disabled={isSharing || totalRecipients === 0}
            className="flex items-center gap-2"
          >
            {isSharing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sharing...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Share Report
              </>
            )}
          </Button>

          <Button 
            variant="outline" 
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>

          <Button 
            variant="outline" 
            onClick={handleCopyLink}
            className="flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>

          {reportBlob && (
            <Button 
              variant="outline" 
              onClick={() => {
                const url = URL.createObjectURL(reportBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${reportType}-${department}-${dateRange}.${format}`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          )}
        </div>

        {/* Sharing Options */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Sharing Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Checkbox id="include-charts" defaultChecked />
              <Label htmlFor="include-charts">Include interactive charts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="include-recommendations" defaultChecked />
              <Label htmlFor="include-recommendations">Include recommendations</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="schedule-followup" />
              <Label htmlFor="schedule-followup">Schedule follow-up meeting</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="track-opens" />
              <Label htmlFor="track-opens">Track when report is opened</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportSharing; 