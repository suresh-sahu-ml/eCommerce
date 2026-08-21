import React from 'react';

export default function FilterPanel({
  sortBy,
  setSortBy,
  selectedHouses,
  setSelectedHouses,
  selectedFamilies,
  setSelectedFamilies,
  availableHouses,
  availableFamilies,
}) {
  const handleHouseChange = (house) => {
    setSelectedHouses((prev) =>
      prev.includes(house) ? prev.filter((h) => h !== house) : [...prev, house]
    );
  };

  const handleFamilyChange = (family) => {
    setSelectedFamilies((prev) =>
      prev.includes(family) ? prev.filter((f) => f !== family) : [...prev, family]
    );
  };

  const clearFilters = () => {
    setSortBy('featured');
    setSelectedHouses([]);
    setSelectedFamilies([]);
  };

  return (
    <div className="w-full md:w-64 flex-none space-y-8 pr-8">
      {/* Sort By */}
      <div>
        <h3 className="font-label-sm text-label-sm uppercase text-primary tracking-widest mb-4">
          Sort By
        </h3>
        <div className="space-y-3">
          {[
            { value: 'featured', label: 'Featured' },
            { value: 'newest', label: 'Newest Arrivals' },
            { value: 'price-high', label: 'Price: High to Low' },
            { value: 'price-low', label: 'Price: Low to High' },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="sort"
                value={option.value}
                checked={sortBy === option.value}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-5 h-5 cursor-pointer"
              />
              <span className="font-body-md text-body-md text-on-surface-variant">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* House Filter */}
      {availableHouses.length > 0 && (
        <div>
          <h3 className="font-label-sm text-label-sm uppercase text-primary tracking-widest mb-4">
            House
          </h3>
          <div className="space-y-3">
            {availableHouses.map((house) => (
              <label key={house} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedHouses.includes(house)}
                  onChange={() => handleHouseChange(house)}
                  className="w-5 h-5 cursor-pointer"
                />
                <span className="font-body-md text-body-md text-on-surface-variant">
                  {house}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Olfactive Family Filter */}
      {availableFamilies.length > 0 && (
        <div>
          <h3 className="font-label-sm text-label-sm uppercase text-primary tracking-widest mb-4">
            Olfactive Family
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableFamilies.map((family) => (
              <button
                key={family}
                onClick={() => handleFamilyChange(family)}
                className={`px-4 py-2 font-label-sm text-label-sm uppercase tracking-widest transition-all rounded ${
                  selectedFamilies.includes(family)
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-primary hover:bg-surface-dim border border-outline'
                }`}
              >
                {family}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clear Filters */}
      {(sortBy !== 'featured' || selectedHouses.length > 0 || selectedFamilies.length > 0) && (
        <button
          onClick={clearFilters}
          className="w-full py-3 border border-outline text-primary font-label-sm text-label-sm uppercase tracking-widest hover:bg-surface-container transition-colors rounded"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
