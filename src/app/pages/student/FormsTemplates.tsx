import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import {
  FileText,
  ExternalLink,
  Info,
  AlertCircle,
  Download,
  FileCheck,
  ChevronRight
} from 'lucide-react';

export function FormsTemplates() {
  return (
    <div className="space-y-4 w-full max-w-[1400px] mx-auto font-sans">
      {/* Title block */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Forms and Templates</h1>
        <p className="text-slate-550 text-sm md:text-base mt-1">
          Open official template links here. Submit completed requirements in the deployment compliance area.
        </p>
      </div>

      {/* Main warning note */}
      <Alert className="border-blue-200 bg-blue-50/50 p-4">
        <Info className="h-5 w-5 text-blue-700 mt-0.5" />
        <AlertTitle className="text-blue-950 font-bold text-sm uppercase tracking-wider">Download Instructions</AlertTitle>
        <AlertDescription className="text-blue-900 text-sm mt-1.5 leading-relaxed">
          All forms should be directly downloaded in your device (pc/laptop). <strong>Do not edit the file directly in the google doc.</strong>
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {/* Subtitle / Intro copy */}
        <p className="text-sm text-slate-650 leading-relaxed">
          Click the specific button links below to access OJT forms and templates you need to accomplish. Specific form and template has specific instructions included. Kindly read the instructions carefully.
        </p>

        {/* 1. MOA CARD */}
        <Card className="shadow-sm border-slate-200 overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-105 pb-1.5">
            <CardTitle className="text-base font-bold text-[#800000] flex items-center gap-2">
              <FileText className="h-5 w-5 shrink-0" />
              Memorandum of Agreement (MOA) Template
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-1.5 space-y-3">
            <p className="text-sm text-slate-650 leading-relaxed text-justify">
              To proceed with your Memorandum of Agreement (MOA), click the MOA template tab. Within the template, carefully review and modify all fields highlighted in yellow, ensuring they accurately reflect the specifics of your Host Training Establishment (HTE). After completing these edits, submit the revised draft to your HTE for their review and approval. Once the HTE has confirmed their satisfaction with the draft MOA, the next step is to send a soft copy of the document in Word file format to your OJT/Internship adviser. Your adviser will then endorse the MOA to the OJT Coordinator for endorsement to University Legal Counsel Office for review.
            </p>

            <div className="p-4 bg-amber-50 text-amber-800 rounded-lg text-sm leading-relaxed border border-amber-100">
              <span className="font-bold text-amber-900 block mb-1">Note:</span>
              Please ensure that if your Host Training Establishment (HTE) is a private entity, you must attach a copy of SEC Certificate of Incorporation (for corporations) or DTI Certificate (for sole proprietorships). The University Legal Counsel Office requires this attachment and will be unable to proceed with the review of your MOA without it. Government agencies are exempt from this requirement and do not need to provide this attachment.
            </div>

            <div className="pt-1.5">
              <Button asChild className="bg-[#800000] hover:bg-[#6b0000] text-white text-sm font-semibold px-5 py-2.5 h-10 cursor-pointer transition-colors shadow-sm">
                <a
                  href="https://docs.google.com/document/d/1A_3zSLiUpLxNSmEYj03WWhszT1_W7rPb/edit?usp=sharing&ouid=108649410443671808721&rtpof=true&sd=true"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5"
                >
                  <Download className="h-4 w-4" />
                  MOA Template
                  <ExternalLink className="h-3.5 w-3.5 ml-0.5" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 2. PRE-OJT TEMPLATES */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-105 pb-1.5">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-[#800000]" />
              Pre-OJT Templates and Forms
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-1.5 space-y-3.5">
            <p className="text-sm text-slate-500">
              Included in this are the templates and forms OJT student needs to comply before the start of OJT:
            </p>

            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-[#800000]" />
                <a 
                  href="https://drive.google.com/file/d/1cytqwLtfoy1hTMAtQQEQBgbxMOHDgK_f/view?usp=drive_link"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-650 hover:text-[#800000] hover:underline flex items-center gap-1 font-medium cursor-pointer transition-colors"
                >
                  Pre-OJT Requirements Checklist
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </a>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-[#800000]" />
                <a
                  href="https://docs.google.com/document/d/1Tlob2HvS0RhAaZwYQszSypwBV8jndk8w/edit?usp=sharing&ouid=108649410443671808721&rtpof=true&sd=true"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-650 hover:text-[#800000] hover:underline flex items-center gap-1 font-medium cursor-pointer transition-colors"
                >
                  Template for Consent Form
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </a>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-[#800000]" />
                <a
                  href="https://docs.google.com/document/d/1urYpXNmm3FEqohvttEHpibtJVAdPUHUR/edit?usp=sharing&ouid=108649410443671808721&rtpof=true&sd=true"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-650 hover:text-[#800000] hover:underline flex items-center gap-1 font-medium cursor-pointer transition-colors"
                >
                  Template for Internship Agreement
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </a>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-[#800000]" />
                <a
                  href="https://docs.google.com/document/d/1stp4vDdC3jdBDrE-paRJK3D3A5rIj_YM/edit?usp=sharing&ouid=108649410443671808721&rtpof=true&sd=true"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-650 hover:text-[#800000] hover:underline flex items-center gap-1 font-medium cursor-pointer transition-colors"
                >
                  Template for Endorsement/Recommendation Letter
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </a>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-[#800000]" />
                <a
                  href="https://docs.google.com/document/d/1qFO7wjDSz4X60fj-bbWM7DLnIK28Ebc2/edit?usp=sharing&ouid=108649410443671808721&rtpof=true&sd=true"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-650 hover:text-[#800000] hover:underline flex items-center gap-1 font-medium cursor-pointer transition-colors"
                >
                  Template Letter for Practicum Plan
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </a>
              </li>
            </ul>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-550 italic flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-[#800000] shrink-0" />
              <span>Note: Yellow highlight should be removed once appropriate details are encoded before finalization and printing.</span>
            </div>
          </CardContent>
        </Card>

        {/* 3. DURING OJT TEMPLATES */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-105 pb-1.5">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-[#800000]" />
              During OJT Templates and Forms
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-1.5 space-y-3.5">
            <p className="text-sm text-slate-500">
              Use these templates while logging hours and reporting weekly progress. Included in this are the templates and forms OJT student needs to comply while OJT is on-going:
            </p>

            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-[#800000]" />
                <a
                  href="https://docs.google.com/document/d/1XzumsAU-vdbzNSx5PqMAi8IlwotT8Wyd/edit?usp=sharing&ouid=108649410443671808721&rtpof=true&sd=true"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-650 hover:text-[#800000] hover:underline flex items-center gap-1 font-medium cursor-pointer transition-colors"
                >
                  Template for Internship Weekly Journal Report
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </a>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-[#800000]" />
                <a
                  href="https://docs.google.com/document/d/1BlNjqPliq7w4IvGHApA7Y9Wf0cZUEuyv/edit?usp=sharing&ouid=108649410443671808721&rtpof=true&sd=true"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-650 hover:text-[#800000] hover:underline flex items-center gap-1 font-medium cursor-pointer transition-colors"
                >
                  Template for Daily Time Record (DTR)
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </a>
              </li>
            </ul>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-550 italic flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-[#800000] shrink-0" />
              <span>Note: Yellow highlight should be removed once appropriate details are encoded before finalization and printing.</span>
            </div>
          </CardContent>
        </Card>

        {/* 4. POST OJT TEMPLATES */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-105 pb-1.5">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-[#800000]" />
              Post-OJT Templates and Forms
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-1.5 space-y-3.5">
            <p className="text-sm text-slate-500">
              These documents are required after finishing the internship. Included in this are the templates and forms OJT student needs to comply after OJT:
            </p>

            <ul className="space-y-3.5 text-sm">
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-[#800000]" />
                <a
                  href="https://docs.google.com/document/d/1y70ljUvnhhcuphVlmu7flycEmHz0J8DM/edit?usp=sharing&ouid=108649410443671808721&rtpof=true&sd=true"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-650 hover:text-[#800000] hover:underline flex items-center gap-1 font-medium cursor-pointer transition-colors"
                >
                  Evaluation form for HTE
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </a>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-[#800000]" />
                <a
                  href="https://docs.google.com/document/d/1rJV55UVuZgAEcioWRfeHRtC4vWjs_Kn5/edit?usp=sharing&ouid=108649410443671808721&rtpof=true&sd=true"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-650 hover:text-[#800000] hover:underline flex items-center gap-1 font-medium cursor-pointer transition-colors"
                >
                  Evaluation form for OJT Student
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </a>
              </li>

              {/* Sub-list for supervisor evaluation */}
              <li className="space-y-2 pl-5 border-l-2 border-slate-250">
                <span className="font-semibold text-slate-750 text-xs block">Evaluation form for OJT Supervisor:</span>
                <div className="flex gap-4">
                  <a
                    href="https://docs.google.com/document/d/1IxNeRF1LN-2OHjGWgjjW4ByBUXlygli0/edit?usp=sharing&ouid=108649410443671808721&rtpof=true&sd=true"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#800000] hover:underline flex items-center gap-1 font-bold text-sm cursor-pointer transition-colors"
                  >
                    BSIT
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href="https://docs.google.com/document/d/1z7oW3u81_23HgmuQKaymbT8mIWesZuKU/edit?usp=sharing&ouid=108649410443671808721&rtpof=true&sd=true"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#800000] hover:underline flex items-center gap-1 font-bold text-sm cursor-pointer transition-colors"
                  >
                    BSOA
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-[#800000]" />
                <a 
                  href="https://docs.google.com/document/d/1wMzLb6Nm65-mRxLc0GdfSJesnXZ5f7aS/edit?usp=sharing&ouid=108649410443671808721&rtpof=true&sd=true"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-650 hover:text-[#800000] hover:underline flex items-center gap-1 font-medium cursor-pointer transition-colors"
                >
                  Template for Self-Reflection
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </a>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-[#800000]" />
                <a 
                  href="https://docs.google.com/document/d/1ipDpySKQK5TrdY9ymSGlRcrkK6Qc8S6C/edit?usp=sharing&ouid=108649410443671808721&rtpof=true&sd=true"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-650 hover:text-[#800000] hover:underline flex items-center gap-1 font-medium cursor-pointer transition-colors"
                >
                  Template for Reflective Journal
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </a>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-[#800000]" />
                <a 
                  href="https://docs.google.com/document/d/1WGtNJmNtuu8aSH2p7ZMUKFvlJ3JifDzM/edit?usp=sharing&ouid=108649410443671808721&rtpof=true&sd=true"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-650 hover:text-[#800000] hover:underline flex items-center gap-1 font-medium cursor-pointer transition-colors"
                >
                  Template for Portfolio
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </a>
              </li>
            </ul>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-550 italic flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-[#800000] shrink-0" />
              <span>Note: Yellow highlight should be removed once appropriate details are encoded before finalization and printing.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
