import React, { useState } from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  return (
    <main className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </main>
  );
}
