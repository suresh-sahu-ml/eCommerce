import React, { useState } from 'react';
import Link from './Link';

export default function SignupModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup attempt:', formData);
    // Add signup logic here
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
            Join the Essence
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant text-center max-w-[280px]">
            Create an account to curate your personal fragrance collection.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
          <div className="space-y-4">
            {/* Full Name */}
            <div className="relative group">
              <input
                className="w-full bg-transparent border-b border-outline-variant py-3 px-1 font-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors peer placeholder-transparent"
                id="fullName"
                placeholder="Full Name"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <label
                className="absolute left-1 top-3 font-body-md text-on-surface-variant transition-all peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-secondary peer-focus:font-label-sm peer-focus:uppercase peer-focus:tracking-widest peer-valid:-top-3.5 peer-valid:text-xs peer-valid:font-label-sm peer-valid:uppercase peer-valid:tracking-widest cursor-text"
                htmlFor="fullName"
              >
                Full Name
              </label>
            </div>

            {/* Email */}
            <div className="relative group">
              <input
                className="w-full bg-transparent border-b border-outline-variant py-3 px-1 font-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors peer placeholder-transparent"
                id="email"
                placeholder="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label
                className="absolute left-1 top-3 font-body-md text-on-surface-variant transition-all peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-secondary peer-focus:font-label-sm peer-focus:uppercase peer-focus:tracking-widest peer-valid:-top-3.5 peer-valid:text-xs peer-valid:font-label-sm peer-valid:uppercase peer-valid:tracking-widest cursor-text"
                htmlFor="email"
              >
                Email Address
              </label>
            </div>

            {/* Phone */}
            <div className="relative group">
              <input
                className="w-full bg-transparent border-b border-outline-variant py-3 px-1 font-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors peer placeholder-transparent"
                id="phone"
                placeholder="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <label
                className="absolute left-1 top-3 font-body-md text-on-surface-variant transition-all peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-secondary peer-focus:font-label-sm peer-focus:uppercase peer-focus:tracking-widest peer-valid:-top-3.5 peer-valid:text-xs peer-valid:font-label-sm peer-valid:uppercase peer-valid:tracking-widest cursor-text"
                htmlFor="phone"
              >
                Phone Number
              </label>
            </div>

            {/* Password */}
            <div className="relative group">
              <input
                className="w-full bg-transparent border-b border-outline-variant py-3 px-1 font-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors peer placeholder-transparent pr-10"
                id="password"
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
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

            {/* Confirm Password */}
            <div className="relative group">
              <input
                className="w-full bg-transparent border-b border-outline-variant py-3 px-1 font-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors peer placeholder-transparent pr-10"
                id="confirmPassword"
                placeholder="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <label
                className="absolute left-1 top-3 font-body-md text-on-surface-variant transition-all peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-secondary peer-focus:font-label-sm peer-focus:uppercase peer-focus:tracking-widest peer-valid:-top-3.5 peer-valid:text-xs peer-valid:font-label-sm peer-valid:uppercase peer-valid:tracking-widest cursor-text"
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
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  className="peer appearance-none w-4 h-4 border border-outline rounded-sm bg-transparent checked:bg-secondary checked:border-secondary transition-colors cursor-pointer"
                  type="checkbox"
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  required
                />
                <span className="material-symbols-outlined absolute text-[12px] text-on-surface opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                  check
                </span>
              </div>
              <span className="font-label-sm text-xs text-on-surface-variant group-hover:text-on-surface transition-colors uppercase tracking-wider">
                I agree to{' '}
                <Link href="#" variant="secondary" className="inline text-xs">
                  terms & conditions
                </Link>
              </span>
            </label>
          </div>

          {/* Create Account Button */}
          <button
            className="w-full py-4 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-[0.2em] hover:bg-secondary hover:text-on-secondary transition-all duration-300 shadow-md hover:shadow-lg mt-4 relative overflow-hidden group"
            type="submit"
          >
            <span className="relative z-10">Create Account</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
          </button>
        </form>

        {/* Already have account */}
        <div className="bg-surface-container py-6 px-8 text-center">
          <p className="font-body-md text-sm text-on-surface-variant">
            Already have an account?
            <button
              onClick={handleClose}
              className="font-label-sm text-secondary hover:text-secondary-fixed-dim uppercase tracking-wider ml-2 transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-secondary hover:after:w-full after:transition-all after:duration-300 inline-block"
            >
              Sign In
            </button>
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
