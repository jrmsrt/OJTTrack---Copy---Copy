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
  FileCheck,
  CalendarCheck,
  Inbox,
  Camera
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

export function DuringOJT() {
  const { user } = useAuth();
  const { students, uploadDuringOJTReq } = useOJT();
  
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
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-red-600 font-sans">Error</h2>
        <p className="text-slate-600 mt-2">Student record not found.</p>
      </div>
    );
  }

  const isCleared = student.stage !== 'Stage 1: Pre-OJT';

  if (!isCleared) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px] text-center gap-3 bg-white rounded-xl border border-slate-200 shadow-sm font-sans">
        <div className="bg-red-50 text-[#800000] h-12 w-12 rounded-full flex items-center justify-center">
          <Lock className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">During-OJT Checklist is Locked</h2>
        <p className="text-slate-500 text-xs max-w-md leading-relaxed">
          “Complete and wait for approval of your Pre-OJT requirements before accessing During-OJT features.”
        </p>
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
    if (reqName.startsWith('Weekly Journal (Week')) {
      const weekNum = reqName.match(/\d+/)?.[0] || '1';
      return `WeeklyJournal_Week${weekNum}`;
    }
    if (reqName.startsWith('Pictures / Documentation (Week')) {
      const weekNum = reqName.match(/\d+/)?.[0] || '1';
      return `PicturesDocs_Week${weekNum}`;
    }
    switch (reqName) {
      case 'Daily Time Record':
        return 'DTR';
      case 'Self-Reflection':
        return 'SelfReflection';
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
    if (name.startsWith('Weekly Journal (Week')) {
      const weekNum = name.match(/\d+/)?.[0] || '1';
      return `Weekly accomplishment report and learning journal for Week ${weekNum}`;
    }
    if (name.startsWith('Pictures / Documentation (Week')) {
      const weekNum = name.match(/\d+/)?.[0] || '1';
      return `Photo documentation of tasks and workspace during Week ${weekNum}`;
    }
    switch (name) {
      case 'Daily Time Record':
        return 'Consolidated time card showing daily punch-in and punch-out records';
      case 'Self-Reflection':
        return 'Detailed narrative reflection of lessons learned and career insights';
      default:
        return 'Internship deployment milestone report';
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
        description: "Only PDF documents are allowed for During-OJT uploads."
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

    uploadDuringOJTReq(student.studentId, selectedReq, formattedFileName);
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
          <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-lg p-4 min-h-[380px]">
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
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-1 min-h-[380px]">
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
          <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-lg p-8 min-h-[380px] text-center">
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

    if (reqName === 'Daily Time Record') {
      return (
        <div className="border border-slate-300 rounded-lg p-6 bg-white font-sans text-[11px] text-slate-800 shadow-inner relative overflow-hidden" style={{ minHeight: '380px' }}>
          <div className="text-center border-b pb-2 mb-4">
            <h3 className="font-bold text-[11px] uppercase text-slate-900 leading-tight">{student.companyName || 'Host Training Establishment'}</h3>
            <p className="text-slate-500 text-[9px] mt-0.5">DAILY TIME RECORD (DTR)</p>
            <p className="font-bold text-[#800000] mt-1 text-[10px]">PUNCH LOG CLEARANCE SHEET</p>
          </div>
          
          <div className="grid grid-cols-2 gap-y-1.5 mb-4 text-[10px] bg-slate-50 p-2.5 rounded border border-slate-100">
            <div><span className="font-semibold text-slate-505 text-slate-500">Intern Name:</span> {studentName}</div>
            <div><span className="font-semibold text-slate-505 text-slate-500">Student ID:</span> {studentNo}</div>
            <div><span className="font-semibold text-slate-505 text-slate-500">Department:</span> Engineering / Development</div>
            <div><span className="font-semibold text-slate-505 text-slate-500">Required Hours:</span> {student.requiredHours} hrs</div>
          </div>

          <div className="border rounded overflow-hidden">
            <div className="bg-slate-50 font-bold border-b py-1 px-2 grid grid-cols-5 text-[9px] text-slate-500 text-center">
              <span>Date</span>
              <span>Time In</span>
              <span>Time Out</span>
              <span>Hours</span>
              <span>Status</span>
            </div>
            <div className="divide-y text-[9px] text-slate-650 text-slate-600 text-center">
              <div className="py-1.5 px-2 grid grid-cols-5">
                <span>2026-06-15</span>
                <span>08:00 AM</span>
                <span>05:00 PM</span>
                <span>8.0</span>
                <span className="text-green-600 font-bold">Approved</span>
              </div>
              <div className="py-1.5 px-2 grid grid-cols-5">
                <span>2026-06-16</span>
                <span>07:55 AM</span>
                <span>05:05 PM</span>
                <span>8.0</span>
                <span className="text-green-600 font-bold">Approved</span>
              </div>
              <div className="py-1.5 px-2 grid grid-cols-5">
                <span>2026-06-17</span>
                <span>08:02 AM</span>
                <span>05:00 PM</span>
                <span>8.0</span>
                <span className="text-green-650 text-green-650 text-green-600 font-bold">Approved</span>
              </div>
              <div className="py-1.5 px-2 grid grid-cols-5">
                <span>2026-06-18</span>
                <span>08:00 AM</span>
                <span>05:00 PM</span>
                <span>8.0</span>
                <span className="text-green-650 text-green-650 text-green-600 font-bold">Approved</span>
              </div>
              <div className="py-1.5 px-2 grid grid-cols-5">
                <span>2026-06-19</span>
                <span>07:58 AM</span>
                <span>05:02 PM</span>
                <span>8.0</span>
                <span className="text-green-650 text-green-650 text-green-600 font-bold">Approved</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center text-[8px] text-slate-400 mt-12 border-t pt-2">
            <span>Verified by: {student.adviserName || 'Michael Chen'}</span>
            <span className="font-mono">{fileName}</span>
          </div>
        </div>
      );
    }

    if (reqName === 'Self-Reflection') {
      return (
        <div className="border border-slate-300 rounded-lg p-6 bg-white font-sans text-slate-800 shadow-inner min-h-[380px] relative overflow-hidden">
          <div className="text-center border-b pb-4 mb-4">
            <h3 className="font-bold text-sm text-slate-900 tracking-tight leading-none">{studentName}</h3>
            <p className="text-[#800000] text-xs font-semibold mt-1">Narrative Self-Reflection Report</p>
            <p className="text-[9px] text-slate-400 font-light mt-0.5">{student.program}</p>
          </div>
          <div className="space-y-3 text-[11px] leading-relaxed text-slate-700">
            <p>
              <strong>My Learning Experience:</strong> Over the course of this internship at {student.companyName || 'my host company'}, I had the opportunity to apply theoretical classroom concepts to industry-level projects. Adapting to the engineering practices, strict version control guidelines, and daily stand-ups taught me how software teams collaborate effectively.
            </p>
            <p>
              <strong>Challenges Overcome:</strong> Initially, managing the scale of the repository and database tables was overwhelming. Through the guidance of my industrial supervisor and consistent research, I learned how to modularize my code and optimize complex queries.
            </p>
            <p>
              <strong>Career Aspirations:</strong> This deployment solidified my desire to pursue a career in software development, specifically focusing on building scalable web interfaces and robust APIs.
            </p>
          </div>
          <div className="mt-12 pt-4 border-t border-slate-200 flex justify-between items-center text-[8px] text-slate-400">
            <span>Date Submitted: 2026-06-24</span>
            <span className="font-mono">{fileName}</span>
          </div>
        </div>
      );
    }

    if (reqName.startsWith('Weekly Journal (Week')) {
      const weekNum = reqName.match(/\d+/)?.[0] || '1';
      return (
        <div className="border border-slate-300 rounded-lg p-6 bg-white font-sans text-slate-800 shadow-inner min-h-[380px]">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <div>
              <h3 className="font-bold text-xs text-slate-900">WEEKLY JOURNAL REPORT</h3>
              <p className="text-[#800000] text-[10px] font-bold mt-0.5">Week {weekNum}</p>
            </div>
            <span className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-500 font-medium">Stage 2: During-OJT</span>
          </div>
          
          <div className="space-y-4 text-[10.5px]">
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[9px] text-[#800000]">1. Key Tasks Accomplished</h4>
              <p className="text-slate-600 mt-1 leading-relaxed pl-2 border-l border-slate-200">
                Participated in daily scrum stand-ups. Completed module integration code, solved minor layout bugs on front-end components, and drafted unit tests for backend APIs.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[9px] text-[#800000]">2. Learning & Skills Applied</h4>
              <p className="text-slate-650 mt-1 leading-relaxed pl-2 border-l border-slate-200">
                Practiced Git branch rebasing workflow. Enhanced understanding of RESTful API request validations and responsive flex-box styling rules.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[9px] text-[#800000]">3. Problems Encountered & Resolutions</h4>
              <p className="text-slate-650 mt-1 leading-relaxed pl-2 border-l border-slate-200">
                Encountered merge conflicts during repository sync. Solved it by pair programming with the team lead and executing precise line-by-line staging.
              </p>
            </div>
          </div>
          <div className="mt-10 pt-4 border-t border-slate-150 flex justify-between items-center text-[8px] text-slate-400">
            <span>Authorized Sign-off: Supervisor Verified</span>
            <span className="font-mono">{fileName}</span>
          </div>
        </div>
      );
    }

    if (reqName.startsWith('Pictures / Documentation (Week')) {
      const weekNum = reqName.match(/\d+/)?.[0] || '1';
      return (
        <div className="border border-slate-300 rounded-lg p-5 bg-white font-sans text-slate-800 shadow-inner min-h-[380px] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <div>
                <h3 className="font-bold text-xs text-slate-900">PHOTO DOCUMENTATION</h3>
                <p className="text-[#800000] text-[10px] font-bold mt-0.5">Week {weekNum}</p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Attachment Verified</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="border rounded bg-slate-50 p-2 text-center flex flex-col items-center justify-center min-h-[140px] border-dashed">
                <div className="bg-slate-200 h-10 w-10 rounded-full flex items-center justify-center text-slate-500 mb-2">
                  <Camera className="h-5 w-5" />
                </div>
                <span className="text-[9px] font-bold text-slate-600 block uppercase">Workspace Photo</span>
                <span className="text-[8px] text-slate-400 mt-1 font-mono">office_desk_w{weekNum}.jpg</span>
              </div>
              <div className="border rounded bg-slate-50 p-2 text-center flex flex-col items-center justify-center min-h-[140px] border-dashed">
                <div className="bg-slate-200 h-10 w-10 rounded-full flex items-center justify-center text-slate-500 mb-2">
                  <Camera className="h-5 w-5" />
                </div>
                <span className="text-[9px] font-bold text-slate-600 block uppercase">Task Output Screen</span>
                <span className="text-[8px] text-slate-400 mt-1 font-mono">ui_screenshot_w{weekNum}.jpg</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-3 border-t border-slate-200 flex justify-between items-center text-[8px] text-slate-400">
            <span>Timestamp: 2026-06-24</span>
            <span className="font-mono">{fileName}</span>
          </div>
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">During-OJT Requirements</h1>
          <p className="text-slate-500 text-sm mt-0.5">Submit all weekly documentation and milestone reports generated during your company deployment.</p>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200 -mt-3.5">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-base font-bold text-slate-800">Deployment Deliverables</CardTitle>
              <CardDescription>File checklist for weekly reporting, time logs, and narrative self-reflections.</CardDescription>
            </div>
            <Badge className="bg-green-50 text-green-700 border-green-105 font-semibold flex items-center gap-1">
              Active Stage: During-OJT
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
              {student.duringOJTRequirements.map((req, idx) => (
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
                {selectedReq && student.duringOJTRequirements.find(r => r.name === selectedReq)?.fileName 
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
