import React, { useState } from 'react';
import Link from './Link';

export default function LoginModal({ isOpen, onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password, rememberMe });
    // Add login logic here
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-inverse-surface/30 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-md mx-4 bg-surface/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
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
          <div className="space-y-5">
            {/* Email Input */}
            <div className="relative group">
              <input
                className="w-full bg-transparent border-b border-outline-variant py-3 px-1 font-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors peer placeholder-transparent"
                id="email"
                placeholder="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label
                className="absolute left-1 top-3 font-body-md text-on-surface-variant transition-all peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-secondary peer-focus:font-label-sm peer-focus:uppercase peer-focus:tracking-widest peer-valid:-top-3.5 peer-valid:text-xs peer-valid:font-label-sm peer-valid:uppercase peer-valid:tracking-widest cursor-text"
                htmlFor="email"
              >
                Email Address
              </label>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <input
                className="w-full bg-transparent border-b border-outline-variant py-3 px-1 font-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors peer placeholder-transparent pr-10"
                id="password"
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label
                className="absolute left-1 top-3 font-body-md text-on-surface-variant transition-all peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-secondary peer-focus:font-label-sm peer-focus:uppercase peer-focus:tracking-widest peer-valid:-top-3.5 peer-valid:text-xs peer-valid:font-label-sm peer-valid:uppercase peer-valid:tracking-widest cursor-text"
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
            <Link
              href="#"
              variant="secondary"
              className="font-label-sm text-xs uppercase tracking-wider"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            className="w-full py-4 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-[0.2em] hover:bg-secondary hover:text-on-secondary transition-all duration-300 shadow-md hover:shadow-lg mt-4 relative overflow-hidden group"
            type="submit"
          >
            <span className="relative z-10">Log In</span>
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

          <div className="grid grid-cols-2 gap-3">
            {/* Google */}
            <button
              className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface font-label-sm text-xs uppercase tracking-wider group"
              type="button"
            >
              <svg
                className="w-4 h-4 text-on-surface group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
              </svg>
              Google
            </button>

            {/* Facebook */}
            <button
              className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface font-label-sm text-xs uppercase tracking-wider group"
              type="button"
            >
              <svg
                className="w-4 h-4 text-on-surface group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
              </svg>
              Facebook
            </button>

            {/* Microsoft */}
            <button
              className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface font-label-sm text-xs uppercase tracking-wider group"
              type="button"
            >
              <svg
                className="w-4 h-4 text-on-surface group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
              </svg>
              Microsoft
            </button>

            {/* Instagram */}
            <button
              className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface font-label-sm text-xs uppercase tracking-wider group"
              type="button"
            >
              <svg
                className="w-4 h-4 text-on-surface group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              Instagram
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="bg-surface-container py-6 px-8 text-center">
          <p className="font-body-md text-sm text-on-surface-variant">
            New to our store?
            <Link
              href="#"
              variant="secondary"
              className="font-label-sm uppercase tracking-wider ml-2 inline-block"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

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
