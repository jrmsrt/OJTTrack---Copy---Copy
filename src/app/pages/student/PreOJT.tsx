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
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  FileText,
  Clock,
  ExternalLink,
  Inbox,
  CalendarCheck,
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

export function PreOJT() {
  const { user } = useAuth();
  const { students, uploadPreOJTReq } = useOJT();
  
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

  // Non-document state (OJT Orientation Date)
  const [orientationDate, setOrientationDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const student = students.find(s => s.studentId === user?.id || s.email === user?.email);

  if (!student) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-red-600">Error</h2>
        <p className="text-slate-600 mt-2">Student profile not found.</p>
      </div>
    );
  }

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
    // Match any digits followed by one or more letters (e.g. 4A or 4-A or 4-1)
    const match = section.match(/(\d)\s*-?\s*([A-Z0-9]+)$/i);
    if (match) {
      const year = match[1];
      const secPart = match[2];
      // Check if secPart is a single letter, translate it
      if (/^[A-Z]$/i.test(secPart)) {
        return `${year}-${sectionLetterToNumber(secPart)}`;
      }
      return `${year}-${secPart}`;
    }
    return section.replace(/\s+/g, '-');
  };

  // Map checklist requirement to file name suffix
  const getFileNamePart = (reqName: string) => {
    switch (reqName) {
      case 'Certificate of Registration (COR)':
        return 'COR';
      case 'Resume':
        return 'Resume';
      case 'Notarize Memorandum of Agreement (MOA)':
        return 'NotarizedMOA';
      case 'Endorsement/Recommendation Letter':
        return 'EndorsementLetter';
      case 'Notarized Waiver/Consent Form':
        return 'NotarizedWaiver';
      case 'Notarized Internship Agreement':
        return 'NotarizedInternshipAgreement';
      case 'Student Practicum Plan':
        return 'PracticumPlan';
      case 'Medical Certificate':
        return 'MedicalCertificate';
      case 'Good Moral Certificate':
        return 'GoodMoralCertificate';
      case 'Certificate of Insurance':
        return 'InsuranceCertificate';
      case 'Certificate (Sexual Harassment and Work Ethics)':
        return 'SexualHarassmentEthicsCert';
      case 'SIS grades (1st year to 3rd year)':
        return 'Grades';
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
    // 1. Extract Last Name (last word of name)
    const nameParts = studentName.trim().split(/\s+/);
    const lastName = nameParts[nameParts.length - 1] || 'Student';

    // 2. Extract Course (everything before the first dash/hyphen)
    let course = 'Course';
    if (program) {
      const parts = program.split(/[—–-]/);
      course = parts.length > 0 ? parts[0].trim() : program.trim();
    }

    // 3. Extract Year-Section (e.g., 4-1 from BSIT 4A)
    const yearSection = getYearSection(section);

    // 4. Get File Name Part
    const filePart = getFileNamePart(documentName);

    // 5. Get file extension from original file name (or fallback to .pdf)
    let extension = '.pdf';
    const extMatch = originalFileName.match(/\.[a-zA-Z0-9]+$/);
    if (extMatch) {
      extension = extMatch[0].toLowerCase();
    }

    return `${lastName}_${course}_${yearSection}_${filePart}${extension}`;
  };

  // Helper check for non-document items
  const isNonDocumentReq = (name: string) => {
    return name === 'Practicum kit (expanded envelope)' || name === 'Attendance OJT Orientation';
  };

  // Dynamic descriptions for each requirement
  const getReqDescription = (name: string) => {
    switch (name) {
      case 'Certificate of Registration (COR)':
        return 'Registration card/proof of enrollment';
      case 'Resume':
        return 'Professional resume with standard 2x2 colored picture and name tag';
      case 'Notarize Memorandum of Agreement (MOA)':
        return 'Official signed and notarized agreement between the university and Host Training Establishment (HTE)';
      case 'Endorsement/Recommendation Letter':
        return 'Official recommendation or endorsement letter signed by the OJT Coordinator and college Dean';
      case 'Certificate (Sexual Harassment and Work Ethics)':
        return 'Certificate of participation/attendance for the seminar on Safe Spaces Act (Sexual Harassment) and Work Ethics';
      case 'Notarized Waiver/Consent Form':
        return 'Signed legal waiver form along with parent/guardian ID photocopy';
      case 'Notarized Internship Agreement':
        return 'Notarized Student Internship Program duly signed by student and guardian';
      case 'Student Practicum Plan':
        return 'Approved personal internship practicum plan';
      case 'Medical Certificate':
        return 'Medical exam clearance slip from clinic/hospital (photocopy)';
      case 'Good Moral Certificate':
        return 'Official certificate of good moral character (photocopy)';
      case 'Certificate of Insurance':
        return 'Accident insurance coverage verification (photocopy)';
      case 'SIS grades (1st year to 3rd year)':
        return 'Compiled screenshots of your SIS grades in one file';
      case 'Practicum kit (expanded envelope)':
        return 'Physical submission of expanded brown envelope at the OJT Office';
      case 'Attendance OJT Orientation':
        return 'Confirmation of participation in the OJT Orientation briefing';
      default:
        return 'Standard intake validation paper';
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
        description: "Only PDF documents are allowed for Pre-OJT uploads."
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

    uploadPreOJTReq(student.studentId, selectedReq, formattedFileName);
    toast.success(`Successfully uploaded document: ${formattedFileName}`, {
      description: `Requirement: ${selectedReq} is now marked as Under Review.`
    });
    
    resetUploadState();
  };

  const handlePracticumKitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    const finalVal = "Handed Over (Physical)";
    uploadPreOJTReq(student.studentId, selectedReq, finalVal);
    toast.success(`Physical submission recorded: ${selectedReq}`, {
      description: 'Status is now marked as Under Review.'
    });

    resetUploadState();
  };

  const handleOrientationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    const finalVal = `Attended on ${orientationDate}`;
    uploadPreOJTReq(student.studentId, selectedReq, finalVal);
    toast.success(`OJT Orientation attendance recorded`, {
      description: `Attended on ${orientationDate}. Status is now marked as Under Review.`
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
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 flex items-center gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>;
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

    // 1. If an actual file was uploaded by the user during this session, preview it
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
    
    // 2. Otherwise, fall back to our beautiful mock layout generators
    switch (reqName) {
      case 'Certificate of Registration (COR)':
        return (
          <div className="border border-slate-300 rounded-lg p-6 bg-white font-sans text-[11px] text-slate-800 shadow-inner relative overflow-hidden select-none" style={{ minHeight: '380px' }}>
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] rotate-12 pointer-events-none">
              <span className="text-5xl font-extrabold text-[#800000]">PUP OFFICIAL</span>
            </div>
            
            <div className="text-center border-b pb-2 mb-4">
              <h3 className="font-bold text-[11px] uppercase text-slate-900 leading-tight">POLYTECHNIC UNIVERSITY OF THE PHILIPPINES</h3>
              <p className="text-slate-500 text-[9px] mt-0.5">Office of the University Registrar</p>
              <p className="font-bold text-[#800000] mt-1 text-[10px]">CERTIFICATE OF REGISTRATION</p>
            </div>
            
            <div className="grid grid-cols-2 gap-y-1.5 mb-4 text-[10px] bg-slate-50 p-2.5 rounded border border-slate-100">
              <div><span className="font-semibold text-slate-500">Student No:</span> {studentNo}</div>
              <div><span className="font-semibold text-slate-500">Academic Year:</span> 2025-2026</div>
              <div><span className="font-semibold text-slate-500">Name:</span> {studentName}</div>
              <div><span className="font-semibold text-slate-500">Year & Section:</span> {student.section}</div>
              <div><span className="font-semibold text-slate-500">Course:</span> {course}</div>
              <div><span className="font-semibold text-slate-500">Registration Status:</span> <span className="text-green-600 font-bold">OFFICIALLY ENROLLED</span></div>
            </div>
            
            <div className="border rounded mb-4 overflow-hidden bg-white">
              <div className="bg-slate-50 font-bold border-b py-1.5 px-2 grid grid-cols-5 text-[9px] text-slate-500">
                <span className="col-span-2">Subject Code / Description</span>
                <span className="text-center">Units</span>
                <span className="text-center">Schedule</span>
                <span className="text-center">Room</span>
              </div>
              <div className="divide-y text-[9px] text-slate-600">
                <div className="py-2 px-2 grid grid-cols-5">
                  <span className="col-span-2 font-medium text-slate-800">ITEC 401 - Internship (480 Hours)</span>
                  <span className="text-center">6.0</span>
                  <span className="text-center">MON-FRI 8:00-17:00</span>
                  <span className="text-center">HTE</span>
                </div>
                <div className="py-2 px-2 grid grid-cols-5">
                  <span className="col-span-2 font-medium text-slate-800">ITEC 402 - Capstone Project 2</span>
                  <span className="text-center">3.0</span>
                  <span className="text-center">SAT 9:00-12:00</span>
                  <span className="text-center">LAB 3</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-[8px] text-slate-400 mt-12 border-t pt-2">
              <span>System Generated: 2026-06-24</span>
              <span className="font-mono text-[8px]">{fileName}</span>
            </div>
          </div>
        );
      case 'Resume':
        return (
          <div className="border border-slate-300 rounded-lg p-6 bg-white font-sans text-slate-800 shadow-inner min-h-[380px]">
            <div className="flex justify-between items-start border-b pb-4 mb-4">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900 tracking-tight leading-none">{studentName}</h3>
                <p className="text-[#800000] text-xs font-semibold">{course} Student</p>
                <p className="text-[10px] text-slate-400 font-light">{student.email} | +63 915 123 4567</p>
              </div>
              
              {/* 2X2 Photo Mockup */}
              <div className="border-2 border-[#800000] p-0.5 rounded shadow-sm bg-white shrink-0">
                <div className="w-16 h-16 bg-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-slate-300 mt-2"></div>
                  <div className="w-12 h-6 rounded-b bg-slate-400 mt-1"></div>
                  <div className="absolute bottom-0 inset-x-0 bg-[#800000] text-[7px] text-white text-center py-0.5 font-bold uppercase tracking-wider">
                    {studentName.split(' ').pop()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 text-[10px]">
              <div>
                <h4 className="font-bold text-[#800000] uppercase text-[9px] border-b pb-0.5 mb-1.5 tracking-wider">Career Objective</h4>
                <p className="text-slate-600 font-light leading-relaxed">
                  Passionate and detail-oriented {course} senior seeking an internship opportunity to apply classroom knowledge in software engineering, database management, and web development to real-world challenges.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-[#800000] uppercase text-[9px] border-b pb-0.5 mb-1.5 tracking-wider">Education</h4>
                <p className="font-semibold text-slate-800">Polytechnic University of the Philippines</p>
                <p className="text-slate-500 font-light">Bachelor of Science in Information Technology (Expected Graduation: 2026)</p>
                <p className="text-slate-500 font-light">GPA: 1.45 / 5.00 Scale</p>
              </div>
              
              <div>
                <h4 className="font-bold text-[#800000] uppercase text-[9px] border-b pb-0.5 mb-1.5 tracking-wider">Key Skills</h4>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {['React', 'TypeScript', 'TailwindCSS', 'Node.js', 'PostgreSQL', 'Git', 'Agile Methodologies'].map((skill, sIdx) => (
                    <span key={sIdx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[9px] font-medium border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-[8px] font-mono text-slate-400 text-right mt-12">
              File Ref: {fileName}
            </div>
          </div>
        );
      case 'Notarize Memorandum of Agreement (MOA)':
        return (
          <div className="border border-slate-300 rounded-lg p-6 bg-white font-sans text-slate-800 shadow-inner relative min-h-[380px] text-[10px] flex flex-col justify-between">
            <div>
              <div className="text-center border-b pb-3 mb-4">
                <h3 className="font-bold text-xs text-[#800000] uppercase tracking-wider">MEMORANDUM OF AGREEMENT</h3>
                <p className="text-slate-400 text-[8px] mt-0.5">Polytechnic University of the Philippines & Partner HTE</p>
              </div>
              <div className="space-y-3.5 mt-4 text-[10px]">
                <p className="leading-relaxed text-justify text-slate-650">
                  This Agreement is entered into by and between the **Polytechnic University of the Philippines** (PUP) and the Host Training Establishment (HTE) to collaborate on the student internship program.
                </p>
                <div className="p-3 bg-amber-50 rounded border border-amber-200 text-amber-800 text-[9px] leading-relaxed mt-4">
                  <strong>Notary Public Verification:</strong> This agreement has been duly notarized under Doc No. 518, Page No. 92, Book No. XIV, Series of 2026.
                </div>
              </div>
            </div>
            <div className="flex justify-between items-end border-t pt-4 mt-6">
              <div className="text-[8px] font-mono text-slate-400">{fileName}</div>
              <div className="text-right text-[9px] font-bold text-green-700 bg-green-50 border border-green-150 rounded px-2 py-0.5">
                NOTARIZED & SIGNED
              </div>
            </div>
          </div>
        );
      case 'Endorsement/Recommendation Letter':
        return (
          <div className="border border-slate-300 rounded-lg p-6 bg-white font-sans text-slate-800 shadow-inner relative min-h-[380px] text-[10px] flex flex-col justify-between">
            <div>
              <div className="text-center border-b pb-3 mb-4">
                <h3 className="font-bold text-xs text-[#800000] uppercase tracking-wider">PUP OFFICE OF INTERNSHIP</h3>
                <p className="text-slate-400 text-[8px] mt-0.5">Official Student Endorsement Letter</p>
              </div>
              <div className="space-y-3 mt-4 text-[10px] leading-relaxed">
                <p>To Whom It May Concern,</p>
                <p className="text-justify text-slate-650">
                  This is to officially endorse <span className="font-bold text-slate-800">{studentName}</span>, a student of the <span className="font-semibold text-slate-700">{course}</span> program, to undergo the mandatory Internship / On-the-Job Training program at your establishment for a total of 480 hours.
                </p>
                <p className="text-slate-650 mt-2">
                  We highly appreciate your partnership and mentorship in shaping the professional development of our interns.
                </p>
              </div>
            </div>
            <div className="flex justify-between items-end border-t pt-4 mt-6">
              <div className="text-[8px] font-mono text-slate-400">{fileName}</div>
              <div className="text-center">
                <div className="font-bold text-slate-700 text-[9px]">Michael Chen</div>
                <div className="text-[7px] text-slate-400 uppercase tracking-widest mt-0.5">OJT Adviser / Coordinator</div>
              </div>
            </div>
          </div>
        );
      case 'Notarized Waiver/Consent Form':
        return (
          <div className="border border-slate-300 rounded-lg p-6 bg-white font-sans text-slate-800 shadow-inner relative min-h-[380px] text-[10px] flex flex-col justify-between">
            <div>
              <div className="text-center border-b pb-3 mb-4">
                <h3 className="font-bold text-[11px] uppercase text-slate-900 leading-tight">NOTARIZED PARENTAL WAIVER & CONSENT</h3>
                <p className="text-slate-500 text-[9px] mt-0.5">PUP OJT Student Clearance Form</p>
              </div>
              
              <div className="space-y-3 text-slate-600 leading-relaxed font-light text-justify text-[10px]">
                <p>
                  I, the parent/legal guardian of <span className="font-bold text-slate-800">{studentName}</span>, hereby grant my full consent for my ward to participate in the Student Internship Program (OJT) consisting of <span className="font-bold text-slate-800">{student.requiredHours} hours</span>.
                </p>
                <p>
                  I acknowledge the risks associated with training in a professional corporate environment and release both the host establishment and the Polytechnic University of the Philippines from liability, provided due process and safety protocols are followed.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-10">
                <div className="text-center">
                  <div className="border-b border-slate-400 w-3/4 mx-auto h-6 flex items-end justify-center font-serif text-[10px] font-semibold italic text-[#800000] decoration-1">
                    {studentName.split(' ').pop()}'s Guardian
                  </div>
                  <span className="text-[8px] text-slate-400 font-semibold block mt-1">Parent / Guardian Signature</span>
                </div>
                <div className="text-center">
                  <div className="border-b border-slate-400 w-3/4 mx-auto h-6 flex items-end justify-center font-serif text-[10px] font-semibold italic text-slate-800">
                    {studentName}
                  </div>
                  <span className="text-[8px] text-slate-400 font-semibold block mt-1">Student Signature</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-200 pt-4 mt-8 flex justify-between items-center bg-slate-50 p-2.5 rounded border border-slate-200">
              <div className="text-[8px] text-slate-400">
                <div>Document Seal ID: 9942-881A-CC</div>
                <div className="font-mono mt-0.5">{fileName}</div>
              </div>
              <div className="border border-green-600 text-green-700 text-[8px] uppercase font-bold px-2 py-0.5 bg-green-50 rotate-3 tracking-wider rounded">
                NOTARIZED SEAL
              </div>
            </div>
          </div>
        );
      case 'Notarized Internship Agreement':
        return (
          <div className="border border-slate-300 rounded-lg p-6 bg-white font-sans text-slate-800 shadow-inner relative min-h-[380px] text-[10px] flex flex-col justify-between">
            <div>
              <div className="text-center border-b pb-3 mb-4">
                <h3 className="font-bold text-[11px] uppercase text-slate-900 leading-tight">STUDENT INTERNSHIP PROGRAM AGREEMENT</h3>
                <p className="text-slate-500 text-[9px] mt-0.5">Memorandum of Internship Agreement (HTE Model)</p>
              </div>
              
              <div className="space-y-2.5 text-slate-600 leading-relaxed font-light text-[10px]">
                <p className="font-semibold text-slate-800 uppercase text-[9px] tracking-wide">PARTIES INVOLVED:</p>
                <ul className="list-disc pl-4 space-y-1.5">
                  <li><strong>The Student:</strong> {studentName} ({studentNo})</li>
                  <li><strong>The Program:</strong> {course} - Section {student.section}</li>
                  <li><strong>Host Establishment:</strong> {student.companyName || 'Approved Partner HTE'}</li>
                </ul>
                <p className="mt-3 text-justify">
                  By signing this agreement, the Student agrees to perform tasks relevant to their course work, adhere to the company's rules and regulations, maintain absolute confidentiality of company assets/documents, and complete the designated {student.requiredHours} training hours.
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-10 text-center text-[8px] text-slate-400">
                <div>
                  <div className="border-b border-slate-400 h-6 flex items-end justify-center font-serif text-[10px] font-semibold italic text-slate-800">
                    {studentName}
                  </div>
                  <span className="font-semibold block mt-1">Student</span>
                </div>
                <div>
                  <div className="border-b border-slate-400 h-6 flex items-end justify-center font-serif text-[10px] font-semibold italic text-slate-700">
                    Approved HTE
                  </div>
                  <span className="font-semibold block mt-1">HTE Supervisor</span>
                </div>
                <div>
                  <div className="border-b border-slate-400 h-6 flex items-end justify-center font-serif text-[10px] font-semibold italic text-[#800000]">
                    Michael Chen
                  </div>
                  <span className="font-semibold block mt-1">OJT Coordinator</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-2 mt-6 flex justify-between items-center text-[8px] font-mono text-slate-400">
              <span>Code Ref: IA-PUP-2026-092</span>
              <span>{fileName}</span>
            </div>
          </div>
        );
      case 'Student Practicum Plan':
        return (
          <div className="border border-slate-300 rounded-lg p-6 bg-white font-sans text-slate-800 shadow-inner min-h-[380px] text-[10px]">
            <div className="text-center border-b pb-3 mb-4">
              <h3 className="font-bold text-[11px] uppercase text-slate-900 leading-tight">OFFICIAL STUDENT PRACTICUM PLAN</h3>
              <p className="text-slate-500 text-[9px] mt-0.5">Course Syllabus & Training Roadmap</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-[9px] bg-slate-50 p-2.5 rounded border border-slate-100">
                <div><strong>Intern:</strong> {studentName}</div>
                <div><strong>HTE Partner:</strong> {student.companyName || 'TechCorp Inc.'}</div>
                <div><strong>Supervisor:</strong> Engr. Robert Torres</div>
                <div><strong>OJT Adviser:</strong> {student.adviserName}</div>
              </div>
              
              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-left text-[9px] bg-white">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-600">
                      <th className="p-2 w-16">Phase</th>
                      <th className="p-2">Target Competencies / Task Areas</th>
                      <th className="p-2 w-24">Hours Allocation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-600">
                    <tr>
                      <td className="p-2 font-semibold">Weeks 1-3</td>
                      <td className="p-2">Orientation, environment setup, framework learning (React/TypeScript)</td>
                      <td className="p-2">120 Hours</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Weeks 4-8</td>
                      <td className="p-2">Frontend mockups, responsive layouts, API development integration</td>
                      <td className="p-2">200 Hours</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Weeks 9-12</td>
                      <td className="p-2">System testing, code deployment, and final debugging tasks</td>
                      <td className="p-2">160 Hours</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="text-[8px] text-slate-400 font-mono mt-12 text-right">
              {fileName}
            </div>
          </div>
        );
      case 'Medical Certificate':
        return (
          <div className="border border-slate-300 rounded-lg p-6 bg-white font-sans text-slate-800 shadow-inner relative min-h-[380px] text-[10px] flex flex-col justify-between">
            <div>
              <div className="text-center border-b pb-3 mb-4">
                <h3 className="font-serif font-bold text-xs text-[#800000] uppercase tracking-wide">METRO HEALTH CLINIC & DIAGNOSTICS</h3>
                <p className="text-slate-500 text-[8px] font-sans">102 University Avenue, Pasig City | Tel: (02) 888-1234</p>
              </div>
              
              <div className="space-y-4 mt-6">
                <div className="flex justify-between items-baseline text-[9px]">
                  <span><strong>Date:</strong> June 15, 2026</span>
                  <span><strong>Ref No:</strong> MC-2026-99238</span>
                </div>
                
                <h4 className="text-center font-bold text-[10px] underline uppercase tracking-wider text-slate-900 my-3">MEDICAL CERTIFICATION</h4>
                
                <p className="leading-relaxed text-justify text-slate-600 font-light text-[10px]">
                  This certifies that <span className="font-bold text-slate-800">{studentName}</span>, {student.section}, has undergone physical, laboratory, and radiographic examination at this clinic.
                </p>
                <p className="leading-relaxed text-justify text-slate-600 font-light text-[10px]">
                  Based on test results and medical indicators, the student is found to be in good physical health and is hereby declared <strong className="text-green-700 bg-green-50 px-1 border border-green-200 rounded">FIT FOR PHYSICAL/VIRTUAL OJT WORK</strong>.
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-end border-t pt-6 mt-8">
              <div className="text-[8px] font-mono text-slate-400">{fileName}</div>
              <div className="text-center">
                <div className="font-serif font-bold italic text-slate-700 text-[10px]">Dr. Victoria Alcantara, MD</div>
                <div className="text-[8px] text-slate-400 border-t pt-0.5">Lic. No 093821-PRC</div>
              </div>
            </div>
          </div>
        );
      case 'Good Moral Certificate':
        return (
          <div className="border border-slate-300 rounded-lg p-6 bg-white font-sans text-slate-800 shadow-inner relative min-h-[380px] text-[10px] flex flex-col justify-between">
            <div>
              <div className="text-center border-b pb-3 mb-4">
                <h3 className="font-bold text-[11px] uppercase text-slate-900 leading-tight">POLYTECHNIC UNIVERSITY OF THE PHILIPPINES</h3>
                <p className="text-slate-500 text-[9px] mt-0.5">Office of the Dean, Student Affairs & Services</p>
              </div>
              
              <div className="space-y-3.5 mt-6 text-[10px]">
                <h4 className="text-center font-bold text-[10px] underline uppercase tracking-wider text-slate-900 my-3">CERTIFICATE OF GOOD MORAL CHARACTER</h4>
                
                <p className="leading-relaxed text-justify text-slate-600 font-light">
                  This certifies that <span className="font-bold text-slate-800">{studentName}</span> is a bona-fide student of the <span className="font-semibold text-slate-700">{course}</span> program.
                </p>
                <p className="leading-relaxed text-justify text-slate-600 font-light">
                  Throughout their residency in the University, the student has maintained a clean record and has not been subjected to any disciplinary actions. The student is recognized as a person of good moral character.
                </p>
                <p className="leading-relaxed text-justify text-slate-600 font-light">
                  This certificate is issued upon student's request in fulfillment of their Pre-OJT clearance requirement.
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-end border-t pt-6 mt-8">
              <div className="text-[8px] font-mono text-slate-400">{fileName}</div>
              <div className="text-center">
                <div className="font-bold text-slate-700 text-[9px]">Dean, Student Affairs</div>
                <div className="text-[7px] text-slate-400 uppercase tracking-widest mt-0.5">PUP Registrar Office</div>
              </div>
            </div>
          </div>
        );
      case 'Certificate of Insurance':
        return (
          <div className="border border-slate-300 rounded-lg p-6 bg-white font-sans text-slate-800 shadow-inner relative min-h-[380px] text-[10px] flex flex-col justify-between">
            <div>
              <div className="text-center border-b pb-3 mb-4">
                <h3 className="font-bold text-xs text-red-600 uppercase tracking-wider">M LHUILLIER GENERAL INSURANCE</h3>
                <p className="text-slate-400 text-[8px] mt-0.5">Accident and Group Insurance division</p>
              </div>
              
              <div className="space-y-3.5 mt-6 text-[10px]">
                <div className="flex justify-between">
                  <span><strong>Policyholder:</strong> {studentName}</span>
                  <span><strong>Policy ID:</strong> MLG-9482-110</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>Group:</strong> PUP Student Internship</span>
                  <span><strong>Coverage:</strong> ₱100,000 Group Accident</span>
                </div>
                
                <h4 className="text-center font-bold text-[10px] uppercase text-slate-900 my-4 tracking-wider">CERTIFICATE OF COVERAGE</h4>
                
                <p className="leading-relaxed text-justify text-slate-600 font-light bg-slate-50 p-2.5 rounded border border-slate-200">
                  This certificate verifies that the individual named above is insured under the Group Accident Plan for students undergoing off-campus internships. Coverage is active for the academic year 2025-2026.
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-end border-t pt-4 mt-6">
              <div className="text-[8px] font-mono text-slate-400">{fileName}</div>
              <div className="text-center bg-red-50 text-red-700 font-bold border border-red-200 rounded px-2.5 py-1 rotate-6 text-[9px] uppercase tracking-wider bg-white">
                ACTIVE INSURANCE
              </div>
            </div>
          </div>
        );
      case 'Certificate (Sexual Harassment and Work Ethics)':
        return (
          <div className="border border-slate-300 rounded-lg p-6 bg-white font-sans text-slate-800 shadow-inner relative min-h-[380px] text-[10px] flex flex-col justify-between">
            <div>
              <div className="text-center border-b pb-3 mb-4">
                <h3 className="font-bold text-xs text-[#800000] uppercase tracking-wider">CERTIFICATE OF PARTICIPATION</h3>
                <p className="text-slate-400 text-[8px] mt-0.5">PUP Office of Gender and Development Office & Legal Affairs</p>
              </div>
              <div className="space-y-4 mt-8 text-center">
                <p className="text-slate-500 text-[9px]">This is to certify that</p>
                <h4 className="text-sm font-bold text-slate-800 underline uppercase">{studentName}</h4>
                <p className="text-slate-650 max-w-sm mx-auto mt-2 leading-relaxed">
                  has successfully attended the mandatory seminar on **Sexual Harassment Prevention (Safe Spaces Act) & Workplace Ethics** held on June 15, 2026.
                </p>
              </div>
            </div>
            <div className="flex justify-between items-end border-t pt-4 mt-6">
              <div className="text-[8px] font-mono text-slate-400">{fileName}</div>
              <div className="text-right text-[8px] text-green-700 font-bold bg-green-50 border border-green-200 rounded px-2.5 py-1">
                COMPLIANT / VERIFIED
              </div>
            </div>
          </div>
        );
      case 'SIS grades (1st year to 3rd year)':
        return (
          <div className="border border-slate-300 rounded-lg p-6 bg-white font-sans text-slate-800 shadow-inner min-h-[380px] text-[10px]">
            <div className="text-center border-b pb-3 mb-4">
              <h3 className="font-bold text-[11px] uppercase text-slate-900 leading-tight">STUDENT INFORMATION SYSTEM (SIS) GRADES</h3>
              <p className="text-slate-500 text-[9px] mt-0.5">SIS Evaluation Transcript Copy</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-1 bg-slate-50 p-2 rounded text-[9px] border border-slate-100">
                <div><strong>Student Name:</strong> {studentName}</div>
                <div><strong>Course:</strong> {course}</div>
                <div><strong>GPA:</strong> 1.38 (Excellent)</div>
              </div>
              
              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-[9px] bg-white">
                  <thead>
                    <tr className="bg-slate-100 border-b font-bold text-slate-600 text-left">
                      <th className="p-1.5">Year/Sem</th>
                      <th className="p-1.5">Subject Description</th>
                      <th className="p-1.5 text-center">Grade</th>
                      <th className="p-1.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-600">
                    <tr>
                      <td className="p-1.5">1st Yr - 1st Sem</td>
                      <td className="p-1.5">Introduction to Computing (ITEC 101)</td>
                      <td className="p-1.5 text-center font-semibold">1.25</td>
                      <td className="p-1.5 text-center text-green-600 font-bold">Passed</td>
                    </tr>
                    <tr>
                      <td className="p-1.5">2nd Yr - 2nd Sem</td>
                      <td className="p-1.5">Database Systems (ITEC 203)</td>
                      <td className="p-1.5 text-center font-semibold">1.00</td>
                      <td className="p-1.5 text-center text-green-600 font-bold">Passed</td>
                    </tr>
                    <tr>
                      <td className="p-1.5">3rd Yr - 2nd Sem</td>
                      <td className="p-1.5">Web Development (ITEC 302)</td>
                      <td className="p-1.5 text-center font-semibold">1.50</td>
                      <td className="p-1.5 text-center text-green-600 font-bold">Passed</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="text-[8px] text-slate-400 font-mono mt-12 text-right">
              {fileName}
            </div>
          </div>
        );
      default:
        return (
          <div className="border border-slate-300 rounded-lg p-6 bg-slate-50 font-sans text-slate-800 shadow-inner min-h-[380px] text-center flex flex-col justify-center items-center">
            {reqName === 'Practicum kit (expanded envelope)' ? (
              <Inbox className="h-12 w-12 text-[#800000] mb-2" />
            ) : (
              <CalendarCheck className="h-12 w-12 text-[#800000] mb-2" />
            )}
            <h4 className="font-bold text-sm uppercase text-slate-800">{reqName}</h4>
            <p className="text-slate-500 text-xs mt-1">Physical declaration and coordinator verification.</p>
            <p className="font-mono text-[9px] text-[#800000] mt-6 bg-red-50/50 border border-red-100 px-3 py-1.5 rounded font-bold">
              {fileName}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Pre-OJT Requirements</h1>
          <p className="text-slate-500 text-sm mt-0.5">Submit all documentation required before deployment clearance.</p>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200 -mt-3.5">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-base font-bold text-slate-800">Requirements Checklist</CardTitle>
              <CardDescription>A list of academic and corporate documentation required by the OJT Coordinator.</CardDescription>
            </div>
            <Badge className="bg-red-50 text-[#800000] border-red-100 font-semibold">
              Deployment Stage Lock Active
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
              {student.preOJTRequirements.map((req, idx) => (
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
                        {req.name === 'Practicum kit (expanded envelope)' ? (
                          <Inbox className="h-4 w-4 text-[#800000] shrink-0" />
                        ) : req.name === 'Attendance OJT Orientation' ? (
                          <CalendarCheck className="h-4 w-4 text-[#800000] shrink-0" />
                        ) : (
                          <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                        )}
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
                            {isNonDocumentReq(req.name) ? 'Re-confirm' : 'Re-upload'}
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
                        {req.name === 'Attendance OJT Orientation' ? (
                          <>
                            <CalendarCheck className="h-3.5 w-3.5" />
                            Confirm Attendance
                          </>
                        ) : req.name === 'Practicum kit (expanded envelope)' ? (
                          <>
                            <Inbox className="h-3.5 w-3.5" />
                            Mark Handed Over
                          </>
                        ) : (
                          <>
                            <Upload className="h-3.5 w-3.5" />
                            Upload File
                          </>
                        )}
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

      {/* SINGLE DIALOG FOR FILE UPLOAD AND NON-DOCUMENT CONFIRMATIONS */}
      <Dialog open={uploadDialogOpen} onOpenChange={(open) => {
        if (!open) resetUploadState();
      }}>
        <DialogContent className="sm:max-w-md">
          {selectedReq && isNonDocumentReq(selectedReq) ? (
            // CUSTOM FORM FOR NON-DOCUMENT REQUIREMENTS
            selectedReq === 'Attendance OJT Orientation' ? (
              <form onSubmit={handleOrientationSubmit}>
                <DialogHeader>
                  <DialogTitle className="text-slate-900 font-sans font-bold flex items-center gap-2">
                    <CalendarCheck className="h-5 w-5 text-[#800000]" />
                    Confirm Orientation Attendance
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 font-light text-xs">
                    Please specify the date you attended the mandatory OJT Orientation.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="attendanceDate" className="text-xs font-semibold text-slate-700">Date of Attendance</Label>
                    <Input
                      id="attendanceDate"
                      type="date"
                      value={orientationDate}
                      onChange={(e) => setOrientationDate(e.target.value)}
                      required
                      className="border-slate-200 focus-visible:ring-[#800000]"
                    />
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-[11px] leading-relaxed border border-blue-100 flex gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-blue-600" />
                    <span>Your declaration will be sent to the OJT Coordinator for confirmation and sign-off.</span>
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button type="button" variant="outline" onClick={resetUploadState} className="text-xs hover:bg-slate-100 hover:text-slate-900 border-slate-200 cursor-pointer transition-colors">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#800000] hover:bg-[#6b0000] text-white text-xs font-semibold cursor-pointer transition-colors shadow-sm">
                    Confirm Attendance
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <form onSubmit={handlePracticumKitSubmit}>
                <DialogHeader>
                  <DialogTitle className="text-slate-900 font-sans font-bold flex items-center gap-2">
                    <Inbox className="h-5 w-5 text-[#800000]" />
                    Confirm Practicum Kit Hand-Over
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 font-light text-xs">
                    Confirm you have physically handed over your expanded brown envelope to the OJT coordinator office.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="p-3 bg-amber-50 text-amber-800 rounded-lg text-[11px] leading-relaxed border border-amber-100 flex gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                    <span>Warning: Ensure the envelope contains all physically required forms before marking this as handed over.</span>
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button type="button" variant="outline" onClick={resetUploadState} className="text-xs hover:bg-slate-100 hover:text-slate-900 border-slate-200 cursor-pointer transition-colors">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#800000] hover:bg-[#6b0000] text-white text-xs font-semibold cursor-pointer transition-colors shadow-sm">
                    Confirm Handed Over
                  </Button>
                </DialogFooter>
              </form>
            )
          ) : (
            // DRAG-AND-DROP FILE UPLOADER FOR DOCUMENT REQUIREMENTS
            <form onSubmit={handleUploadSubmit}>
              <DialogHeader>
                <DialogTitle className="text-slate-900 font-sans font-bold">
                  {selectedReq && student.preOJTRequirements.find(r => r.name === selectedReq)?.fileName 
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
          )}
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
