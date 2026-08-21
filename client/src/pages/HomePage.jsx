import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/Home/HeroSection';
import OlfactiveSection from '../components/Home/OlfactiveSection';
import HomeFooter from '../components/Home/HomeFooter';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-surface text-on-surface font-body-md selection:bg-secondary-container">
      <Header scrolled={scrolled} activePage="home" />

      {/* Hero Section - Full Screen */}
      <HeroSection />

      {/* Rest of Content */}
      <div className="relative w-full bg-neutral-50 overflow-x-hidden">
        <div className="w-full flex flex-col">
          <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 flex flex-col">
            <div className="max-w-7xl mx-auto w-full">
              <OlfactiveSection />
            </div>
          </div>
          <HomeFooter />
        </div>
      </div>
    </div>
  );
}
