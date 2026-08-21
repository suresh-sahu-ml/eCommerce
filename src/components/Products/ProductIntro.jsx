import React from 'react';

export default function ProductIntro() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-24 bg-surface text-center px-margin-mobile">
      <img
        alt="The Perfume Shop Logo"
        className="h-24 w-24 object-contain mb-8 mix-blend-multiply opacity-90"
        src="https://lh3.googleusercontent.com/aida/AP1WRLsThVUwHTQiZWcMW99ow3T1AEjQ4NGx6FvMkjt6pM8T7xeXAAKCxHSPGgh_H1QFP6W82VqoauWfQACv7wyahb5q2OkYP7pGQNJ4VNk57Wedd4RGkOQ65YSrQWXsYc-16aAqlmHxYA4_pIHZ0RRywgyjtetjSYt79kjC1hdSRdD7WfvIVzh2CUcx0JWzVLcSPEUIyyu0ozYI5l0fY5Y1IZhEJei2x55ePSKTPsyNliZ0TfkTn8uKAnLK6g"
      />
      <h1 className="font-display-lg text-display-lg text-primary uppercase tracking-widest mb-6">
        The Collection
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
        Discover our curated selection of fine fragrances. From the ethereal florals to deep, resonant woods, each bottle is a masterful olfactory journey crafted by the world's most distinguished houses, featuring the exclusive DCarlem collection.
      </p>
    </div>
  );
}
