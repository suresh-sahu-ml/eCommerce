import React from 'react';

export default function ProductIntro() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-4 bg-surface text-center px-4 sm:px-8 md:px-12 lg:px-16">
      <h1 className="font-headline-lg text-headline-lg text-primary uppercase tracking-widest mb-2">
        The Collection
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
        Discover our curated selection of fine fragrances. From the ethereal florals to deep, resonant woods, each bottle is a masterful olfactory journey crafted by the world's most distinguished houses, featuring the exclusive DCarlem collection.
      </p>
    </div>
  );
}
