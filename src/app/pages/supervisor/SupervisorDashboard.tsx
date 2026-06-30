import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Users, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supervisorInterns } from '../../data/referenceData';

const attendanceTrendData = [
  { week: 'W1', attendance: 96 },
  { week: 'W2', attendance: 98 },
  { week: 'W3', attendance: 95 },
  { week: 'W4', attendance: 99 },
  { week: 'W5', attendance: 97 },
  { week: 'W6', attendance: 98 },
];

const taskCompletionByIntern = [
  { name: 'Sarah J.', completion: 67 },
  { name: 'David M.', completion: 58 },
  { name: 'Lisa W.', completion: 75 },
];

export function SupervisorDashboard() {
  const avgCompletion = Math.round(
    supervisorInterns.reduce((acc, i) => acc + i.taskCompletion, 0) / supervisorInterns.length
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Supervisor Dashboard</h1>
        <p className="text-slate-600 mt-1">Monitor and manage your interns' progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Interns</CardTitle>
            <Users className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supervisorInterns.length}</div>
            <p className="text-xs text-slate-500">Active internships</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-slate-500">Require review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Task Completion</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCompletion}%</div>
            <p className="text-xs text-slate-500">Across all interns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-slate-500">Below 95% threshold</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[90, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="attendance" stroke="#4f46e5" strokeWidth={2} dot={{ fill: '#4f46e5', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Completion by Intern</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskCompletionByIntern}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="completion" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Interns Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Assigned Interns</CardTitle>
            <Link to="/interns">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supervisorInterns.map((intern) => (
              <div
                key={intern.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium">
                    {intern.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{intern.name}</h4>
                    <p className="text-sm text-slate-500">{intern.studentId} • {intern.university}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-900">
                      {intern.totalHours}/{intern.requiredHours} hrs
                    </p>
                    <p className="text-xs text-slate-500">
                      {Math.round((intern.totalHours / intern.requiredHours) * 100)}% complete
                    </p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-slate-900">{intern.taskCompletion}%</p>
                    <p className="text-xs text-slate-500">Task completion</p>
                  </div>
                  <Badge
                    className={
                      intern.attendanceRate >= 95
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }
                  >
                    {intern.attendanceRate}% Attendance
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Reviews */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pending Reviews</CardTitle>
            <Link to="/reports">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-orange-200 bg-orange-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Sarah Johnson - Week 13 Report</p>
                <p className="text-sm text-slate-600">Submitted 1 day ago</p>
              </div>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">Review</Button>
            </div>
            <div className="flex items-center justify-between p-3 border border-orange-200 bg-orange-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">David Martinez - Week 12 Report</p>
                <p className="text-sm text-slate-600">Submitted 2 days ago</p>
              </div>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">Review</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
