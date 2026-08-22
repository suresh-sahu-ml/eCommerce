import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductIntro from '../components/Products/ProductIntro';
import FilterPanel from '../components/Products/FilterPanel';
import ProductGrid from '../components/Products/ProductGrid';
import Pagination from '../components/Products/Pagination';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [scrolled, setScrolled] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedHouses, setSelectedHouses] = useState([]);
  const [selectedFamilies, setSelectedFamilies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/products/active');
      if (response.ok) {
        const data = await response.json();
        const productsWithMappedFields = data.map(p => ({
          id: p.productId,
          name: p.productName,
          house: p.brand || 'Brand',
          family: p.olfactiveFamily || 'Fragrance',
          price: p.price,
          discountType: p.discountType,
          discountValue: p.discountValue,
          isDiscountActive: p.isDiscountActive,
          discountedPrice: p.discountedPrice,
          image: (p.imageUrls && p.imageUrls.length > 0) ? p.imageUrls[0] : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCv8oeO5FBUlX4jvAFp_JR0LAGKZAn-eKsx25m_cOqT4LCV_taip1UI0qia81ECIRqb7ObLVHEToUy1Zp010Ch5AgPvo6H13JAqiB9PxQFLV364LqC5H4f3KVx36mxaXOhew5EH1Dq_leCUpWoDKe-bsIVdijbnT-NCTwrupdjir9-VHIY7NzD8fzRdNHRp17hFV_9owYn7oHf5sj1TCZALV7p4296Hpg_sOYZ4fY-J6Q9q_kDL2JOI',
        }));
        setAllProducts(productsWithMappedFields);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique houses and families from products
  const availableHouses = useMemo(() => {
    return [...new Set(allProducts.map(p => p.house))].sort();
  }, [allProducts]);

  const availableFamilies = useMemo(() => {
    return [...new Set(allProducts.map(p => p.family))].sort();
  }, [allProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = allProducts;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.house.toLowerCase().includes(query) ||
        p.family.toLowerCase().includes(query)
      );
    }

    // Apply house filter
    if (selectedHouses.length > 0) {
      result = result.filter(p => selectedHouses.includes(p.house));
    }

    // Apply family filter
    if (selectedFamilies.length > 0) {
      result = result.filter(p => selectedFamilies.includes(p.family));
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result = [...result].sort((a, b) => b.id - a.id);
        break;
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'featured':
      default:
        // Keep original order
        break;
    }

    return result;
  }, [allProducts, searchQuery, selectedHouses, selectedFamilies, sortBy]);

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <Header scrolled={scrolled} activePage="products" />
      <main className="w-full pt-20 bg-surface">
        <div className="flex flex-col w-full">
          {searchQuery ? (
            <section className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-12">
              <div className="max-w-7xl mx-auto">
                <h1 className="font-display-md text-display-md text-primary mb-2">
                  Search Results
                </h1>
                <p className="font-body-md text-on-surface-variant mb-2">
                  Searching for: <span className="font-label-sm text-primary">"{searchQuery}"</span>
                </p>
                <p className="font-body-sm text-on-surface-variant">
                  Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </p>
              </div>
            </section>
          ) : (
            <ProductIntro />
          )}

          <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 flex justify-center pb-section-gap">
            <div className="max-w-7xl w-full flex gap-12">
              {/* Filter Panel */}
              <FilterPanel
                sortBy={sortBy}
                setSortBy={setSortBy}
                selectedHouses={selectedHouses}
                setSelectedHouses={setSelectedHouses}
                selectedFamilies={selectedFamilies}
                setSelectedFamilies={setSelectedFamilies}
                availableHouses={availableHouses}
                availableFamilies={availableFamilies}
              />

              {/* Products Grid */}
              <div className="flex-1">
                {loading ? (
                  <div className="text-center py-12">Loading products...</div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12 text-on-surface-variant">
                    {searchQuery
                      ? `No products found matching "${searchQuery}". Try a different search term.`
                      : 'No products found with the selected filters.'}
                  </div>
                ) : (
                  <ProductGrid products={filteredProducts} />
                )}
              </div>
            </div>
          </div>

          <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
