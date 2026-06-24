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
  FileText, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Paperclip,
  ArrowRight
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

export function TaskReview() {
  const { students, reviewDailyTask } = useOJT();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState<{ studentId: string; studentName: string; taskId: string; title: string; description: string; date: string; output: string; skills: string; problems: string; status: string } | null>(null);
  const [remarks, setRemarks] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  // Flatten tasks that are submitted or pending review
  const allTasks = students.flatMap(s => 
    s.dailyTasks.map(t => ({
      taskId: t.id,
      title: t.title,
      description: t.description,
      date: t.date,
      timeStarted: t.timeStarted,
      timeEnded: t.timeEnded,
      output: t.output,
      skills: t.skillsApplied,
      problems: t.problemsEncountered,
      status: t.status,
      remarks: t.remarks,
      attachmentName: t.attachmentName,
      studentId: s.studentId,
      studentName: s.name,
      studentNumber: s.studentNumber,
      section: s.section
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter tasks
  const filteredTasks = allTasks.filter(t => 
    t.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReviewAction = (status: 'Approved' | 'Needs Revision') => {
    if (!selectedTask) return;

    reviewDailyTask(selectedTask.studentId, selectedTask.taskId, status, remarks);
    toast.success(`Task log ${status === 'Approved' ? 'Approved' : 'Returned for Revision'}`);
    
    setReviewDialogOpen(false);
    setSelectedTask(null);
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Daily Task Log Review</h1>
          <p className="text-slate-500 text-sm mt-0.5">Review and sign off on technical task logs submitted by interns.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search by student name or task..."
            className="pl-10 text-xs bg-slate-50 border-slate-200 focus-visible:ring-[#800000]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-800">Submitted Tasks Queue</CardTitle>
          <CardDescription>Click a task entry to view detail description and issue signatures.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No daily task entries submitted.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Student</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Log Date</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Task Log Details</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Output / Deliverable</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Status</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase text-center w-28">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((t) => (
                  <TableRow key={t.taskId} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 text-xs block">{t.studentName}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{t.studentNumber} | {t.section}</span>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 font-semibold text-xs text-slate-700">
                      {t.date}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 max-w-xs">
                      <span className="font-bold text-slate-800 text-xs block">{t.title}</span>
                      <p className="text-[11px] text-slate-500 font-light line-clamp-1 mt-0.5">{t.description}</p>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-xs font-semibold text-slate-650">
                      {t.output || '—'}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 font-semibold text-xs">
                      {getStatusBadge(t.status)}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-center">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedTask(t);
                          setRemarks(t.remarks || '');
                          setReviewDialogOpen(true);
                        }}
                        className="bg-[#800000] hover:bg-[#6b0000] text-white text-[10px] h-7 font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        Audit Task
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      {selectedTask && (
        <Dialog open={reviewDialogOpen} onOpenChange={() => setReviewDialogOpen(false)}>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto font-sans">
            <DialogHeader>
              <DialogTitle>Audit Daily Accomplishment Log</DialogTitle>
              <DialogDescription>
                Verify details submitted by <span className="font-bold text-slate-850">{selectedTask.studentName}</span> for {selectedTask.date}.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4 text-xs">
              <div className="space-y-1.5 p-3 bg-slate-50 rounded border">
                <p className="font-bold text-slate-800 text-xs">Task Log: {selectedTask.title}</p>
                <p className="text-slate-600 mt-1 font-light leading-relaxed">{selectedTask.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Skills Applied</p>
                  <p className="text-slate-800 font-semibold mt-1">{selectedTask.skills || '—'}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Output Deliverable</p>
                  <p className="text-slate-800 font-semibold mt-1">{selectedTask.output || '—'}</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Problems Encountered</p>
                <p className="text-red-700 font-semibold mt-1 bg-red-50/50 p-2 rounded border border-red-100 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {selectedTask.problems || 'None'}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reviewRemarks" className="text-xs">Review Remarks / Feedback</Label>
                <Input
                  id="reviewRemarks"
                  placeholder="Enter comments, e.g. Relational tables mapped accurately."
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
                <Check className="h-3.5 w-3.5 mr-1" /> Approve Log
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
