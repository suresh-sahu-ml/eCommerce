import React, { useState } from 'react';

export default function ProductCard({ product, index }) {
  const [isHovered, setIsHovered] = useState(false);

  // Stagger vertical offset for alternate rows
  const verticalOffset = index % 2 === 1 && index > 0 ? 'lg:mt-12' : '';
  const negativeOffset = index >= 3 && index % 2 === 1 ? 'lg:-mt-12' : '';

  const marginClass = negativeOffset || verticalOffset;

  return (
    <article
      className={`group flex flex-col cursor-pointer relative ${marginClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="w-full aspect-[4/5] bg-surface-container overflow-hidden relative mb-6">
        <img
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
          src={product.image}
          alt={product.name}
        />

        {/* Add to Bag Button */}
        <div
          className={`absolute inset-x-0 bottom-0 p-4 flex justify-center transition-all duration-300 ease-out ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button className="w-full bg-primary text-on-primary font-label-sm text-label-sm uppercase py-4 hover:bg-secondary transition-colors tracking-widest">
            Add to Bag
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col items-center text-center space-y-2">
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
          {product.house}
        </span>
        <h2 className="font-headline-md text-headline-md text-primary">
          {product.name}
        </h2>
        <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-[0.2em]">
          {product.family}
        </span>
        <span className="font-body-md text-body-md text-primary pt-2">
          ${product.price}
        </span>
      </div>
    </article>
  );
}
