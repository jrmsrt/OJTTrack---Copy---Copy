import React, { useState } from 'react';
import { useOJT } from '../../context/OJTContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Download, 
  ChevronRight,
  BookOpen,
  Lock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function PortfolioBuilder() {
  const { user } = useAuth();
  const { students, submitPortfolio } = useOJT();

  const [generating, setGenerating] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);

  const student = students.find(s => s.studentId === user?.id || s.email === user?.email);

  if (!student) {
    return (
      <div className="p-6 text-center font-sans">
        <h2 className="text-xl font-bold text-red-600">Error</h2>
        <p className="text-slate-600 mt-2">Student record not found.</p>
      </div>
    );
  }

  // Check approval of all documents
  const preApproved = student.preOJTRequirements.every(r => r.status === 'Approved');
  const moaApproved = student.moaState.status === 'Approved';
  const duringApproved = student.duringOJTRequirements.every(r => r.status === 'Approved');
  const postApproved = student.postOJTRequirements.every(r => r.status === 'Approved');
  
  const allClear = preApproved && moaApproved && duringApproved && postApproved;

  // Compile missing items
  const missingRequirements: string[] = [];
  if (!preApproved) {
    student.preOJTRequirements.forEach(r => {
      if (r.status !== 'Approved') missingRequirements.push(`Pre-OJT: ${r.name}`);
    });
  }
  if (!moaApproved) {
    missingRequirements.push("Pre-OJT: Approved Memorandum of Agreement (MOA)");
  }
  if (!duringApproved) {
    student.duringOJTRequirements.forEach(r => {
      if (r.status !== 'Approved') missingRequirements.push(`During-OJT: ${r.name}`);
    });
  }
  if (!postApproved) {
    student.postOJTRequirements.forEach(r => {
      if (r.status !== 'Approved') missingRequirements.push(`Post-OJT: ${r.name}`);
    });
  }

  const handleGeneratePortfolio = () => {
    if (!allClear) {
      toast.error("Generation Locked", {
        description: "You must resolve all missing checklists before compiling."
      });
      return;
    }

    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setDownloadReady(true);
      submitPortfolio(student.studentId);
      
      // Celebrate!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      toast.success("OJT Portfolio Compiled Successfully!", {
        description: "Official documents structured. Scroll to preview or download."
      });
    }, 2500);
  };

  const handleDownload = () => {
    toast.success("Downloading compiled PDF Portfolio...", {
      description: `Saved: ${student.name.replace(/ /g, '_')}_OJT_Portfolio.pdf`
    });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Portfolio Builder</h1>
          <p className="text-slate-500 text-sm mt-0.5">Assemble and generate your final OJT compilation report with official appendices.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Checklist and Verification */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-800">Portfolio Status</CardTitle>
              <CardDescription>System checks on requirements approval.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-xs font-semibold">
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border">
                  <span className="text-slate-600">Pre-OJT Clearances</span>
                  {preApproved && moaApproved ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Incomplete</Badge>
                  )}
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border">
                  <span className="text-slate-600">During-OJT Clearances</span>
                  {duringApproved ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Incomplete</Badge>
                  )}
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border">
                  <span className="text-slate-600">Post-OJT Clearances</span>
                  {postApproved ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Incomplete</Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <Button
                  onClick={handleGeneratePortfolio}
                  disabled={!allClear || generating}
                  className="w-full bg-[#800000] hover:bg-[#6b0000] text-white font-bold py-2.5 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  {generating ? (
                    <>Compiling Chapters...</>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Portfolio
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleDownload}
                  disabled={!downloadReady && !student.portfolioApproved}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <Download className="h-4 w-4" />
                  Download Compiled PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Missing Indicator panel */}
          {missingRequirements.length > 0 && (
            <Card className="border-red-200 bg-red-50/20 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-1.5 text-red-700 font-bold text-sm">
                  <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                  <h4>Missing Requirements Indicator</h4>
                </div>
                <CardDescription className="text-xs text-red-600">You must secure Adviser approval for these files before downloading.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 font-light max-h-48 overflow-y-auto">
                  {missingRequirements.map((item, index) => (
                    <li key={index} className="leading-tight">{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {student.portfolioApproved && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs flex items-start gap-1.5 font-bold">
              <CheckCircle2 className="h-4.5 w-4.5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p>Adviser Clearance Endorsed</p>
                <p className="text-[10px] text-slate-500 font-normal mt-0.5">remarks: "{student.portfolioRemarks || 'Excellent compilation'}"</p>
              </div>
            </div>
          )}
        </div>

        {/* Portfolio Table of Contents Preview */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-800">Portfolio Structure & Table of Contents</CardTitle>
              <CardDescription>Visual preview of the compiled chapter outlines.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 text-xs text-slate-700 space-y-4">
              <div className="border border-slate-200 rounded-lg p-5 font-serif space-y-4 max-w-xl mx-auto bg-white">
                <h3 className="text-center font-bold text-sm uppercase tracking-tight text-slate-900 border-b border-slate-900 pb-2">TABLE OF CONTENTS</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline font-bold font-sans text-[10px] text-[#800000] uppercase mt-2">
                    <span>OJT Compilation Chapters</span>
                    <span>Page</span>
                  </div>
                  
                  <div className="flex justify-between items-baseline">
                    <span>Title Page</span>
                    <span className="border-b border-dotted border-slate-400 flex-grow mx-2 h-1"></span>
                    <span>i</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span>Approval Sheet (Adviser Verification)</span>
                    <span className="border-b border-dotted border-slate-400 flex-grow mx-2 h-1"></span>
                    <span>ii</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span>Acknowledgment & Dedication</span>
                    <span className="border-b border-dotted border-slate-400 flex-grow mx-2 h-1"></span>
                    <span>iii</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span>Introduction & OJT Objectives</span>
                    <span className="border-b border-dotted border-slate-400 flex-grow mx-2 h-1"></span>
                    <span>1</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span>Company Host Profile</span>
                    <span className="border-b border-dotted border-slate-400 flex-grow mx-2 h-1"></span>
                    <span>5</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span>Weekly Accomplishment Journal Logs</span>
                    <span className="border-b border-dotted border-slate-400 flex-grow mx-2 h-1"></span>
                    <span>10</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span>Student Self-Assessment & Reflections</span>
                    <span className="border-b border-dotted border-slate-400 flex-grow mx-2 h-1"></span>
                    <span>25</span>
                  </div>
                  
                  <div className="flex justify-between items-baseline font-bold font-sans text-[10px] text-[#800000] uppercase mt-3">
                    <span>Appendices</span>
                    <span>Page</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span>Appendix A: Midterm and Final Evaluation Forms</span>
                    <span className="border-b border-dotted border-slate-400 flex-grow mx-2 h-1"></span>
                    <span>30</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span>Appendix B: Consent Slips & Endorsement Letter</span>
                    <span className="border-b border-dotted border-slate-400 flex-grow mx-2 h-1"></span>
                    <span>35</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span>Appendix C: Signed Memorandum of Agreement (MOA)</span>
                    <span className="border-b border-dotted border-slate-400 flex-grow mx-2 h-1"></span>
                    <span>42</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span>Appendix D: Daily Time Records (DTR Log Sheets)</span>
                    <span className="border-b border-dotted border-slate-400 flex-grow mx-2 h-1"></span>
                    <span>50</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span>Appendix E: Certificate of Completion & Clearances</span>
                    <span className="border-b border-dotted border-slate-400 flex-grow mx-2 h-1"></span>
                    <span>58</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
