import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Plus, Paperclip } from 'lucide-react';
import { studentTasks, supervisorInterns } from '../../data/mockData';

export function TaskAssignment() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const tasksByStatus = {
    assigned: studentTasks.filter((t) => t.status === 'assigned'),
    'in-progress': studentTasks.filter((t) => t.status === 'in-progress'),
    completed: studentTasks.filter((t) => t.status === 'completed'),
    reviewed: [] as typeof studentTasks,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Task Management</h1>
          <p className="text-slate-600 mt-1">Assign and track tasks for your interns</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
              <Plus className="h-4 w-4" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Assign a new task to an intern</DialogDescription>
            </DialogHeader>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Task Title</Label>
                <Input id="task-title" placeholder="Enter task title" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-description">Description</Label>
                <Textarea
                  id="task-description"
                  placeholder="Provide detailed task description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assign-to">Assign To</Label>
                  <Select>
                    <SelectTrigger id="assign-to">
                      <SelectValue placeholder="Select intern" />
                    </SelectTrigger>
                    <SelectContent>
                      {supervisorInterns.map((intern) => (
                        <SelectItem key={intern.id} value={intern.id.toString()}>
                          {intern.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input id="deadline" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="documentation">Documentation</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attachments">Attachments (Optional)</Label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                  <Paperclip className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Task requirements, specifications, or reference materials
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                  Create Task
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(tasksByStatus).map(([status, tasks]) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium capitalize flex items-center gap-2">
                {status.replace('-', ' ')}
                <Badge variant="outline">{tasks.length}</Badge>
              </h3>
            </div>
            <div className="space-y-3">
              {tasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <Badge
                        variant="outline"
                        className={
                          task.priority === 'high'
                            ? 'border-red-300 text-red-700'
                            : 'border-orange-300 text-orange-700'
                        }
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                      {task.description}
                    </p>
                    <div className="text-xs text-slate-500">
                      <p>Due: {task.deadline}</p>
                      <p className="mt-1">Assigned to: {task.supervisor}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {tasks.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-sm text-slate-500">No tasks</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
