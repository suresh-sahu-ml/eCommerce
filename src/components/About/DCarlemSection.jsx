import React, { useState } from 'react';

const DCARLEM_CARDS = [
  {
    id: 'essence',
    title: 'The Essence',
    description: 'A distillation of pure emotion, crafted over thousands of hours by master noses.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC22_JRnGsn1zRb_sbFSSSgKHIf8PmFvUbJ_dgwTj2WQszB5m_kZZtBpal50XY1MjkhzeQ-sMZN5ddD1lAXhIlwvtKZV1rmt4OvNdrVyTupGIfsLPiu6leRlc05QA-rYxAUzH_syp29Jq6BsX-U-YAxhcpKEGLaMPjiUhbeG8eyJFsxDPP9YZAWD2jF0rGMTUwdxu0u6-UqwqbYXKfTOXFnw8RAWt37fg_vjxz5xhU3c-HP1JdSL_1j',
  },
  {
    id: 'ingredients',
    title: 'The Ingredients',
    description: 'Ethically sourced, rare botanicals and resins from the farthest reaches of the globe.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUG3V7qHyZS7ipenIKMmcSDOUVjAcbCdqH7XnaTTJ8n0wIqxL7mlG7E6BjK2t-Zw0vNpP2SjbnKObUxe2YteODAElTraf9WIyeDmltX5tYL1CQRnMX0dlghW2En6iAp7Ku32O7ngNe4tuyY52c8c4f0ut3ayiu01sDpQIwwL2HjGxYtaeiOq0vKF8FgvI6cfTa0HKflRJK3qvpeJNQdaUf6so7WUkxAjKVw16dcH6cl22BqzE2IIs0',
  },
  {
    id: 'vessel',
    title: 'The Vessel',
    description: 'Designed not just to hold, but to preserve and present the liquid gold within.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXAbXHXFbqWA9Ws77dRgQ3_EC-yy3xG3IRZ3YE6G4u1d2z3Lu6ywioWPZ3fCt4Hi0mRnfZ75x-ek3_swjpkDlRYZthu8NOXDvatpYQyn8fnLBlP4vIYx4WYP4V0rAOfshu0c9-pR1heSLXYDmlv5Jb2VYeOylUzJL-GNne5ogYTHS1KPOJAdZFlVZSkoau5qM6VGCgo2qric8XtX_QawtygopMevwdSRaxzZwS7mzJGpPYNm2LNc3N',
  },
];

export default function DCarlemSection() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="w-full py-section-gap bg-surface-container-low relative">
      {/* Decorative Background Pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-margin-desktop relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-4 block">
            Our Signature
          </span>
          <h2 className="font-display-lg text-display-lg text-on-surface">DCarlem</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto mt-6">
            The pinnacle of our craftsmanship.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {DCARLEM_CARDS.map((card, index) => (
            <DCarlemCard
              key={card.id}
              card={card}
              index={index}
              isHovered={hoveredCard === card.id}
              onHover={() => setHoveredCard(card.id)}
              onHoverEnd={() => setHoveredCard(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function DCarlemCard({ card, index, isHovered, onHover, onHoverEnd }) {
  const offsetClass = index === 1 ? 'md:mt-16' : '';

  return (
    <div
      className={`group relative aspect-[3/4] bg-surface overflow-hidden ${offsetClass}`}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
    >
      {/* Image */}
      <img
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100 mix-blend-darken"
        src={card.image}
        alt={card.title}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />

      {/* Content */}
      <div
        className={`absolute bottom-0 left-0 w-full p-8 transition-all duration-500 ${
          isHovered ? 'translate-y-0' : 'translate-y-4'
        }`}
      >
        <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
          {card.title}
        </h3>
        <p
          className={`font-body-md text-body-md text-on-surface-variant transition-opacity duration-500 delay-100 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {card.description}
        </p>
      </div>
    </div>
  );
}
