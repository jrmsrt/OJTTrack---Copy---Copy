import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth, AuthorizedStudent } from './AuthContext';
import { loadApiState, saveApiState } from '../lib/apiState';
import { initialAuthorizedStudents as uploadedAuthorizedStudents } from '../data/initialAuthorizedStudents';

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

const OJT_STATE_KEY = 'ojt';

// Default checklists according to coordinator requirements
const defaultPreOJTChecklist: RequirementItem[] = [
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
  status: 'Not Submitted',
  fileName: null,
  remarks: '',
}));

const defaultDuringOJTChecklist: RequirementItem[] = [
  'Daily Time Record',
  'Self-Reflection',
  ...Array.from({ length: 12 }, (_, i) => `Weekly Journal (Week ${i + 1})`),
  ...Array.from({ length: 12 }, (_, i) => `Pictures / Documentation (Week ${i + 1})`)
].map(name => ({
  name,
  status: 'Not Submitted',
  fileName: null,
  remarks: '',
}));

const defaultPostOJTChecklist: RequirementItem[] = [
  'Student Performance Evaluation',
  'HTE Supervisor’s Evaluation',
  'HTE Evaluation',
  'Certificate of Completion'
].map(name => ({
  name,
  status: 'Not Submitted',
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

function formatNameWithMiddleInitial(fullName: string): string {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 2) return fullName;
  
  const secondToLast = parts[parts.length - 2];
  if (secondToLast.length === 2 && secondToLast.endsWith('.')) {
    return fullName;
  }
  
  const lastName = parts[parts.length - 1];
  const middleName = parts[parts.length - 2];
  const firstName = parts.slice(0, parts.length - 2).join(' ');
  
  const middleInitial = middleName.charAt(0).toUpperCase();
  return `${firstName} ${middleInitial}. ${lastName}`;
}

function createStudentProfile(student: AuthorizedStudent): StudentOJTProfile {
  const isJaira = student.email.toLowerCase() === 'jairarmasarate@iskolarngbayan.pup.edu.ph';
  const isKate = student.email.toLowerCase() === 'kateheartvaguilon@iskolarngbayan.pup.edu.ph';
  const isFarhana = student.email.toLowerCase() === 'farhanasalim@iskolarngbayan.pup.edu.ph';
  const isMarion = student.email.toLowerCase() === 'marionoliviercatok@iskolarngbayan.pup.edu.ph';

  let stage: OJTStage = 'Stage 1: Pre-OJT';
  let totalHoursRendered = 0;
  let preOJTRequirements: RequirementItem[] = defaultPreOJTChecklist.map(req => ({ ...req }));
  let duringOJTRequirements: RequirementItem[] = defaultDuringOJTChecklist.map(req => ({ ...req }));
  let postOJTRequirements: RequirementItem[] = defaultPostOJTChecklist.map(req => ({ ...req }));
  let moaState: MOAState = {
    status: 'NO MOA',
    fileName: null,
    remarks: '',
    timeline: []
  };
  let weeklyJournals: WeeklyJournal[] = [];
  let portfolioSubmitted = false;
  let portfolioApproved = false;
  let portfolioRemarks = '';

  if (isJaira) {
    preOJTRequirements = defaultPreOJTChecklist.map(req => {
      if (req.name === 'Certificate of Registration (COR)') {
        return { ...req, status: 'Submitted', fileName: 'COR_Jaira_Masarate.pdf', remarks: 'Please review my COR.' };
      }
      if (req.name === 'Resume') {
        return { ...req, status: 'Submitted', fileName: 'Resume_Jaira_Masarate.pdf', remarks: 'Latest updated resume.' };
      }
      return { ...req };
    });
    moaState = {
      status: 'FOR NOTARIZATION',
      fileName: 'MOA_Draft_Jaira_Masarate.pdf',
      remarks: 'Signed by HTE. Awaiting coordinator review.',
      timeline: [
        { date: '2026-06-20', status: 'FOR COMPANY REVIEW', remarks: 'Generated by coordinator.' },
        { date: '2026-06-24', status: 'FOR NOTARIZATION', remarks: 'Signed and uploaded.' }
      ]
    };
  } else if (isKate) {
    stage = 'Stage 2: During OJT';
    totalHoursRendered = 80;
    preOJTRequirements = defaultPreOJTChecklist.map(req => ({ ...req, status: 'Approved', remarks: 'Approved.' }));
    moaState = {
      status: 'SIGNED AND NOTARIZED',
      fileName: 'MOA_Kate_Aguilon.pdf',
      remarks: 'Verified copy.',
      timeline: [
        { date: '2026-06-01', status: 'SIGNED AND NOTARIZED', remarks: 'Fully notarized and approved.' }
      ]
    };
    weeklyJournals = [
      {
        id: 'wj_kate_1',
        weekNumber: 1,
        startDate: '2026-06-01',
        endDate: '2026-06-05',
        tasks: [],
        reflection: 'Completed onboarding training and set up my dev tools.',
        problems: 'No major issues.',
        totalHours: 40,
        status: 'Submitted',
        remarks: ''
      },
      {
        id: 'wj_kate_2',
        weekNumber: 2,
        startDate: '2026-06-08',
        endDate: '2026-06-12',
        tasks: [],
        reflection: 'Worked on backend API route implementations and model schemas.',
        problems: 'Faced minor issues with MySQL connection pools.',
        totalHours: 40,
        status: 'Submitted',
        remarks: ''
      }
    ];
  } else if (isFarhana) {
    stage = 'Stage 3: Post-OJT';
    totalHoursRendered = 480;
    preOJTRequirements = defaultPreOJTChecklist.map(req => ({ ...req, status: 'Approved', remarks: 'Approved.' }));
    moaState = {
      status: 'SIGNED AND NOTARIZED',
      fileName: 'MOA_Farhana_Alim.pdf',
      remarks: 'Verified Copy',
      timeline: [{ date: '2026-06-01', status: 'SIGNED AND NOTARIZED', remarks: 'Approved.' }]
    };
    duringOJTRequirements = defaultDuringOJTChecklist.map(req => ({ ...req, status: 'Approved', remarks: 'Approved.' }));
    postOJTRequirements = defaultPostOJTChecklist.map(req => {
      if (req.name === 'Certificate of Completion') {
        return { ...req, status: 'Submitted', fileName: 'COC_Farhana_Alim.pdf', remarks: 'Finished 480 hours.' };
      }
      return { ...req };
    });
  } else if (isMarion) {
    stage = 'Stage 4: Portfolio Completion';
    totalHoursRendered = 480;
    preOJTRequirements = defaultPreOJTChecklist.map(req => ({ ...req, status: 'Approved', remarks: 'Approved.' }));
    moaState = {
      status: 'SIGNED AND NOTARIZED',
      fileName: 'MOA_Marion_Atok.pdf',
      remarks: 'Verified Copy',
      timeline: [{ date: '2026-06-01', status: 'SIGNED AND NOTARIZED', remarks: 'Approved.' }]
    };
    duringOJTRequirements = defaultDuringOJTChecklist.map(req => ({ ...req, status: 'Approved', remarks: 'Approved.' }));
    postOJTRequirements = defaultPostOJTChecklist.map(req => ({ ...req, status: 'Approved', remarks: 'Approved.' }));
    portfolioSubmitted = true;
    portfolioApproved = false;
    portfolioRemarks = 'Please review my completed portfolio compilation.';
  }

  return {
    studentId: `student-${student.studentNumber}`,
    studentNumber: student.studentNumber,
    name: formatNameWithMiddleInitial(student.name),
    email: student.email,
    program: student.program,
    section: student.section,
    adviserId: '2',
    adviserName: 'Michael Chen',
    companyId: 'c1',
    companyName: 'TechCorp Inc.',
    stage,
    totalHoursRendered,
    requiredHours: 480,
    preOJTRequirements,
    moaState,
    attendanceHistory: [],
    dtrHistory: [],
    dailyTasks: [],
    weeklyJournals,
    duringOJTRequirements,
    postOJTRequirements,
    midtermEvaluation: null,
    finalEvaluation: null,
    portfolioApproved,
    portfolioRemarks,
    portfolioSubmitted,
  };
}

export function OJTProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [databaseLoaded, setDatabaseLoaded] = useState(false);

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
    // Initial seed used only when the MySQL app_state row is empty.
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

    // Pre-populate Student profiles with some approved/submitted items
    const initialStudentProfiles: StudentOJTProfile[] = uploadedAuthorizedStudents.map(createStudentProfile);

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
        toId: 'student-2023-00007-PQ-0',
        toName: 'Jaira Rapanut Masarate',
        message: 'Hi Jaira, please update the notarized waiver with your parent\'s signature and re-upload.',
        timestamp: '2026-06-23 10:30 AM',
        unread: true,
      },
      {
        id: 'm2',
        fromId: '3',
        fromName: 'Dr. Emily Rodriguez',
        fromRole: 'coordinator',
        toId: 'student-2023-00007-PQ-0',
        toName: 'Jaira Rapanut Masarate',
        message: 'Your MOA is under review. I have pinged company HR.',
        timestamp: '2026-06-22 02:15 PM',
        unread: false,
      }
    ];

    const demoEmails = ['sarah.johnson@university.edu', 'david.martinez@university.edu', 'lisa.wang@university.edu'];
    const sanitizedStudentProfiles = initialStudentProfiles.filter(s => !demoEmails.includes(s.email.toLowerCase()));

    return {
      students: sanitizedStudentProfiles,
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

  useEffect(() => {
    let isMounted = true;

    loadApiState<typeof state>(OJT_STATE_KEY)
      .then((databaseState) => {
        if (!isMounted) return;
        if (databaseState) {
          const demoEmails = ['sarah.johnson@university.edu', 'david.martinez@university.edu', 'lisa.wang@university.edu'];
          let filteredStudents = (databaseState.students || [])
            .filter(s => !demoEmails.includes(s.email.toLowerCase()))
            .map(s => ({
              ...s,
              name: formatNameWithMiddleInitial(s.name)
            }));

          const existingEmails = new Set(filteredStudents.map(s => s.email.toLowerCase()));
          const defaultStudentProfiles: StudentOJTProfile[] = uploadedAuthorizedStudents
            .filter(student => !demoEmails.includes(student.email.toLowerCase()) && !existingEmails.has(student.email.toLowerCase()))
            .map(createStudentProfile);

          setState({
            ...databaseState,
            students: [...filteredStudents, ...defaultStudentProfiles]
          });
        }
      })
      .catch((error) => {
        console.error('Failed to load OJT data from MySQL.', error);
      })
      .finally(() => {
        if (isMounted) {
          setDatabaseLoaded(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to MySQL through the local API.
  useEffect(() => {
    if (!databaseLoaded) return;

    saveApiState(OJT_STATE_KEY, state).catch((error) => {
      console.error('Failed to save OJT data to MySQL.', error);
    });
  }, [databaseLoaded, state]);

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
    saveApiState(OJT_STATE_KEY, {}).finally(() => window.location.reload());
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
