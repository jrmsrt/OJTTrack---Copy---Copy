import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'student' | 'adviser' | 'coordinator';
export type AccountStatus = 'Pending Verification' | 'Verified' | 'Suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  accountStatus?: AccountStatus;
  password?: string;
  avatar?: string;
  studentId?: string;
  studentNumber?: string;
  university?: string;
  company?: string;
  program?: string;
  section?: string;
  contactNumber?: string;
  position?: string;
  companyAddress?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => { success: boolean; error?: string };
  registerAccount: (account: User) => { success: boolean; error?: string };
  verifyEmail: (email: string) => void;
  resendVerificationEmail: (email: string) => void;
  updateUser: (updates: Partial<User>) => void;
  isEmailRegistered: (email: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const registeredAccountsKey = 'registeredAccounts';

const demoUsers: Record<UserRole, User> = {
  student: {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    role: 'student',
    accountStatus: 'Verified',
    studentId: 'STU-2024-001',
    studentNumber: '2023-00007-PQ-0',
    university: 'Tech University',
    company: 'TechCorp Inc.',
    program: 'BSIT — Bachelor of Science in Information Technology',
    section: 'BSIT 4A',
    contactNumber: '0917 555 0101',
  },
  adviser: {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@techcorp.com',
    role: 'adviser',
    accountStatus: 'Verified',
    company: 'TechCorp Inc.',
    position: 'OJT Adviser',
    contactNumber: '0917 555 0202',
    companyAddress: '14 Innovation Drive, Makati City',
  },
  coordinator: {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@university.edu',
    role: 'coordinator',
    accountStatus: 'Verified',
    university: 'Tech University',
  },
};

function getRegisteredAccounts(): User[] {
  const savedAccounts = localStorage.getItem(registeredAccountsKey);
  return savedAccounts ? JSON.parse(savedAccounts) : [];
}

function saveRegisteredAccounts(accounts: User[]) {
  localStorage.setItem(registeredAccountsKey, JSON.stringify(accounts));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Load user from localStorage on initial render
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    // Save user to localStorage whenever it changes
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', user.role);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    }
  }, [user]);

  const findAccount = (email: string, role: UserRole) => {
    const normalizedEmail = email.trim().toLowerCase();
    const registeredAccount = getRegisteredAccounts().find(
      (account) => account.email.toLowerCase() === normalizedEmail && account.role === role,
    );

    if (registeredAccount) {
      return registeredAccount;
    }

    const demoUser = demoUsers[role];
    return demoUser.email.toLowerCase() === normalizedEmail || !email ? demoUser : undefined;
  };

  const login = (email: string, password: string, role: UserRole) => {
    const account = findAccount(email, role);

    if (!account) {
      return { success: false, error: 'Account not found. Please check your login details.' };
    }

    if (account.accountStatus === 'Suspended') {
      return { success: false, error: 'This account has been suspended. Please contact the OJT Coordinator.' };
    }

    if (account.accountStatus === 'Pending Verification') {
      return {
        success: false,
        error: 'Your email address has not been verified yet. Please verify your email before logging in.',
      };
    }

    if (account.password && account.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    setUser(account);
    return { success: true };
  };

  const isEmailRegistered = (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const demoEmails = Object.values(demoUsers).map((account) => account.email.toLowerCase());
    return (
      demoEmails.includes(normalizedEmail) ||
      getRegisteredAccounts().some((account) => account.email.toLowerCase() === normalizedEmail)
    );
  };

  const registerAccount = (account: User) => {
    if (isEmailRegistered(account.email)) {
      return {
        success: false,
        error: 'This email is already registered. Please use a different email or login.',
      };
    }

    const accounts = getRegisteredAccounts();
    saveRegisteredAccounts([
      ...accounts,
      {
        ...account,
        id: `${Date.now()}`,
        accountStatus: 'Pending Verification',
      },
    ]);

    return { success: true };
  };

  const verifyEmail = (email: string) => {
    const accounts = getRegisteredAccounts();
    const updatedAccounts = accounts.map((account) =>
      account.email.toLowerCase() === email.toLowerCase()
        ? { ...account, accountStatus: 'Verified' as AccountStatus }
        : account,
    );

    saveRegisteredAccounts(updatedAccounts);
  };

  const resendVerificationEmail = (email: string) => {
    localStorage.setItem('lastVerificationEmail', email);
    localStorage.setItem('lastVerificationEmailSentAt', new Date().toISOString());
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);

    const accounts = getRegisteredAccounts();
    saveRegisteredAccounts(
      accounts.map((account) => (account.id === updatedUser.id ? updatedUser : account)),
    );
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        registerAccount,
        verifyEmail,
        resendVerificationEmail,
        updateUser,
        isEmailRegistered,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
