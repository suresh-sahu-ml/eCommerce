import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/About/HeroSection';
import StorySection from '../components/About/StorySection';
import DCarlemSection from '../components/About/DCarlemSection';
import CuratedExcellenceSection from '../components/About/CuratedExcellenceSection';
import CallToActionSection from '../components/About/CallToActionSection';

export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <Header scrolled={scrolled} activePage="about-us" />
      <main className="w-full pt-20 bg-surface">
        <div className="flex flex-col w-full">
          <HeroSection />
          <StorySection />
          <DCarlemSection />
          <CuratedExcellenceSection />
          <CallToActionSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
