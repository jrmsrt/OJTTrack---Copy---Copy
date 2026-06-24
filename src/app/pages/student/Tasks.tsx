import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOJT, DailyTask } from '../../context/OJTContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
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
  Edit, 
  Trash, 
  Calendar, 
  Clock, 
  Briefcase, 
  AlertTriangle,
  CheckCircle2,
  FileText,
  Paperclip
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

export function Tasks() {
  const { user } = useAuth();
  const { students, submitDailyTask, updateDailyTask, deleteDailyTask } = useOJT();

  const student = students.find(s => s.studentId === user?.id || s.email === user?.email);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<DailyTask | null>(null);

  // Form states
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeStarted, setTimeStarted] = useState('08:00 AM');
  const [timeEnded, setTimeEnded] = useState('05:00 PM');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [output, setOutput] = useState('');
  const [skillsApplied, setSkillsApplied] = useState('');
  const [problemsEncountered, setProblemsEncountered] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  if (!student) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-red-600">Error</h2>
        <p className="text-slate-600 mt-2">Student record not found.</p>
      </div>
    );
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in the task title and description.");
      return;
    }

    submitDailyTask(student.studentId, {
      date,
      timeStarted,
      timeEnded,
      title,
      description,
      output,
      skillsApplied,
      problemsEncountered,
      attachmentName: attachmentName.trim() ? attachmentName : null
    });

    toast.success("Daily Task Log submitted successfully!");
    setAddDialogOpen(false);
    resetForm();
  };

  const handleEditClick = (task: DailyTask) => {
    setSelectedTask(task);
    setDate(task.date);
    setTimeStarted(task.timeStarted);
    setTimeEnded(task.timeEnded);
    setTitle(task.title);
    setDescription(task.description);
    setOutput(task.output);
    setSkillsApplied(task.skillsApplied);
    setProblemsEncountered(task.problemsEncountered);
    setAttachmentName(task.attachmentName || '');
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    updateDailyTask(student.studentId, {
      ...selectedTask,
      date,
      timeStarted,
      timeEnded,
      title,
      description,
      output,
      skillsApplied,
      problemsEncountered,
      attachmentName: attachmentName.trim() ? attachmentName : null
    });

    toast.success("Daily Task Log updated successfully!");
    setEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteClick = (taskId: string) => {
    if (confirm("Are you sure you want to delete this task log?")) {
      deleteDailyTask(student.studentId, taskId);
      toast.success("Task log entry removed.");
    }
  };

  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setTimeStarted('08:00 AM');
    setTimeEnded('05:00 PM');
    setTitle('');
    setDescription('');
    setOutput('');
    setSkillsApplied('');
    setProblemsEncountered('');
    setAttachmentName('');
    setSelectedTask(null);
  };

  const getStatusBadge = (status: DailyTask['status']) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 gap-1"><CheckCircle2 className="h-3 w-3" /> Approved</Badge>;
      case 'Needs Revision':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 gap-1"><AlertTriangle className="h-3 w-3" /> Needs Revision</Badge>;
      case 'Submitted':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 gap-1"><Clock className="h-3 w-3" /> Submitted</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-slate-200">Draft</Badge>;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Daily Task Log Module</h1>
          <p className="text-slate-500 text-sm mt-0.5">Log accomplishment details, hours rendering, and skills applied daily.</p>
        </div>

        <Dialog open={addDialogOpen} onOpenChange={(open) => {
          setAddDialogOpen(open);
          if(!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-[#800000] hover:bg-[#6b0000] text-white font-bold text-xs h-9 flex items-center gap-1.5 cursor-pointer">
              <Plus className="h-4 w-4" /> Add Daily Task Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleAddSubmit}>
              <DialogHeader>
                <DialogTitle>Add Daily Accomplishment Entry</DialogTitle>
                <DialogDescription>Submit your work hours details and outputs for adviser signature check.</DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="logDate">Date</Label>
                    <Input id="logDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="start">Time Started</Label>
                    <Input id="start" placeholder="e.g. 08:00 AM" value={timeStarted} onChange={(e) => setTimeStarted(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="end">Time Ended</Label>
                    <Input id="end" placeholder="e.g. 05:00 PM" value={timeEnded} onChange={(e) => setTimeEnded(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="taskTitle">Task Title</Label>
                  <Input id="taskTitle" placeholder="e.g. Frontend navigation adjustments" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="taskDesc">Task Description</Label>
                  <Textarea id="taskDesc" placeholder="Explain details of duties performed..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="appliedSkills">Skills Applied</Label>
                    <Input id="appliedSkills" placeholder="e.g. CSS flexbox, React hooks" value={skillsApplied} onChange={(e) => setSkillsApplied(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="accomplishment">Output / Accomplishment</Label>
                    <Input id="accomplishment" placeholder="e.g. Mapped navigation sidebar" value={output} onChange={(e) => setOutput(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="problems">Problems Encountered</Label>
                  <Input id="problems" placeholder="Describe any roadblocks, or type None" value={problemsEncountered} onChange={(e) => setProblemsEncountered(e.target.value)} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="attachment">Supporting Attachment File Name</Label>
                  <div className="relative">
                    <Input id="attachment" placeholder="e.g. mockup_screenshot.png" value={attachmentName} onChange={(e) => setAttachmentName(e.target.value)} className="pr-10" />
                    <Paperclip className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#800000] hover:bg-[#6b0000] text-white">Submit Entry</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task Log Table */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-850">Accomplishment Log History</CardTitle>
          <CardDescription>Daily task sheets logged by the intern.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {student.dailyTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-450 text-sm">
              No daily logs submitted yet. Click "Add Daily Task Entry" to submit one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Log Date</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Hours</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Task Description</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Output / Deliverable</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase w-32">Status</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase text-center w-28">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {student.dailyTasks.map((task) => (
                  <TableRow key={task.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block text-xs">{task.date}</span>
                      <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {task.timeStarted} - {task.timeEnded}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 font-medium text-slate-600 text-xs">
                      9.0 hrs
                    </TableCell>
                    <TableCell className="py-3.5 px-4 max-w-xs">
                      <span className="font-bold text-slate-800 text-xs block">{task.title}</span>
                      <p className="text-xs text-slate-500 font-light line-clamp-2 mt-0.5">{task.description}</p>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                      {task.output || '—'}
                      {task.attachmentName && (
                        <span className="text-[10px] text-[#800000] block font-medium mt-1 flex items-center gap-1">
                          <Paperclip className="h-3 w-3 shrink-0" />
                          {task.attachmentName}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 font-semibold text-xs">
                      {getStatusBadge(task.status)}
                      {task.remarks && (
                        <p className="text-[10px] text-amber-700 font-light mt-1 bg-amber-50 p-1.5 rounded border border-amber-100">
                          {task.remarks}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-center">
                      <div className="flex justify-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(task)}
                          disabled={task.status === 'Approved'}
                          className="h-8 w-8 text-slate-600 hover:text-[#800000] hover:bg-red-50 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(task.id)}
                          disabled={task.status === 'Approved'}
                          className="h-8 w-8 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {selectedTask && (
        <Dialog open={editDialogOpen} onOpenChange={(open) => {
          setEditDialogOpen(open);
          if(!open) resetForm();
        }}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto font-sans">
            <form onSubmit={handleEditSubmit}>
              <DialogHeader>
                <DialogTitle>Edit Daily Log Entry</DialogTitle>
                <DialogDescription>Modify logged activity logs for {selectedTask.date}</DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="editLogDate">Date</Label>
                    <Input id="editLogDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="editStart">Time Started</Label>
                    <Input id="editStart" value={timeStarted} onChange={(e) => setTimeStarted(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="editEnd">Time Ended</Label>
                    <Input id="editEnd" value={timeEnded} onChange={(e) => setTimeEnded(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="editTaskTitle">Task Title</Label>
                  <Input id="editTaskTitle" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="editTaskDesc">Task Description</Label>
                  <Textarea id="editTaskDesc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="editAppliedSkills">Skills Applied</Label>
                    <Input id="editAppliedSkills" value={skillsApplied} onChange={(e) => setSkillsApplied(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="editAccomplishment">Output / Accomplishment</Label>
                    <Input id="editAccomplishment" value={output} onChange={(e) => setOutput(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="editProblems">Problems Encountered</Label>
                  <Input id="editProblems" value={problemsEncountered} onChange={(e) => setProblemsEncountered(e.target.value)} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="editAttachment">Supporting Attachment File Name</Label>
                  <div className="relative">
                    <Input id="editAttachment" value={attachmentName} onChange={(e) => setAttachmentName(e.target.value)} className="pr-10" />
                    <Paperclip className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#800000] hover:bg-[#6b0000] text-white">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
