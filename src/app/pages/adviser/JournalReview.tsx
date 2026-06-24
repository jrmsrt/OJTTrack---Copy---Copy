import React, { useState } from 'react';
import { useOJT } from '../../context/OJTContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { 
  Check, 
  X, 
  Search, 
  BookOpen, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

export function JournalReview() {
  const { students, reviewWeeklyJournal } = useOJT();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJournal, setSelectedJournal] = useState<{ studentId: string; studentName: string; studentNumber: string; section: string; program: string; companyName: string; journalId: string; weekNumber: number; reflection: string; problems: string; totalHours: number; status: string; remarks?: string } | null>(null);
  const [remarks, setRemarks] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  // Flatten weekly journals
  const allJournals = students.flatMap(s => 
    s.weeklyJournals.map(j => ({
      journalId: j.id,
      weekNumber: j.weekNumber,
      startDate: j.startDate,
      endDate: j.endDate,
      reflection: j.reflection,
      problems: j.problems,
      totalHours: j.totalHours,
      status: j.status,
      remarks: j.remarks,
      studentId: s.studentId,
      studentName: s.name,
      studentNumber: s.studentNumber,
      section: s.section,
      program: s.program,
      companyName: s.companyName
    }))
  ).sort((a, b) => b.weekNumber - a.weekNumber);

  // Filter journals
  const filteredJournals = allJournals.filter(j => 
    j.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReviewAction = (status: 'Approved' | 'Needs Revision') => {
    if (!selectedJournal) return;

    reviewWeeklyJournal(selectedJournal.studentId, selectedJournal.journalId, status, remarks);
    toast.success(`Weekly Journal for Week ${selectedJournal.weekNumber} is now ${status === 'Approved' ? 'Approved' : 'Returned'}`);
    
    setReviewDialogOpen(false);
    setSelectedJournal(null);
    setRemarks('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'Needs Revision':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-250"><AlertTriangle className="h-3 w-3 mr-1" /> Needs Revision</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><Clock className="h-3 w-3 mr-1" /> Submitted</Badge>;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Weekly Journal Review</h1>
          <p className="text-slate-500 text-sm mt-0.5">Audit and endorse weekly OJT accomplishment journals compiled by interns.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search by student name..."
            className="pl-10 text-xs bg-slate-50 border-slate-200 focus-visible:ring-[#800000]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-800">Submitted Journals Queue</CardTitle>
          <CardDescription>Verify student reflections and total logged hours details before endorsing.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {filteredJournals.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No weekly journals submitted.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Student Name</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Week Number</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Total Hours</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Reflection Snippet</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Status</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase text-center w-28">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJournals.map((j) => (
                  <TableRow key={j.journalId} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 text-xs block">{j.studentName}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{j.studentNumber} | {j.section}</span>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 font-semibold text-xs text-slate-805">
                      Week {j.weekNumber}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-xs font-bold text-slate-800">
                      {j.totalHours} hrs
                    </TableCell>
                    <TableCell className="py-3.5 px-4 max-w-xs text-xs text-slate-500 font-light truncate">
                      {j.reflection}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 font-semibold text-xs">
                      {getStatusBadge(j.status)}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-center">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedJournal(j);
                          setRemarks(j.remarks || '');
                          setReviewDialogOpen(true);
                        }}
                        className="bg-[#800000] hover:bg-[#6b0000] text-white text-[10px] h-7 font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        Audit Journal
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog Document Preview style */}
      {selectedJournal && (
        <Dialog open={reviewDialogOpen} onOpenChange={() => setReviewDialogOpen(false)}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto font-sans">
            <DialogHeader>
              <DialogTitle>Audit Weekly Report Journal</DialogTitle>
              <DialogDescription>
                Verify reflections and hour validations for <span className="font-bold">{selectedJournal.studentName}</span>.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-5 text-xs">
              {/* Serif document preview sheet */}
              <div className="bg-white border border-slate-350 shadow-md p-8 text-slate-800 text-[10.5px] font-serif leading-relaxed max-w-2xl mx-auto space-y-5">
                <div className="text-center border-b pb-3 font-sans font-bold">
                  <p className="text-[10px] uppercase text-[#800000]">Polytechnic University of the Philippines</p>
                  <h4 className="text-xs uppercase mt-1">Accomplishment Weekly Journal (Week {selectedJournal.weekNumber})</h4>
                </div>

                <div className="grid grid-cols-2 gap-y-1.5 font-sans font-medium text-[9px] text-slate-500 pb-2 border-b border-slate-100">
                  <p>Student Name: <span className="text-slate-800 font-serif font-bold text-[10px]">{selectedJournal.studentName}</span></p>
                  <p>Company: <span className="text-slate-800 font-serif font-bold text-[10px]">{selectedJournal.companyName}</span></p>
                  <p>Program/Section: <span className="text-slate-800 font-serif font-bold text-[10px]">{selectedJournal.section}</span></p>
                  <p>Accumulated Duration: <span className="text-[#800000] font-sans font-bold text-[10px]">{selectedJournal.totalHours} hrs</span></p>
                </div>

                <div>
                  <h5 className="font-sans font-bold text-xs text-slate-900 border-l-2 border-[#800000] pl-1.5 mb-1.5">1. Reflective Insights</h5>
                  <p className="text-justify indent-6 leading-loose">{selectedJournal.reflection}</p>
                </div>

                <div>
                  <h5 className="font-sans font-bold text-xs text-slate-900 border-l-2 border-[#800000] pl-1.5 mb-1.5">2. Roadblocks & Incidents</h5>
                  <p className="text-justify bg-red-50/30 p-2 rounded border border-red-100 text-red-800 font-sans">{selectedJournal.problems}</p>
                </div>
              </div>

              {/* Remarks Field */}
              <div className="space-y-1.5 pt-2">
                <Label htmlFor="journalRemarks" className="text-xs">Add Adviser Remarks / Remarks</Label>
                <Input
                  id="journalRemarks"
                  placeholder="e.g. Approved. Thorough reflection on software review criteria."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => handleReviewAction('Needs Revision')}
                className="text-xs border-amber-300 text-amber-800 hover:bg-amber-50 cursor-pointer"
              >
                <X className="h-3.5 w-3.5 mr-1" /> Return for Revision
              </Button>
              <Button
                onClick={() => handleReviewAction('Approved')}
                className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold cursor-pointer"
              >
                <Check className="h-3.5 w-3.5 mr-1" /> Endorse Weekly Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
