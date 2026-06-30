import React from 'react';
import { Download, FileCheck, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

export interface RequirementFilePreview {
  studentName: string;
  reqName: string;
  fileName: string;
  stage: 'Pre-OJT' | 'During-OJT' | 'Post-OJT' | 'MOA' | 'Portfolio';
}

interface RequirementFilePreviewDialogProps {
  preview: RequirementFilePreview | null;
  onOpenChange: (open: boolean) => void;
}

function getDocumentSummary(preview: RequirementFilePreview) {
  const normalized = preview.reqName.toLowerCase();

  if (normalized.includes('daily time record')) {
    return 'Daily time record copy with rendered hours, dates, and supervisor validation marks.';
  }

  if (normalized.includes('weekly journal')) {
    return 'Weekly accomplishment report with task summary, reflections, and adviser review area.';
  }

  if (normalized.includes('evaluation')) {
    return 'Evaluation document copy with rating fields, comments, signatures, and company verification.';
  }

  if (normalized.includes('completion')) {
    return 'Certificate copy confirming completion of the required internship hours.';
  }

  if (normalized.includes('picture') || normalized.includes('documentation')) {
    return 'Documentation file containing photo evidence and weekly activity captions.';
  }

  return 'Submitted student document copy prepared for adviser verification.';
}

export function RequirementFilePreviewDialog({ preview, onOpenChange }: RequirementFilePreviewDialogProps) {
  if (!preview) return null;

  const summary = getDocumentSummary(preview);

  return (
    <Dialog open={!!preview} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto font-sans">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-[#800000]" />
            Uploaded File Preview
          </DialogTitle>
          <DialogDescription>
            Previewing <span className="font-mono font-semibold text-slate-700">{preview.fileName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">
          <div className="rounded border bg-slate-50 p-4 text-xs space-y-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Student</p>
              <p className="font-bold text-slate-800 mt-1">{preview.studentName}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Requirement</p>
              <p className="font-semibold text-slate-700 mt-1">{preview.reqName}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Stage</p>
              <p className="font-semibold text-slate-700 mt-1">{preview.stage}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 text-[11px] font-bold"
              onClick={() => {
                const blob = new Blob([`${preview.reqName}\n${preview.studentName}\n${preview.fileName}`], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = preview.fileName;
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Download Copy
            </Button>
          </div>

          <div className="bg-slate-100 rounded-lg p-4 overflow-auto">
            <div className="mx-auto bg-white border shadow-sm min-h-[620px] max-w-[520px] p-8 text-slate-900 font-serif">
              <div className="border-b pb-4 mb-6 text-center">
                <p className="text-[10px] uppercase tracking-widest font-sans text-slate-400">Polytechnic University of the Philippines</p>
                <h3 className="text-lg font-bold mt-2">{preview.reqName}</h3>
                <p className="text-xs text-slate-500 mt-1">{preview.stage} Submission</p>
              </div>

              <div className="space-y-4 text-xs leading-6">
                <div className="grid grid-cols-[120px_1fr] gap-2 font-sans">
                  <span className="text-slate-400 font-semibold">Student Name</span>
                  <span className="font-bold">{preview.studentName}</span>
                  <span className="text-slate-400 font-semibold">File Name</span>
                  <span className="font-mono text-[11px]">{preview.fileName}</span>
                  <span className="text-slate-400 font-semibold">Review Status</span>
                  <span>Submitted for adviser verification</span>
                </div>

                <div className="border rounded p-4 bg-slate-50/70 font-sans">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-[#800000] shrink-0 mt-0.5" />
                    <p className="text-slate-650">{summary}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p>This preview represents the uploaded student file currently attached to the requirement queue.</p>
                  <p>The adviser may inspect the file name, student, requirement type, and submission context before approving or requesting revision.</p>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-8 text-center text-[11px] font-sans">
                  <div className="border-t pt-2">Student Signature</div>
                  <div className="border-t pt-2">Adviser Verification</div>
                </div>
              </div>

              <p className="mt-10 text-right text-[9px] font-mono text-slate-400">{preview.fileName}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
