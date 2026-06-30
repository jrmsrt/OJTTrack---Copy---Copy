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
  const { students, updateDTRStatus } = useOJT();
  
  const [activeTab, setActiveTab] = useState<'logs' | 'dtrs'>('logs');
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [weekFilter, setWeekFilter] = useState('');
  const [dtrMonthFilter, setDtrMonthFilter] = useState('');
  
  // Review Dialog States
  const [selectedDtr, setSelectedDtr] = useState<any | null>(null);
  const [remarks, setRemarks] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const getComparableSection = (section: string) => {
    const normalizedSection = section.trim().toUpperCase();
    const legacyMatch = normalizedSection.match(/\b([34])([AB])$/);

    if (legacyMatch) {
      return `${legacyMatch[1]}-${legacyMatch[2] === 'A' ? '1' : '2'}`;
    }

    return section.trim();
  };

  const getWeekRange = (weekValue: string) => {
    const [yearValue, weekNumberValue] = weekValue.split('-W');
    const year = Number(yearValue);
    const weekNumber = Number(weekNumberValue);

    if (!year || !weekNumber) return null;

    const janFourth = new Date(year, 0, 4);
    const janFourthDay = janFourth.getDay() || 7;
    const firstWeekMonday = new Date(janFourth);
    firstWeekMonday.setDate(janFourth.getDate() - janFourthDay + 1);

    const start = new Date(firstWeekMonday);
    start.setDate(firstWeekMonday.getDate() + (weekNumber - 1) * 7);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return { start, end };
  };

  const isDateWithinWeek = (dateValue: string, weekValue: string) => {
    const range = getWeekRange(weekValue);
    if (!range) return true;

    const date = new Date(`${dateValue}T00:00:00`);
    return date >= range.start && date <= range.end;
  };

  // Flatten all attendance logs across all students
  const allLogs = students.flatMap(s => 
    s.attendanceHistory.map(a => ({
      ...a,
      studentName: s.name,
      studentNumber: s.studentNumber,
      program: s.program,
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
  const filteredLogs = allLogs.filter(log => {
    const normalizedSearch = searchTerm.toLowerCase();
    const matchesSearch = log.studentName.toLowerCase().includes(normalizedSearch) || 
                          log.studentNumber.includes(searchTerm) ||
                          log.date.toLowerCase().includes(normalizedSearch) ||
                          log.locationStatus.toLowerCase().includes(normalizedSearch) ||
                          log.companyName.toLowerCase().includes(normalizedSearch);
    const matchesSection = sectionFilter === 'all' || getComparableSection(log.section) === sectionFilter;
    const matchesProgram = programFilter === 'all' || log.program.includes(programFilter);
    const matchesDate = !dateFilter || log.date === dateFilter;
    const matchesWeek = !weekFilter || isDateWithinWeek(log.date, weekFilter);
    return matchesSearch && matchesSection && matchesProgram && matchesDate && matchesWeek;
  });

  // Filter DTRs list
  const filteredDTRs = allDTRs.filter(dtr => {
    const normalizedSearch = searchTerm.toLowerCase();
    const matchesSearch = dtr.studentName.toLowerCase().includes(normalizedSearch) || 
                          dtr.studentNumber.includes(searchTerm) ||
                          dtr.month.toLowerCase().includes(normalizedSearch) ||
                          dtr.status.toLowerCase().includes(normalizedSearch) ||
                          dtr.companyName.toLowerCase().includes(normalizedSearch);
    const matchesSection = sectionFilter === 'all' || getComparableSection(dtr.section) === sectionFilter;
    const matchesProgram = programFilter === 'all' || dtr.program.includes(programFilter);
    const matchesMonth = !dtrMonthFilter || dtr.startDate.startsWith(dtrMonthFilter);
    return matchesSearch && matchesSection && matchesProgram && matchesMonth;
  });

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

  const handlePrintDtr = (dtrId: string) => {
    document.getElementById('dtr-print-frame')?.remove();

    const frame = document.createElement('iframe');
    frame.id = 'dtr-print-frame';
    frame.src = `/print-dtr/${dtrId}?preview=1`;
    frame.style.position = 'fixed';
    frame.style.right = '0';
    frame.style.bottom = '0';
    frame.style.width = '1px';
    frame.style.height = '1px';
    frame.style.border = '0';
    frame.style.opacity = '0';
    frame.setAttribute('aria-hidden', 'true');
    frame.onload = () => {
      window.setTimeout(() => {
        frame.contentWindow?.focus();
        frame.contentWindow?.print();
      }, 300);
    };
    document.body.appendChild(frame);

    window.setTimeout(() => frame.remove(), 60000);
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
            className={`h-8 text-xs font-bold cursor-pointer ${activeTab === 'logs' ? 'bg-white shadow-sm hover:bg-white' : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'}`}
          >
            Clock-In Logs
          </Button>
          <Button
            onClick={() => setActiveTab('dtrs')}
            variant={activeTab === 'dtrs' ? 'secondary' : 'ghost'}
            className={`h-8 text-xs font-bold cursor-pointer ${activeTab === 'dtrs' ? 'bg-white shadow-sm hover:bg-white' : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'}`}
          >
            DTR Review Board
          </Button>
        </div>
      </div>

      {/* Filter panel */}
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1.5 w-full">
            <Label htmlFor="attendance-search" className="text-xs">Search student</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="attendance-search"
                type="search"
                placeholder={activeTab === 'logs' ? "Search student, ID, company, or date..." : "Search student, ID, company, month, or status..."}
                className="pl-10 text-xs bg-slate-50 border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full md:w-48 space-y-1.5">
            <Label htmlFor="attendance-program" className="text-xs">Program Course</Label>
            <select
              id="attendance-program"
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-250 rounded-lg p-2 text-xs focus:ring-[#800000] focus:border-[#800000]"
            >
              <option value="all">All Programs</option>
              <option value="BSIT">BSIT</option>
              <option value="BSCpE">BSCpE</option>
              <option value="BSHM">BSHM</option>
              <option value="BSOA">BSOA</option>
            </select>
          </div>

          <div className="w-full md:w-48 space-y-1.5">
            <Label htmlFor="attendance-section" className="text-xs">Class Section</Label>
            <select
              id="attendance-section"
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-250 rounded-lg p-2 text-xs focus:ring-[#800000] focus:border-[#800000]"
            >
              <option value="all">All Sections</option>
              <option value="3-1">3-1</option>
              <option value="3-2">3-2</option>
              <option value="4-1">4-1</option>
              <option value="4-2">4-2</option>
            </select>
          </div>

          {activeTab === 'logs' && (
            <>
              <div className="w-full md:w-40 space-y-1.5">
                <Label htmlFor="attendance-date" className="text-xs">Log Date</Label>
                <Input
                  id="attendance-date"
                  type="date"
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    if (e.target.value) setWeekFilter('');
                  }}
                  className="text-xs bg-slate-50 border-slate-200"
                />
              </div>

              <div className="w-full md:w-40 space-y-1.5">
                <Label htmlFor="attendance-week" className="text-xs">Log Week</Label>
                <Input
                  id="attendance-week"
                  type="week"
                  value={weekFilter}
                  onChange={(e) => {
                    setWeekFilter(e.target.value);
                    if (e.target.value) setDateFilter('');
                  }}
                  className="text-xs bg-slate-50 border-slate-200"
                />
              </div>
            </>
          )}

          {activeTab === 'dtrs' && (
            <div className="w-full md:w-40 space-y-1.5">
              <Label htmlFor="dtr-month" className="text-xs">DTR Month</Label>
              <Input
                id="dtr-month"
                type="month"
                value={dtrMonthFilter}
                onChange={(e) => setDtrMonthFilter(e.target.value)}
                className="text-xs bg-slate-50 border-slate-200"
              />
            </div>
          )}
        </CardContent>
      </Card>

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
              {/* Actual printable DTR preview */}
              <div className="bg-slate-100 rounded-lg border border-slate-200 overflow-hidden h-[420px]">
                <iframe
                  title={`Printable DTR preview for ${selectedDtr.studentName}`}
                  src={`/print-dtr/${selectedDtr.id}?preview=1`}
                  className="w-full h-full bg-white"
                />
              </div>

              <div className="hidden">
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
                    onClick={() => handlePrintDtr(selectedDtr.id)}
                    variant="outline"
                    className="text-xs border-slate-300 font-semibold flex items-center gap-1 px-3 cursor-pointer hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Printer className="h-4 w-4" /> View Printable DTR PDF
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleReviewAction('Needs Revision')}
                      variant="outline"
                      className="text-xs border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-400 font-semibold flex items-center gap-1.5 px-4 cursor-pointer"
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
