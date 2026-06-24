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
import { 
  Search, 
  Download, 
  FileSpreadsheet, 
  FileText,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

export function OJTDatabase() {
  const { students } = useOJT();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentNumber.includes(searchTerm) ||
    s.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = (type: 'Excel' | 'CSV' | 'PDF') => {
    toast.success(`Exporting database to ${type}...`, {
      description: `Saved: PUP_OJT_Database_Term2_${new Date().toISOString().split('T')[0]}.${type === 'Excel' ? 'xlsx' : type.toLowerCase()}`
    });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">OJT Deployed Database</h1>
          <p className="text-slate-500 text-sm mt-0.5 font-light">Comprehensive directory database of all interns currently deployed or cleared.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleExport('Excel')}
            className="text-xs h-9 border-slate-250 text-slate-700 flex items-center gap-1.5 cursor-pointer font-bold hover:bg-slate-50"
          >
            <FileSpreadsheet className="h-4 w-4 text-green-600" /> Export Excel
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleExport('CSV')}
            className="text-xs h-9 border-slate-250 text-slate-700 flex items-center gap-1.5 cursor-pointer font-bold hover:bg-slate-50"
          >
            <FileText className="h-4 w-4 text-blue-600" /> Export CSV
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleExport('PDF')}
            className="text-xs h-9 border-slate-250 text-slate-700 flex items-center gap-1.5 cursor-pointer font-bold hover:bg-slate-50"
          >
            <Download className="h-4 w-4 text-red-600" /> Export PDF Booklet
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-base font-bold text-slate-800">Master Database Records</CardTitle>
            <CardDescription>Tracing cohort deployment and clearances details.</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search by student name or company..."
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
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Student Name</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Student Number</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase font-sans">Program</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Section</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Company Partner</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase font-sans font-normal">Section Adviser</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Total Rendered</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Portfolio status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((s) => (
                <TableRow key={s.studentId} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="py-3 px-4 font-bold text-slate-800 text-xs">{s.name}</TableCell>
                  <TableCell className="py-3 px-4 text-xs font-semibold text-slate-600">{s.studentNumber}</TableCell>
                  <TableCell className="py-3 px-4 text-xs text-slate-500 truncate max-w-[120px]">{s.program.split('—')[0]}</TableCell>
                  <TableCell className="py-3 px-4 text-xs font-semibold text-slate-650">{s.section}</TableCell>
                  <TableCell className="py-3 px-4 text-xs font-semibold text-slate-700">{s.companyName}</TableCell>
                  <TableCell className="py-3 px-4 text-xs text-slate-500 font-medium">Prof. {s.adviserName}</TableCell>
                  <TableCell className="py-3 px-4 text-xs font-extrabold text-slate-800">{s.totalHoursRendered.toFixed(1)} / {s.requiredHours} hrs</TableCell>
                  <TableCell className="py-3 px-4">
                    {s.portfolioApproved ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">Cleared</Badge>
                    ) : s.portfolioSubmitted ? (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">Review</Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-500 border-slate-200">Pending</Badge>
                    )}
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
