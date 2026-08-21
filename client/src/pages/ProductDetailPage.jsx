import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(null);
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [thumbnailImages, setThumbnailImages] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState('');
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      checkWishlistStatus();
    }
  }, [product?.productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        // Use imageUrls array - show only the images that were uploaded (max 4)
        const images = (data.imageUrls && data.imageUrls.length > 0) ? data.imageUrls.slice(0, 4) : [];
        setThumbnailImages(images);
        setMainImage(images[0] || '');
        // Select the first size by default
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0].sizeId);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (section) => {
    setExpandedAccordion(expandedAccordion === section ? null : section);
  };

  const checkWishlistStatus = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (!token || !product) return;

      const response = await fetch(`http://localhost:8080/api/wishlist/check/${product.productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInWishlist(data.inWishlist);
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleWishlistToggle = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      if (inWishlist) {
        const response = await fetch(`http://localhost:8080/api/wishlist/remove/${product.productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setInWishlist(false);
          setMessage('✓ Removed from wishlist');
          setTimeout(() => setMessage(''), 3000);
        }
      } else {
        const url = new URL(`http://localhost:8080/api/wishlist/add/${product.productId}`, window.location.origin);
        if (selectedSize) {
          url.searchParams.append('sizeId', selectedSize);
        }
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setInWishlist(true);
          setMessage('✓ Added to wishlist');
          setTimeout(() => setMessage(''), 3000);
        } else if (response.status === 409) {
          setMessage('✓ Already in wishlist');
          setInWishlist(true);
          setTimeout(() => setMessage(''), 3000);
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      setMessage('✗ Error updating wishlist');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleAddToBag = async () => {
    if (!selectedSize) {
      setMessage('Please select a size');
      return;
    }

    setAddingToCart(true);
    setMessage('');

    try {
      // Get the auth token from localStorage (check both keys for Keycloak and email login)
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');

      const headers = {
        'Content-Type': 'application/json',
      };

      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `http://localhost:8080/api/cart/add?productId=${product.productId}&sizeId=${selectedSize}&quantity=${quantity}`,
        {
          method: 'POST',
          headers,
        }
      );

      const data = await response.json();
      console.log('Full add to cart response:', data);

      if (response.ok && data.success) {
        setMessage('✓ Added to bag successfully!');
        setQuantity(1);
        // Store cart data in localStorage for Header to display
        if (data.cart) {
          console.log('Cart data:', data.cart);
          console.log('Updating cart count from:', localStorage.getItem('cartCount'), 'to:', data.cart.itemCount);
          localStorage.setItem('cartCount', data.cart.itemCount);
          localStorage.setItem('cartData', JSON.stringify(data.cart));
          // Dispatch custom event with count to notify Header of cart update
          console.log('Dispatching cartCountUpdated event with count:', data.cart.itemCount);
          const event = new CustomEvent('cartCountUpdated', { detail: { count: data.cart.itemCount } });
          window.dispatchEvent(event);
        } else {
          console.warn('No cart data in response:', data);
        }
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorMsg = data.error || 'Failed to add to bag';
        setMessage(`✗ ${errorMsg}`);
        console.error('Error response:', data);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setMessage('✗ Error adding to bag - check console for details');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <Header activePage="products" />
        <div className="pt-20 flex items-center justify-center h-96">
          <p className="text-on-surface-variant">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-surface">
        <Header activePage="products" />
        <div className="pt-20 flex items-center justify-center h-96">
          <p className="text-on-surface-variant">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <Header activePage="products" />
      <main className="w-full pt-20 bg-surface">
        <div className="flex flex-col w-full">
          {/* Breadcrumb */}
          <div className="max-w-6xl mx-auto w-full px-margin-desktop py-2 flex items-center gap-2">
            <button
              onClick={() => navigate('/products')}
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors uppercase"
            >
              Products
            </button>
            <span className="text-on-surface-variant text-xs">/</span>
            <button
              onClick={() => navigate('/products')}
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors uppercase"
            >
              {product.brand || 'Brand'}
            </button>
            <span className="text-on-surface-variant text-xs">/</span>
            <span className="font-label-sm text-label-sm text-primary uppercase truncate">{product.productName}</span>
          </div>

          {/* Main Product Section */}
          <section className="max-w-6xl mx-auto px-margin-desktop w-full grid grid-cols-1 lg:grid-cols-2 gap-12 pb-section-gap">
            {/* Image Gallery */}
            <div className="relative">
              <div className="sticky top-24 space-y-gutter">
                {/* Main Featured Image */}
                <div className="aspect-square bg-surface-container-low rounded-lg overflow-hidden group">
                  <img
                    alt={product.productName}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    src={mainImage || 'https://via.placeholder.com/400x500?text=Product+Image'}
                  />
                </div>

                {/* Thumbnail Gallery - Desktop only */}
                {thumbnailImages.length > 0 && (
                  <div
                    className={`hidden lg:flex gap-3 overflow-x-auto mt-6`}
                  >
                    {thumbnailImages.map((img, index) => (
                      <div
                        key={index}
                        onClick={() => setMainImage(img)}
                        className={`w-32 h-32 bg-surface-container-low rounded overflow-hidden cursor-pointer transition-all flex-shrink-0 ${
                          mainImage === img
                            ? 'border-2 border-primary'
                            : 'border border-outline-variant/30 hover:border-outline-variant'
                        }`}
                      >
                        <img src={img} className="w-full h-full object-cover" alt={`View ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="lg:pl-12 flex flex-col pt-0">
              <div className="mb-6">
                <h2 className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                  {product.brand || 'Brand'}
                </h2>
                <h1 className="font-display-lg text-display-lg text-primary mb-4">{product.productName}</h1>
                <div className="flex items-center gap-4">
                  {product.isDiscountActive && product.discountedPrice < product.price ? (
                    <>
                      <p className="font-headline-md text-headline-md text-primary">
                        ₹{product.discountedPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="font-body-md text-sm text-on-surface-variant">INR</span>
                      </p>
                      <p className="font-body-md text-on-surface-variant line-through">
                        ₹{product.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <span className="bg-error text-on-error px-3 py-1 text-xs font-label-sm uppercase rounded">
                        {product.discountType === 'FIXED' ? `₹${product.discountValue} OFF` : `${product.discountValue}% OFF`}
                      </span>
                    </>
                  ) : (
                    <p className="font-headline-md text-headline-md text-primary">
                      ₹{product.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="font-body-md text-sm text-on-surface-variant">INR</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className="font-body-lg text-body-lg text-on-surface-variant">{product.description || 'No description available'}</p>
              </div>

              {/* Selectors */}
              <div className="space-y-6 mb-12">
                {/* Size */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <span className="font-label-sm text-label-sm uppercase text-primary block mb-3">Size</span>
                    <div className={`flex gap-2 ${product.sizes.length > 2 ? 'flex-wrap' : 'gap-4'}`}>
                      {product.sizes.map((size) => (
                        <button
                          key={size.sizeId}
                          onClick={() => setSelectedSize(size.sizeId)}
                          className={`flex-1 py-4 text-center font-label-sm text-label-sm uppercase tracking-widest transition-all ${
                            selectedSize === size.sizeId
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container hover:bg-surface-dim text-primary'
                          }`}
                        >
                          {size.sizeName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <span className="font-label-sm text-label-sm uppercase text-primary block mb-4">Quantity</span>
                  <div className="flex items-center w-32 bg-surface-container h-12">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-full flex items-center justify-center text-primary hover:bg-surface-dim transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="flex-1 text-center font-body-md">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-full flex items-center justify-center text-primary hover:bg-surface-dim transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-8">
                <button
                  onClick={handleAddToBag}
                  disabled={addingToCart}
                  className="w-full py-5 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-[0.2em] hover:bg-secondary transition-colors relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {addingToCart ? 'Adding...' : 'Add to Bag'}
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </span>
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`w-full py-4 font-label-sm text-label-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
                    inWishlist
                      ? 'bg-error/20 text-error hover:bg-error/30'
                      : 'bg-transparent text-primary hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {inWishlist ? 'favorite' : 'favorite_border'}
                  </span>
                  {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
              </div>

              {/* Success Message */}
              {message && (
                <div className="mb-8 p-3 bg-success-container text-on-success-container text-center font-label-sm text-sm rounded-lg">
                  {message}
                </div>
              )}

              {/* Accordion Details */}
              <div className="space-y-1 border-t border-outline-variant pt-2">
                {/* Olfactory Pyramid */}
                <div className="accordion-item">
                  <button
                    onClick={() => toggleAccordion('pyramid')}
                    className="w-full py-3 flex justify-between items-center text-left group"
                  >
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Olfactory Pyramid</span>
                    <span
                      className={`material-symbols-outlined text-primary transition-transform duration-300 ${
                        expandedAccordion === 'pyramid' ? 'rotate-180' : ''
                      }`}
                    >
                      {expandedAccordion === 'pyramid' ? 'remove' : 'add'}
                    </span>
                  </button>
                  {expandedAccordion === 'pyramid' && (
                    <div className="pb-4 space-y-4 pt-1">
                      <div>
                        <h4 className="font-label-sm text-[10px] uppercase text-on-surface-variant mb-1">Top Notes</h4>
                        <p className="font-body-md text-primary">Citrus, Bergamot</p>
                      </div>
                      <div>
                        <h4 className="font-label-sm text-[10px] uppercase text-on-surface-variant mb-1">Heart Notes</h4>
                        <p className="font-body-md text-primary">Floral, Rose, Jasmine</p>
                      </div>
                      <div>
                        <h4 className="font-label-sm text-[10px] uppercase text-on-surface-variant mb-1">Base Notes</h4>
                        <p className="font-body-md text-primary">Amber, Sandalwood, Musk</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ingredients */}
                <div className="accordion-item border-t border-outline-variant/30">
                  <button
                    onClick={() => toggleAccordion('ingredients')}
                    className="w-full py-3 flex justify-between items-center text-left group"
                  >
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Ingredients</span>
                    <span
                      className={`material-symbols-outlined text-primary transition-transform duration-300 ${
                        expandedAccordion === 'ingredients' ? 'rotate-180' : ''
                      }`}
                    >
                      {expandedAccordion === 'ingredients' ? 'remove' : 'add'}
                    </span>
                  </button>
                  {expandedAccordion === 'ingredients' && (
                    <div className="pb-4 pt-1">
                      <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                        Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citronellol, Geraniol, Coumarin, Farnesol,
                        Citral, Benzyl Benzoate, Benzyl Cinnamate.
                      </p>
                    </div>
                  )}
                </div>

                {/* Experience */}
                <div className="accordion-item border-t border-outline-variant/30">
                  <button
                    onClick={() => toggleAccordion('experience')}
                    className="w-full py-3 flex justify-between items-center text-left group"
                  >
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">The Signature Experience</span>
                    <span
                      className={`material-symbols-outlined text-primary transition-transform duration-300 ${
                        expandedAccordion === 'experience' ? 'rotate-180' : ''
                      }`}
                    >
                      {expandedAccordion === 'experience' ? 'remove' : 'add'}
                    </span>
                  </button>
                  {expandedAccordion === 'experience' && (
                    <div className="pb-4 pt-1 space-y-3">
                      <div className="flex gap-4 items-start">
                        <span className="material-symbols-outlined text-primary">local_florist</span>
                        <p className="font-body-md text-sm text-on-surface-variant">
                          Complimentary sample set with every order, allowing you to discover our collection.
                        </p>
                      </div>
                      <div className="flex gap-4 items-start">
                        <span className="material-symbols-outlined text-primary">card_giftcard</span>
                        <p className="font-body-md text-sm text-on-surface-variant">
                          Artisanal gift wrapping in our signature dark textured paper, sealed with wax.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
