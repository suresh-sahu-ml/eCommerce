import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import authService from '../services/authService';

export default function VerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  const userId = location.state?.userId;
  const email = location.state?.email;
  const phone = location.state?.phone;

  if (!userId) {
    navigate('/signup');
    return null;
  }

  // Timer for resend
  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newDigits = [...otpDigits];
    pasted.split('').forEach((char, i) => {
      if (i < 6) newDigits[i] = char;
    });
    setOtpDigits(newDigits);
    if (pasted.length === 6) {
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const code = otpDigits.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.verify(userId, code);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
      setSuccess('Verification successful! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');
    try {
      await authService.resendCode(userId);
      setOtpDigits(['', '', '', '', '', '']);
      setTimeLeft(59);
      setCanResend(false);
      setSuccess('Code resent successfully!');
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || 'Failed to resend code.');
    }
  };

  const maskEmail = (email) => {
    const [localPart, domain] = email.split('@');
    return `${localPart.substring(0, 1)}***@${domain}`;
  };

  const maskPhone = (phone) => {
    if (!phone) return '';
    return `***${phone.slice(-4)}`;
  };

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <Header />
      <main className="w-full pt-20 bg-surface">
        <div className="flex flex-col w-full h-full min-h-[calc(100vh-80px)] items-center justify-center relative overflow-hidden bg-surface">
          {/* Background Image */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuApbWz7j1ivDsR5hFSiaKX37LnzMV5NGkTUdefUXxxREFBqR7qbH9sIF-_dUSx6tOPcSmXy1nZxPwrJ1QFLP9nZy30eFqfvDk4DYr5ECLKnm4isedM8dYlO7kO6df88MEWY8aXjAc71HJ17WD9WxTRi0OicVyShn_j-e9CLWWK2ijwT0f95OCTMo1mHV92xFD0tc3d1Km8oRDYeaZ9tqm22SyLjCPzRo0awucHnht1n4zvCwJ6Tn-WL")',
            }}
          />

          {/* Blur Overlay */}
          <div className="absolute inset-0 bg-inverse-surface/30 backdrop-blur-md" />

          {/* Verification Modal */}
          <div className="relative z-10 w-full max-w-md mx-4 bg-surface/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="px-8 pt-10 pb-8 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-6 shadow-inner">
                <span className="material-symbols-outlined text-secondary text-2xl font-light">
                  water_drop
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2 text-center">
                Verify Your Identity
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant text-center max-w-[280px]">
                We've sent a 6-digit code to your mobile <span className="text-on-surface font-semibold">{maskPhone(phone)}</span> and email <span className="text-on-surface font-semibold">{maskEmail(email)}</span>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleVerify} className="px-8 pb-8 space-y-6">
              {error && (
                <div className="bg-error-container/20 border border-error/30 rounded-md p-3">
                  <p className="text-sm text-error font-body-md">{error}</p>
                </div>
              )}
              {success && (
                <div className="bg-green-100/20 border border-green-500/30 rounded-md p-3">
                  <p className="text-sm text-green-700 font-body-md">{success}</p>
                </div>
              )}

              {/* OTP Digits */}
              <div className="flex justify-between items-center gap-2 md:gap-4" onPaste={handlePaste}>
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 md:w-14 md:h-16 bg-transparent text-center font-display-lg text-[32px] text-on-surface focus:outline-none border-b-2 border-outline-variant focus:border-secondary transition-colors rounded-none placeholder-transparent"
                    placeholder="0"
                  />
                ))}
              </div>

              {/* Resend & Submit */}
              <div className="flex flex-col gap-6">
                <div className="flex justify-center items-center font-label-sm text-label-sm">
                  <span className="text-on-surface-variant mr-2">Didn't receive it?</span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={!canResend}
                    className="text-secondary hover:text-on-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                  >
                    {canResend ? 'Resend Code Now' : `Resend in 00:${timeLeft.toString().padStart(2, '0')}`}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpDigits.join('').length !== 6}
                  className="w-full py-4 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-[0.2em] hover:bg-secondary hover:text-on-secondary transition-all duration-300 shadow-md hover:shadow-lg mt-4 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">{loading ? 'Verifying...' : 'Verify & Proceed'}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                </button>
              </div>
            </form>

            {/* Footer Toggle */}
            <div className="bg-surface-container py-6 px-8 text-center">
              <button
                onClick={() => navigate('/signup')}
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface uppercase tracking-widest transition-colors inline-flex items-center gap-2 group"
              >
                <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">
                  arrow_back
                </span>
                Try Another Method
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
