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
  Award, 
  AlertTriangle,
  Clock,
  BookOpen,
  FileText
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

export function PortfolioReview() {
  const { students, reviewPortfolio } = useOJT();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [remarks, setRemarks] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const submittedStudents = students.filter(s => s.portfolioSubmitted);

  const filteredStudents = submittedStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const student = students.find(s => s.studentId === selectedStudentId);

  const handleReviewAction = (status: 'Approved' | 'Needs Revision') => {
    if (!selectedStudentId) return;

    reviewPortfolio(selectedStudentId, status, remarks);
    toast.success(`Portfolio submission is now ${status === 'Approved' ? 'Approved & Cleared' : 'Returned'}`);
    
    setReviewDialogOpen(false);
    setSelectedStudentId(null);
    setRemarks('');
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Portfolio Review Module</h1>
          <p className="text-slate-500 text-sm mt-0.5">Audit compiled internship portfolios containing full accomplishments, assessments, and time logs.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search by intern name..."
            className="pl-10 text-xs bg-slate-50 border-slate-200 focus-visible:ring-[#800000]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-800">Submitted Portfolios Queue</CardTitle>
          <CardDescription>Verify Table of Contents, attachments, evaluations, and clearances compiled in standard templates.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No compiled portfolios submitted.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Intern details</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Hours Rendered</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Company assigned</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Approval Status</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase text-center w-28">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((s) => (
                  <TableRow key={s.studentId} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 text-xs block">{s.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{s.studentNumber} | {s.section}</span>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-xs font-bold text-slate-800">
                      {s.totalHoursRendered.toFixed(0)} hrs
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-xs font-semibold text-slate-650">
                      {s.companyName}
                    </TableCell>
                    <TableCell className="py-3.5 px-4">
                      {s.portfolioApproved ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">Endorsed</Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">Awaiting Audit</Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-center">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedStudentId(s.studentId);
                          setRemarks(s.portfolioRemarks || '');
                          setReviewDialogOpen(true);
                        }}
                        className="bg-[#800000] hover:bg-[#6b0000] text-white text-[10px] h-7 font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        Audit Portfolio
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Audit Detail Overlay Dialog */}
      {student && (
        <Dialog open={reviewDialogOpen} onOpenChange={() => setReviewDialogOpen(false)}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto font-sans">
            <DialogHeader>
              <DialogTitle>Audit Intern Portfolio Report</DialogTitle>
              <DialogDescription>
                Endorse compilation sheet for <span className="font-bold">{student.name}</span>.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-6 text-xs">
              {/* Document Outline Preview */}
              <div className="border rounded-lg p-5 font-serif space-y-3.5 max-w-xl mx-auto bg-white shadow">
                <h3 className="text-center font-bold text-xs uppercase tracking-tight text-slate-900 border-b pb-2">Compiled Portfolio Chapters Outline</h3>
                <div className="space-y-1.5 leading-relaxed text-[10px]">
                  <p className="flex justify-between"><span>Chapter I: Title Page & Internship Agreement</span><span className="font-sans font-bold text-green-600">✓ Checked</span></p>
                  <p className="flex justify-between"><span>Chapter II: Endorsement Slips & Consent Forms</span><span className="font-sans font-bold text-green-600">✓ Checked</span></p>
                  <p className="flex justify-between"><span>Chapter III: Memorandum of Agreement (MOA) Copy</span><span className="font-sans font-bold text-green-600">✓ Checked</span></p>
                  <p className="flex justify-between"><span>Chapter IV: Daily Time Records (DTR Log Sheets)</span><span className="font-sans font-bold text-green-600">✓ Checked</span></p>
                  <p className="flex justify-between"><span>Chapter V: Weekly Accomplishment Reports & Reflections</span><span className="font-sans font-bold text-green-600">✓ Checked</span></p>
                  <p className="flex justify-between"><span>Chapter VI: Evaluation Forms (Adviser & Supervisor)</span><span className="font-sans font-bold text-green-600">✓ Checked</span></p>
                  <p className="flex justify-between"><span>Chapter VII: Photographic Documentation & Certificates</span><span className="font-sans font-bold text-green-600">✓ Checked</span></p>
                </div>
              </div>

              {/* Remarks Field */}
              <div className="space-y-1.5">
                <Label htmlFor="portfolioRemarks" className="text-xs">Endorsement Remarks / Feedback</Label>
                <Input
                  id="portfolioRemarks"
                  placeholder="e.g. Excellent OJT Portfolio compilation. All components verified."
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
                <X className="h-3.5 w-3.5 mr-1" /> Request Revision
              </Button>
              <Button
                onClick={() => handleReviewAction('Approved')}
                className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold cursor-pointer"
              >
                <Check className="h-3.5 w-3.5 mr-1" /> Approve & Clear Internship
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
