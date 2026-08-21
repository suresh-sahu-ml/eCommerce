import React from 'react';
import RevealOnScroll from './RevealOnScroll';

const houses = [
  { id: 1, name: 'Maison Alchemy', delay: 100 },
  { id: 2, name: 'L\'Essence', delay: 200 },
  { id: 3, name: 'Botanica', delay: 300 },
  { id: 4, name: 'Nocturne', delay: 400 },
];

export default function BrowseByHouse() {
  return (
    <section className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap border-t border-outline-variant/10">
      {/* Section Header */}
      <div className="text-center mb-16 reveal-on-scroll">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
          Browse by House
        </h2>
        <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
          Discover creations from the world's most esteemed perfumeries.
        </p>
      </div>

      {/* Houses Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 items-center justify-items-center opacity-70">
        {houses.map((house) => (
          <div
            key={house.id}
            className="reveal-on-scroll"
            style={{ transitionDelay: `${house.delay}ms` }}
          >
            <h3 className="font-headline-md text-[20px] tracking-widest uppercase text-on-surface">
              {house.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
