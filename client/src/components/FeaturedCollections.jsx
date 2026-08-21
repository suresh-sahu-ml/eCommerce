import React, { useEffect, useRef } from 'react';
import RevealOnScroll from './RevealOnScroll';

const collections = [
  {
    id: 'floral',
    title: 'Floral &amp; Ethereal',
    label: 'Collection I',
    description: 'Jasmine, Rose, and rare blooms.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPkTw7Js-6sJx8BjmIrgftVWabaHjLRgA3rS7ynvym58AbM7mG-w1BVn24COkOWfuo9I0L0EvfOV6MIzh5b0zRyLibN9Yp1ixinnW0mrJ6nhvks_qwA85tY9ojtD59bNK_mjk-N_EyZz78JvAUAmy7mPnXF5f1SIrztWMMrkRWAMhMXJggCRrlw16TtsInmpcTcFnELQplUXaNU-ZIZ239luBU4TNjaZdasTjQc5SbHrX4KlUqRebN',
    size: 'large',
  },
  {
    id: 'woody',
    title: 'Woody &amp; Deep',
    label: 'Collection II',
    description: 'Agarwood, Sandalwood, and earthy essences.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDohVMxtDosbfTnzypHvsYUhWZYC4CChaK-HkskrqFsv-7zyuzK6GlY7q_vKqjgKBBWOHH5TqpmvzLnPIpAbMlfSVE0yiOiU83Cub87w4DFqOqwYXoMFb1u_kWRR2DkBr46-56P21mZNgyzkcr5vnEdtUdeG3RPEC-JtkZIh2x1JGSOScRMeAhbLJjgIB2X1EL3689EIIFLnn70oIM6g5LRkQaDSf9aHdu4IzygbzC6SYzTuAn1pLHZ',
    size: 'small',
  },
  {
    id: 'oriental',
    title: 'Oriental &amp; Spicy',
    label: 'Collection III',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBl7ni3VGckGsczcgN5qDCHNc9qxfHOqAXL0Lvz5FeCLAQvz3wcFk_LaHPZ0As23ppY_PwGiEvTXIwJbHBedHsmsu9vtnAlenXPHY13_8xN_xqaEPxfhphewlQ5Rl9fqtujs48xSHGyCkA2qTyQJ2bHHssAi9LM5nou_VTlkDcYKp7Zm7dlcXh4CGHq1-ZsFSiXyVXWG85lw1ioQ2_gs6yY2w5uAqiwRdp2vadjBngEmjNYk-h7YpOH',
    size: 'small',
  },
];

export default function FeaturedCollections() {
  return (
    <section className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 reveal-on-scroll">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
            Olfactive Families
          </h2>
          <p className="font-body-md text-on-surface-variant max-w-md">
            Navigate our portfolio through distinctive aromatic profiles, each telling a unique story of origin and emotion.
          </p>
        </div>
        <a
          className="font-label-sm text-label-sm text-on-surface uppercase tracking-widest flex items-center gap-2 group pb-1 border-b border-on-surface/20 hover:border-on-surface transition-colors"
          href="#"
        >
          View All Families
          <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1">
            east
          </span>
        </a>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter h-auto md:h-[600px]">
        {/* Large Card */}
        <CollectionCard collection={collections[0]} delay={100} />

        {/* Right Column with Two Small Cards */}
        <div className="md:col-span-5 flex flex-col gap-gutter h-full">
          <CollectionCard collection={collections[1]} delay={200} />
          <CollectionCard collection={collections[2]} delay={300} />
        </div>
      </div>
    </section>
  );
}

function CollectionCard({ collection, delay }) {
  const { title, label, description, image, size, id } = collection;
  const isLarge = size === 'large';

  return (
    <a
      className={`group relative block w-full ${
        isLarge ? 'md:col-span-7' : ''
      } ${isLarge ? 'h-[400px] md:h-full' : 'h-[300px] md:h-[calc(50%-12px)]'} bg-surface-container overflow-hidden rounded-lg reveal-on-scroll transition-all duration-700 hover:scale-[1.02] hover:shadow-xl hover:z-10`}
      href="#"
      key={id}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
        style={{ backgroundImage: `url('${image}')` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-tertiary-container/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
        <span className="font-label-sm text-[10px] text-on-primary tracking-widest uppercase mb-2 block opacity-80">
          {label}
        </span>
        <h3 className="font-headline-md text-headline-md text-on-primary mb-2">
          {title}
        </h3>
        {description && (
          <p className="font-body-md text-on-primary/80 transform translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            {description}
          </p>
        )}
      </div>
    </a>
  );
}
