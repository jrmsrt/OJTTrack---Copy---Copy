import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { FileText, Plus, CheckCircle, Clock, MessageSquare, Paperclip } from 'lucide-react';
import { progressReports } from '../../data/mockData';

export function Progress() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Progress Reports</h1>
          <p className="text-slate-600 mt-1">Submit and track your weekly progress reports</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
              <Plus className="h-4 w-4" />
              Submit New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submit Weekly Progress Report</DialogTitle>
              <DialogDescription>Fill in your weekly accomplishments and progress</DialogDescription>
            </DialogHeader>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="week">Week Number</Label>
                <Input id="week" type="number" placeholder="13" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accomplished">Tasks Accomplished</Label>
                <Textarea
                  id="accomplished"
                  placeholder="List all tasks you completed this week..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills Learned</Label>
                <Textarea
                  id="skills"
                  placeholder="What new skills or technologies did you learn?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenges">Challenges Encountered</Label>
                <Textarea
                  id="challenges"
                  placeholder="Any difficulties or obstacles you faced?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours">Hours Worked</Label>
                <Input id="hours" type="number" placeholder="40" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="attachments">Attachments (Optional)</Label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                  <Paperclip className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Screenshots, documents, or other evidence
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                  Submit Report
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Total Reports</div>
                <div className="text-2xl font-bold">12</div>
              </div>
              <FileText className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Approved</div>
                <div className="text-2xl font-bold text-green-600">10</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Pending</div>
                <div className="text-2xl font-bold text-orange-600">2</div>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {progressReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Week {report.week} Progress Report</CardTitle>
                <Badge
                  className={
                    report.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }
                >
                  {report.status}
                </Badge>
              </div>
              <p className="text-sm text-slate-500">Submitted on {report.dateSubmitted}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-700">Tasks Accomplished</Label>
                  <p className="text-sm text-slate-600">{report.tasksAccomplished}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Skills Learned</Label>
                  <p className="text-sm text-slate-600">{report.skillsLearned}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Challenges</Label>
                  <p className="text-sm text-slate-600">{report.challenges}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Hours Worked</Label>
                  <p className="text-sm text-slate-600">{report.hoursWorked} hours</p>
                </div>
              </div>

              {report.supervisorComments && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-green-900 mb-1">Supervisor Feedback</p>
                      <p className="text-sm text-green-800">{report.supervisorComments}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {progressReports.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-medium text-slate-900 mb-2">No Progress Reports Yet</h3>
            <p className="text-slate-600 mb-4">Submit your first weekly progress report to get started.</p>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsDialogOpen(true)}>
              Submit Report
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
