import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function Header({ scrolled, activePage = null }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
      setUser(authService.getUser());
      setIsAdmin(authService.isAdmin());
    };
    checkAuth();

    // Load cart count from localStorage
    const savedCount = localStorage.getItem('cartCount');
    if (savedCount) {
      setCartCount(parseInt(savedCount, 10));
    }

    // Fetch cart from backend to get actual count
    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('access_token');
        if (!token) return;

        const response = await fetch('http://localhost:8080/api/cart', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Cart count from backend:', data.itemCount);
          localStorage.setItem('cartCount', data.itemCount);
          setCartCount(data.itemCount);
        }
      } catch (error) {
        console.log('Could not fetch cart count:', error.message);
      }
    };

    // Fetch cart count when user is authenticated
    if (isAuthenticated) {
      fetchCartCount();
    }
  }, [isAuthenticated]);

  // Separate useEffect for event listeners (only on mount/unmount)
  useEffect(() => {
    const handleCartUpdate = () => {
      console.log('cartUpdated event fired');
      const updatedCount = localStorage.getItem('cartCount');
      console.log('New cart count from storage:', updatedCount);
      if (updatedCount) {
        setCartCount(parseInt(updatedCount, 10));
      }
    };

    const handleCartCountUpdated = (e) => {
      console.log('cartCountUpdated event fired with count:', e.detail.count);
      setCartCount(e.detail.count);
      localStorage.setItem('cartCount', e.detail.count);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('cartCountUpdated', handleCartCountUpdated);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('cartCountUpdated', handleCartCountUpdated);
    };
  }, []);

  const handleUserClick = () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setShowUserMenu(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled ? 'bg-surface/95 backdrop-blur-md shadow-md' : 'bg-surface'
      }`}
      id="main-header"
    >
      <div className="h-20 w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 flex items-center justify-between">
        {/* Logo - Click to go home */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-4 hover:opacity-80 transition-opacity"
        >
          <img
            alt="The Perfume Shop Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrzignGKC8X8O4J0BwH8ccYObbUJpm_JApaiK2w0rSiKB8O9P_0VB3SI0GFJ-_qRTzNVTVbK8qDEDGGlskjbm4SZuGIon44EyIDiKpkkW0oUfWYjTouiaAi3hIdWbHZuKAV_Ag_Fl6pwjNyu4ZKVSzNBptzVihLi41Dzt5oNEa9wfY7EcbhDYPv29BkqlJYcVH-qkIa5ETc0eB07JvSpxPwmOehbMeRFzrm0rmfgI0TvfxMNH48xjy"
          />
          <span className="font-headline-md text-headline-md uppercase tracking-[0.2em]">
            The Perfume Shop
          </span>
        </button>

        {/* Left Navigation */}
        <nav className="hidden md:flex flex-1 items-center gap-8 lg:gap-12 ml-8 lg:ml-12">
          {isAdmin ? (
            // Admin Navigation
            <>
              <NavLink
                onClick={() => navigate('/admin')}
                label="Products"
                isActive={activePage === 'admin'}
              />
              <NavLink
                onClick={() => navigate('/admin/orders')}
                label="Orders"
                isActive={activePage === 'admin-orders'}
              />
              <NavLink
                onClick={() => navigate('/admin/discounts')}
                label="Discounts"
                isActive={activePage === 'admin-discounts'}
              />
              <NavLink
                onClick={() => navigate('/admin/bulkupload')}
                label="Bulk Upload"
                isActive={activePage === 'admin-bulkupload'}
              />
            </>
          ) : (
            // Regular User Navigation
            <>
              <NavLink
                onClick={() => navigate('/products')}
                label="Products"
                isActive={activePage === 'products'}
              />
              <NavLink
                onClick={() => navigate('/about')}
                label="About Us"
                isActive={activePage === 'about-us'}
              />
              <NavLink
                onClick={() => navigate('/contact')}
                label="Contact Us"
                isActive={activePage === 'contact-us'}
              />
            </>
          )}
        </nav>

        {/* Right Navigation */}
        <div className="flex-1 flex items-center justify-end gap-6 sm:gap-8 md:gap-12">
          {/* Search Bar */}
          <div className="hidden sm:flex items-center gap-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              className="bg-neutral-200 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all w-40 md:w-48"
            />
            <button
              onClick={handleSearchClick}
              className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              title="Search"
            >
              <span className="material-symbols-outlined text-on-surface-variant hover:text-on-surface">
                search
              </span>
            </button>
          </div>

          {/* Wishlist - Only for non-admin users */}
          {!isAdmin && (
            <button
              onClick={() => navigate('/wishlist')}
              className="flex items-center gap-2 cursor-pointer group hover:opacity-80 transition-opacity"
              title="Wishlist"
            >
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-surface transition-colors">
                favorite
              </span>
            </button>
          )}

          {/* Shopping Bag - Only for non-admin users */}
          {!isAdmin && (
            <button
              onClick={() => navigate('/cart')}
              className="relative flex items-center gap-2 cursor-pointer group hover:opacity-80 transition-opacity"
            >
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-surface transition-colors">
                shopping_bag
              </span>
              {cartCount > 0 && (
                <span className="font-label-sm text-[10px] absolute -top-1 -right-2 bg-secondary text-on-secondary w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={handleUserClick}
              title={isAuthenticated ? `Logged in as ${user?.firstName}` : 'Click to login'}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-secondary transition-colors"
            >
              <span className="material-symbols-outlined text-on-primary text-[18px]">
                person
              </span>
            </button>

            {/* User Menu Dropdown */}
            {isAuthenticated && showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-lg overflow-hidden z-40">
                <div className="px-4 py-3 border-b border-outline-variant">
                  <p className="font-label-sm text-on-surface">{user?.firstName} {user?.lastName}</p>
                  <p className="font-label-sm text-xs text-on-surface-variant">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    navigate('/orders');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-surface-container transition-colors font-label-sm text-on-surface"
                >
                  My Orders
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-surface-container transition-colors font-label-sm text-error"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ onClick, label, isActive = false }) {
  return (
    <button
      onClick={onClick}
      className={`font-label-sm text-label-sm transition-colors uppercase relative inline-block after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-secondary hover:after:w-full after:transition-all after:duration-300 ${
        isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
      }`}
    >
      {label}
    </button>
  );
}
