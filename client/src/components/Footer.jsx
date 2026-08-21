import React, { useState } from 'react';
import Link from './Link';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="w-full bg-surface-container py-8 border-t border-outline-variant/20">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Brand Column */}
        <div className="space-y-3">
          <h4 className="font-headline-sm text-headline-sm">The Perfume Shop</h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
            Crafting olfactory journeys through the world's most precious botanicals.
          </p>

          {/* Social Icons */}
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-sm cursor-pointer hover:text-secondary transition-colors duration-300">
              share
            </span>
            <span className="material-symbols-outlined text-sm cursor-pointer hover:text-secondary transition-colors duration-300">
              camera
            </span>
            <span className="material-symbols-outlined text-sm cursor-pointer hover:text-secondary transition-colors duration-300">
              mail
            </span>
          </div>
        </div>

        {/* Customer Service */}
        <div className="space-y-2">
          <h5 className="font-label-xs text-label-xs uppercase text-on-surface-variant">Customer Service</h5>
          <nav className="flex flex-col gap-1">
            <Link href="/contact" className="font-body-sm text-body-sm hover:text-primary transition-colors">
              Contact Us
            </Link>
            <Link href="/shipping-returns" className="font-body-sm text-body-sm hover:text-primary transition-colors">
              Shipping &amp; Returns
            </Link>
            <Link href="/fragrance-finder" className="font-body-sm text-body-sm hover:text-primary transition-colors">
              Fragrance Finder
            </Link>
          </nav>
        </div>

        {/* The House */}
        <div className="space-y-2">
          <h5 className="font-label-xs text-label-xs uppercase text-on-surface-variant">The House</h5>
          <nav className="flex flex-col gap-1">
            <Link href="/our-story" className="font-body-sm text-body-sm hover:text-primary transition-colors">
              Our Story
            </Link>
            <Link href="/products" className="font-body-sm text-body-sm hover:text-primary transition-colors">
              Our Collection
            </Link>
            <Link href="/about" className="font-body-sm text-body-sm hover:text-primary transition-colors">
              Learn More
            </Link>
          </nav>
        </div>

        {/* Newsletter */}
        <div className="space-y-3">
          <h5 className="font-label-xs text-label-xs uppercase text-on-surface-variant">Journal Subscription</h5>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Enter the world of The Perfume Shop.
          </p>

          <form onSubmit={handleEmailSubmit} className="relative flex items-center border-b border-on-surface py-1 group">
            <input
              className="bg-transparent w-full font-body-sm text-sm focus:outline-none placeholder:text-on-surface-variant"
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="cursor-pointer transition-transform duration-300 group-focus-within:translate-x-2 hover:translate-x-2"
            >
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6 pt-4 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs font-label-xs uppercase">
        <p className="text-on-surface-variant">© The Perfume Shop. All Rights Reserved.</p>
        <div className="flex gap-4">
          <Link href="/privacy-policy" className="text-xs hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="text-xs hover:text-primary transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}