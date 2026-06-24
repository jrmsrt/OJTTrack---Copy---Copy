import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Search, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';
import { progressReports } from '../../data/mockData';

const allReports = [
  ...progressReports.map(r => ({ ...r, studentName: 'Sarah Johnson', studentId: 'STU-2024-001' })),
  {
    id: 3,
    studentName: 'David Martinez',
    studentId: 'STU-2024-002',
    week: 11,
    dateSubmitted: '2026-03-12',
    tasksAccomplished: 'Implemented user interface components',
    skillsLearned: 'React components, CSS styling',
    challenges: 'Responsive design challenges',
    hoursWorked: 38,
    status: 'pending' as const,
    supervisorComments: '',
  },
];

export function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<typeof allReports[0] | null>(null);
  const [feedback, setFeedback] = useState('');

  const filteredReports = allReports.filter((report) =>
    report.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingReports = filteredReports.filter(r => r.status === 'pending');
  const approvedReports = filteredReports.filter(r => r.status === 'approved');

  const handleApprove = () => {
    // Mock approval
    setSelectedReport(null);
    setFeedback('');
  };

  const handleRequestRevision = () => {
    // Mock request revision
    setSelectedReport(null);
    setFeedback('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Progress Reports</h1>
          <p className="text-slate-600 mt-1">Review and approve student progress reports</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search reports..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Pending Review</div>
                <div className="text-2xl font-bold text-orange-600">{pendingReports.length}</div>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Approved</div>
                <div className="text-2xl font-bold text-green-600">{approvedReports.length}</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Total Reports</div>
                <div className="text-2xl font-bold">{filteredReports.length}</div>
              </div>
              <MessageSquare className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingReports.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedReports.length})</TabsTrigger>
          <TabsTrigger value="all">All Reports ({filteredReports.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingReports.map((report) => (
            <Card key={report.id} className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{report.studentName} - Week {report.week}</CardTitle>
                    <p className="text-sm text-slate-500">{report.studentId} • Submitted {report.dateSubmitted}</p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">Pending Review</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 font-medium">Tasks Accomplished:</p>
                    <p className="text-slate-900">{report.tasksAccomplished}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 font-medium">Skills Learned:</p>
                    <p className="text-slate-900">{report.skillsLearned}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 font-medium">Challenges:</p>
                    <p className="text-slate-900">{report.challenges}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 font-medium">Hours Worked:</p>
                    <p className="text-slate-900">{report.hoursWorked} hours</p>
                  </div>
                </div>
                <Button 
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setSelectedReport(report)}
                >
                  Review Report
                </Button>
              </CardContent>
            </Card>
          ))}
          {pendingReports.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-medium text-slate-900 mb-2">No Pending Reports</h3>
                <p className="text-slate-600">All reports have been reviewed.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedReports.map((report) => (
            <Card key={report.id} className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{report.studentName} - Week {report.week}</CardTitle>
                    <p className="text-sm text-slate-500">{report.studentId} • Submitted {report.dateSubmitted}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Approved</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 font-medium">Tasks Accomplished:</p>
                    <p className="text-slate-900">{report.tasksAccomplished}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 font-medium">Skills Learned:</p>
                    <p className="text-slate-900">{report.skillsLearned}</p>
                  </div>
                </div>
                {report.supervisorComments && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-green-900 mb-1">Your Feedback:</p>
                    <p className="text-sm text-green-800">{report.supervisorComments}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className={`border-l-4 ${report.status === 'approved' ? 'border-l-green-500' : 'border-l-orange-500'}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{report.studentName} - Week {report.week}</CardTitle>
                    <p className="text-sm text-slate-500">{report.studentId} • Submitted {report.dateSubmitted}</p>
                  </div>
                  <Badge className={report.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                    {report.status === 'approved' ? 'Approved' : 'Pending'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="text-slate-600">Hours: {report.hoursWorked} • Tasks: {report.tasksAccomplished}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Progress Report</DialogTitle>
            <DialogDescription>
              {selectedReport?.studentName} - Week {selectedReport?.week}
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Tasks Accomplished</p>
                  <p className="text-sm text-slate-600">{selectedReport.tasksAccomplished}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Skills Learned</p>
                  <p className="text-sm text-slate-600">{selectedReport.skillsLearned}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Challenges Encountered</p>
                  <p className="text-sm text-slate-600">{selectedReport.challenges}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Hours Worked</p>
                  <p className="text-sm text-slate-600">{selectedReport.hoursWorked} hours</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Your Feedback</p>
                <Textarea
                  placeholder="Provide feedback and comments..."
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-green-600 hover:bg-green-700 gap-2" onClick={handleApprove}>
                  <CheckCircle className="h-4 w-4" />
                  Approve Report
                </Button>
                <Button className="flex-1 bg-orange-600 hover:bg-orange-700 gap-2" onClick={handleRequestRevision}>
                  <XCircle className="h-4 w-4" />
                  Request Revision
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
