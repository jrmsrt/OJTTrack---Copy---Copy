import React from 'react';
import { Badge } from '../ui/badge';
import { type RequirementSubmissionStatus } from '../../data/mockData';

const requirementStatusClasses: Record<RequirementSubmissionStatus, string> = {
  'Not Submitted': 'bg-slate-100 text-slate-700 hover:bg-slate-100',
  Submitted: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100',
  'Under Review': 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  Approved: 'bg-green-100 text-green-800 hover:bg-green-100',
  Rejected: 'bg-red-100 text-red-800 hover:bg-red-100',
  'Needs Revision': 'bg-orange-100 text-orange-800 hover:bg-orange-100',
};

export function RequirementStatusBadge({ status }: { status: RequirementSubmissionStatus }) {
  return <Badge className={requirementStatusClasses[status]}>{status}</Badge>;
}
