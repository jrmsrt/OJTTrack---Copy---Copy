import React, { useState } from 'react';
import { useOJT } from '../../context/OJTContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Search, Archive, CheckCircle2, AlertTriangle, Eye, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export function PortfolioManagement() {
  const { students } = useOJT();
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = sectionFilter === 'all' || s.section === sectionFilter;
    return matchesSearch && matchesSection;
  });

  const handleArchive = (name: string) => {
    toast.success(`Portfolio for ${name} archived in student files folder!`, {
      description: "Document set locked for edit."
    });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Portfolio Management Board</h1>
          <p className="text-slate-500 text-sm mt-0.5 font-light">Audit adviser-endorsed portfolios and catalog completed records.</p>
        </div>
        <div className="flex gap-2">
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="bg-white border border-slate-205 rounded p-2 text-xs"
          >
            <option value="all">All Sections</option>
            <option value="BSIT 4A">BSIT 4A</option>
            <option value="BSIT 4B">BSIT 4B</option>
            <option value="BSCpE 4A">BSCpE 4A</option>
          </select>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-base font-bold text-slate-800 font-sans">Clearance Submissions</CardTitle>
            <CardDescription>Track endorsement approvals from assigned faculty mentors.</CardDescription>
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
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Intern Details</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Adviser Endorsement</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Submission date</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Approval status</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase text-center w-28">Archive Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((s) => (
                <TableRow key={s.studentId} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="py-3.5 px-4 font-sans">
                    <span className="font-bold text-slate-800 text-xs block">{s.name}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{s.studentNumber} | {s.section}</span>
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                    Prof. {s.adviserName}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-xs font-semibold text-slate-500">
                    {s.portfolioSubmitted ? 'June 23, 2026' : '—'}
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    {s.portfolioApproved ? (
                      <Badge className="bg-green-105 text-green-800 border-green-200 flex items-center gap-1 w-32"><ShieldCheck className="h-3.5 w-3.5" /> Endorsement Verified</Badge>
                    ) : s.portfolioSubmitted ? (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1 w-32"><Clock className="h-3.5 w-3.5" /> Awaiting Endorsement</Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-400 border-slate-200 flex items-center gap-1 w-32">Not Submitted</Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!s.portfolioApproved}
                      onClick={() => handleArchive(s.name)}
                      className="text-[10px] h-7 border-slate-205 text-slate-600 hover:bg-slate-50 flex items-center gap-1 justify-center cursor-pointer disabled:opacity-40"
                    >
                      <Archive className="h-3.5 w-3.5" /> Archive File
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
