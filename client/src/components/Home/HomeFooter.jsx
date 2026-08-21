import React from 'react';
import Link from '../Link';

export default function HomeFooter() {
  return (
    <footer className="mt-4 py-6 border-t border-neutral-200 w-full">
      <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6">
        {/* Brand Section */}
        <div className="max-w-xs">
          <h3 className="font-headline-md text-xl mb-4">The Perfume Shop</h3>
          <p className="text-sm text-neutral-500 font-light leading-relaxed">
            Curating the world's most exceptional olfactory experiences since 2019. Your scent is your signature.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-8">
          {/* Shop Column */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-xs uppercase tracking-widest mb-2">Shop</span>
            <Link href="#" className="text-sm text-neutral-500 hover:text-black">
              Bestsellers
            </Link>
            <Link href="#" className="text-sm text-neutral-500 hover:text-black">
              New Arrivals
            </Link>
            <Link href="#" className="text-sm text-neutral-500 hover:text-black">
              Sample Sets
            </Link>
          </div>

          {/* Explore Column */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-xs uppercase tracking-widest mb-2">Explore</span>
            <Link href="/our-story" className="text-sm text-neutral-500 hover:text-black">
              Our Story
            </Link>
            <Link href="#" className="text-sm text-neutral-500 hover:text-black">
              Olfactive Guide
            </Link>
            <a
              href="https://maps.google.com/?q=The+Perfume+Shop,+Sangareddy,+Telangana,+502001"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-500 hover:text-black"
            >
              Visit our shop
            </a>
          </div>
        </div>
      </div>

        {/* Bottom Section */}
        <div className="mt-4 pt-4 flex justify-between items-center text-[10px] text-neutral-400 uppercase tracking-widest border-t border-neutral-200">
          <span>© The Perfume Shop</span>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="text-[10px] hover:text-neutral-600">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-[10px] hover:text-neutral-600">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
