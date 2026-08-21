import React, { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="w-full bg-surface-container py-section-gap border-t border-outline-variant/20">
      {/* Main Footer Content */}
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter">
        {/* Brand Column */}
        <div className="space-y-6">
          <h4 className="font-headline-md text-headline-md">Aura &amp; Essence</h4>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">
            Crafting olfactory journeys through the world's most precious botanicals.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4">
            <span className="material-symbols-outlined cursor-pointer hover:text-secondary transition-colors duration-300 hover:-translate-y-1 transform">
              share
            </span>
            <span className="material-symbols-outlined cursor-pointer hover:text-secondary transition-colors duration-300 hover:-translate-y-1 transform">
              camera
            </span>
            <span className="material-symbols-outlined cursor-pointer hover:text-secondary transition-colors duration-300 hover:-translate-y-1 transform">
              mail
            </span>
          </div>
        </div>

        {/* Customer Service */}
        <div className="space-y-4">
          <h5 className="font-label-sm text-label-sm uppercase">Customer Service</h5>
          <nav className="flex flex-col gap-2">
            <FooterLink href="#" label="Contact Us" />
            <FooterLink href="#" label="Shipping &amp; Returns" />
            <FooterLink href="#" label="Fragrance Finder" />
          </nav>
        </div>

        {/* The House */}
        <div className="space-y-4">
          <h5 className="font-label-sm text-label-sm uppercase">The House</h5>
          <nav className="flex flex-col gap-2">
            <FooterLink href="#" label="Our Story" />
            <FooterLink href="#" label="Ingredients" />
            <FooterLink href="#" label="Sustainability" />
          </nav>
        </div>

        {/* Newsletter */}
        <div className="space-y-6">
          <h5 className="font-label-sm text-label-sm uppercase">Journal Subscription</h5>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Enter the world of Aura &amp; Essence.
          </p>

          <form onSubmit={handleEmailSubmit} className="relative flex items-center border-b border-on-surface py-2 group">
            <input
              className="bg-transparent w-full font-body-md focus:outline-none placeholder:text-on-surface-variant"
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
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop mt-20 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-label-sm uppercase text-on-surface-variant">
        <p>© 2024 Aura &amp; Essence. All Rights Reserved.</p>
        <div className="flex gap-6">
          <a className="hover:text-primary transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }) {
  return (
    <a
      className="font-body-md text-on-surface-variant hover:text-primary transition-colors inline-block w-fit relative group"
      href={href}
    >
      {label}
      <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
    </a>
  );
}
