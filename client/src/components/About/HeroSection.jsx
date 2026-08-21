import React from 'react';

export default function HeroSection() {
  return (
    <section className="relative w-full h-[819px] flex items-center justify-center bg-surface overflow-hidden pt-20">
      {/* Background Image with Overlays */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDayKfAZBJT_kNGjVLfxiK5zLDwh-vF7oYGLp85mZt2_KFAY3BbuP4DYAiiKcoZqw8hFJ9KsM_81xS3VCRrocE_b4wpqeXPrcZJJeR_Psgp4MVXE2vZexN2YCafq8ftrMfpYeJbVPw5cecU_m8IVu6pqOoc-y3sOHMfeIFk9GrRqXUSIdBulK1CIhQxNz4lXCAPH7o4CZR-mjsk_2Lj6W5za1TEEV6QCVVsU6YTTmd8mqlpBNjZMo8h')`,
        }}
      >
        <div className="absolute inset-0 bg-surface/30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl px-gutter mx-auto flex flex-col items-center">
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-[0.2em] mb-8 relative before:content-[''] before:absolute before:-left-12 before:top-1/2 before:w-8 before:h-[1px] before:bg-on-surface-variant after:content-[''] after:absolute after:-right-12 after:top-1/2 after:w-8 after:h-[1px] after:bg-on-surface-variant">
          The Perfume Shop
        </span>

        <h1 className="font-display-lg text-display-lg text-on-surface mb-6 mix-blend-exclusion">
          Our Olfactory Journey
        </h1>

        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Crafting invisible art. We believe scent is the most intimate form of memory, a silent narrator of your unique journey through the world.
        </p>
      </div>
    </section>
  );
}
