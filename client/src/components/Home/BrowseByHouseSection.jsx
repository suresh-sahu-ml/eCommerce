import React, { useState } from 'react';

const HOUSES = [
  "L'Artisan",
  'Diptyque',
  'Byredo',
  'Aesop',
  'Memo Paris',
  'Le Labo',
];

export default function BrowseByHouseSection() {
  return (
    <div className="p-4 pt-16 reveal active">
      <h2 className="text-on-background font-headline-md text-[28px] font-bold leading-tight tracking-[-0.015em] pb-8">
        Browse by House
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
        {HOUSES.map((house, index) => (
          <HouseItem key={house} house={house} index={index} />
        ))}
      </div>
    </div>
  );
}

function HouseItem({ house, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="logo-item reveal w-24 h-12 flex items-center justify-center border-b border-transparent hover:border-neutral-300 transition-all cursor-pointer active"
      style={{
        transitionDelay: `${(index + 1) * 100}ms`,
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="font-bold tracking-widest text-xs uppercase">{house}</span>
    </div>
  );
}
