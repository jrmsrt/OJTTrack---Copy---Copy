import React, { useState, useRef } from 'react';
import { useOJT } from '../../context/OJTContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText,
  Lock,
  FileCheck
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export function PostOJT() {
  const { user } = useAuth();
  const { students, uploadPostOJTReq } = useOJT();
  
  const [selectedReq, setSelectedReq] = useState<string | null>(null);
  const [formattedFileName, setFormattedFileName] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Drag and drop states
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep track of actual uploaded file references & object URLs for dynamic preview
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { file: File; url: string }>>({});

  // File Preview state
  const [previewReq, setPreviewReq] = useState<{ reqName: string; fileName: string } | null>(null);

  const student = students.find(s => s.studentId === user?.id || s.email === user?.email);

  if (!student) {
    return (
      <div className="p-6 text-center font-sans">
        <h2 className="text-xl font-bold text-red-600">Error</h2>
        <p className="text-slate-655 mt-2">Student profile not found.</p>
      </div>
    );
  }

  // Unlock check: hours completed & During-OJT approved
  const hoursCompleted = student.totalHoursRendered >= student.requiredHours;
  const duringOJTApproved = student.duringOJTRequirements.every(req => req.status === 'Approved');
  const isUnlocked = hoursCompleted && duringOJTApproved;

  // For simulation override check (Stage 3 or 4)
  const bypassLock = student.stage === 'Stage 3: Post-OJT' || student.stage === 'Stage 4: Portfolio Completion';
  const showLock = !isUnlocked && !bypassLock;

  if (showLock) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px] text-center gap-3 bg-white rounded-xl border border-slate-200 shadow-sm font-sans">
        <div className="bg-red-50 text-[#800000] h-12 w-12 rounded-full flex items-center justify-center">
          <Lock className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Post-OJT Checklist is Locked</h2>
        <p className="text-slate-500 text-xs max-w-sm leading-relaxed mt-1">
          This module is disabled until:
        </p>
        <div className="bg-slate-55 p-3 rounded border border-slate-100 text-left text-xs text-slate-600 space-y-1 bg-slate-50">
          <p className="flex items-center gap-1.5 font-medium">
            <span className={`h-2 w-2 rounded-full ${hoursCompleted ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
            Required Hours Rendered: {student.totalHoursRendered.toFixed(0)} / {student.requiredHours} hrs {hoursCompleted ? '(Cleared)' : '(Pending)'}
          </p>
          <p className="flex items-center gap-1.5 font-medium">
            <span className={`h-2 w-2 rounded-full ${duringOJTApproved ? 'bg-green-500' : 'bg-red-500'}`}></span>
            During-OJT Requirements: {duringOJTApproved ? 'All Approved' : 'Awaiting Review / Revision'}
          </p>
        </div>
        <p className="text-[10px] text-slate-400 font-medium">Tip: Use the Simulation Panel to bypass this check quickly.</p>
      </div>
    );
  }

  // Helper check for non-document items
  const isNonDocumentReq = (name: string) => {
    return false;
  };

  // Translate A->1, B->2, etc.
  const sectionLetterToNumber = (sec: string) => {
    const char = sec.trim().toUpperCase();
    if (char.length === 1) {
      const code = char.charCodeAt(0) - 64; // A=1, B=2, C=3, etc.
      if (code >= 1 && code <= 26) return String(code);
    }
    return char;
  };

  // Extract Year-Section (e.g., 4-1 from BSIT 4A)
  const getYearSection = (section: string) => {
    if (!section) return 'Year-Section';
    const match = section.match(/(\d)\s*-?\s*([A-Z0-9]+)$/i);
    if (match) {
      const year = match[1];
      const secPart = match[2];
      if (/^[A-Z]$/i.test(secPart)) {
        return `${year}-${sectionLetterToNumber(secPart)}`;
      }
      return `${year}-${secPart}`;
    }
    return section.replace(/\s+/g, '-');
  };

  // Map requirement name to file suffix
  const getFileNamePart = (reqName: string) => {
    switch (reqName) {
      case 'Student Performance Evaluation':
        return 'StudentPerformanceEval';
      case 'HTE Supervisor’s Evaluation':
        return 'SupervisorEval';
      case 'HTE Evaluation':
        return 'HTEEval';
      case 'Certificate of Completion':
        return 'CertificateOfCompletion';
      default:
        return reqName.replace(/[^a-zA-Z0-9]/g, '');
    }
  };

  // Format uploaded file name helper
  const formatUploadedFileName = (
    studentName: string,
    program: string,
    section: string,
    documentName: string,
    originalFileName: string
  ) => {
    const nameParts = studentName.trim().split(/\s+/);
    const lastName = nameParts[nameParts.length - 1] || 'Student';

    let course = 'Course';
    if (program) {
      const parts = program.split(/[—–-]/);
      course = parts.length > 0 ? parts[0].trim() : program.trim();
    }

    const yearSection = getYearSection(section);
    const filePart = getFileNamePart(documentName);

    let extension = '.pdf';
    const extMatch = originalFileName.match(/\.[a-zA-Z0-9]+$/);
    if (extMatch) {
      extension = extMatch[0].toLowerCase();
    }

    return `${lastName}_${course}_${yearSection}_${filePart}${extension}`;
  };

  // Dynamic descriptions for each requirement
  const getReqDescription = (name: string) => {
    switch (name) {
      case 'Student Performance Evaluation':
        return 'Final performance rating scorecard signed by the university coordinator';
      case 'HTE Supervisor’s Evaluation':
        return 'Official internship supervisor evaluation and appraisal document';
      case 'HTE Evaluation':
        return 'Narrative student feedback evaluation form reviewing the company partner';
      case 'Certificate of Completion':
        return 'Official internship certificate issued by host training establishment';
      default:
        return 'Final intake clearance verification sheet';
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileSelected = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error("Invalid file format", {
        description: "Only PDF documents are allowed for Post-OJT uploads."
      });
      return;
    }
    setSelectedFile(file);
    if (selectedReq) {
      const formatted = formatUploadedFileName(
        student.name,
        student.program,
        student.section,
        selectedReq,
        file.name
      );
      setFormattedFileName(formatted);
    }
  };

  const resetUploadState = () => {
    setSelectedFile(null);
    setFormattedFileName('');
    setDragActive(false);
    setSelectedReq(null);
    setUploadDialogOpen(false);
  };

  // Submit handlers
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq || !selectedFile || !formattedFileName.trim()) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    setUploadedFiles(prev => ({
      ...prev,
      [selectedReq]: { file: selectedFile, url: objectUrl }
    }));

    uploadPostOJTReq(student.studentId, selectedReq, formattedFileName);
    toast.success(`Successfully uploaded document: ${formattedFileName}`, {
      description: `Requirement: ${selectedReq} is now marked as Under Review.`
    });
    
    resetUploadState();
  };

  const openUploadModal = (reqName: string) => {
    setSelectedReq(reqName);
    setUploadDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Approved/Received</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Rejected</Badge>;
      case 'Needs Revision':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Needs Revision</Badge>;
      case 'Submitted':
      case 'Under Review':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 flex items-center gap-1"><Clock className="h-3 w-3" /> Under Review</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-slate-200">Not Submitted</Badge>;
    }
  };

  // Preview renderer for the documents modal
  const renderPreviewContent = (reqName: string, fileName: string) => {
    const studentName = student.name;
    const studentNo = student.studentNumber;
    const course = student.program.split(/[—–-]/)[0]?.trim() || 'BSIT';

    const actualUpload = uploadedFiles[reqName];
    if (actualUpload) {
      const { file, url } = actualUpload;
      const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|svg)$/i.test(file.name);
      const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

      if (isImage) {
        return (
          <div className="flex flex-col items-center justify-center bg-slate-55 border border-slate-200 rounded-lg p-4 min-h-[380px] bg-slate-50">
            <img 
              src={url} 
              alt={reqName} 
              className="max-w-full max-h-[60vh] object-contain rounded shadow border" 
            />
            <p className="text-[10px] text-slate-400 font-mono mt-3">Image Preview: {file.name} ({ (file.size / 1024).toFixed(1) } KB)</p>
          </div>
        );
      } else if (isPdf) {
        return (
          <div className="bg-slate-55 border border-slate-200 rounded-lg p-1 min-h-[380px] bg-slate-50">
            <iframe 
              src={url} 
              title={reqName} 
              className="w-full h-[60vh] rounded border shadow-inner" 
            />
            <p className="text-[10px] text-slate-400 font-mono mt-2 text-center">PDF Preview: {file.name} ({ (file.size / 1024 / 1024).toFixed(2) } MB)</p>
          </div>
        );
      } else {
        return (
          <div className="flex flex-col items-center justify-center bg-slate-55 border border-slate-200 rounded-lg p-8 min-h-[380px] text-center bg-slate-50">
            <FileText className="h-16 w-16 text-[#800000] mb-4 animate-bounce" />
            <h4 className="font-bold text-slate-800 text-sm uppercase">{reqName}</h4>
            <p className="text-slate-500 text-xs mt-1.5 max-w-sm leading-relaxed mx-auto">
              This file type <strong>({file.name.split('.').pop()?.toUpperCase()})</strong> cannot be viewed directly in the browser.
            </p>
            <div className="mt-6 flex flex-col gap-2 w-full max-w-xs mx-auto">
              <a 
                href={url} 
                download={fileName} 
                className="w-full bg-[#800000] hover:bg-[#6b0000] text-white text-xs font-semibold py-2 px-4 rounded text-center transition-colors shadow flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 rotate-180" />
                Download Uploaded File
              </a>
              <span className="text-[9px] text-slate-450 font-mono truncate text-center">Original: {file.name}</span>
            </div>
          </div>
        );
      }
    }

    if (reqName === 'Student Performance Evaluation') {
      return (
        <div className="border border-slate-300 rounded-lg p-6 bg-white font-sans text-[11px] text-slate-800 shadow-inner relative overflow-hidden" style={{ minHeight: '380px' }}>
          <div className="text-center border-b pb-2 mb-4">
            <h3 className="font-bold text-[11px] uppercase text-slate-900 leading-tight">POLYTECHNIC UNIVERSITY OF THE PHILIPPINES</h3>
            <p className="text-slate-500 text-[9px] mt-0.5">STUDENT PERFORMANCE EVALUATION SHEET</p>
            <p className="font-bold text-[#800000] mt-1 text-[10px]">FINAL PERFORMANCE RATING</p>
          </div>
          
          <div className="grid grid-cols-2 gap-y-1.5 mb-4 text-[10px] bg-slate-50 p-2.5 rounded border border-slate-100">
            <div><span className="font-semibold text-slate-500">Student:</span> {studentName}</div>
            <div><span className="font-semibold text-slate-500">Program:</span> {course}</div>
            <div><span className="font-semibold text-slate-500">HTE Partner:</span> {student.companyName || 'TechCorp Inc.'}</div>
            <div><span className="font-semibold text-slate-500">Overall Score:</span> <span className="text-green-600 font-bold">95.8% (Outstanding)</span></div>
          </div>

          <div className="border rounded overflow-hidden">
            <div className="bg-slate-50 font-bold border-b py-1 px-2 grid grid-cols-4 text-[9px] text-slate-500 text-center">
              <span className="col-span-2 text-left pl-2">Evaluation Criteria</span>
              <span>Max Points</span>
              <span>Score Given</span>
            </div>
            <div className="divide-y text-[9px] text-slate-600 text-center">
              <div className="py-1 px-2 grid grid-cols-4">
                <span className="col-span-2 text-left pl-2 font-medium">1. Technical Competence</span>
                <span>40</span>
                <span className="font-semibold">38</span>
              </div>
              <div className="py-1 px-2 grid grid-cols-4">
                <span className="col-span-2 text-left pl-2 font-medium">2. Work Discipline & Attitude</span>
                <span>30</span>
                <span className="font-semibold">29</span>
              </div>
              <div className="py-1 px-2 grid grid-cols-4">
                <span className="col-span-2 text-left pl-2 font-medium">3. Collaboration & Communication</span>
                <span>20</span>
                <span className="font-semibold">19</span>
              </div>
              <div className="py-1 px-2 grid grid-cols-4">
                <span className="col-span-2 text-left pl-2 font-medium">4. Attendance / Punctuality</span>
                <span>10</span>
                <span className="font-semibold">9.8</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-3 border-t border-slate-200 flex justify-between items-center text-[8px] text-slate-400">
            <span>Evaluated by: HTE HR & Supervisor</span>
            <span className="font-mono">{fileName}</span>
          </div>
        </div>
      );
    }

    if (reqName === 'HTE Supervisor’s Evaluation') {
      return (
        <div className="border border-slate-300 rounded-lg p-6 bg-white font-sans text-[11px] text-slate-800 shadow-inner relative overflow-hidden" style={{ minHeight: '380px' }}>
          <div className="text-center border-b pb-2 mb-4">
            <h3 className="font-bold text-[11px] uppercase text-slate-900 leading-tight">HTE SUPERVISOR EVALUATION</h3>
            <p className="text-slate-500 text-[9px] mt-0.5">Host Training Establishment Feedback</p>
            <p className="font-bold text-[#800000] mt-1 text-[10px]">Supervisor Appraisals & Comments</p>
          </div>
          
          <div className="space-y-3 text-[10.5px]">
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[9px] text-[#800000]">Core Strengths:</h4>
              <p className="text-slate-600 mt-1 leading-relaxed pl-2 border-l border-slate-200">
                {studentName} demonstrated excellent backend engineering skills. Quick to adapt to tech stack, well-organized code documentation habits, and active involvement during engineering design discussions.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[9px] text-[#800000]">Areas of Improvement:</h4>
              <p className="text-slate-650 mt-1 leading-relaxed pl-2 border-l border-slate-200">
                Could benefit from presenting project work more confidently to high-level stakeholders during sprint review showcases.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[9px] text-[#800000]">Recommendation:</h4>
              <p className="text-slate-650 mt-1 leading-relaxed pl-2 border-l border-slate-200">
                Strongly recommended for hire upon university graduation. Excellent work ethics.
              </p>
            </div>
          </div>
          
          <div className="mt-12 pt-3 border-t border-slate-200 flex justify-between items-center text-[8px] text-slate-400">
            <span>Signature: Supervisor Michael Chen</span>
            <span className="font-mono">{fileName}</span>
          </div>
        </div>
      );
    }

    if (reqName === 'HTE Evaluation') {
      return (
        <div className="border border-slate-300 rounded-lg p-6 bg-white font-sans text-slate-800 shadow-inner min-h-[380px] relative overflow-hidden text-[11px]">
          <div className="text-center border-b pb-3 mb-4">
            <h3 className="font-bold text-sm text-slate-900 tracking-tight leading-none">STUDENT FEEDBACK ON HTE</h3>
            <p className="text-[#800000] text-xs font-semibold mt-1">Host Training Establishment Evaluation Report</p>
            <p className="text-[9px] text-slate-400 font-light mt-0.5">Evaluated Company: {student.companyName || 'TechCorp Inc.'}</p>
          </div>
          
          <div className="space-y-4 text-[10.5px]">
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[9px] text-[#800000]">1. Training Program Quality</h4>
              <p className="text-slate-600 mt-1 leading-relaxed pl-2 border-l border-slate-200">
                The tasks assigned matched my program specialization. I was given actual production features to work on rather than minor administrative tasks. Rating: 5/5
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[9px] text-[#800000]">2. Supervision & Guidance</h4>
              <p className="text-slate-650 mt-1 leading-relaxed pl-2 border-l border-slate-200">
                My industrial supervisor met with me weekly to discuss code quality, answer architecture questions, and check on my well-being. Rating: 5/5
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[9px] text-[#800000]">3. Work Environment & Facilities</h4>
              <p className="text-slate-650 mt-1 leading-relaxed pl-2 border-l border-slate-200">
                Provided with a development sandbox, clean workstation, and onboarding tutorials that made adaptions seamless. Rating: 4.8/5
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-3 border-t border-slate-200 flex justify-between items-center text-[8px] text-slate-400">
            <span>Submitted by: {studentName}</span>
            <span className="font-mono">{fileName}</span>
          </div>
        </div>
      );
    }

    if (reqName === 'Certificate of Completion') {
      return (
        <div className="border-4 border-double border-[#800000] rounded-lg p-8 bg-amber-50/10 font-serif text-center relative overflow-hidden" style={{ minHeight: '380px' }}>
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
            <span className="text-8xl font-serif text-[#800000]">HTE</span>
          </div>
          
          <div className="mt-4">
            <h2 className="font-bold text-lg text-slate-900 tracking-wide">{student.companyName || 'TECHCORP INC.'}</h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Certificate of Completion</p>
          </div>
          
          <div className="my-8">
            <p className="text-[10px] text-slate-400 italic">This is proudly presented to</p>
            <h1 className="text-lg font-bold text-[#800000] font-sans tracking-wide mt-2">{studentName}</h1>
            <p className="text-[9px] text-slate-600 mt-4 leading-relaxed max-w-sm mx-auto">
              for having successfully completed the required <strong>{student.requiredHours} Hours</strong> of Internship/On-the-Job Training under the Department of Software Engineering from June 15, 2026 to September 11, 2026.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-[9px] mt-12 border-t pt-4 border-slate-200 font-sans font-sans">
            <div className="flex flex-col items-center">
              <span className="font-bold text-slate-800">Michael Chen</span>
              <span className="text-[8px] text-slate-400 mt-0.5">HTE Supervisor</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-slate-800">{studentName}</span>
              <span className="text-[8px] text-slate-400 mt-0.5">OJT Intern</span>
            </div>
          </div>
          
          <p className="absolute bottom-2 right-4 font-mono text-[7px] text-slate-300">{fileName}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-lg p-8 min-h-[380px] text-center">
        <FileText className="h-16 w-16 text-[#800000] mb-4 animate-bounce" />
        <h4 className="font-bold text-slate-800 text-sm uppercase">{reqName}</h4>
        <p className="text-slate-500 text-xs mt-1.5 max-w-sm leading-relaxed mx-auto">
          Mock preview representation of your uploaded document clearance.
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Post-OJT Requirements</h1>
          <p className="text-slate-500 text-sm mt-0.5">Submit final clearances, evaluations, and certificate of completion to finalize your OJT hours verification.</p>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200 -mt-3.5">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-base font-bold text-slate-800">Final Clearances Checklist</CardTitle>
              <CardDescription>File submissions required after finishing company deployment.</CardDescription>
            </div>
            <Badge className="bg-indigo-50 text-indigo-700 border-indigo-105 font-semibold flex items-center gap-1">
              Active Stage: Post-OJT
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
                <th className="py-4 pl-12 pr-6 font-semibold">Requirement Description</th>
                <th className="py-4 px-6 font-semibold">Verification/Upload</th>
                <th className="py-4 px-6 font-semibold w-32">Status</th>
                <th className="py-4 px-6 font-semibold">Remarks & Notes</th>
              </tr>
            </thead>
            <tbody>
              {student.postOJTRequirements.map((req, idx) => (
                <tr 
                  key={idx}
                  className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-5.5 pl-12 pr-6">
                    <span className="font-semibold text-slate-800 block">
                      {idx + 1}. {req.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{getReqDescription(req.name)}</span>
                  </td>
                  <td className="py-5.5 px-6">
                    {req.fileName ? (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                        <span 
                          className="text-xs font-semibold text-slate-600 max-w-[180px] truncate hover:text-[#800000] hover:underline cursor-pointer flex items-center gap-1 transition-colors"
                          title="Click to preview file"
                          onClick={() => setPreviewReq({ reqName: req.name, fileName: req.fileName || '' })}
                        >
                          {req.fileName}
                        </span>
                        {req.status !== 'Approved' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs text-[#800000] hover:text-white hover:bg-[#800000] font-bold ml-1 cursor-pointer transition-colors px-2 rounded"
                            onClick={() => openUploadModal(req.name)}
                          >
                            Re-upload
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 border-slate-200 text-slate-600 hover:text-white hover:bg-[#800000] hover:border-[#800000] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                        onClick={() => openUploadModal(req.name)}
                      >
                        <Upload className="h-3.5 w-3.5" />
                        Upload File
                      </Button>
                    )}
                  </td>
                  <td className="py-5.5 px-6 font-semibold">
                    {getStatusBadge(req.status)}
                  </td>
                  <td className="py-5.5 px-6 text-xs text-slate-500 max-w-xs leading-relaxed font-light">
                    {req.remarks ? req.remarks : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* SINGLE DIALOG FOR FILE UPLOAD */}
      <Dialog open={uploadDialogOpen} onOpenChange={(open) => {
        if (!open) resetUploadState();
      }}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleUploadSubmit}>
            <DialogHeader>
              <DialogTitle className="text-slate-900 font-sans font-bold">
                {selectedReq && student.postOJTRequirements.find(r => r.name === selectedReq)?.fileName 
                  ? 'Re-upload Document' 
                  : 'Upload OJT Document'}
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-light text-xs">
                Upload file validation copy for <span className="font-semibold text-slate-800">{selectedReq}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              {/* DRAG AND DROP ZONE */}
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  dragActive 
                    ? "border-[#800000] bg-red-50/30" 
                    : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf"
                />
                
                <div className="flex flex-col items-center gap-2">
                  <Upload className={`h-8 w-8 transition-colors ${dragActive ? "text-[#800000]" : "text-slate-400"}`} />
                  <p className="text-xs font-semibold text-slate-700">
                    Drag & drop your PDF file here, or <span className="text-[#800000] hover:underline font-bold">browse</span>
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Supports PDF only (Max 10MB)
                  </p>
                </div>
              </div>

              {/* DYNAMIC FILE SELECTION DISPLAY & NAME FORMAT PREVIEW */}
              {selectedFile && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <FileCheck className="h-4 w-4 text-[#800000]" />
                      <span className="truncate max-w-[200px]" title={selectedFile.name}>{selectedFile.name}</span>
                    </div>
                    <span className="text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-200">
                    <Label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Auto-Formatted Filename</Label>
                    <div className="mt-1 p-2 bg-[#800000]/5 text-[#800000] font-mono text-[10px] rounded border border-[#800000]/10 truncate" title={formattedFileName}>
                      {formattedFileName}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={resetUploadState} className="text-xs hover:bg-slate-100 hover:text-slate-900 border-slate-200 cursor-pointer transition-colors">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#800000] hover:bg-[#6b0000] text-white text-xs font-semibold cursor-pointer transition-colors shadow-sm"
                disabled={!selectedFile || !formattedFileName.trim()}
              >
                Upload File
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DYNAMIC DOCUMENT PREVIEW DIALOG */}
      <Dialog open={!!previewReq} onOpenChange={(open) => {
        if (!open) setPreviewReq(null);
      }}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto font-sans">
          <DialogHeader className="border-b pb-2 mb-2">
            <DialogTitle className="text-slate-900 font-sans font-bold flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-[#800000]" />
              Document Preview
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-light text-xs truncate">
              Previewing: <span className="font-mono text-slate-700 font-semibold">{previewReq?.fileName}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2 bg-slate-100 rounded-lg p-3 border border-slate-200">
            {previewReq && renderPreviewContent(previewReq.reqName, previewReq.fileName)}
          </div>
          
          <DialogFooter className="border-t pt-3 mt-2">
            <Button type="button" onClick={() => setPreviewReq(null)} className="bg-[#800000] hover:bg-[#6b0000] text-white text-xs font-semibold px-4 cursor-pointer transition-colors">
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
