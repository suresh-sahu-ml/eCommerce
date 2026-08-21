import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const heroParallax = useRef(null);
  const heroContent = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth > 768 && heroContent.current) {
        const scrolled = window.pageYOffset;
        const heroHeight = window.innerHeight;

        if (scrolled <= heroHeight) {
          // Content floating effect
          heroContent.current.style.transform = `translateY(${scrolled * 0.15}px)`;
          heroContent.current.style.opacity = Math.max(0, 1 - scrolled / 600);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center overflow-hidden"
      ref={heroParallax}
    >
      {/* Background with gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJN5ru2Il3Sgf8uawk6tvYCsoirz_Q-wsriioI1f8jBjpDNq1Gp02kWrZg41JFDkea5qep_96JVYD3PV8k69HvfkboopeeC01NP-A8hNbDHBMiPqN9vRweMzE9QloW9mp62USlFqAEvtpBm-pu72MGRCBWJukSpRuET0Bq4PrGmKrGd-2vvnv3a8zPDtY8wSOd6hRh7pKaDMQ0xG0sqpq9x6Xt1wg2TWBCl8RLTSvAfjXPy_YZY9gL')`,
        }}
      />

      {/* Content - Centered */}
      <div className="relative z-10 flex items-center justify-center h-full w-full">
        <div
          ref={heroContent}
          className="flex flex-col gap-6 text-center max-w-4xl px-4 sm:px-8 items-center"
        >
          <h1 className="text-white font-display-lg text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-[-0.033em]">
            The Art of Scent
          </h1>
          <h2 className="text-white text-sm sm:text-base md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Discover your signature aura through our curated collection of artisanal fragrances.
          </h2>

          <button
            onClick={() => navigate('/products')}
            className="mt-6 flex items-center justify-center overflow-hidden rounded-xl h-12 px-8 bg-white text-black hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 active:scale-95 text-base font-bold"
          >
            <span className="truncate">Explore Collections</span>
          </button>
        </div>
      </div>

      {/* Scroll Indicator - Clickable */}
      <button
        onClick={() => {
          // Scroll to just past the hero section
          window.scrollTo({
            top: window.innerHeight - 60,
            behavior: 'smooth',
          });
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce cursor-pointer hover:opacity-100 transition-opacity"
      >
        <span className="text-white text-xs font-light opacity-70 hover:opacity-100">Scroll to explore</span>
        <svg
          className="w-6 h-6 text-white opacity-70 hover:opacity-100 transition-opacity"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>
    </div>
  );
}
