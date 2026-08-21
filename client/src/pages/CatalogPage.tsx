import React, { useMemo } from "react";
import { Spinner } from "@nextui-org/react";
import { useCatalog } from "../hooks/useCatalog";
import { useAppSelector } from "../store";
import { ProductCard } from "../components/ProductCard";
import { FilterSidebar } from "../components/FilterSidebar";

export const CatalogPage: React.FC = () => {
  const filters = useAppSelector((state) => state.filters);
  const { products, loading, error } = useCatalog({
    page: 1,
    limit: 24,
    topNotes: filters.selectedNotes.length > 0 ? filters.selectedNotes : undefined,
    brand: filters.selectedBrands.length > 0 ? filters.selectedBrands : undefined,
    minPrice: filters.priceRange[0],
    maxPrice: filters.priceRange[1],
    search: filters.searchQuery || undefined,
    sortBy: filters.sortBy,
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = [...products];

    if (filters.searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    switch (filters.sortBy) {
      case "price":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [products, filters.searchQuery, filters.sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="container-luxury">
        <h1 className="text-luxury mb-12">Perfume Catalog</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block">
            <FilterSidebar />
          </div>

          <div className="lg:col-span-3">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-8">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-96">
                <Spinner label="Loading products..." />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">
                  No products found. Try adjusting your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
