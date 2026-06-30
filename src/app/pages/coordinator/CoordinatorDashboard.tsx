import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Clock, TrendingUp, CheckCircle, Calendar, FileText, Bell } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { coordinatorStats, departmentHoursData, participationTrendData } from '../../data/referenceData';

export function CoordinatorDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 font-sans">
      {/* Coordinator Welcome */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider">Administrator Portal</span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1">Hello, Director {user?.name}!</h1>
          <p className="text-slate-355 text-sm mt-1 font-light">
            System-wide overview and compliance analytics.
          </p>
        </div>
        <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/20 text-xs">
          <p className="text-slate-355">Academic Role:</p>
          <p className="font-bold text-slate-100 text-sm mt-0.5">OJT Placement Coordinator</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              Total Interns
              <Users className="h-4.5 w-4.5 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{coordinatorStats.totalInterns}</div>
            <p className="text-xs text-slate-500 mt-4 font-medium">Across all programs</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              Active Programs
              <CheckCircle className="h-4.5 w-4.5 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{coordinatorStats.activePrograms}</div>
            <p className="text-xs text-slate-500 mt-4 font-medium">Running this semester</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              Total Hours Logged
              <Clock className="h-4.5 w-4.5 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{coordinatorStats.totalHoursLogged.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-4 font-medium">Cumulative hours</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              Attendance Compliance
              <TrendingUp className="h-4.5 w-4.5 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{coordinatorStats.attendanceCompliance}%</div>
            <p className="text-xs text-slate-500 mt-4 font-medium">Above target</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800">Internship Participation Trend</CardTitle>
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
                <Line type="monotone" dataKey="students" stroke="#800000" strokeWidth={2} dot={{ fill: '#800000', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800">Hours Logged by Department</CardTitle>
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
                <Bar dataKey="hours" fill="#D4AF37" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Program Overview */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-800">Active Internship Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Computer Science Internship', students: 15, completion: 68 },
              { name: 'Engineering Practicum', students: 12, completion: 72 },
              { name: 'Business Administration OJT', students: 8, completion: 65 },
              { name: 'Information Technology Internship', students: 10, completion: 70 },
            ].map((program, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 text-sm">{program.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{program.students} students enrolled</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">{program.completion}%</p>
                    <p className="text-[10px] text-slate-400 font-medium">Avg completion</p>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden w-24">
                    <div
                      className="h-full bg-[#800000] rounded-full"
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
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-800">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: 'New intern registration', name: 'John Smith', time: '10 minutes ago' },
              { action: 'Weekly report submitted', name: 'Sarah Johnson', time: '1 hour ago' },
              { action: 'Task completion milestone', name: 'David Martinez', time: '2 hours ago' },
              { action: 'Attendance verified', name: 'Lisa Wang', time: '3 hours ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border-l-4 border-l-[#800000] bg-slate-50/55 rounded-lg">
                <div className="h-9 w-9 rounded-full bg-red-50 text-[#800000] font-bold text-xs flex items-center justify-center border border-red-100">
                  {activity.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-800">{activity.action}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{activity.name} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
