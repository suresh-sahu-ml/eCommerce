import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import authService from '../services/authService';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const getLabelClasses = (fieldId) => {
    const hasValue = email.length > 0;
    const isFocused = focusedField === fieldId;
    const shouldFloat = hasValue || isFocused;

    const baseClasses = "absolute left-1 font-body-md transition-all cursor-text";
    const floatUpClasses = "-top-3.5 text-xs font-label-sm uppercase tracking-widest text-secondary";
    const floatDownClasses = "top-3 text-on-surface-variant";

    return `${baseClasses} ${shouldFloat ? floatUpClasses : floatDownClasses}`;
  };

  const handleFocus = (fieldId) => {
    setFocusedField(fieldId);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSuccess('Password reset link sent to your email! Check your inbox.');
      setEmail('');
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => navigate('/login'), 500);
      }, 2500);
    } catch (err) {
      setError(err.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <Header />
      <main className="w-full pt-20 bg-surface">
        <div className={`flex flex-col w-full h-full min-h-[calc(100vh-80px)] items-center justify-center px-5 py-12 relative overflow-hidden transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
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
          {/* Modal Card */}
          <div className="relative z-10 w-full max-w-md mx-4 bg-surface/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
            {/* Content */}
            <div className="px-8 pt-12 pb-8 md:px-10 md:pt-16 md:pb-10 flex flex-col items-center text-center">
              {/* Lock Icon */}
              <div className="mb-8 w-12 h-12 rounded-full bg-surface-container flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-secondary text-2xl font-light">
                  lock_reset
                </span>
              </div>

              {/* Title */}
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-3">
                Reset Password
              </h2>

              {/* Description */}
              <p className="font-body-md text-body-md text-on-surface-variant mb-10">
                Enter the email address associated with your account and we'll send you a link to restore your access.
              </p>

              {/* Error Message */}
              {error && (
                <div className="w-full mb-6 p-3 bg-error-container/20 border border-error/30 rounded-md">
                  <p className="text-sm text-error font-body-md">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="w-full mb-6 p-3 bg-green-100/20 border border-green-500/30 rounded-md">
                  <p className="text-sm text-green-700 font-body-md">{success}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="w-full space-y-8">
                {/* Email Input */}
                <div className="relative group">
                  <input
                    className="w-full bg-transparent border-b border-outline-variant py-3 px-1 font-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
                    id="email"
                    placeholder="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                    required
                  />
                  <label
                    className={getLabelClasses('email')}
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest py-4 px-8 hover:bg-secondary transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[16px] animate-spin">
                        progress_activity
                      </span>
                      Sending...
                    </span>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </div>

            {/* Footer Section */}
            <div className="bg-surface-container/60 py-6 px-8 border-t border-outline-variant/30 text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="font-label-sm text-label-sm uppercase tracking-wider text-secondary hover:text-primary transition-colors"
                >
                  Back to Login
                </Link>
              </p>
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
