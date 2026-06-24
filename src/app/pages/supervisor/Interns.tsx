import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Search, Eye, Clock, CheckSquare, TrendingUp } from 'lucide-react';
import { supervisorInterns, attendanceHistory, studentTasks, progressReports } from '../../data/mockData';

export function Interns() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIntern, setSelectedIntern] = useState<typeof supervisorInterns[0] | null>(null);

  const filteredInterns = supervisorInterns.filter((intern) =>
    intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intern.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Interns Management</h1>
          <p className="text-slate-600 mt-1">Monitor and manage your assigned interns</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search interns..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Interns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Student Name</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>University</TableHead>
                    <TableHead>Hours Progress</TableHead>
                    <TableHead>Task Completion</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInterns.map((intern) => (
                    <TableRow key={intern.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium">
                            {intern.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-medium">{intern.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{intern.studentId}</TableCell>
                      <TableCell>{intern.university}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {intern.totalHours}/{intern.requiredHours} hrs
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden w-24">
                            <div
                              className="h-full bg-indigo-600 rounded-full"
                              style={{ width: `${(intern.totalHours / intern.requiredHours) * 100}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{intern.taskCompletion}%</span>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden w-16">
                            <div
                              className="h-full bg-green-600 rounded-full"
                              style={{ width: `${intern.taskCompletion}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            intern.attendanceRate >= 95
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {intern.attendanceRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedIntern(intern)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Intern Detail Dialog */}
      <Dialog open={!!selectedIntern} onOpenChange={() => setSelectedIntern(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Intern Profile - {selectedIntern?.name}</DialogTitle>
            <DialogDescription>{selectedIntern?.studentId}</DialogDescription>
          </DialogHeader>
          {selectedIntern && (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Total Hours</p>
                          <p className="text-xl font-bold">{selectedIntern.totalHours} hrs</p>
                        </div>
                        <Clock className="h-8 w-8 text-indigo-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Task Completion</p>
                          <p className="text-xl font-bold">{selectedIntern.taskCompletion}%</p>
                        </div>
                        <CheckSquare className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Attendance Rate</p>
                          <p className="text-xl font-bold">{selectedIntern.attendanceRate}%</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600">University</p>
                      <p className="font-medium">{selectedIntern.university}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Company</p>
                      <p className="font-medium">{selectedIntern.company}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Required Hours</p>
                      <p className="font-medium">{selectedIntern.requiredHours} hours</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Status</p>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attendance" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead>Date</TableHead>
                      <TableHead>Time In</TableHead>
                      <TableHead>Time Out</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.timeIn}</TableCell>
                        <TableCell>{record.timeOut}</TableCell>
                        <TableCell>{record.hours} hrs</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              record.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-orange-100 text-orange-800'
                            }
                          >
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="tasks" className="space-y-4">
                {studentTasks.map((task) => (
                  <Card key={task.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{task.title}</h4>
                        <Badge
                          className={
                            task.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : task.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-800'
                          }
                        >
                          {task.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{task.description}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Due: {task.deadline}</span>
                        <Badge variant="outline" className={task.priority === 'high' ? 'border-red-300 text-red-700' : ''}>
                          {task.priority}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                {progressReports.map((report) => (
                  <Card key={report.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Week {report.week}</CardTitle>
                        <Badge className={report.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                          {report.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <p className="text-slate-600">Accomplished:</p>
                        <p className="text-slate-900">{report.tasksAccomplished}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Skills Learned:</p>
                        <p className="text-slate-900">{report.skillsLearned}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
