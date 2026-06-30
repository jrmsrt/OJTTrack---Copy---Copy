import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BrandedHeader } from '../../components/BrandedHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

export function OtpVerification() {
  const navigate = useNavigate();
  const { getPendingOtp, verifyOtp, resendOtp } = useAuth();
  
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const otpCode = useMemo(() => otpValues.join(''), [otpValues]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [error, setError] = useState('');

  const handleChange = (value: string, index: number) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      setOtpValues(prev => {
        const newValues = [...prev];
        newValues[index] = '';
        return newValues;
      });
      return;
    }

    const digits = cleaned.split('');
    
    setOtpValues(prev => {
      const newValues = [...prev];
      for (let j = 0; j < digits.length && index + j < 6; j++) {
        newValues[index + j] = digits[j];
      }
      return newValues;
    });

    const nextIndex = Math.min(index + digits.length, 5);
    setTimeout(() => {
      inputRefs.current[nextIndex]?.focus();
      inputRefs.current[nextIndex]?.select();
    }, 0);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      
      setOtpValues(prev => {
        const newValues = [...prev];
        if (prev[index] === '') {
          const prevIndex = Math.max(0, index - 1);
          newValues[prevIndex] = '';
          setTimeout(() => {
            inputRefs.current[prevIndex]?.focus();
            inputRefs.current[prevIndex]?.select();
          }, 0);
        } else {
          newValues[index] = '';
        }
        return newValues;
      });
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const newValues = [...otpValues];
      const digits = pastedData.split('');
      for (let i = 0; i < 6; i++) {
        newValues[i] = digits[i] || '';
      }
      setOtpValues(newValues);
      
      const focusIndex = Math.min(pastedData.length, 5);
      setTimeout(() => {
        inputRefs.current[focusIndex]?.focus();
        inputRefs.current[focusIndex]?.select();
      }, 0);
    }
  };
  const [pendingOtp, setPendingOtp] = useState(() => getPendingOtp());
  const [secondsRemaining, setSecondsRemaining] = useState(300);
  const [resendSeconds, setResendSeconds] = useState(30);

  useEffect(() => {
    if (!pendingOtp) {
      navigate('/login');
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(0, Math.ceil((new Date(pendingOtp.expiresAt).getTime() - Date.now()) / 1000));
      setSecondsRemaining(remaining);
    };

    updateTimer();
    const interval = window.setInterval(updateTimer, 1000);
    return () => window.clearInterval(interval);
  }, [navigate, pendingOtp]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setResendSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const isExpired = secondsRemaining <= 0;
  const maskedEmail = useMemo(() => pendingOtp?.email || 'your PUP Webmail', [pendingOtp]);

  const handleSubmit = (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    const result = verifyOtp(otpCode);

    if (!result.success) {
      setError(result.error || 'Unable to verify OTP. Please try again.');
      return;
    }

    setError('');
    navigate(pendingOtp?.purpose === 'passwordReset' ? '/change-password' : '/password-decision');
  };

  useEffect(() => {
    if (otpCode.length === 6) {
      handleSubmit();
    }
  }, [otpCode]);

  const handleResend = () => {
    const result = resendOtp();

    if (!result.success) {
      setError(result.error || 'Unable to resend OTP. Please log in again.');
      return;
    }

    setPendingOtp(getPendingOtp());
    setOtpValues(['', '', '', '', '', '']);
    setError('');
    setResendSeconds(30);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <BrandedHeader />
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-[420px] rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="text-center px-6 pt-7 pb-3 gap-1">
            <CardTitle className="text-2xl font-bold leading-tight text-slate-900">OTP Verification</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              We sent a secure One-Time Password to your PUP Webmail.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {localStorage.getItem('lastOtpPreview') && (
              <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-2.5 text-[10px] text-blue-700 text-center font-sans">
                <span>[Dev Mode] The OTP code generated is: <strong className="font-bold text-sm text-blue-900">{localStorage.getItem('lastOtpPreview')}</strong></span>
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 flex gap-2 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className={`mb-5 flex h-10 items-center justify-between rounded-lg border px-4 text-xs ${isExpired ? 'border-red-200 bg-red-50 text-red-700' : 'border-[#ffd36b] bg-[#fff2cc] text-[#6f5415]'}`}>
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="h-3.5 w-3.5" />
                Code expires in:
              </span>
              <span className="text-sm font-bold text-[#990000]">{isExpired ? 'EXPIRED' : formatSeconds(secondsRemaining)}</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 block text-center">Enter 6-Digit OTP</Label>
                <div className="flex justify-between gap-1.5 max-w-[280px] mx-auto">
                  {otpValues.map((value, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      id={`otp-${idx}`}
                      type="text"
                      value={value}
                      onChange={(event) => handleChange(event.target.value, idx)}
                      onKeyDown={(event) => handleKeyDown(event, idx)}
                      onPaste={handlePaste}
                      inputMode="numeric"
                      maxLength={6}
                      className="h-11 w-9 border border-slate-200 bg-slate-50 text-center text-lg font-bold rounded-lg transition-all duration-200 focus:border-[#800000] focus:ring-[3px] focus:ring-[#800000]/20 focus:shadow-[0_0_10px_rgba(128,0,0,0.15)] outline-none"
                      disabled={isExpired}
                      required
                    />
                  ))}
                </div>
                <p className="text-center text-[10px] text-slate-400 pt-1 leading-normal">Please enter the 6-digit verification code sent to {maskedEmail}.</p>
              </div>

              <Button
                type="submit"
                disabled={otpCode.length !== 6 || isExpired}
                className="h-11 w-full rounded-lg bg-[#800000] hover:bg-[#6b0000] text-sm font-bold text-white shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:bg-[#b85b5b]"
              >
                Verify OTP
              </Button>
            </form>

            <div className="mt-5 text-center text-xs text-slate-500">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendSeconds > 0}
                className="font-semibold text-[#800000] hover:underline disabled:cursor-not-allowed disabled:text-slate-400"
              >
                Resend OTP {resendSeconds > 0 ? `(Wait ${resendSeconds}s)` : ''}
              </button>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-4 text-center">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#800000]">
                <ArrowLeft className="h-3.5 w-3.5" />
                Cancel
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
