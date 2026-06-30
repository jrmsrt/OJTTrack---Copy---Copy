import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { LandingPage } from './pages/LandingPage';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { EmailVerifiedSuccess, VerificationExpired, VerifyEmail } from './pages/auth/EmailVerification';
import { OtpVerification } from './pages/auth/OtpVerification';
import { PasswordDecision } from './pages/auth/PasswordDecision';
import { ChangePassword } from './pages/auth/ChangePassword';
import { Layout } from './components/Layout';

// Student Portal Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { PreOJT } from './pages/student/PreOJT';
import { MOATracking } from './pages/student/MOATracking';
import { Attendance } from './pages/student/Attendance';
import { PrintDTR } from './pages/student/PrintDTR';
import { Tasks } from './pages/student/Tasks';
import { WeeklyJournal } from './pages/student/WeeklyJournal';
import { PrintWeeklyJournal } from './pages/student/PrintWeeklyJournal';
import { DuringOJT } from './pages/student/DuringOJT';
import { PostOJT } from './pages/student/PostOJT';
import { PortfolioBuilder } from './pages/student/PortfolioBuilder';
import { FormsTemplates } from './pages/student/FormsTemplates';

// Adviser Portal Pages
import { AdviserDashboard } from './pages/adviser/AdviserDashboard';
import { StudentMonitoring } from './pages/adviser/StudentMonitoring';
import { AttendanceMonitoring } from './pages/adviser/AttendanceMonitoring';
import { AdviserFormsTemplates } from './pages/adviser/FormsTemplates';
import { JournalReview } from './pages/adviser/JournalReview';
import { RequirementReviews } from './pages/adviser/RequirementReviews';
import { PortfolioReview } from './pages/adviser/PortfolioReview';

// Coordinator Portal Pages
import { CoordinatorDashboard } from './pages/coordinator/CoordinatorDashboard';
import { StudentManagement } from './pages/coordinator/StudentManagement';
import { AdviserManagement } from './pages/coordinator/AdviserManagement';
import { CompanyManagement } from './pages/coordinator/CompanyManagement';
import { MOAManagement } from './pages/coordinator/MOAManagement';
import { TemplateManagement } from './pages/coordinator/TemplateManagement';
import { OJTDatabase } from './pages/coordinator/OJTDatabase';
import { PortfolioManagement } from './pages/coordinator/PortfolioManagement';
import { Announcements } from './pages/coordinator/Announcements';
import { Settings as CoordinatorSettings } from './pages/coordinator/Settings';

// Shared Pages
import { Messages } from './pages/shared/Messages';
import { Settings } from './pages/shared/Settings';

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const savedUser = localStorage.getItem('user');
  
  if (!savedUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout>{children}</Layout>;
}

function ProtectedPrintRoute({ children }: { children: React.ReactNode }) {
  const savedUser = localStorage.getItem('user');

  if (!savedUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Role-based Dashboard router
function DashboardRouter() {
  const savedUser = localStorage.getItem('user');

  if (!savedUser) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(savedUser);

  let Dashboard;

  if (user.role === 'adviser') {
    Dashboard = <AdviserDashboard />;
  } else if (user.role === 'coordinator') {
    Dashboard = <CoordinatorDashboard />;
  } else {
    Dashboard = <StudentDashboard />;
  }

  return <Layout>{Dashboard}</Layout>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LandingPage,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/forgot-password',
    Component: ForgotPassword,
  },
  {
    path: '/verify-otp',
    Component: OtpVerification,
  },
  {
    path: '/password-decision',
    Component: PasswordDecision,
  },
  {
    path: '/change-password',
    Component: ChangePassword,
  },
  {
    path: '/verify-email',
    Component: VerifyEmail,
  },
  {
    path: '/email-verified',
    Component: EmailVerifiedSuccess,
  },
  {
    path: '/verification-expired',
    Component: VerificationExpired,
  },
  {
    path: '/dashboard',
    element: <DashboardRouter />,
  },
  
  // Student Portal Routes
  {
    path: '/pre-ojt',
    element: <ProtectedRoute><PreOJT /></ProtectedRoute>
  },
  {
    path: '/moa',
    element: <ProtectedRoute><MOATracking /></ProtectedRoute>
  },
  {
    path: '/attendance',
    element: <ProtectedRoute><Attendance /></ProtectedRoute>
  },
  {
    path: '/dtr-generation',
    element: <Navigate to="/attendance" replace />
  },
  {
    path: '/print-dtr/:dtrId',
    element: <ProtectedPrintRoute><PrintDTR /></ProtectedPrintRoute>
  },
  {
    path: '/tasks',
    element: <ProtectedRoute><Tasks /></ProtectedRoute>
  },
  {
    path: '/weekly-journal',
    element: <ProtectedRoute><WeeklyJournal /></ProtectedRoute>
  },
  {
    path: '/print-weekly-journal/:journalId',
    element: <ProtectedPrintRoute><PrintWeeklyJournal /></ProtectedPrintRoute>
  },
  {
    path: '/during-ojt',
    element: <ProtectedRoute><DuringOJT /></ProtectedRoute>
  },
  {
    path: '/post-ojt',
    element: <ProtectedRoute><PostOJT /></ProtectedRoute>
  },
  {
    path: '/portfolio',
    element: <ProtectedRoute><PortfolioBuilder /></ProtectedRoute>
  },
  {
    path: '/forms-templates',
    element: <ProtectedRoute><FormsTemplates /></ProtectedRoute>
  },

  // Adviser Portal Routes
  {
    path: '/adviser/students',
    element: <ProtectedRoute><StudentMonitoring /></ProtectedRoute>
  },
  {
    path: '/adviser/attendance',
    element: <ProtectedRoute><AttendanceMonitoring /></ProtectedRoute>
  },
  {
    path: '/adviser/forms-templates',
    element: <ProtectedRoute><AdviserFormsTemplates /></ProtectedRoute>
  },
  {
    path: '/adviser/journals',
    element: <ProtectedRoute><JournalReview /></ProtectedRoute>
  },
  {
    path: '/adviser/review-requirements',
    element: <ProtectedRoute><RequirementReviews /></ProtectedRoute>
  },
  {
    path: '/adviser/pre-ojt',
    element: <Navigate to="/adviser/review-requirements?stage=pre" replace />
  },
  {
    path: '/adviser/during-ojt',
    element: <Navigate to="/adviser/review-requirements?stage=during" replace />
  },
  {
    path: '/adviser/post-ojt',
    element: <Navigate to="/adviser/review-requirements?stage=post" replace />
  },
  {
    path: '/adviser/portfolio',
    element: <ProtectedRoute><PortfolioReview /></ProtectedRoute>
  },

  // Coordinator Portal Routes
  {
    path: '/coordinator/students',
    element: <ProtectedRoute><StudentManagement /></ProtectedRoute>
  },
  {
    path: '/coordinator/advisers',
    element: <ProtectedRoute><AdviserManagement /></ProtectedRoute>
  },
  {
    path: '/coordinator/companies',
    element: <ProtectedRoute><CompanyManagement /></ProtectedRoute>
  },
  {
    path: '/coordinator/moas',
    element: <ProtectedRoute><MOAManagement /></ProtectedRoute>
  },
  {
    path: '/coordinator/templates',
    element: <ProtectedRoute><TemplateManagement /></ProtectedRoute>
  },
  {
    path: '/coordinator/database',
    element: <ProtectedRoute><OJTDatabase /></ProtectedRoute>
  },
  {
    path: '/coordinator/portfolios',
    element: <ProtectedRoute><PortfolioManagement /></ProtectedRoute>
  },
  {
    path: '/coordinator/announcements',
    element: <ProtectedRoute><Announcements /></ProtectedRoute>
  },
  {
    path: '/coordinator/settings',
    element: <ProtectedRoute><CoordinatorSettings /></ProtectedRoute>
  },

  // Shared Routes
  {
    path: '/messages',
    element: <ProtectedRoute><Messages /></ProtectedRoute>
  },
  {
    path: '/settings',
    element: <ProtectedRoute><Settings /></ProtectedRoute>
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center font-sans">
          <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
          <p className="text-xl text-slate-600 mb-8">Page not found</p>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#800000] text-white rounded-lg hover:bg-[#6b0000] font-bold"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    ),
  },
]);
