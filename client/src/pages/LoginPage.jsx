import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import authService from '../services/authService';
import keycloak from '../services/keycloakConfig';

export default function LoginPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const getLabelClasses = (fieldId) => {
    const hasValue = fieldId === 'email' ? email.length > 0 : password.length > 0;
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

  React.useEffect(() => {
    // Check if user is already authenticated via Keycloak
    if (keycloak && keycloak.authenticated) {
      console.log('User already authenticated via Keycloak');
      const token = keycloak.token;
      if (token) {
        // Store Keycloak token
        localStorage.setItem('token', token);

        // Extract user info from Keycloak token
        if (keycloak.tokenParsed) {
          localStorage.setItem('user', JSON.stringify({
            userId: keycloak.tokenParsed.sub,
            email: keycloak.tokenParsed.email,
            firstName: keycloak.tokenParsed.given_name,
            lastName: keycloak.tokenParsed.family_name,
          }));
        }

        // Redirect to home
        navigate('/');
      }
    }
  }, [navigate]);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
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

          {/* Login Modal */}
          <div className="relative z-10 w-full max-w-md mx-4 bg-surface/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="px-8 pt-10 pb-8 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-6 shadow-inner">
                <span className="material-symbols-outlined text-secondary text-2xl font-light">
                  water_drop
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2 text-center">
                Welcome Back
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant text-center max-w-[280px]">
                Enter your details to access your curated fragrance collection.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
              {error && (
                <div className="bg-error-container/20 border border-error/30 rounded-md p-3">
                  <p className="text-sm text-error font-body-md">{error}</p>
                </div>
              )}
              <div className="space-y-5">
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
                  />
                  <label
                    className={getLabelClasses('email')}
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                </div>

                {/* Password Input */}
                <div className="relative group">
                  <input
                    className="w-full bg-transparent border-b border-outline-variant py-3 px-1 font-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors pr-10"
                    id="password"
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => handleFocus('password')}
                    onBlur={handleBlur}
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
              </div>

              {/* Remember & Forgot */}
              <div className="flex justify-between items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      className="peer appearance-none w-4 h-4 border border-outline rounded-sm bg-transparent checked:bg-primary checked:border-primary transition-colors cursor-pointer"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="material-symbols-outlined absolute text-[12px] text-on-primary opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      check
                    </span>
                  </div>
                  <span className="font-label-sm text-xs text-on-surface-variant group-hover:text-on-surface transition-colors uppercase tracking-wider">
                    Remember me
                  </span>
                </label>
                <Link to="/forgot-password" className="font-label-sm text-xs uppercase tracking-wider text-secondary hover:text-primary">
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                className="w-full py-4 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-[0.2em] hover:bg-secondary hover:text-on-secondary transition-all duration-300 shadow-md hover:shadow-lg mt-4 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                <span className="relative z-10">{loading ? 'Logging In...' : 'Log In'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              </button>
            </form>

            {/* Social Login */}
            <div className="px-8 pb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-outline-variant/50 flex-1" />
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-[0.2em]">
                  Or Continue With
                </span>
                <div className="h-px bg-outline-variant/50 flex-1" />
              </div>

              <div className="grid grid-cols-4 gap-4 w-full">
                {/* Google */}
                <button
                  className="flex items-center justify-center p-3 rounded-md bg-surface-container-lowest hover:bg-surface-container-low transition-colors shadow-sm group cursor-pointer"
                  type="button"
                  onClick={() => {
                    console.log('🔵 Google login clicked');
                    authService.loginWithGoogle();
                  }}
                  title="Sign in with Google"
                >
                  <svg
                    className="w-5 h-5 text-on-surface opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none"
                    fill="#4285F4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                </button>

                {/* Facebook */}
                <button
                  className="flex items-center justify-center p-3 rounded-md bg-surface-container-lowest hover:bg-surface-container-low transition-colors shadow-sm group cursor-pointer"
                  type="button"
                  onClick={() => {
                    console.log('🔵 Facebook login clicked');
                    authService.loginWithFacebook();
                  }}
                  title="Sign in with Facebook"
                >
                  <svg
                    className="w-5 h-5 text-[#1877F2] opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>

                {/* Microsoft */}
                <button
                  className="flex items-center justify-center p-3 rounded-md bg-surface-container-lowest hover:bg-surface-container-low transition-colors shadow-sm group cursor-pointer"
                  type="button"
                  onClick={() => {
                    console.log('🔵 Microsoft login clicked');
                    authService.loginWithMicrosoft();
                  }}
                  title="Sign in with Microsoft"
                >
                  <svg
                    className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none"
                    fill="none"
                    viewBox="0 0 21 21"
                  >
                    <path d="M10 0H0v10h10V0z" fill="#f25022" />
                    <path d="M21 0H11v10h10V0z" fill="#7fba00" />
                    <path d="M10 11H0v10h10V11z" fill="#00a4ef" />
                    <path d="M21 11H11v10h10V11z" fill="#ffb900" />
                  </svg>
                </button>

                {/* LinkedIn */}
                <button
                  className="flex items-center justify-center p-3 rounded-md bg-surface-container-lowest hover:bg-surface-container-low transition-colors shadow-sm group cursor-pointer"
                  type="button"
                  onClick={() => {
                    console.log('🔵 LinkedIn login clicked');
                    authService.loginWithLinkedin();
                  }}
                  title="Sign in with LinkedIn"
                >
                  <svg
                    className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none"
                    fill="#0A66C2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.474-2.23-1.66-2.23-1.016 0-1.62.683-1.884 1.344-.097.23-.121.551-.121.883v5.572h-3.54s.05-9.035 0-9.976h3.54v1.413c.44-.678 1.228-1.645 2.989-1.645 2.183 0 3.82 1.428 3.82 4.501v5.707zM5.337 8.855c-1.144 0-1.915-.761-1.915-1.713 0-.953.77-1.713 1.96-1.713 1.188 0 1.915.76 1.94 1.713 0 .952-.752 1.713-1.985 1.713zm1.946 11.597H3.392V9.476h3.891v10.976zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="bg-surface-container py-6 px-8 text-center">
              <p className="font-body-md text-sm text-on-surface-variant">
                New to our store?
                <Link to="/signup" className="font-label-sm uppercase tracking-wider ml-2 inline-block text-secondary hover:text-primary">
                  Create an account
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
