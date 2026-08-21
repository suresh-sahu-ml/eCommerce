import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function Header({ scrolled, activePage = null }) {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  const handleUserClick = () => {
    if (isAuthenticated) {
      authService.logout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled ? 'bg-surface/95 backdrop-blur-md shadow-md' : ''
      }`}
      id="main-header"
    >
      <div className="h-20 max-w-[1440px] mx-auto px-margin-desktop flex items-center justify-between">
        {/* Left Navigation */}
        <nav
          className="flex-1 flex items-center gap-gutter"
          data-active-classes="text-primary border-b border-primary"
        >
          <NavLink to="/products" label="Products" isActive={activePage === 'products'} />
          <NavLink to="/about" label="About Us" isActive={activePage === 'about'} />
        </nav>

        {/* Logo & Brand */}
        <div className="flex-shrink-0 flex items-center justify-center gap-4">
          <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <img
              alt="The Perfume Shop Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrzignGKC8X8O4J0BwH8ccYObbUJpm_JApaiK2w0rSiKB8O9P_0VB3SI0GFJ-_qRTzNVTVbK8qDEDGGlskjbm4SZuGIon44EyIDiKpkkW0oUfWYjTouiaAi3hIdWbHZuKAV_Ag_Fl6pwjNyu4ZKVSzNBptzVihLi41Dzt5oNEa9wfY7EcbhDYPv29BkqlJYcVH-qkIa5ETc0eB07JvSpxPwmOehbMeRFzrm0rmfgI0TvfxMNH48xjy"
            />
            <span className="font-headline-md text-headline-md uppercase tracking-[0.2em]">
              Aura &amp; Essence
            </span>
          </Link>
        </div>

        {/* Right Navigation */}
        <div className="flex-1 flex items-center justify-end gap-gutter">
          {/* Shopping Bag */}
          <div className="relative flex items-center gap-2 cursor-pointer group">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-surface transition-colors">
              shopping_bag
            </span>
            <span className="font-label-sm text-[10px] absolute -top-1 -right-2 bg-secondary text-on-secondary w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </div>

          {/* User Profile */}
          <div
            onClick={handleUserClick}
            title={isAuthenticated ? `Logged in as ${user?.firstName}` : 'Click to login'}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-2 cursor-pointer hover:bg-secondary transition-colors"
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">
              person
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, label, isActive = false }) {
  return (
    <Link
      to={to}
      className={`font-label-sm text-label-sm transition-colors uppercase relative group ${
        isActive
          ? 'text-primary font-bold'
          : 'text-on-surface-variant hover:text-on-surface'
      }`}
    >
      {label}
      <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-on-surface origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
    </Link>
  );
}
