import React, { useState } from 'react';

const LUXURY_BRANDS = [
  { id: 1, name: 'Christian Dior', number: '01' },
  { id: 2, name: 'Versace', number: '02' },
  { id: 3, name: 'Gucci', number: '03' },
];

export default function CuratedExcellenceSection() {
  const [hoveredBrand, setHoveredBrand] = useState(null);

  return (
    <section className="w-full py-section-gap px-margin-desktop max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Left Column - Text Content */}
        <div className="md:col-span-5 flex flex-col justify-center">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-6">
            Global Houses
          </span>

          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8">
            Curated<br />
            Excellence
          </h2>

          <p className="font-body-md text-body-md text-on-surface-variant mb-12 max-w-md">
            While DCarlem remains our exclusive pride, our shelves are adorned with a meticulously selected collection of world-renowned luxury houses. We provide a stage for the legends of perfumery.
          </p>

          {/* Brand Names List */}
          <div className="flex flex-col gap-6 w-max">
            {LUXURY_BRANDS.map((brand) => (
              <BrandItem
                key={brand.id}
                brand={brand}
                isHovered={hoveredBrand === brand.id}
                onHover={() => setHoveredBrand(brand.id)}
                onHoverEnd={() => setHoveredBrand(null)}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Overlapping Images */}
        <div className="md:col-span-6 md:col-start-7 relative">
          <div className="relative w-full aspect-square md:aspect-auto md:h-full min-h-[500px]">
            {/* Main Image - Top Right */}
            <div className="absolute top-0 right-0 w-3/4 aspect-[4/5] bg-surface-container z-10 shadow-xl shadow-primary/5">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYd18HDYMvP_pd5w1hUPfyZSEy7bEx9iyQowpg6OA6b7CGStlOO4ZYOlzcyzkDmWYfJPorfRmUuBbt46P0ncJ_Sa2KKl-lhp45eeWKdzqrIiWN1_ruIsk0vFnUp15jvhjVrVIG42T3lqZOnogNJt2yL3HWgnFcgPfrcu4qSnzV8JuxhJYaar3Yn4Rvpi1r_JMv-KxSp7s_US3GYFe0V3bMYSf_FhLbxDGyZlB2mtqKKDjc0DcqIUvg"
                alt="Luxury perfume bottles display"
              />
            </div>

            {/* Secondary Image - Bottom Left */}
            <div className="absolute bottom-12 left-0 w-1/2 aspect-square bg-surface-variant z-20 shadow-xl shadow-primary/5 -ml-8">
              <img
                className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVe0xR1IhVW33d3zgwQJ6MYZFqVa90jLHhTeYpS06QZZVMDhUor1I7wUJDg4W9rouN7DAO9T7ySqRW4HW7eA_EiCTx64sFVWgFhAy4c56YIgISNy0MJK9hz56u40HZ18o7j6G9N2Ag_wY_v5oplYpD2HTuAoUK2uhm4nF5fWfaK1OVnprs_-ojNgGmnmgmhQGrrpvqDc4E6MYkzMLq_OiBnxxoNBAhazW6-CFtXE_Z7SPvK9i4GEZ0"
                alt="Perfume application detail"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandItem({ brand, isHovered, onHover, onHoverEnd }) {
  return (
    <div
      className="group flex items-center gap-4 cursor-pointer"
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
    >
      <span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-primary transition-colors w-8">
        {brand.number}
      </span>

      <h4 className={`font-headline-md text-headline-md text-on-surface transition-opacity ${
        isHovered ? 'opacity-50' : ''
      }`}>
        {brand.name}
      </h4>

      <span
        className={`material-symbols-outlined text-primary transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        }`}
      >
        arrow_forward
      </span>
    </div>
  );
}
