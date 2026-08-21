import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import authService from '../services/authService';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const token = searchParams.get('token');

  const getLabelClasses = (fieldId) => {
    const hasValue = fieldId === 'password' ? password.length > 0 : confirmPassword.length > 0;
    const isFocused = focusedField === fieldId;
    const shouldFloat = hasValue || isFocused;

    const baseClasses = "absolute left-1 font-body-md transition-all cursor-text";
    const floatUpClasses = "-top-3.5 text-xs font-label-sm uppercase tracking-widest text-secondary";
    const floatDownClasses = "top-3 text-on-surface-variant";

    return `${baseClasses} ${shouldFloat ? floatUpClasses : floatDownClasses}`;
  };

  const validatePasswordStrength = (pwd) => {
    setPasswordStrength({
      hasMinLength: pwd.length >= 8,
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecialChar: /[!@#$%^&*]/.test(pwd),
    });
  };

  const isPasswordStrong = () => {
    return Object.values(passwordStrength).every(val => val === true);
  };

  const handleFocus = (fieldId) => {
    setFocusedField(fieldId);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new one.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Please enter a new password');
      return;
    }

    if (!confirmPassword.trim()) {
      setError('Please confirm your password');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.resetPassword(token, password, confirmPassword);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
      setSuccess(true);
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => navigate('/'), 500);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <Header />
      <main className="w-full pt-20 bg-surface">
        <div className={`flex flex-col w-full h-full min-h-[calc(100vh-80px)] items-center justify-center relative overflow-hidden bg-surface transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
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

          {/* Reset Password Modal */}
          <div className={`relative z-10 w-full max-w-md mx-4 bg-surface/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden ${success ? 'scale-95 opacity-0 transition-all duration-500' : 'animate-fade-in-up'}`}>
            {/* Top accent line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-secondary/30 to-transparent"></div>

            {/* Header */}
            <div className="px-8 pt-10 pb-8 flex flex-col items-center">
              {/* Lock Icon */}
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-6 shadow-inner">
                <span className="material-symbols-outlined text-secondary text-2xl font-light">
                  lock
                </span>
              </div>

              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2 text-center">
                Create New Password
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant text-center max-w-[280px]">
                Enter your new password below to restore access to your account.
              </p>
            </div>

            {/* Success Content */}
            {success && (
              <div className="px-8 py-12 flex flex-col items-center text-center space-y-4 animate-fade-in-up">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-green-600 text-4xl">
                    check_circle
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  Password Reset Successfully!
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Your password has been updated. You'll be redirected to the home page shortly.
                </p>
              </div>
            )}

            {/* Form */}
            {!success && (
            <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
              {error && (
                <div className="bg-error-container/20 border border-error/30 rounded-md p-3">
                  <p className="text-sm text-error font-body-md">{error}</p>
                </div>
              )}

              {/* Password Input */}
              <div className="space-y-2">
                <div className="relative group">
                  <input
                    className="w-full bg-transparent border-b border-outline-variant py-3 px-1 font-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors pr-10"
                    id="password"
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePasswordStrength(e.target.value);
                    }}
                    onFocus={() => handleFocus('password')}
                    onBlur={handleBlur}
                    required
                  />
                  <label
                    className={getLabelClasses('password')}
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-3 text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {password && (
                  <div className="text-xs space-y-1 pl-1">
                    <div className={`flex items-center gap-2 ${passwordStrength.hasMinLength ? 'text-emerald-600' : 'text-on-surface-variant'}`}>
                      <span>{passwordStrength.hasMinLength ? '✓' : '○'}</span>
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.hasUppercase ? 'text-emerald-600' : 'text-on-surface-variant'}`}>
                      <span>{passwordStrength.hasUppercase ? '✓' : '○'}</span>
                      <span>1 uppercase letter (A-Z)</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.hasLowercase ? 'text-emerald-600' : 'text-on-surface-variant'}`}>
                      <span>{passwordStrength.hasLowercase ? '✓' : '○'}</span>
                      <span>1 lowercase letter (a-z)</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.hasNumber ? 'text-emerald-600' : 'text-on-surface-variant'}`}>
                      <span>{passwordStrength.hasNumber ? '✓' : '○'}</span>
                      <span>1 number (0-9)</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.hasSpecialChar ? 'text-emerald-600' : 'text-on-surface-variant'}`}>
                      <span>{passwordStrength.hasSpecialChar ? '✓' : '○'}</span>
                      <span>1 special character (!@#$%^&*)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="relative group">
                <input
                  className="w-full bg-transparent border-b border-outline-variant py-3 px-1 font-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors pr-10"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => handleFocus('confirmPassword')}
                  onBlur={handleBlur}
                  required
                />
                <label
                  className={getLabelClasses('confirmPassword')}
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-1 top-3 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">
                    {showConfirm ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>

              {/* Buttons */}
              <div className="pt-4 flex flex-col gap-6 w-full">
                <button
                  type="submit"
                  disabled={loading || !token || !isPasswordStrong() || password !== confirmPassword}
                  className="w-full py-4 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-[0.2em] hover:bg-secondary hover:text-on-secondary transition-all duration-300 shadow-md hover:shadow-lg mt-4 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <span className="material-symbols-outlined text-[18px] animate-spin">
                          progress_activity
                        </span>
                        Resetting...
                      </>
                    ) : (
                      <>
                        Reset Password
                        <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform duration-300">
                          arrow_forward
                        </span>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full py-4 bg-transparent text-on-surface font-label-sm text-label-sm uppercase tracking-[0.2em] border-[0.5px] border-outline-variant hover:border-primary hover:bg-primary/5 transition-all duration-300 relative overflow-hidden group flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform duration-300">
                    arrow_back
                  </span>
                  Back to Login
                </button>
              </div>
            </form>
            )}

            {/* Footer */}
            <div className="bg-surface-container-low py-6 px-8 border-t-[0.5px] border-outline-variant/30 flex justify-center">
              <span className="font-headline-md text-[14px] uppercase tracking-[0.2em] text-on-surface-variant/60">
                Aura & Essence
              </span>
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
