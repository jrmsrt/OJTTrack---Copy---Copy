import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Define OJT Stages
export type OJTStage = 'Stage 1: Pre-OJT' | 'Stage 2: During OJT' | 'Stage 3: Post-OJT' | 'Stage 4: Portfolio Completion';

export interface RequirementItem {
  name: string;
  status: 'Not Submitted' | 'Submitted' | 'Under Review' | 'Needs Revision' | 'Approved' | 'Rejected';
  fileName: string | null;
  remarks: string;
  updatedAt?: string;
}

export interface MOAState {
  status: 'NO MOA' | 'FOR COMPANY REVIEW' | 'IN-PROCESS FOR REVISION' | 'IN-PROCESS FOR REVIEW OF ULCO' | 'FOR NOTARIZATION' | 'SIGNED AND NOTARIZED' | 'SAS COPY';
  fileName: string | null;
  remarks: string;
  timeline: { date: string; status: string; remarks: string }[];
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  timeIn: string;
  timeOut: string | null;
  totalHours: number;
  locationStatus: 'Location Verified' | 'Outside Deployment Area' | 'Location Permission Denied' | 'Invalid Location' | 'Attendance Recorded';
  gpsCoordinates: { lat: number; lng: number } | null;
  remarks: string;
  deviceInfo: string;
  attendanceStatus: 'Present' | 'Incomplete Time Out' | 'Location Verified' | 'Outside Deployment Area' | 'Late' | 'Absent';
}

export interface DTRRecord {
  id: string;
  month: string;
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Generated' | 'Submitted' | 'Under Review' | 'Needs Revision' | 'Approved';
  remarks: string;
  submittedAt?: string;
  totalHours: number;
  logs: {
    date: string;
    timeIn: string;
    timeOut: string | null;
    totalHours: number;
    locationStatus: string;
    gpsCoordinates: { lat: number; lng: number } | null;
  }[];
}

export interface DailyTask {
  id: string;
  date: string;
  timeStarted: string;
  timeEnded: string;
  title: string;
  description: string;
  output: string;
  skillsApplied: string;
  problemsEncountered: string;
  attachmentName: string | null;
  status: 'Draft' | 'Submitted' | 'Reviewed' | 'Needs Revision' | 'Approved';
  remarks?: string;
}

export interface WeeklyJournal {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  tasks: DailyTask[];
  reflection: string;
  problems: string;
  totalHours: number;
  status: 'Draft' | 'Submitted' | 'Needs Revision' | 'Approved';
  remarks?: string;
}

export interface EvaluationForm {
  id: string;
  program: string;
  title: string;
  criteria: { id: string; criteriaName: string; maxPoints: number; score: number }[];
  comments: string;
  ratingScale: number; // e.g., 5-point scale
  status: 'Draft' | 'Submitted';
  submittedAt?: string;
}

export interface Company {
  id: string;
  name: string;
  address: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  latitude: number;
  longitude: number;
  allowedRadius: number; // in meters
}

export interface StudentOJTProfile {
  studentId: string;
  studentNumber: string;
  name: string;
  email: string;
  program: string;
  section: string;
  adviserId: string; // references Adviser user ID
  adviserName: string;
  companyId: string; // references Company ID
  companyName: string;
  stage: OJTStage;
  totalHoursRendered: number;
  requiredHours: number;
  preOJTRequirements: RequirementItem[];
  moaState: MOAState;
  attendanceHistory: AttendanceRecord[];
  dtrHistory: DTRRecord[];
  dailyTasks: DailyTask[];
  weeklyJournals: WeeklyJournal[];
  duringOJTRequirements: RequirementItem[];
  postOJTRequirements: RequirementItem[];
  midtermEvaluation: EvaluationForm | null;
  finalEvaluation: EvaluationForm | null;
  portfolioApproved: boolean;
  portfolioRemarks: string;
  portfolioSubmitted: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: 'Info' | 'Important' | 'Urgent';
  targetRole: 'all' | 'student' | 'adviser';
  section?: string;
  author: string;
  publishDate: string;
}

export interface Message {
  id: string;
  fromId: string;
  fromName: string;
  fromRole: string;
  toId: string;
  toName: string;
  message: string;
  timestamp: string;
  unread: boolean;
}

export interface Template {
  id: string;
  name: string;
  category: 'Pre-OJT' | 'During-OJT' | 'Post-OJT' | 'Portfolio' | 'Evaluation';
  description: string;
  linkUrl: string;
  status: 'Published' | 'Disabled';
  lastUpdated: string;
}

interface OJTContextType {
  students: StudentOJTProfile[];
  companies: Company[];
  announcements: Announcement[];
  messages: Message[];
  templates: Template[];
  evaluationFormConfigs: any[];
  systemSettings: {
    academicYear: string;
    semester: string;
    requiredHours: number;
    defaultRadius: number;
  };
  mockLocation: { lat: number; lng: number; accuracy: number };
  setMockLocation: (loc: { lat: number; lng: number; accuracy: number }) => void;
  // Core Functions
  timeIn: (studentId: string, mockGps: { lat: number; lng: number } | null, deviceInfo?: string) => { success: boolean; message: string };
  timeOut: (studentId: string, mockGps: { lat: number; lng: number } | null, deviceInfo?: string) => { success: boolean; message: string };
  submitDailyTask: (studentId: string, task: Omit<DailyTask, 'id' | 'status'>) => void;
  deleteDailyTask: (studentId: string, taskId: string) => void;
  updateDailyTask: (studentId: string, task: DailyTask) => void;
  submitWeeklyJournal: (studentId: string, journal: Omit<WeeklyJournal, 'id' | 'status'>) => void;
  updateWeeklyJournal: (studentId: string, journalId: string, updates: Partial<WeeklyJournal>) => void;
  uploadPreOJTReq: (studentId: string, reqName: string, fileName: string) => void;
  uploadDuringOJTReq: (studentId: string, reqName: string, fileName: string) => void;
  uploadPostOJTReq: (studentId: string, reqName: string, fileName: string) => void;
  uploadMOA: (studentId: string, fileName: string) => void;
  submitPortfolio: (studentId: string) => void;
  submitDTR: (studentId: string, month: string, startDate: string, endDate: string, logs: DTRRecord['logs']) => void;
  updateDTRStatus: (studentId: string, dtrId: string, status: DTRRecord['status'], remarks: string) => void;
  
  // Adviser Functions
  reviewPreOJTReq: (studentId: string, reqName: string, status: RequirementItem['status'], remarks: string) => void;
  reviewDuringOJTReq: (studentId: string, reqName: string, status: RequirementItem['status'], remarks: string) => void;
  reviewPostOJTReq: (studentId: string, reqName: string, status: RequirementItem['status'], remarks: string) => void;
  reviewMOA: (studentId: string, status: MOAState['status'], remarks: string) => void;
  reviewDailyTask: (studentId: string, taskId: string, status: DailyTask['status'], remarks: string) => void;
  reviewWeeklyJournal: (studentId: string, journalId: string, status: WeeklyJournal['status'], remarks: string) => void;
  reviewPortfolio: (studentId: string, status: 'Approved' | 'Needs Revision', remarks: string) => void;
  submitStudentEvaluation: (studentId: string, type: 'midterm' | 'final', evaluation: EvaluationForm) => void;
  
  // Coordinator Functions
  addStudentProfile: (profile: Omit<StudentOJTProfile, 'stage' | 'preOJTRequirements' | 'moaState' | 'attendanceHistory' | 'dailyTasks' | 'weeklyJournals' | 'duringOJTRequirements' | 'postOJTRequirements' | 'midtermEvaluation' | 'finalEvaluation' | 'portfolioApproved' | 'portfolioRemarks' | 'portfolioSubmitted'>) => void;
  updateStudentProfile: (studentId: string, updates: Partial<StudentOJTProfile>) => void;
  addCompany: (comp: Omit<Company, 'id'>) => void;
  updateCompany: (compId: string, updates: Partial<Company>) => void;
  addTemplate: (temp: Omit<Template, 'id' | 'lastUpdated'>) => void;
  updateTemplate: (tempId: string, updates: Partial<Template>) => void;
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'publishDate'>) => void;
  deleteAnnouncement: (annId: string) => void;
  sendChatMessage: (toId: string, toName: string, toRole: string, text: string) => void;
  updateSystemSettings: (settings: any) => void;
  
  // Helper for simulation
  forceUnlockStage: (studentId: string, stage: OJTStage) => void;
  resetAllDemoData: () => void;
}

const OJTContext = createContext<OJTContextType | undefined>(undefined);

// LocalStorage Keys
const OJT_STORAGE_KEY = 'ojt_monitoring_system_data';

// Default checklists according to coordinator requirements
const defaultPreOJTChecklist = [
  'Certificate of Registration (COR)',
  'Resume',
  'Notarize Memorandum of Agreement (MOA)',
  'Endorsement/Recommendation Letter',
  'Notarized Waiver/Consent Form',
  'Notarized Internship Agreement',
  'Student Practicum Plan',
  'Medical Certificate',
  'Good Moral Certificate',
  'Certificate of Insurance',
  'Certificate (Sexual Harassment and Work Ethics)',
  'SIS grades (1st year to 3rd year)',
  'Practicum kit (expanded envelope)',
  'Attendance OJT Orientation'
].map(name => ({
  name,
  status: 'Not Submitted' as const,
  fileName: null,
  remarks: '',
}));

const defaultDuringOJTChecklist = [
  'Daily Time Record',
  'Self-Reflection',
  ...Array.from({ length: 12 }, (_, i) => `Weekly Journal (Week ${i + 1})`),
  ...Array.from({ length: 12 }, (_, i) => `Pictures / Documentation (Week ${i + 1})`)
].map(name => ({
  name,
  status: 'Not Submitted' as const,
  fileName: null,
  remarks: '',
}));

const defaultPostOJTChecklist = [
  'Student Performance Evaluation',
  'HTE Supervisor’s Evaluation',
  'HTE Evaluation',
  'Certificate of Completion'
].map(name => ({
  name,
  status: 'Not Submitted' as const,
  fileName: null,
  remarks: '',
}));

const defaultEvaluationCriteria = [
  { id: '1', criteriaName: 'Quality of Work / Accuracy', maxPoints: 20, score: 0 },
  { id: '2', criteriaName: 'Quantity of Work / Productivity', maxPoints: 20, score: 0 },
  { id: '3', criteriaName: 'Knowledge and Technical Skills', maxPoints: 20, score: 0 },
  { id: '4', criteriaName: 'Attendance and Punctuality', maxPoints: 20, score: 0 },
  { id: '5', criteriaName: 'Attitude and Professional Ethics', maxPoints: 20, score: 0 },
];

export function OJTProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // Mock User Location - TechCorp is Makati (14.5547, 121.0244)
  // Let's set the initial mock location of student to be inside Makati (inside radius)
  const [mockLocation, setMockLocation] = useState({
    lat: 14.55472,
    lng: 121.02444,
    accuracy: 10,
  });

  const [state, setState] = useState<{
    students: StudentOJTProfile[];
    companies: Company[];
    announcements: Announcement[];
    messages: Message[];
    templates: Template[];
    evaluationFormConfigs: any[];
    systemSettings: {
      academicYear: string;
      semester: string;
      requiredHours: number;
      defaultRadius: number;
    };
  }>(() => {
    const saved = localStorage.getItem(OJT_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse local OJT storage state, loading mocks instead", e);
      }
    }

    // Default Pre-populated Mocks
    const defaultCompanies: Company[] = [
      {
        id: 'c1',
        name: 'TechCorp Inc.',
        address: '14 Innovation Drive, Makati City',
        contactPerson: 'Michael Chen',
        contactNumber: '0917 555 0202',
        email: 'contact@techcorp.com',
        latitude: 14.5547, // Makati coordinates
        longitude: 121.0244,
        allowedRadius: 200, // 200 meters geo-fence
      },
      {
        id: 'c2',
        name: 'Northstar Analytics',
        address: '88 Cyber Boulevard, Quezon City',
        contactPerson: 'Anna Cruz',
        contactNumber: '0918 222 3344',
        email: 'hr@northstar.io',
        latitude: 14.6515,
        longitude: 121.0493,
        allowedRadius: 150,
      },
      {
        id: 'c3',
        name: 'City IT Office',
        address: 'Municipal Hall, Pasig City',
        contactPerson: 'Engr. Raul Gomez',
        contactNumber: '0905 888 1234',
        email: 'pasigit@pasig.gov.ph',
        latitude: 14.5583,
        longitude: 121.0617,
        allowedRadius: 300,
      }
    ];

    // Pre-populate Student Sarah Johnson - Stage 1 (Pre-OJT) with some approved items
    // She needs a few more approvals/submissions to advance
    const sarahProfile: StudentOJTProfile = {
      studentId: '1',
      studentNumber: '2023-00007-PQ-0',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      program: 'BSIT — Bachelor of Science in Information Technology',
      section: 'BSIT 4A',
      adviserId: '2',
      adviserName: 'Michael Chen',
      companyId: 'c1',
      companyName: 'TechCorp Inc.',
      stage: 'Stage 1: Pre-OJT',
      totalHoursRendered: 0,
      requiredHours: 480,
      preOJTRequirements: defaultPreOJTChecklist.map(req => {
        if (req.name === 'Resume') {
          return { ...req, status: 'Approved', fileName: 'Johnson_BSIT_4-1_Resume.pdf', remarks: 'Good format' };
        }
        if (req.name === 'Certificate of Registration (COR)') {
          return { ...req, status: 'Approved', fileName: 'Johnson_BSIT_4-1_COR.pdf', remarks: 'Enrolled' };
        }
        if (req.name === 'Notarized Waiver/Consent Form') {
          return { ...req, status: 'Needs Revision', fileName: 'Johnson_BSIT_4-1_NotarizedWaiver.pdf', remarks: 'Missing parent signature at page 2' };
        }
        if (req.name === 'Notarized Internship Agreement') {
          return { ...req, status: 'Submitted', fileName: 'Johnson_BSIT_4-1_NotarizedInternshipAgreement.pdf', remarks: 'Awaiting signature verification' };
        }
        return req;
      }),
      moaState: {
        status: 'IN-PROCESS FOR REVIEW OF ULCO',
        fileName: 'Sarah_Johnson_MOA_Draft.pdf',
        remarks: 'Legal counsel verifying clause 4.',
        timeline: [
          { date: '2026-06-01', status: 'FOR COMPANY REVIEW', remarks: 'Initial draft submitted by student' },
          { date: '2026-06-02', status: 'IN-PROCESS FOR REVIEW OF ULCO', remarks: 'Coordinator routing to Legal' },
          { date: '2026-06-04', status: 'IN-PROCESS FOR REVISION', remarks: 'Company name incorrect in heading' },
          { date: '2026-06-06', status: 'FOR COMPANY REVIEW', remarks: 'Corrected draft uploaded' },
          { date: '2026-06-08', status: 'IN-PROCESS FOR REVIEW OF ULCO', remarks: 'Reviewing final clauses' }
        ]
      },
      attendanceHistory: [
        {
          id: 'a1',
          studentId: '1',
          date: '2026-06-20',
          timeIn: '08:00 AM',
          timeOut: '05:00 PM',
          totalHours: 8.0,
          locationStatus: 'Location Verified',
          gpsCoordinates: { lat: 14.55471, lng: 121.02442 },
          remarks: 'Regular OJT day',
          deviceInfo: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0.0.0',
          attendanceStatus: 'Present'
        },
        {
          id: 'a2',
          studentId: '1',
          date: '2026-06-21',
          timeIn: '08:15 AM',
          timeOut: '05:15 PM',
          totalHours: 8.0,
          locationStatus: 'Location Verified',
          gpsCoordinates: { lat: 14.55470, lng: 121.02441 },
          remarks: 'Regular OJT day',
          deviceInfo: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0.0.0',
          attendanceStatus: 'Present'
        }
      ],
      dtrHistory: [],
      dailyTasks: [
        {
          id: 't1',
          date: '2026-06-20',
          timeStarted: '08:00 AM',
          timeEnded: '12:00 PM',
          title: 'Database schema modeling',
          description: 'Designed ER diagram for inventory management module.',
          output: 'ER diagram document',
          skillsApplied: 'MySQL, database modeling',
          problemsEncountered: 'Struggled with modeling self-referencing roles.',
          attachmentName: 'schema_v1.png',
          status: 'Approved',
          remarks: 'Good relational structures.'
        },
        {
          id: 't2',
          date: '2026-06-20',
          timeStarted: '01:00 PM',
          timeEnded: '05:00 PM',
          title: 'API endpoint mapping',
          description: 'Mapped API endpoints for catalog module in Express.',
          output: 'Swagger documentation link',
          skillsApplied: 'Express, Swagger OpenAPI',
          problemsEncountered: 'None',
          attachmentName: null,
          status: 'Approved',
          remarks: 'Clean mappings'
        }
      ],
      weeklyJournals: [
        {
          id: 'w1',
          weekNumber: 1,
          startDate: '2026-06-15',
          endDate: '2026-06-19',
          tasks: [],
          reflection: 'Learned a lot about industrial coding standards in this first week. Code reviews are stricter than expected.',
          problems: 'Adapting to the huge codebase repository.',
          totalHours: 40,
          status: 'Approved',
          remarks: 'Great start! Keep up the diligence.'
        }
      ],
      duringOJTRequirements: defaultDuringOJTChecklist,
      postOJTRequirements: defaultPostOJTChecklist,
      midtermEvaluation: null,
      finalEvaluation: null,
      portfolioApproved: false,
      portfolioRemarks: '',
      portfolioSubmitted: false,
    };

    // Pre-populate some other students to fill out Adviser dashboard
    const davidProfile: StudentOJTProfile = {
      ...sarahProfile,
      studentId: 'david',
      studentNumber: '2023-00045-PQ-0',
      name: 'David Martinez',
      email: 'david.martinez@university.edu',
      section: 'BSIT 4B',
      companyId: 'c2',
      companyName: 'Northstar Analytics',
      stage: 'Stage 2: During OJT', // david is in During OJT!
      totalHoursRendered: 240,
      preOJTRequirements: defaultPreOJTChecklist.map(req => ({ ...req, status: 'Approved', fileName: 'mock.pdf' })),
      moaState: {
        status: 'SAS COPY',
        fileName: 'David_MOA_Final.pdf',
        remarks: 'Approved.',
        timeline: [{ date: '2026-05-15', status: 'SAS COPY', remarks: 'Approved' }]
      },
      attendanceHistory: [
        {
          id: 'da1',
          studentId: 'david',
          date: '2026-06-10',
          timeIn: '08:10 AM',
          timeOut: '05:10 PM',
          totalHours: 8.0,
          locationStatus: 'Location Verified',
          gpsCoordinates: { lat: 14.6515, lng: 121.0493 },
          remarks: 'Regular attendance',
          deviceInfo: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0.0.0',
          attendanceStatus: 'Present'
        },
        {
          id: 'da2',
          studentId: 'david',
          date: '2026-06-11',
          timeIn: '08:15 AM',
          timeOut: '05:15 PM',
          totalHours: 8.0,
          locationStatus: 'Location Verified',
          gpsCoordinates: { lat: 14.6515, lng: 121.0493 },
          remarks: 'Regular attendance',
          deviceInfo: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0.0.0',
          attendanceStatus: 'Present'
        }
      ],
      dtrHistory: [
        {
          id: 'dtr_david_1',
          month: 'June 2026',
          startDate: '2026-06-01',
          endDate: '2026-06-15',
          status: 'Submitted',
          remarks: 'Awaiting signature verification',
          submittedAt: '2026-06-16',
          totalHours: 16,
          logs: [
            {
              date: '2026-06-10',
              timeIn: '08:10 AM',
              timeOut: '05:10 PM',
              totalHours: 8.0,
              locationStatus: 'Location Verified',
              gpsCoordinates: { lat: 14.6515, lng: 121.0493 }
            },
            {
              date: '2026-06-11',
              timeIn: '08:15 AM',
              timeOut: '05:15 PM',
              totalHours: 8.0,
              locationStatus: 'Location Verified',
              gpsCoordinates: { lat: 14.6515, lng: 121.0493 }
            }
          ]
        }
      ],
      weeklyJournals: [
        {
          id: 'w_d1',
          weekNumber: 1,
          startDate: '2026-05-18',
          endDate: '2026-05-22',
          tasks: [],
          reflection: 'First week was onboarding and environment setup.',
          problems: 'Permissions issues on Docker container setup.',
          totalHours: 40,
          status: 'Approved',
          remarks: 'Good job.'
        },
        {
          id: 'w_d2',
          weekNumber: 2,
          startDate: '2026-05-25',
          endDate: '2026-05-29',
          tasks: [],
          reflection: 'Began working on UI layout bugs and responsive design.',
          problems: 'CSS conflicts in utility modules.',
          totalHours: 40,
          status: 'Submitted',
          remarks: ''
        }
      ]
    };

    const lisaProfile: StudentOJTProfile = {
      ...sarahProfile,
      studentId: 'lisa',
      studentNumber: '2023-00109-PQ-0',
      name: 'Lisa Wang',
      email: 'lisa.wang@university.edu',
      program: 'BSCpE — Bachelor of Science in Computer Engineering',
      section: 'BSCpE 4A',
      companyId: 'c3',
      companyName: 'City IT Office',
      stage: 'Stage 3: Post-OJT', // lisa has finished hours!
      totalHoursRendered: 480,
      preOJTRequirements: defaultPreOJTChecklist.map(req => ({ ...req, status: 'Approved', fileName: 'mock.pdf' })),
      duringOJTRequirements: defaultDuringOJTChecklist.map(req => ({ ...req, status: 'Approved', fileName: 'mock.pdf' })),
      moaState: {
        status: 'SAS COPY',
        fileName: 'Lisa_MOA.pdf',
        remarks: 'Approved',
        timeline: [{ date: '2026-05-01', status: 'SAS COPY', remarks: 'Approved' }]
      },
      portfolioSubmitted: true,
      portfolioRemarks: 'Please review final documentation.',
      dtrHistory: [],
    };

    const defaultAnnouncements: Announcement[] = [
      {
        id: 'ann1',
        title: 'Pre-Deployment Orientation',
        message: 'All interns who have pending Pre-OJT documentations are required to attend the virtual check-up seminar this Friday at 2:00 PM via MS Teams.',
        priority: 'Urgent',
        targetRole: 'student',
        author: 'Dr. Emily Rodriguez',
        publishDate: '2026-06-22',
      },
      {
        id: 'ann2',
        title: 'Weekly Journal Template Notice',
        message: 'Please ensure that when generating the Weekly Journal, you use the official layout. Do not delete the signature slots for the Adviser.',
        priority: 'Important',
        targetRole: 'all',
        author: 'Dr. Emily Rodriguez',
        publishDate: '2026-06-20',
      }
    ];

    const defaultTemplates: Template[] = [
      { id: 't1', name: 'Resume Standard Template', category: 'Pre-OJT', description: 'Official outline for student resumes.', linkUrl: '#', status: 'Published', lastUpdated: '2026-05-10' },
      { id: 't2', name: 'Parent Consent & Waiver Form', category: 'Pre-OJT', description: 'Notarized parental permission template.', linkUrl: '#', status: 'Published', lastUpdated: '2026-05-12' },
      { id: 't3', name: 'Memorandum of Agreement (HTE Model)', category: 'Pre-OJT', description: 'MOA template for companies to review.', linkUrl: '#', status: 'Published', lastUpdated: '2026-05-15' },
      { id: 't4', name: 'Weekly Journal Official Layout', category: 'During-OJT', description: 'Weekly accomplishment log template.', linkUrl: '#', status: 'Published', lastUpdated: '2026-05-20' },
      { id: 't5', name: 'Daily Time Record Log Sheet', category: 'During-OJT', description: 'Excel-like time sheet format.', linkUrl: '#', status: 'Published', lastUpdated: '2026-05-22' },
      { id: 't6', name: 'OJT Student Self-Assessment', category: 'Post-OJT', description: 'Form to evaluate student learning outcomes.', linkUrl: '#', status: 'Published', lastUpdated: '2026-06-01' },
      { id: 't7', name: 'Evaluation Form (Training Supervisor)', category: 'Post-OJT', description: 'Company feedback grading paper.', linkUrl: '#', status: 'Published', lastUpdated: '2026-06-01' },
      { id: 't8', name: 'Final Portfolio Compiler Layout', category: 'Portfolio', description: 'Final compilation blueprint.', linkUrl: '#', status: 'Published', lastUpdated: '2026-06-05' },
    ];

    const defaultMessages: Message[] = [
      {
        id: 'm1',
        fromId: '2',
        fromName: 'Michael Chen',
        fromRole: 'adviser',
        toId: '1',
        toName: 'Sarah Johnson',
        message: 'Hi Sarah, please update the notarized waiver with your parent\'s signature and re-upload.',
        timestamp: '2026-06-23 10:30 AM',
        unread: true,
      },
      {
        id: 'm2',
        fromId: '3',
        fromName: 'Dr. Emily Rodriguez',
        fromRole: 'coordinator',
        toId: '1',
        toName: 'Sarah Johnson',
        message: 'Your MOA is under review. I have pinged company HR.',
        timestamp: '2026-06-22 02:15 PM',
        unread: false,
      }
    ];

    return {
      students: [sarahProfile, davidProfile, lisaProfile],
      companies: defaultCompanies,
      announcements: defaultAnnouncements,
      messages: defaultMessages,
      templates: defaultTemplates,
      evaluationFormConfigs: [],
      systemSettings: {
        academicYear: '2025-2026',
        semester: 'Second Semester',
        requiredHours: 480,
        defaultRadius: 200, // 200m
      }
    };
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(OJT_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Stage locks evaluation helper
  const checkStageLock = (profile: StudentOJTProfile): OJTStage => {
    // 1. Check Pre-OJT Requirements & MOA
    const allPreOJTApproved = profile.preOJTRequirements.every(req => req.status === 'Approved');
    const moaApproved = profile.moaState.status === 'SIGNED AND NOTARIZED' || profile.moaState.status === 'SAS COPY';
    
    if (!allPreOJTApproved || !moaApproved) {
      return 'Stage 1: Pre-OJT';
    }

    // 2. Check rendered hours vs required hours
    if (profile.totalHoursRendered < profile.requiredHours) {
      return 'Stage 2: During OJT';
    }

    // 3. During OJT requirements all approved?
    const allDuringOJTApproved = profile.duringOJTRequirements.every(req => req.status === 'Approved');
    if (!allDuringOJTApproved) {
      return 'Stage 2: During OJT'; // Keep in Stage 2 if during-OJT requirements aren't cleared
    }

    // 4. Check if Post-OJT Requirements approved
    const allPostOJTApproved = profile.postOJTRequirements.every(req => req.status === 'Approved');
    if (!allPostOJTApproved) {
      return 'Stage 3: Post-OJT';
    }

    // 5. Portfolio Completion
    return 'Stage 4: Portfolio Completion';
  };

  // Helper helper to update single student profile
  const updateStudentState = (studentId: string, updater: (profile: StudentOJTProfile) => StudentOJTProfile) => {
    setState(prev => {
      const updatedStudents = prev.students.map(s => {
        if (s.studentId === studentId) {
          const updated = updater(s);
          const computedStage = checkStageLock(updated);
          return { ...updated, stage: computedStage };
        }
        return s;
      });
      return { ...prev, students: updatedStudents };
    });
  };

  // 4. Geolocation calculations
  const degreesToRadians = (deg: number) => (deg * Math.PI) / 180;
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const earthRadius = 6371000; // Meters
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
  };

  // 1. Time In Function
  const timeIn = (studentId: string, mockGps: { lat: number; lng: number } | null, deviceInfo: string = 'Unknown') => {
    let result = { success: false, message: '' };
    
    // Find student
    const student = state.students.find(s => s.studentId === studentId);
    if (!student) {
      return { success: false, message: 'Student profile not found.' };
    }

    // Must be in Stage 2 or higher
    if (student.stage === 'Stage 1: Pre-OJT') {
      return { success: false, message: 'Pre-OJT requirements must be approved before logging attendance.' };
    }

    // Find assigned company
    const company = state.companies.find(c => c.id === student.companyId);
    if (!company) {
      return { success: false, message: 'Assigned company details not found. Please contact coordinator.' };
    }

    const todayDate = new Date().toISOString().split('T')[0];
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // GPS validation check
    let distance = 0;
    let locationStatus: AttendanceRecord['locationStatus'] = 'Outside Deployment Area';
    
    if (mockGps) {
      distance = calculateDistance(mockGps.lat, mockGps.lng, company.latitude, company.longitude);
      if (distance <= company.allowedRadius) {
        locationStatus = 'Location Verified';
      }
    } else {
      locationStatus = 'Location Permission Denied';
    }

    // Late check (after 8:30 AM)
    const now = new Date();
    const isLateTime = now.getHours() > 8 || (now.getHours() === 8 && now.getMinutes() > 30);
    const attendanceStatus = locationStatus !== 'Location Verified' 
      ? 'Outside Deployment Area' 
      : (isLateTime ? 'Late' : 'Location Verified');

    if (locationStatus !== 'Location Verified') {
      result = {
        success: false,
        message: `Clock In Failed. You are outside the allowed company location radius (${Math.round(distance)}m away).`,
      };
      
      // Still log failed attempt in attendance record
      updateStudentState(studentId, s => ({
        ...s,
        attendanceHistory: [
          {
            id: `att_${Date.now()}`,
            studentId,
            date: todayDate,
            timeIn: timeString,
            timeOut: null,
            totalHours: 0,
            locationStatus,
            gpsCoordinates: mockGps,
            remarks: `Failed clock-in attempt. Distance: ${Math.round(distance)}m from company centre.`,
            deviceInfo,
            attendanceStatus: 'Outside Deployment Area'
          },
          ...s.attendanceHistory
        ]
      }));

      return result;
    }

    // Success
    updateStudentState(studentId, s => {
      // Check if already clocked in today
      const alreadyClockedIn = s.attendanceHistory.find(a => a.date === todayDate && a.timeOut === null);
      if (alreadyClockedIn) return s;

      return {
        ...s,
        attendanceHistory: [
          {
            id: `att_${Date.now()}`,
            studentId,
            date: todayDate,
            timeIn: timeString,
            timeOut: null,
            totalHours: 0,
            locationStatus: 'Location Verified',
            gpsCoordinates: mockGps,
            remarks: isLateTime ? 'Clocked in Late (After 08:30 AM).' : 'Clocked in on time.',
            deviceInfo,
            attendanceStatus: isLateTime ? 'Late' : 'Location Verified'
          },
          ...s.attendanceHistory
        ]
      };
    });

    return { success: true, message: `Time In recorded successfully! ${isLateTime ? 'Late entry noted.' : 'Location verified.'}` };
  };

  // 2. Time Out Function
  const timeOut = (studentId: string, mockGps: { lat: number; lng: number } | null, deviceInfo: string = 'Unknown') => {
    let result = { success: false, message: '' };
    
    // Find student
    const student = state.students.find(s => s.studentId === studentId);
    if (!student) {
      return { success: false, message: 'Student profile not found.' };
    }

    // Find assigned company
    const company = state.companies.find(c => c.id === student.companyId);
    if (!company) {
      return { success: false, message: 'Assigned company details not found.' };
    }

    // GPS validation check on checkout
    let distance = 0;
    let locationStatus: AttendanceRecord['locationStatus'] = 'Outside Deployment Area';
    
    if (mockGps) {
      distance = calculateDistance(mockGps.lat, mockGps.lng, company.latitude, company.longitude);
      if (distance <= company.allowedRadius) {
        locationStatus = 'Location Verified';
      }
    } else {
      locationStatus = 'Location Permission Denied';
    }

    if (locationStatus !== 'Location Verified') {
      return {
        success: false,
        message: `Clock Out Failed. You are outside the allowed company location radius (${Math.round(distance)}m away) to Clock Out.`,
      };
    }

    let message = 'Clocked out successfully.';
    updateStudentState(studentId, s => {
      const todayDate = new Date().toISOString().split('T')[0];
      const activeRecordIdx = s.attendanceHistory.findIndex(a => a.timeOut === null);
      
      if (activeRecordIdx === -1) {
        message = 'No active check-in found.';
        return s;
      }

      const record = s.attendanceHistory[activeRecordIdx];
      const timeOutString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Calculate hours
      const parseTime = (tStr: string) => {
        const [time, modifier] = tStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return hours + minutes / 60;
      };

      const inVal = parseTime(record.timeIn);
      const outVal = parseTime(timeOutString);
      let diff = outVal - inVal;
      if (diff < 0) diff += 24; // boundary crossing
      diff = Math.round(diff * 100) / 100; // round to two decimals

      const updatedHistory = [...s.attendanceHistory];
      const wasLate = record.attendanceStatus === 'Late';
      const attStatus = wasLate ? 'Late' : 'Present';

      updatedHistory[activeRecordIdx] = {
        ...record,
        timeOut: timeOutString,
        totalHours: diff,
        locationStatus: 'Attendance Recorded',
        attendanceStatus: attStatus,
        remarks: `Present. Rendered ${diff.toFixed(2)} hours.`,
        deviceInfo
      };

      const newTotalHours = s.totalHoursRendered + diff;

      return {
        ...s,
        attendanceHistory: updatedHistory,
        totalHoursRendered: newTotalHours
      };
    });

    return { success: true, message };
  };

  // 2b. DTR Functions
  const submitDTR = (studentId: string, month: string, startDate: string, endDate: string, logs: DTRRecord['logs']) => {
    updateStudentState(studentId, s => {
      const totalHours = logs.reduce((acc, log) => acc + log.totalHours, 0);
      const newDtr: DTRRecord = {
        id: `dtr_${Date.now()}`,
        month,
        startDate,
        endDate,
        status: 'Submitted',
        remarks: '',
        submittedAt: new Date().toISOString().split('T')[0],
        totalHours,
        logs
      };

      return {
        ...s,
        dtrHistory: [newDtr, ...(s.dtrHistory || [])]
      };
    });
  };

  const updateDTRStatus = (studentId: string, dtrId: string, status: DTRRecord['status'], remarks: string) => {
    updateStudentState(studentId, s => {
      return {
        ...s,
        dtrHistory: (s.dtrHistory || []).map(d =>
          d.id === dtrId ? { ...d, status, remarks } : d
        )
      };
    });
  };

  // Daily Tasks CRUD
  const submitDailyTask = (studentId: string, task: Omit<DailyTask, 'id' | 'status'>) => {
    updateStudentState(studentId, s => ({
      ...s,
      dailyTasks: [
        {
          ...task,
          id: `task_${Date.now()}`,
          status: 'Submitted',
        },
        ...s.dailyTasks
      ]
    }));
  };

  const deleteDailyTask = (studentId: string, taskId: string) => {
    updateStudentState(studentId, s => ({
      ...s,
      dailyTasks: s.dailyTasks.filter(t => t.id !== taskId)
    }));
  };

  const updateDailyTask = (studentId: string, task: DailyTask) => {
    updateStudentState(studentId, s => ({
      ...s,
      dailyTasks: s.dailyTasks.map(t => t.id === task.id ? task : t)
    }));
  };

  // Weekly Journals CRUD
  const submitWeeklyJournal = (studentId: string, journal: Omit<WeeklyJournal, 'id' | 'status'>) => {
    updateStudentState(studentId, s => ({
      ...s,
      weeklyJournals: [
        {
          ...journal,
          id: `journal_${Date.now()}`,
          status: 'Submitted',
        },
        ...s.weeklyJournals
      ]
    }));
  };

  const updateWeeklyJournal = (studentId: string, journalId: string, updates: Partial<WeeklyJournal>) => {
    updateStudentState(studentId, s => ({
      ...s,
      weeklyJournals: s.weeklyJournals.map(j => j.id === journalId ? { ...j, ...updates } : j)
    }));
  };

  // Requirement uploads
  const uploadPreOJTReq = (studentId: string, reqName: string, fileName: string) => {
    updateStudentState(studentId, s => ({
      ...s,
      preOJTRequirements: s.preOJTRequirements.map(r =>
        r.name === reqName ? { ...r, status: 'Submitted', fileName, remarks: 'Uploaded file' } : r
      )
    }));
  };

  const uploadDuringOJTReq = (studentId: string, reqName: string, fileName: string) => {
    updateStudentState(studentId, s => ({
      ...s,
      duringOJTRequirements: s.duringOJTRequirements.map(r =>
        r.name === reqName ? { ...r, status: 'Submitted', fileName, remarks: 'Uploaded file' } : r
      )
    }));
  };

  const uploadPostOJTReq = (studentId: string, reqName: string, fileName: string) => {
    updateStudentState(studentId, s => ({
      ...s,
      postOJTRequirements: s.postOJTRequirements.map(r =>
        r.name === reqName ? { ...r, status: 'Submitted', fileName, remarks: 'Uploaded file' } : r
      )
    }));
  };

  const uploadMOA = (studentId: string, fileName: string) => {
    updateStudentState(studentId, s => {
      const today = new Date().toISOString().split('T')[0];
      return {
        ...s,
        moaState: {
          ...s.moaState,
          status: 'FOR COMPANY REVIEW',
          fileName,
          timeline: [
            ...s.moaState.timeline,
            { date: today, status: 'FOR COMPANY REVIEW', remarks: `Uploaded: ${fileName}` }
          ]
        }
      };
    });
  };

  const submitPortfolio = (studentId: string) => {
    updateStudentState(studentId, s => ({
      ...s,
      portfolioSubmitted: true,
      portfolioRemarks: 'Portfolio compiled and submitted for adviser review.'
    }));
  };

  // Adviser Actions
  const reviewPreOJTReq = (studentId: string, reqName: string, status: RequirementItem['status'], remarks: string) => {
    updateStudentState(studentId, s => ({
      ...s,
      preOJTRequirements: s.preOJTRequirements.map(r =>
        r.name === reqName ? { ...r, status, remarks, updatedAt: new Date().toLocaleDateString() } : r
      )
    }));
  };

  const reviewDuringOJTReq = (studentId: string, reqName: string, status: RequirementItem['status'], remarks: string) => {
    updateStudentState(studentId, s => ({
      ...s,
      duringOJTRequirements: s.duringOJTRequirements.map(r =>
        r.name === reqName ? { ...r, status, remarks, updatedAt: new Date().toLocaleDateString() } : r
      )
    }));
  };

  const reviewPostOJTReq = (studentId: string, reqName: string, status: RequirementItem['status'], remarks: string) => {
    updateStudentState(studentId, s => ({
      ...s,
      postOJTRequirements: s.postOJTRequirements.map(r =>
        r.name === reqName ? { ...r, status, remarks, updatedAt: new Date().toLocaleDateString() } : r
      )
    }));
  };

  const reviewMOA = (studentId: string, status: MOAState['status'], remarks: string) => {
    updateStudentState(studentId, s => {
      const today = new Date().toISOString().split('T')[0];
      return {
        ...s,
        moaState: {
          ...s.moaState,
          status,
          remarks,
          timeline: [
            ...s.moaState.timeline,
            { date: today, status, remarks }
          ]
        }
      };
    });
  };

  const reviewDailyTask = (studentId: string, taskId: string, status: DailyTask['status'], remarks: string) => {
    updateStudentState(studentId, s => ({
      ...s,
      dailyTasks: s.dailyTasks.map(t =>
        t.id === taskId ? { ...t, status, remarks } : t
      )
    }));
  };

  const reviewWeeklyJournal = (studentId: string, journalId: string, status: WeeklyJournal['status'], remarks: string) => {
    updateStudentState(studentId, s => ({
      ...s,
      weeklyJournals: s.weeklyJournals.map(j =>
        j.id === journalId ? { ...j, status, remarks } : j
      )
    }));
  };

  const reviewPortfolio = (studentId: string, status: 'Approved' | 'Needs Revision', remarks: string) => {
    updateStudentState(studentId, s => ({
      ...s,
      portfolioApproved: status === 'Approved',
      portfolioRemarks: remarks,
      portfolioSubmitted: status === 'Needs Revision' ? false : s.portfolioSubmitted
    }));
  };

  const submitStudentEvaluation = (studentId: string, type: 'midterm' | 'final', evaluation: EvaluationForm) => {
    updateStudentState(studentId, s => {
      if (type === 'midterm') {
        return { ...s, midtermEvaluation: evaluation };
      } else {
        return { ...s, finalEvaluation: evaluation };
      }
    });
  };

  // Coordinator Actions
  const addStudentProfile = (profile: Omit<StudentOJTProfile, 'stage' | 'preOJTRequirements' | 'moaState' | 'attendanceHistory' | 'dtrHistory' | 'dailyTasks' | 'weeklyJournals' | 'duringOJTRequirements' | 'postOJTRequirements' | 'midtermEvaluation' | 'finalEvaluation' | 'portfolioApproved' | 'portfolioRemarks' | 'portfolioSubmitted'>) => {
    const newProfile: StudentOJTProfile = {
      ...profile,
      stage: 'Stage 1: Pre-OJT',
      preOJTRequirements: defaultPreOJTChecklist,
      moaState: {
        status: 'NO MOA',
        fileName: null,
        remarks: '',
        timeline: []
      },
      attendanceHistory: [],
      dtrHistory: [],
      dailyTasks: [],
      weeklyJournals: [],
      duringOJTRequirements: defaultDuringOJTChecklist,
      postOJTRequirements: defaultPostOJTChecklist,
      midtermEvaluation: null,
      finalEvaluation: null,
      portfolioApproved: false,
      portfolioRemarks: '',
      portfolioSubmitted: false,
    };
    setState(prev => ({
      ...prev,
      students: [...prev.students, newProfile]
    }));
  };

  const updateStudentProfile = (studentId: string, updates: Partial<StudentOJTProfile>) => {
    updateStudentState(studentId, s => ({
      ...s,
      ...updates
    }));
  };

  const addCompany = (comp: Omit<Company, 'id'>) => {
    setState(prev => ({
      ...prev,
      companies: [
        ...prev.companies,
        {
          ...comp,
          id: `comp_${Date.now()}`
        }
      ]
    }));
  };

  const updateCompany = (compId: string, updates: Partial<Company>) => {
    setState(prev => ({
      ...prev,
      companies: prev.companies.map(c => c.id === compId ? { ...c, ...updates } : c)
    }));
  };

  const addTemplate = (temp: Omit<Template, 'id' | 'lastUpdated'>) => {
    setState(prev => ({
      ...prev,
      templates: [
        ...prev.templates,
        {
          ...temp,
          id: `temp_${Date.now()}`,
          lastUpdated: new Date().toISOString().split('T')[0]
        }
      ]
    }));
  };

  const updateTemplate = (tempId: string, updates: Partial<Template>) => {
    setState(prev => ({
      ...prev,
      templates: prev.templates.map(t => t.id === tempId ? { ...t, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : t)
    }));
  };

  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'publishDate'>) => {
    setState(prev => ({
      ...prev,
      announcements: [
        {
          ...ann,
          id: `ann_${Date.now()}`,
          publishDate: new Date().toISOString().split('T')[0]
        },
        ...prev.announcements
      ]
    }));
  };

  const deleteAnnouncement = (annId: string) => {
    setState(prev => ({
      ...prev,
      announcements: prev.announcements.filter(a => a.id !== annId)
    }));
  };

  const sendChatMessage = (toId: string, toName: string, toRole: string, text: string) => {
    if (!user) return;
    setState(prev => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          id: `msg_${Date.now()}`,
          fromId: user.id,
          fromName: user.name,
          fromRole: user.role,
          toId,
          toName,
          message: text,
          timestamp: new Date().toLocaleString(),
          unread: true
        }
      ]
    }));
  };

  const updateSystemSettings = (settings: any) => {
    setState(prev => ({
      ...prev,
      systemSettings: {
        ...prev.systemSettings,
        ...settings
      }
    }));
  };

  // FORCE SIMULATION OVERRIDES
  const forceUnlockStage = (studentId: string, stage: OJTStage) => {
    updateStudentState(studentId, s => {
      let preOjt = [...s.preOJTRequirements];
      let moa = { ...s.moaState };
      let duringOjt = [...s.duringOJTRequirements];
      let postOjt = [...s.postOJTRequirements];
      let totalHours = s.totalHoursRendered;

      if (stage === 'Stage 2: During OJT' || stage === 'Stage 3: Post-OJT' || stage === 'Stage 4: Portfolio Completion') {
        preOjt = preOjt.map(r => ({ ...r, status: 'Approved' }));
        moa.status = 'SAS COPY';
      }

      if (stage === 'Stage 3: Post-OJT' || stage === 'Stage 4: Portfolio Completion') {
        duringOjt = duringOjt.map(r => ({ ...r, status: 'Approved' }));
        totalHours = s.requiredHours; // mark complete
      }

      if (stage === 'Stage 4: Portfolio Completion') {
        postOjt = postOjt.map(r => ({ ...r, status: 'Approved' }));
      }

      return {
        ...s,
        preOJTRequirements: preOjt,
        moaState: moa,
        duringOJTRequirements: duringOjt,
        postOJTRequirements: postOjt,
        totalHoursRendered: totalHours,
        stage
      };
    });
  };

  const resetAllDemoData = () => {
    localStorage.removeItem(OJT_STORAGE_KEY);
    window.location.reload();
  };

  return (
    <OJTContext.Provider
      value={{
        students: state.students,
        companies: state.companies,
        announcements: state.announcements,
        messages: state.messages,
        templates: state.templates,
        evaluationFormConfigs: state.evaluationFormConfigs,
        systemSettings: state.systemSettings,
        mockLocation,
        setMockLocation,
        
        timeIn,
        timeOut,
        submitDailyTask,
        deleteDailyTask,
        updateDailyTask,
        submitWeeklyJournal,
        updateWeeklyJournal,
        uploadPreOJTReq,
        uploadDuringOJTReq,
        uploadPostOJTReq,
        uploadMOA,
        submitPortfolio,
        submitDTR,
        updateDTRStatus,
        
        reviewPreOJTReq,
        reviewDuringOJTReq,
        reviewPostOJTReq,
        reviewMOA,
        reviewDailyTask,
        reviewWeeklyJournal,
        reviewPortfolio,
        submitStudentEvaluation,
        
        addStudentProfile,
        updateStudentProfile,
        addCompany,
        updateCompany,
        addTemplate,
        updateTemplate,
        addAnnouncement,
        deleteAnnouncement,
        sendChatMessage,
        updateSystemSettings,
        
        forceUnlockStage,
        resetAllDemoData
      }}
    >
      {children}
    </OJTContext.Provider>
  );
}

export function useOJT() {
  const context = useContext(OJTContext);
  if (context === undefined) {
    throw new Error('useOJT must be used within an OJTProvider');
  }
  return context;
}
