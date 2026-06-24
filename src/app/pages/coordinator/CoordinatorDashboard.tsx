import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { coordinatorStats, departmentHoursData, participationTrendData } from '../../data/mockData';

export function CoordinatorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Coordinator Dashboard</h1>
        <p className="text-slate-600 mt-1">System-wide overview and analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interns</CardTitle>
            <Users className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coordinatorStats.totalInterns}</div>
            <p className="text-xs text-slate-500">Across all programs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coordinatorStats.activePrograms}</div>
            <p className="text-xs text-slate-500">Running this semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours Logged</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coordinatorStats.totalHoursLogged.toLocaleString()}</div>
            <p className="text-xs text-slate-500">Cumulative hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Compliance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coordinatorStats.attendanceCompliance}%</div>
            <p className="text-xs text-slate-500">Above target</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Internship Participation Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={participationTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="students" stroke="#4f46e5" strokeWidth={2} dot={{ fill: '#4f46e5', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hours Logged by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentHoursData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="department" type="category" stroke="#64748b" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="hours" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Program Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Active Internship Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Computer Science Internship', students: 15, completion: 68 },
              { name: 'Engineering Practicum', students: 12, completion: 72 },
              { name: 'Business Administration OJT', students: 8, completion: 65 },
              { name: 'Information Technology Internship', students: 10, completion: 70 },
            ].map((program, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">{program.name}</h4>
                  <p className="text-sm text-slate-500">{program.students} students enrolled</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{program.completion}%</p>
                    <p className="text-xs text-slate-500">Avg completion</p>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden w-24">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${program.completion}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: 'New intern registration', name: 'John Smith', time: '10 minutes ago' },
              { action: 'Weekly report submitted', name: 'Sarah Johnson', time: '1 hour ago' },
              { action: 'Task completion milestone', name: 'David Martinez', time: '2 hours ago' },
              { action: 'Attendance verified', name: 'Lisa Wang', time: '3 hours ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border-l-4 border-l-indigo-600 bg-slate-50 rounded">
                <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  {activity.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                  <p className="text-xs text-slate-500">{activity.name} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
