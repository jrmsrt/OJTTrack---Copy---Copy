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
  Clock
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

export function PostOJTReview() {
  const { students, reviewPostOJTReq } = useOJT();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReq, setSelectedReq] = useState<{ studentId: string; studentName: string; reqName: string; fileName: string; status: string; remarks: string } | null>(null);
  const [remarks, setRemarks] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  // Flatten submitted Post-OJT requirements across students
  const submittedReqs = students.flatMap(s => 
    s.postOJTRequirements
      .filter(r => r.status === 'Submitted' || r.status === 'Under Review')
      .map(r => ({
        studentId: s.studentId,
        studentName: s.name,
        studentNumber: s.studentNumber,
        section: s.section,
        reqName: r.name,
        fileName: r.fileName || '',
        status: r.status,
        remarks: r.remarks
      }))
  );

  const filteredReqs = submittedReqs.filter(r => 
    r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.reqName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReviewAction = (status: 'Approved' | 'Needs Revision') => {
    if (!selectedReq) return;

    reviewPostOJTReq(selectedReq.studentId, selectedReq.reqName, status, remarks);
    toast.success(`Requirement ${selectedReq.reqName} is now ${status === 'Approved' ? 'Approved' : 'Returned'}`);
    
    setReviewDialogOpen(false);
    setSelectedReq(null);
    setRemarks('');
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Post-OJT Requirement Review</h1>
          <p className="text-slate-500 text-sm mt-0.5">Endorse clearances, assessments, and completion certificates after OJT hours end.</p>
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
          <CardTitle className="text-base font-bold text-slate-800">Post-OJT Queue</CardTitle>
          <CardDescription>Verify final self-assessments, company certificates, and recommendations logs.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {filteredReqs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              All Post-OJT reviews are cleared. No items pending.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Student Name</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Requirement Description</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">File Uploaded</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Status</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase text-center w-28">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReqs.map((r, i) => (
                  <TableRow key={i} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 text-xs block">{r.studentName}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{r.studentNumber} | {r.section}</span>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 font-semibold text-xs text-slate-805">
                      {r.reqName}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-650 font-medium">
                        <FileText className="h-4 w-4 text-[#800000] shrink-0" />
                        <span className="truncate max-w-[160px]" title={r.fileName}>{r.fileName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5 px-4">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1 w-24"><Clock className="h-3 w-3" /> Under Review</Badge>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-center">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedReq(r);
                          setRemarks(r.remarks || '');
                          setReviewDialogOpen(true);
                        }}
                        className="bg-[#800000] hover:bg-[#6b0000] text-white text-[10px] h-7 font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        Verify File
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
      {selectedReq && (
        <Dialog open={reviewDialogOpen} onOpenChange={() => setReviewDialogOpen(false)}>
          <DialogContent className="sm:max-w-md font-sans">
            <DialogHeader>
              <DialogTitle>Verify Post-OJT Document</DialogTitle>
              <DialogDescription>
                Auditing <span className="font-semibold text-slate-800">{selectedReq.reqName}</span> submitted by {selectedReq.studentName}.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded border flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#800000]" />
                <div>
                  <p className="font-bold text-slate-800 text-[11px] truncate max-w-[180px]">{selectedReq.fileName}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Format: Scanned PDF Clearance Certificate</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reqRemarks" className="text-xs">Add Audit Remarks</Label>
                <Input
                  id="reqRemarks"
                  placeholder="e.g. Scanned copy clear and contains supervisor seal. Approved."
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
                <Check className="h-3.5 w-3.5 mr-1" /> Endorse Clearance
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
