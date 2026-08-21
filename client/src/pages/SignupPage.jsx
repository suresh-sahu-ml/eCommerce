import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import authService from '../services/authService';

export default function SignupPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [focusedField, setFocusedField] = useState(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const validatePasswordStrength = (password) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password),
    });
  };

  const isPasswordStrong = () => {
    return Object.values(passwordStrength).every(val => val === true);
  };

  const getLabelClasses = (fieldId) => {
    const hasValue = formData[fieldId] && formData[fieldId].length > 0;
    const isFocused = focusedField === fieldId;
    const shouldFloat = hasValue || isFocused;

    const baseClasses = "absolute left-1 font-body-md transition-all cursor-text";
    const floatUpClasses = "-top-3.5 text-xs font-label-sm uppercase tracking-widest text-secondary";
    const floatDownClasses = "top-3 text-on-surface-variant";

    return `${baseClasses} ${shouldFloat ? floatUpClasses : floatDownClasses}`;
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));

    if (id === 'password') {
      validatePasswordStrength(value);
    }
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
    setLoading(true);

    try {
      const response = await authService.signup(formData);
      navigate('/verify', {
        state: {
          userId: response.userId,
          email: response.email,
        }
      });
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <Header scrolled={scrolled} activePage={null} />
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

          {/* Signup Modal */}
          <div className="relative z-10 w-full max-w-md mx-4 bg-surface/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="px-8 pt-8 pb-6 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mb-4 shadow-inner">
                <span className="material-symbols-outlined text-secondary text-xl font-light">
                  water_drop
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-1 text-center">
                Join the Essence
              </h2>
              <p className="font-body-md text-xs text-on-surface-variant text-center max-w-[280px]">
                Create an account to curate your fragrance collection.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 pb-6 space-y-4">
              {error && (
                <div className="bg-error-container/20 border border-error/30 rounded-md p-3">
                  <p className="text-sm text-error font-body-md">{error}</p>
                </div>
              )}
              <div className="space-y-4">
                {/* Full Name */}
                <div className="relative group">
                  <input
                    className="w-full bg-transparent border-b border-outline-variant py-3 px-1 font-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
                    id="fullName"
                    placeholder="Full Name"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    onFocus={() => handleFocus('fullName')}
                    onBlur={handleBlur}
                    required
                  />
                  <label
                    className={getLabelClasses('fullName')}
                    htmlFor="fullName"
                  >
                    Full Name
                  </label>
                </div>

                {/* Email */}
                <div className="relative group">
                  <input
                    className="w-full bg-transparent border-b border-outline-variant py-3 px-1 font-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
                    id="email"
                    placeholder="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
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

                {/* Password */}
                <div className="space-y-2">
                  <div className="relative group">
                    <input
                      className="w-full bg-transparent border-b border-outline-variant py-3 px-1 font-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors pr-10"
                      id="password"
                      placeholder="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
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
                      className="absolute right-1 top-3 text-on-surface-variant hover:text-on-surface transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  {formData.password && (
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

                {/* Confirm Password */}
                <div className="relative group">
                  <input
                    className="w-full bg-transparent border-b border-outline-variant py-3 px-1 font-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors pr-10"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
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
                    className="absolute right-1 top-3 text-on-surface-variant hover:text-on-surface transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center flex-shrink-0">
                    <input
                      className="peer appearance-none w-3 h-3 border border-outline rounded-sm bg-transparent checked:bg-secondary checked:border-secondary transition-colors cursor-pointer"
                      type="checkbox"
                      id="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      required
                    />
                    <span className="material-symbols-outlined absolute text-[10px] text-on-surface opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      check
                    </span>
                  </div>
                  <span className="font-label-sm text-[11px] text-on-surface-variant group-hover:text-on-surface transition-colors uppercase tracking-wider">
                    I agree to{' '}
                    <a href="#" className="inline text-[11px] text-secondary hover:text-primary">
                      terms & conditions
                    </a>
                  </span>
                </label>
              </div>

              {/* Create Account Button */}
              <button
                className="w-full py-3 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-[0.2em] hover:bg-secondary hover:text-on-secondary transition-all duration-300 shadow-md hover:shadow-lg mt-2 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading || !isPasswordStrong() || formData.password !== formData.confirmPassword}
              >
                <span className="relative z-10">{loading ? 'Creating Account...' : 'Create Account'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              </button>
            </form>

            {/* Already have account */}
            <div className="bg-surface-container py-4 px-8 text-center">
              <p className="font-body-md text-xs text-on-surface-variant">
                Already have an account?
                <Link to="/login" className="font-label-sm uppercase tracking-wider ml-1 inline-block text-xs text-secondary hover:text-primary">
                  Sign In
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
