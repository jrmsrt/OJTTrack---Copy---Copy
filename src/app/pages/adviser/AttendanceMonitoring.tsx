import React, { useState } from 'react';
import { useOJT, DTRRecord } from '../../context/OJTContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { 
  Search, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Clock,
  FileText,
  Printer,
  Sliders,
  Check,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { toast } from 'sonner';

export function AttendanceMonitoring() {
  const { students, updateDTRStatus, companies } = useOJT();
  
  const [activeTab, setActiveTab] = useState<'logs' | 'dtrs'>('logs');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Review Dialog States
  const [selectedDtr, setSelectedDtr] = useState<any | null>(null);
  const [remarks, setRemarks] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  // Flatten all attendance logs across all students
  const allLogs = students.flatMap(s => 
    s.attendanceHistory.map(a => ({
      ...a,
      studentName: s.name,
      studentNumber: s.studentNumber,
      section: s.section,
      companyName: s.companyName
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Flatten all DTR submissions
  const allDTRs = students.flatMap(s => 
    (s.dtrHistory || []).map(d => ({
      ...d,
      studentId: s.studentId,
      studentName: s.name,
      studentNumber: s.studentNumber,
      section: s.section,
      program: s.program,
      companyName: s.companyName
    }))
  ).sort((a, b) => {
    const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
    const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
    return dateB - dateA;
  });

  // Filter logs list
  const filteredLogs = allLogs.filter(log => 
    log.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.locationStatus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter DTRs list
  const filteredDTRs = allDTRs.filter(dtr => 
    dtr.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    dtr.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dtr.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Location Verified':
      case 'Attendance Recorded':
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 font-bold px-2 py-0.5 rounded text-[10px] gap-1"><CheckCircle2 className="h-3 w-3" /> Location Verified</Badge>;
      case 'Outside Deployment Area':
        return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100 font-bold px-2 py-0.5 rounded text-[10px] gap-1"><AlertTriangle className="h-3 w-3" /> Outside Geofence</Badge>;
      case 'Location Permission Denied':
      case 'Invalid Location':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-250 hover:bg-amber-100 font-bold px-2 py-0.5 rounded text-[10px] gap-1"><AlertTriangle className="h-3 w-3" /> GPS Shielded</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-500 border-slate-200">{status}</Badge>;
    }
  };

  const getDtrBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200 font-bold">Approved</Badge>;
      case 'Needs Revision':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 font-bold">Needs Revision</Badge>;
      case 'Submitted':
      case 'Under Review':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-bold">Submitted</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-500 border-slate-200">{status}</Badge>;
    }
  };

  const handleOpenReview = (dtr: any) => {
    setSelectedDtr(dtr);
    setRemarks(dtr.remarks || '');
    setReviewDialogOpen(true);
  };

  const handleReviewAction = (status: DTRRecord['status']) => {
    if (!selectedDtr) return;
    updateDTRStatus(selectedDtr.studentId, selectedDtr.id, status, remarks);
    toast.success(`DTR status updated to ${status}`, {
      description: `Student: ${selectedDtr.studentName}`
    });
    setReviewDialogOpen(false);
    setSelectedDtr(null);
    setRemarks('');
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Attendance Monitoring</h1>
          <p className="text-slate-500 text-sm mt-0.5 font-normal">Audit student clock-ins, geofence coordinate logs, and approve Daily Time Records.</p>
        </div>
        
        {/* Tab triggers */}
        <div className="flex gap-1.5 bg-slate-100 p-1.5 rounded-lg border border-slate-200 text-xs self-start">
          <Button
            onClick={() => setActiveTab('logs')}
            variant={activeTab === 'logs' ? 'secondary' : 'ghost'}
            className={`h-8 text-xs font-bold ${activeTab === 'logs' ? 'bg-white shadow-sm' : 'text-slate-600'}`}
          >
            Clock-In Logs
          </Button>
          <Button
            onClick={() => setActiveTab('dtrs')}
            variant={activeTab === 'dtrs' ? 'secondary' : 'ghost'}
            className={`h-8 text-xs font-bold ${activeTab === 'dtrs' ? 'bg-white shadow-sm' : 'text-slate-600'}`}
          >
            DTR Review Board
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="search"
          placeholder={activeTab === 'logs' ? "Search student or date..." : "Search student, month, status..."}
          className="pl-10 text-xs bg-white border-slate-200 focus-visible:ring-[#800000] w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {activeTab === 'logs' ? (
        /* Tab 1: Real-time logs */
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-800">Verification Logs</CardTitle>
            <CardDescription className="text-xs font-normal">Audited punch events with Geolocation coordinate checks.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Intern</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Deployment Company</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Date</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Clock In/Out</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Hours Rendered</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Geofence Validation</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Log Coordinates</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-400 font-semibold font-sans">
                      No punch log entries match selection.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors text-xs font-sans">
                      <TableCell className="py-3 px-4">
                        <span className="font-bold text-slate-800 text-xs block">{log.studentName}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{log.studentNumber} | {log.section}</span>
                      </TableCell>
                      <TableCell className="py-3 px-4 font-semibold text-slate-650">
                        {log.companyName}
                      </TableCell>
                      <TableCell className="py-3 px-4 font-semibold text-slate-805">
                        {log.date}
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <span className="text-xs font-bold text-slate-700 block">{log.timeIn}</span>
                        <span className="text-[10px] text-slate-450 font-medium">Out: {log.timeOut || '—'}</span>
                      </TableCell>
                      <TableCell className="py-3 px-4 font-extrabold text-slate-800 text-xs">
                        {log.totalHours > 0 ? `${log.totalHours.toFixed(2)} hrs` : '—'}
                      </TableCell>
                      <TableCell className="py-3 px-4 font-semibold">
                        {getStatusBadge(log.locationStatus)}
                      </TableCell>
                      <TableCell className="py-3 px-4 font-mono text-[10px] text-slate-500">
                        {log.gpsCoordinates ? (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-slate-450 shrink-0" />
                            {log.gpsCoordinates.lat.toFixed(4)}, {log.gpsCoordinates.lng.toFixed(4)}
                          </span>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        /* Tab 2: DTR Submissions list */
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-800">DTR Review Board</CardTitle>
            <CardDescription className="text-xs font-normal">Audit daily time card compilations submitted by student interns.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Student Name</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Target Month</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Date Range</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Total Rendered Hours</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Submitted Date</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Status</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase text-center w-32">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDTRs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-400 font-semibold font-sans">
                      No Daily Time Records submitted yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDTRs.map((dtr) => (
                    <TableRow key={dtr.id} className="hover:bg-slate-50/50 transition-colors text-xs font-sans">
                      <TableCell className="py-3.5 px-4 font-bold text-slate-850">
                        {dtr.studentName}
                        <span className="text-[10px] text-slate-400 font-medium block">{dtr.studentNumber} | {dtr.section}</span>
                      </TableCell>
                      <TableCell className="py-3.5 px-4 font-bold text-slate-700">{dtr.month}</TableCell>
                      <TableCell className="py-3.5 px-4 font-semibold text-slate-550">{dtr.startDate} to {dtr.endDate}</TableCell>
                      <TableCell className="py-3.5 px-4 font-extrabold text-slate-850">{dtr.totalHours.toFixed(2)} hrs</TableCell>
                      <TableCell className="py-3.5 px-4 text-slate-500 font-medium">{dtr.submittedAt || '—'}</TableCell>
                      <TableCell className="py-3.5 px-4">{getDtrBadge(dtr.status)}</TableCell>
                      <TableCell className="py-3.5 px-4 text-center">
                        <Button
                          size="sm"
                          onClick={() => handleOpenReview(dtr)}
                          className="bg-[#800000] hover:bg-[#6b0000] text-white text-[10.5px] h-7 font-bold px-3.5 cursor-pointer"
                        >
                          Review DTR
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* DTR Audit Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setReviewDialogOpen(false);
          setSelectedDtr(null);
        }
      }}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto font-sans p-6">
          <DialogHeader className="border-b pb-2 mb-2">
            <DialogTitle className="text-slate-900 font-sans font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#800000]" />
              Coordinate Daily Time Record Review
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-normal text-xs truncate">
              Auditing DTR submission for <span className="font-bold text-slate-850">{selectedDtr?.studentName}</span> | Period: {selectedDtr?.startDate} to {selectedDtr?.endDate}
            </DialogDescription>
          </DialogHeader>

          {selectedDtr && (
            <div className="space-y-4">
              {/* Printable preview render mimic */}
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 font-mono text-[10px] text-slate-800 max-h-[350px] overflow-y-auto">
                <div className="text-center border-b pb-2 mb-3">
                  <p className="font-bold text-[11px] uppercase tracking-wide">POLYTECHNIC UNIVERSITY OF THE PHILIPPINES</p>
                  <p className="font-extrabold text-[#800000] text-xs pt-1.5 underline">DAILY TIME RECORD PREVIEW</p>
                </div>
                
                <div className="grid grid-cols-2 gap-y-1 bg-white p-2 rounded border text-[9.5px] mb-3 font-sans">
                  <div><strong>Student:</strong> {selectedDtr.studentName}</div>
                  <div><strong>Course & Section:</strong> {selectedDtr.section}</div>
                  <div><strong>Company HTE:</strong> {selectedDtr.companyName}</div>
                  <div><strong>Covered Period:</strong> {selectedDtr.startDate} to {selectedDtr.endDate}</div>
                  <div><strong>Total Logged Hours:</strong> <strong className="text-[#800000]">{selectedDtr.totalHours.toFixed(2)} hours</strong></div>
                </div>

                <div className="border rounded overflow-hidden bg-white">
                  <table className="w-full text-center text-[9.5px]">
                    <thead>
                      <tr className="bg-slate-100 border-b font-sans font-bold text-slate-550 text-[8.5px]">
                        <th className="p-1 border-r">Date</th>
                        <th className="p-1 border-r">Arrival (In)</th>
                        <th className="p-1 border-r text-slate-400 font-normal">AM Out</th>
                        <th className="p-1 border-r text-slate-400 font-normal">PM In</th>
                        <th className="p-1 border-r">Departure (Out)</th>
                        <th className="p-1 w-20">Hours</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selectedDtr.logs.map((log: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-1 border-r font-bold text-slate-500 bg-slate-50/50">{log.date}</td>
                          <td className="p-1 border-r text-slate-700 font-semibold">{log.timeIn}</td>
                          <td className="p-1 border-r text-slate-350 font-sans italic text-[8px]">12:00 PM</td>
                          <td className="p-1 border-r text-slate-350 font-sans italic text-[8px]">01:00 PM</td>
                          <td className="p-1 border-r text-slate-700 font-semibold">{log.timeOut || '—'}</td>
                          <td className="p-1 font-bold text-slate-805">{log.totalHours.toFixed(2)} hrs</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Audit Controls */}
              <div className="space-y-4 font-sans text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="auditRemarks" className="text-xs font-bold text-slate-750">Evaluation Notes & Audit Remarks</Label>
                  <Input
                    id="auditRemarks"
                    placeholder="e.g. DTR looks perfect, signatures verified. / Missing punch out log on June 12th."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="border-slate-200 text-xs py-2"
                  />
                </div>

                <div className="flex flex-wrap justify-between items-center gap-3 pt-3 border-t">
                  <Button
                    onClick={() => window.open(`/print-dtr/${selectedDtr.id}`, '_blank')}
                    variant="outline"
                    className="text-xs border-slate-300 font-semibold flex items-center gap-1 px-3"
                  >
                    <Printer className="h-4 w-4" /> View Printable DTR PDF
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleReviewAction('Needs Revision')}
                      variant="outline"
                      className="text-xs border-amber-300 text-amber-700 hover:bg-amber-50 font-semibold flex items-center gap-1.5 px-4 cursor-pointer"
                    >
                      <X className="h-4 w-4" /> Request Revision
                    </Button>
                    <Button
                      onClick={() => handleReviewAction('Approved')}
                      className="bg-green-700 hover:bg-green-800 text-white font-bold text-xs flex items-center gap-1.5 px-4 cursor-pointer"
                    >
                      <Check className="h-4 w-4" /> Approve DTR (Sign-off)
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
