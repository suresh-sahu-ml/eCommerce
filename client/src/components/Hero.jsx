import React, { useState, useEffect, useRef } from 'react';

export default function Hero() {
  const heroBgRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (heroBgRef.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setScrollPos(window.scrollY * 0.3);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative w-full h-[870px] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          ref={heroBgRef}
          className="bg-cover bg-center w-full h-[120%] -top-[10%] relative transform origin-center transition-transform duration-75 ease-out animate-slow-zoom"
          data-alt="A cinematic, high-fashion shot of elegant glass perfume bottles surrounded by flowing silk fabrics in muted charcoal and gold tones."
          id="hero-bg"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDfKUxG_CCKAOYfMqqWJg7jX7f4bU8L9V1GQZlICzFK6eWap-X2wV4EBt5qP1TU_Cvze0SEGRuXbNFn5cX4AZLdNxEQUTs6EGSH4pG_3L8Cnl9iZK53QAkLyCnks82OhwyJ0mq1pU-LuCXozINYeM7SAG_-SIp0IBBEtr0_zfPrO6eDcuIorsO5PnrNkMY7oWciA_aEU_fHHI5VziUOZgO4zwQg6YfGXX7JxInUgyQmwEEELwj8qr6I')`,
            transform: `translateY(${scrollPos}px)`,
          }}
        />
        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-surface/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center flex flex-col items-center max-w-3xl px-6">
        <span
          className="font-label-sm text-label-sm text-on-surface tracking-[0.3em] uppercase mb-6 opacity-0 translate-y-4 animate-fade-in-up"
          style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
        >
          Aura &amp; Essence
        </span>

        <h1
          className="font-display-lg text-display-lg text-on-surface mb-8 opacity-0 translate-y-4 animate-fade-in-up"
          style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
        >
          The Art of<br />
          Olfactory Elevation
        </h1>

        <p
          className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-md mx-auto opacity-0 translate-y-4 animate-fade-in-up"
          style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
        >
          Discover a curated collection of niche fragrances, crafted with the world's most precious botanicals.
        </p>

        <button
          className="group relative px-8 py-4 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest overflow-hidden opacity-0 translate-y-4 animate-fade-in-up transition-all duration-500 hover:bg-primary/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
        >
          <span className="relative z-10 flex items-center gap-2 transition-transform duration-300 group-hover:scale-105">
            Explore Collections
            <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1">
              arrow_forward
            </span>
          </span>
        </button>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in"
        style={{ animationDelay: '1200ms', animationFillMode: 'forwards' }}
      >
        <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest">
          Scroll
        </span>
        <div className="w-[1px] h-12 bg-on-surface-variant/30 overflow-hidden">
          <div className="w-full h-full bg-on-surface origin-top animate-scroll-line" />
        </div>
      </div>
    </section>
  );
}
