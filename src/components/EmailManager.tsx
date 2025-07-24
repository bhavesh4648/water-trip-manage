import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Send,
  Settings,
  Calendar,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

interface ScheduledEmail {
  id: string;
  recipient: string;
  subject: string;
  scheduledDate: string;
  status: "pending" | "sent" | "failed";
  reportType: string;
}

const EmailManager = () => {
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    username: "",
    password: "",
    fromEmail: "",
    fromName: "KeiYaShiv Water Supply",
  });

  const [manualEmail, setManualEmail] = useState({
    to: "",
    subject: "Monthly Water Delivery Report",
    body: "Dear Sir/Madam,\n\nPlease find attached the monthly water delivery report.\n\nBest regards,\nKeiYFvaShiv Team",
  });

  const [scheduledEmails] = useState<ScheduledEmail[]>([
    {
      id: "1",
      recipient: "hemant@example.com",
      subject: "Monthly Delivery Report - January 2024",
      scheduledDate: "2024-02-01T09:00:00Z",
      status: "sent",
      reportType: "Monthly Client Report",
    },
    {
      id: "2",
      recipient: "info@raviind.com",
      subject: "Monthly Delivery Report - January 2024",
      scheduledDate: "2024-02-01T09:00:00Z",
      status: "pending",
      reportType: "Monthly Client Report",
    },
    {
      id: "3",
      recipient: "contact@shiventerprises.com",
      subject: "Monthly Delivery Report - January 2024",
      scheduledDate: "2024-02-01T09:00:00Z",
      status: "failed",
      reportType: "Monthly Client Report",
    },
  ]);

  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleConfigureEmail = () => {
    setIsConfiguring(true);

    // Simulate API call
    setTimeout(() => {
      setIsConfiguring(false);
      toast({
        title: "Email Configuration Saved",
        description: "SMTP settings have been updated successfully",
      });
    }, 2000);
  };

  const handleSendManualEmail = () => {
    if (!manualEmail.to || !manualEmail.subject) {
      toast({
        title: "Missing Information",
        description: "Please fill in recipient and subject",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    // Simulate sending email
    setTimeout(() => {
      setIsSending(false);
      toast({
        title: "Email Sent Successfully",
        description: `Report sent to ${manualEmail.to}`,
      });
      setManualEmail((prev) => ({
        ...prev,
        to: "",
        body: "Dear Sir/Madam,\n\nPlease find attached the monthly water delivery report.\n\nBest regards,\nKeiYaShiv Team",
      }));
    }, 3000);
  };

  const handleScheduleAutoEmails = () => {
    toast({
      title: "Auto-Schedule Configured",
      description:
        "Monthly reports will be sent automatically on the 1st of each month",
    });
  };

  const retryFailedEmail = (emailId: string) => {
    toast({
      title: "Retrying Email",
      description: "Attempting to resend the failed email",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "sent":
        return "Sent";
      case "failed":
        return "Failed";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Configuration */}
      <Card className="border-ocean/20">
        <CardHeader>
          <CardTitle className="text-ocean-deep flex items-center gap-2">
            <Settings className="h-5 w-5 text-ocean" />
            Email Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input
                id="smtp-host"
                value={emailSettings.smtpHost}
                onChange={(e) =>
                  setEmailSettings((prev) => ({
                    ...prev,
                    smtpHost: e.target.value,
                  }))
                }
                placeholder="smtp.gmail.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input
                id="smtp-port"
                value={emailSettings.smtpPort}
                onChange={(e) =>
                  setEmailSettings((prev) => ({
                    ...prev,
                    smtpPort: e.target.value,
                  }))
                }
                placeholder="587"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="username">Username/Email</Label>
              <Input
                id="username"
                type="email"
                value={emailSettings.username}
                onChange={(e) =>
                  setEmailSettings((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                placeholder="your-email@gmail.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password/App Password</Label>
              <Input
                id="password"
                type="password"
                value={emailSettings.password}
                onChange={(e) =>
                  setEmailSettings((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                placeholder="your-app-password"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="from-email">From Email</Label>
              <Input
                id="from-email"
                type="email"
                value={emailSettings.fromEmail}
                onChange={(e) =>
                  setEmailSettings((prev) => ({
                    ...prev,
                    fromEmail: e.target.value,
                  }))
                }
                placeholder="noreply@yourcompany.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="from-name">From Name</Label>
              <Input
                id="from-name"
                value={emailSettings.fromName}
                onChange={(e) =>
                  setEmailSettings((prev) => ({
                    ...prev,
                    fromName: e.target.value,
                  }))
                }
                placeholder="KeiYaShiv Water Supply"
                className="mt-1"
              />
            </div>
          </div>

          <Button
            variant="ocean"
            onClick={handleConfigureEmail}
            disabled={isConfiguring}
            className="gap-2"
          >
            {isConfiguring ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Settings className="h-4 w-4" />
                Save Configuration
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Manual Email */}
      <Card className="border-ocean/20">
        <CardHeader>
          <CardTitle className="text-ocean-deep flex items-center gap-2">
            <Mail className="h-5 w-5 text-ocean" />
            Send Manual Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email-to">To (Email Address)</Label>
              <Input
                id="email-to"
                type="email"
                value={manualEmail.to}
                onChange={(e) =>
                  setManualEmail((prev) => ({ ...prev, to: e.target.value }))
                }
                placeholder="client@example.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                value={manualEmail.subject}
                onChange={(e) =>
                  setManualEmail((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
                placeholder="Monthly Water Delivery Report"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email-body">Message Body</Label>
              <Textarea
                id="email-body"
                value={manualEmail.body}
                onChange={(e) =>
                  setManualEmail((prev) => ({ ...prev, body: e.target.value }))
                }
                placeholder="Enter your message here..."
                rows={6}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="ocean"
                onClick={handleSendManualEmail}
                disabled={isSending}
                className="gap-2"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Email with Report
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  setManualEmail((prev) => ({
                    ...prev,
                    body: "Dear Sir/Madam,\n\nPlease find attached the monthly water delivery report.\n\nBest regards,\nKeiYaShiv Team",
                  }))
                }
              >
                Reset Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Schedule */}
      <Card className="border-ocean/20">
        <CardHeader>
          <CardTitle className="text-ocean-deep flex items-center gap-2">
            <Calendar className="h-5 w-5 text-ocean" />
            Auto-Schedule Monthly Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-ocean-light/20 p-4 rounded-lg">
              <h4 className="font-semibold text-ocean-deep mb-2">
                Automatic Email Schedule
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Monthly reports will be automatically generated and sent to all
                clients on the 1st of each month at 9:00 AM.
              </p>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-ocean" />
                  <span>Monthly on 1st</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-ocean" />
                  <span>9:00 AM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-ocean" />
                  <span>All active clients</span>
                </div>
              </div>
            </div>

            <Button
              variant="wave"
              onClick={handleScheduleAutoEmails}
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              Configure Auto-Schedule
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email History */}
      <Card className="border-ocean/20">
        <CardHeader>
          <CardTitle className="text-ocean-deep flex items-center gap-2">
            <FileText className="h-5 w-5 text-ocean" />
            Email History & Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduledEmails.map((email) => (
              <div
                key={email.id}
                className="border border-ocean/20 rounded-lg p-4 bg-ocean-light/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(email.status)}
                      <span className="font-medium text-ocean-deep">
                        {email.subject}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          email.status === "sent"
                            ? "bg-green-100 text-green-700"
                            : email.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {getStatusText(email.status)}
                      </span>
                    </div>

                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {email.recipient}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(
                            new Date(email.scheduledDate),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {email.reportType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {email.status === "failed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => retryFailedEmail(email.id)}
                      className="gap-2"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {scheduledEmails.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No email history found. Emails will appear here once sent.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailManager;
