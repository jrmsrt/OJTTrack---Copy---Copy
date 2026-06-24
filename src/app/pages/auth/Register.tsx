import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useAuth, UserRole } from '../../context/AuthContext';
import { AlertCircle, CheckCircle2, MailCheck, Eye, EyeOff } from 'lucide-react';
import { BrandedHeader } from '../../components/BrandedHeader';

const programOptions = [
  'BSIT — Bachelor of Science in Information Technology',
  'BSOA — Bachelor of Science in Office Administration',
  'BSCpE — Bachelor of Science in Computer Engineering',
  'BSHM — Bachelor of Science in Hospitality Management',
];

const sectionOptions = [
  '1-1',
  '1-2',
  '2-1',
  '2-2',
  '3-1',
  '3-2',
  '4-1',
  '4-2',
];

const passwordMessage =
  'Password must be at least 8 characters and include a lowercase letter, an uppercase letter, a number, and a special character.';
const emailMessage = 'Email should be valid.';
const duplicateEmailMessage = 'This email is already registered. Please use a different email or login.';
const nameMessage = 'Name should follow the format: Last Name, First Name Middle Initial (e.g., Francisco, Juan S.) and start with a capital letter only.';
const studentNumberMessage = 'Student number must follow the format: YYYY-XXXXX-PQ-0.';

const validators = {
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  password: (value: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value),
  fullName: (value: string) => /^[A-Z][a-z .'-]*,\s[A-Z][a-z .'-]*(?:\s[A-Z]\.?)?$/.test(value.trim()),
  studentNumber: (value: string) => /^\d{4}-\d{5}-[A-Z]{2}-\d$/.test(value),
};

function FieldStatus({ valid, touched }: { valid: boolean; touched: boolean }) {
  if (!touched) return null;

  return valid ? (
    <CheckCircle2 className="h-4 w-4 text-green-600" />
  ) : (
    <AlertCircle className="h-4 w-4 text-red-600" />
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-600">{message}</p>;
}

export function Register({ roleOverride }: { roleOverride?: 'student' | 'adviser' }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedRole = roleOverride || (searchParams.get('role') === 'adviser' ? 'adviser' : 'student');
  const role = requestedRole as Extract<UserRole, 'student' | 'adviser'>;
  const { registerAccount, isEmailRegistered, resendVerificationEmail } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentNumber: '',
    program: '',
    section: '',
    contactNumber: '',
    company: '', // not strictly needed for adviser but kept for type compatibility
    position: '', // adviser position, e.g. "OJT Coordinator Adviser"
    companyAddress: '',
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const errors = useMemo(() => {
    const nextErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) nextErrors.fullName = 'Full Name is required.';
    else if (!validators.fullName(formData.fullName)) nextErrors.fullName = nameMessage;

    if (!formData.email.trim()) nextErrors.email = 'Email Address is required.';
    else if (!validators.email(formData.email)) nextErrors.email = emailMessage;
    else if (isEmailRegistered(formData.email)) nextErrors.email = duplicateEmailMessage;

    if (!formData.password) nextErrors.password = 'Password is required.';
    else if (!validators.password(formData.password)) nextErrors.password = passwordMessage;

    if (!formData.confirmPassword) nextErrors.confirmPassword = 'Confirm Password is required.';
    else if (formData.confirmPassword !== formData.password) nextErrors.confirmPassword = 'Confirm Password must match Password.';

    if (!formData.contactNumber.trim()) nextErrors.contactNumber = 'Contact Number is required.';

    if (role === 'student') {
      if (!formData.studentNumber.trim()) nextErrors.studentNumber = 'Student Number is required.';
      else if (!validators.studentNumber(formData.studentNumber)) nextErrors.studentNumber = studentNumberMessage;
      if (!formData.program) nextErrors.program = 'Program/Course is required.';
      if (!formData.section.trim()) nextErrors.section = 'Section is required.';
    } else {
      if (!formData.position.trim()) nextErrors.position = 'Academic Title/Position is required.';
      if (!formData.section.trim()) nextErrors.section = 'Assigned Class Section is required.';
    }

    return nextErrors;
  }, [formData, role, isEmailRegistered]);

  const isValid = Object.keys(errors).length === 0;

  const updateField = (name: string, value: string) => {
    setFormData((current) => ({ ...current, [name]: value }));
    setTouched((current) => ({ ...current, [name]: true }));
    setSubmitError('');
  };

  const fieldTouched = (name: string) => touched[name] || submitted;

  const renderInput = (
    name: keyof typeof formData,
    label: string,
    placeholder: string,
    type = 'text',
  ) => {
    const touchedField = fieldTouched(name);
    const hasError = Boolean(errors[name]) && touchedField;
    const valid = !errors[name] && Boolean(formData[name]);

    const isPasswordField = name === 'password' || name === 'confirmPassword';
    const isShowingPassword = name === 'password' ? showPassword : showConfirmPassword;
    const toggleShowPassword = () => {
      if (name === 'password') setShowPassword(!showPassword);
      else setShowConfirmPassword(!showConfirmPassword);
    };

    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <div className="relative">
          <Input
            id={name}
            name={name}
            type={isPasswordField ? (isShowingPassword ? 'text' : 'password') : type}
            placeholder={placeholder}
            value={formData[name]}
            onBlur={() => setTouched((current) => ({ ...current, [name]: true }))}
            onChange={(event) => updateField(name, event.target.value)}
            className={`${isPasswordField ? 'pr-16' : 'pr-10'} ${hasError ? 'border-red-300 focus-visible:ring-red-200' : valid ? 'border-green-300 focus-visible:ring-green-200' : ''}`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <FieldStatus valid={valid} touched={touchedField && Boolean(formData[name])} />
            {isPasswordField && (
              <button
                type="button"
                onClick={toggleShowPassword}
                className="text-slate-500 hover:text-[#800000] focus:outline-none transition-colors"
              >
                {isShowingPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
        <FieldError message={hasError ? errors[name] : undefined} />
        {name === 'password' && !hasError && (
          <p className="text-xs text-slate-500">{passwordMessage}</p>
        )}
      </div>
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    if (!isValid) return;

    const result = registerAccount({
      id: '',
      role,
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      accountStatus: 'Pending Verification',
      ...(role === 'student'
        ? {
            studentId: formData.studentNumber,
            studentNumber: formData.studentNumber,
            program: formData.program,
            section: formData.section,
            contactNumber: formData.contactNumber,
          }
        : {
            position: formData.position,
            section: formData.section,
            contactNumber: formData.contactNumber,
          }),
    });

    if (!result.success) {
      setSubmitError(result.error || duplicateEmailMessage);
      return;
    }

    resendVerificationEmail(formData.email);
    navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <BrandedHeader />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-8">
        <div className="w-full max-w-5xl">
          <Card className="shadow-lg border border-slate-200">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-900">
                    {role === 'student' ? 'Student Registration' : 'OJT Adviser Registration'}
                  </CardTitle>
                  <CardDescription>
                    Complete all required details. Email verification is needed before account activation.
                  </CardDescription>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm text-[#800000] border border-red-100 font-semibold self-start sm:self-auto">
                  <MailCheck className="h-4 w-4" />
                  Email verification required
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {submitError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 flex gap-2 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput('fullName', 'Full Name (Last Name, First Name Middle Initial)', 'e.g. Francisco, Juan S.')}
                  {renderInput('email', 'Email Address', role === 'student' ? 'student@university.edu' : 'adviser@university.edu', 'email')}
                  {renderInput('password', 'Password', 'Create a strong password', 'password')}
                  {renderInput('confirmPassword', 'Confirm Password', 'Re-enter your password', 'password')}

                  {role === 'student' ? (
                    <>
                      {renderInput('studentNumber', 'Student Number', 'YYYY-XXXXX-PQ-0')}
                      <div className="space-y-2">
                        <Label htmlFor="program">Program/Course</Label>
                        <Select value={formData.program} onValueChange={(value) => updateField('program', value)}>
                          <SelectTrigger id="program" className={fieldTouched('program') && errors.program ? 'border-red-300' : formData.program ? 'border-green-300' : ''}>
                            <SelectValue placeholder="Select program/course" />
                          </SelectTrigger>
                          <SelectContent>
                            {programOptions.map((program) => (
                              <SelectItem key={program} value={program}>{program}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FieldError message={fieldTouched('program') ? errors.program : undefined} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="section">Section</Label>
                        <Select value={formData.section} onValueChange={(value) => updateField('section', value)}>
                          <SelectTrigger id="section" className={fieldTouched('section') && errors.section ? 'border-red-300' : formData.section ? 'border-green-300' : ''}>
                            <SelectValue placeholder="Select section" />
                          </SelectTrigger>
                          <SelectContent>
                            {sectionOptions.map((section) => (
                              <SelectItem key={section} value={section}>{section}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FieldError message={fieldTouched('section') ? errors.section : undefined} />
                      </div>
                      {renderInput('contactNumber', 'Contact Number', '0917 555 0101')}
                    </>
                  ) : (
                    <>
                      {renderInput('position', 'Academic Title / Designation', 'e.g. OJT Instructor, Professor I')}
                      <div className="space-y-2">
                        <Label htmlFor="section">Assigned Section Oversight</Label>
                        <Select value={formData.section} onValueChange={(value) => updateField('section', value)}>
                          <SelectTrigger id="section" className={fieldTouched('section') && errors.section ? 'border-red-300' : formData.section ? 'border-green-300' : ''}>
                            <SelectValue placeholder="Select section to monitor" />
                          </SelectTrigger>
                          <SelectContent>
                            {sectionOptions.map((section) => (
                              <SelectItem key={section} value={section}>{section}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FieldError message={fieldTouched('section') ? errors.section : undefined} />
                      </div>
                      {renderInput('contactNumber', 'Contact Number', '0917 555 0202')}
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#800000] font-semibold hover:underline">
                      Sign in
                    </Link>
                  </p>
                  <Button type="submit" disabled={!isValid} className="bg-[#800000] hover:bg-[#6b0000] text-white disabled:opacity-50 font-bold px-6 cursor-pointer">
                    Register
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
