import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ShieldCheck } from 'lucide-react';
import { deploymentRequirementStatus, type DeploymentStatus } from '../../data/mockData';

const statusClasses: Record<DeploymentStatus, string> = {
  'Not Started': 'bg-slate-100 text-slate-700 hover:bg-slate-100',
  'In Progress': 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  Submitted: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100',
  'Under Review': 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  Approved: 'bg-green-100 text-green-800 hover:bg-green-100',
  'Needs Revision': 'bg-red-100 text-red-800 hover:bg-red-100',
  Cleared: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
};

export function StatusBadge({ status }: { status: DeploymentStatus }) {
  return <Badge className={statusClasses[status]}>{status}</Badge>;
}

export function DeploymentStatusWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Deployment Requirement Status</CardTitle>
          <p className="text-sm text-slate-500 mt-1">Template access is separate from requirement submission.</p>
        </div>
        <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
          <ShieldCheck className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
          {deploymentRequirementStatus.map((item) => (
            <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-sm text-slate-600 min-h-10">{item.label}</p>
              <div className="mt-3">
                <StatusBadge status={item.status} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
