import React, { useState } from 'react';
import { useOJT, StudentOJTProfile } from '../../context/OJTContext';
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
  Plus, 
  UserCheck, 
  Search, 
  Mail, 
  BookOpen, 
  UserPlus, 
  FileSpreadsheet 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';

export function StudentManagement() {
  const { students, addStudentProfile, updateStudentProfile } = useOJT();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentOJTProfile | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [program, setProgram] = useState('BSIT — Bachelor of Science in Information Technology');
  const [section, setSection] = useState('BSIT 4A');
  const [adviserName, setAdviserName] = useState('Michael Chen');

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentNumber.includes(searchTerm)
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !studentNumber.trim() || !email.trim()) {
      toast.error("Please fill in name, ID, and email.");
      return;
    }

    addStudentProfile({
      studentId: `s_${Date.now()}`,
      studentNumber,
      name,
      email,
      program,
      section,
      adviserId: adviserName === 'Michael Chen' ? '2' : 'adviser_temp',
      adviserName,
      companyId: 'c1',
      companyName: 'TechCorp Inc.'
    });

    toast.success(`Intern ${name} added to the system database!`);
    setAddDialogOpen(false);
    clearForm();
  };

  const clearForm = () => {
    setName('');
    setStudentNumber('');
    setEmail('');
    setProgram('BSIT — Bachelor of Science in Information Technology');
    setSection('BSIT 4A');
    setAdviserName('Michael Chen');
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    updateStudentProfile(selectedStudent.studentId, {
      adviserName,
      section
    });

    toast.success(`Updated advisory settings for ${selectedStudent.name}`);
    setAssignDialogOpen(false);
    setSelectedStudent(null);
  };

  const handleImportRoster = () => {
    toast.success("Roster Excel parsing completed!", {
      description: "Added 12 student records to advisory sections."
    });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Student Management</h1>
          <p className="text-slate-500 text-sm mt-0.5 font-light">Register, allocate, and oversight internship metadata records.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleImportRoster}
            className="text-xs h-9 border-slate-250 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <FileSpreadsheet className="h-4 w-4" /> Import Excel Masterlist
          </Button>

          <Dialog open={addDialogOpen} onOpenChange={(open) => {
            setAddDialogOpen(open);
            if(!open) clearForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-[#800000] hover:bg-[#6b0000] text-white text-xs h-9 flex items-center gap-1.5 cursor-pointer">
                <UserPlus className="h-4 w-4" /> Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md font-sans">
              <form onSubmit={handleAddSubmit}>
                <DialogHeader>
                  <DialogTitle>Register Intern Profile</DialogTitle>
                  <DialogDescription>Input new student details to establish tracking.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <Label htmlFor="sName">Full Name</Label>
                    <Input id="sName" placeholder="e.g. Francisco, Juan S." value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="sNum">Student Number</Label>
                    <Input id="sNum" placeholder="YYYY-XXXXX-PQ-0" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="sMail">Email Address</Label>
                    <Input id="sMail" type="email" placeholder="student@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="sProg">Academic Program</Label>
                    <select
                      id="sProg"
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      className="w-full bg-white border border-slate-205 rounded p-2 text-xs"
                    >
                      <option value="BSIT — Bachelor of Science in Information Technology">BSIT — IT</option>
                      <option value="BSCpE — Bachelor of Science in Computer Engineering">BSCpE — Comp Eng</option>
                      <option value="BSOA — Bachelor of Science in Office Administration">BSOA — Office Admin</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="sSec">Class Section</Label>
                      <select
                        id="sSec"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        className="w-full bg-white border border-slate-205 rounded p-2 text-xs"
                      >
                        <option value="BSIT 4A">BSIT 4A</option>
                        <option value="BSIT 4B">BSIT 4B</option>
                        <option value="BSCpE 4A">BSCpE 4A</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="sAdv">Assigned Adviser</Label>
                      <select
                        id="sAdv"
                        value={adviserName}
                        onChange={(e) => setAdviserName(e.target.value)}
                        className="w-full bg-white border border-slate-205 rounded p-2 text-xs"
                      >
                        <option value="Michael Chen">Prof. Michael Chen</option>
                        <option value="Engr. Raul Gomez">Engr. Raul Gomez</option>
                      </select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-[#800000] hover:bg-[#6b0000] text-white">Save Profile</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grid of students */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-base font-bold text-slate-800">Master Roster</CardTitle>
            <CardDescription>Roster record of registered interns.</CardDescription>
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
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Intern</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Program</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Assigned Adviser</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Active Section</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">OJT Status Stage</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase text-center w-28">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((s) => (
                <TableRow key={s.studentId} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="py-3.5 px-4 font-sans">
                    <span className="font-bold text-slate-800 text-xs block">{s.name}</span>
                    <span className="text-[10px] text-slate-450 font-medium">{s.studentNumber} | {s.email}</span>
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-xs text-slate-500 font-light truncate max-w-[150px]">
                    {s.program.split('—')[0]}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                    Prof. {s.adviserName}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-xs font-semibold text-slate-650">
                    {s.section}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 font-semibold text-xs">
                    <Badge variant="outline" className="text-[10px] font-semibold text-slate-700">{s.stage.split(':')[1] || s.stage}</Badge>
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedStudent(s);
                        setSection(s.section);
                        setAdviserName(s.adviserName);
                        setAssignDialogOpen(true);
                      }}
                      className="text-[10px] h-7 border-slate-205 text-slate-600 hover:bg-slate-50 cursor-pointer font-bold"
                    >
                      Allocate / Reassign
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Allocation Dialog Overlay */}
      {selectedStudent && (
        <Dialog open={assignDialogOpen} onOpenChange={() => setAssignDialogOpen(false)}>
          <DialogContent className="sm:max-w-md font-sans">
            <form onSubmit={handleAssignSubmit}>
              <DialogHeader>
                <DialogTitle>Allocate Section & Adviser</DialogTitle>
                <DialogDescription>Assign section supervisor for <span className="font-semibold text-slate-800">{selectedStudent.name}</span>.</DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-4 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="allocSec">Oversight Section</Label>
                  <select
                    id="allocSec"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded p-2.5 text-xs focus:ring-[#800000] focus:border-[#800000]"
                  >
                    <option value="BSIT 4A">BSIT 4A</option>
                    <option value="BSIT 4B">BSIT 4B</option>
                    <option value="BSCpE 4A">BSCpE 4A</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="allocAdv">Assigned Adviser Mentor</Label>
                  <select
                    id="allocAdv"
                    value={adviserName}
                    onChange={(e) => setAdviserName(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded p-2.5 text-xs focus:ring-[#800000] focus:border-[#800000]"
                  >
                    <option value="Michael Chen">Prof. Michael Chen</option>
                    <option value="Dr. Emily Rodriguez">Dr. Emily Rodriguez</option>
                    <option value="Engr. Raul Gomez">Engr. Raul Gomez</option>
                  </select>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#800000] hover:bg-[#6b0000] text-white">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
