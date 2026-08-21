import React from 'react';

const HOUSES = ['DCarlem', 'Maison Alchemy', 'Aura & Essence'];
const FAMILIES = ['Floral', 'Woody', 'Oriental', 'Fresh'];

export default function ProductFilters({
  sortBy,
  setSortBy,
  selectedHouses,
  handleHouseChange,
  selectedFamily,
  setSelectedFamily,
}) {
  return (
    <aside className="md:col-span-3 flex flex-col gap-12 sticky top-32">
      {/* Sort By */}
      <div className="flex flex-col gap-4">
        <h3 className="font-label-sm text-label-sm uppercase tracking-widest text-primary border-b border-outline/20 pb-2">
          Sort By
        </h3>
        <div className="flex flex-col gap-3 font-body-md text-on-surface-variant">
          <SortOption
            label="Featured"
            value="featured"
            checked={sortBy === 'featured'}
            onChange={() => setSortBy('featured')}
          />
          <SortOption
            label="Newest Arrivals"
            value="newest"
            checked={sortBy === 'newest'}
            onChange={() => setSortBy('newest')}
          />
          <SortOption
            label="Price: High to Low"
            value="price-high"
            checked={sortBy === 'price-high'}
            onChange={() => setSortBy('price-high')}
          />
        </div>
      </div>

      {/* House Filter */}
      <div className="flex flex-col gap-4">
        <h3 className="font-label-sm text-label-sm uppercase tracking-widest text-primary border-b border-outline/20 pb-2">
          House
        </h3>
        <div className="flex flex-col gap-3 font-body-md text-on-surface-variant">
          {HOUSES.map((house) => (
            <CheckboxOption
              key={house}
              label={house}
              checked={selectedHouses.includes(house)}
              onChange={() => handleHouseChange(house)}
            />
          ))}
        </div>
      </div>

      {/* Olfactive Family */}
      <div className="flex flex-col gap-4">
        <h3 className="font-label-sm text-label-sm uppercase tracking-widest text-primary border-b border-outline/20 pb-2">
          Olfactive Family
        </h3>
        <div className="flex flex-wrap gap-2">
          {FAMILIES.map((family) => (
            <button
              key={family}
              onClick={() => setSelectedFamily(family)}
              className={`px-4 py-2 border font-label-sm text-label-sm uppercase hover:bg-primary hover:text-on-primary transition-colors ${
                selectedFamily === family
                  ? 'border-primary text-primary bg-primary text-on-primary'
                  : 'border-outline text-on-surface-variant'
              }`}
            >
              {family}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function SortOption({ label, value, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
      <span
        className={`w-4 h-4 rounded-full border flex items-center justify-center group-hover:border-secondary transition-colors ${
          checked ? 'border-primary' : 'border-outline'
        }`}
      >
        {checked && <span className="w-2 h-2 rounded-full bg-primary" />}
      </span>
      <span className="group-hover:text-primary transition-colors">{label}</span>
    </label>
  );
}

function CheckboxOption({ label, checked, onChange }) {
  const isHighlighted = label === 'DCarlem' && checked;

  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
      <span
        className={`w-4 h-4 border flex items-center justify-center group-hover:border-secondary transition-colors ${
          checked ? 'border-primary bg-primary' : 'border-outline'
        }`}
      >
        {checked && (
          <span
            className="material-symbols-outlined text-[12px] text-on-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check
          </span>
        )}
      </span>
      <span
        className={`group-hover:text-primary transition-colors ${
          isHighlighted ? 'text-primary font-medium' : ''
        }`}
      >
        {label}
      </span>
    </label>
  );
}
