import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuickAddModal from './QuickAddModal';

export default function ProductCard({ product, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkWishlistStatus();
  }, [product.id]);

  const checkWishlistStatus = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch(`http://localhost:8080/api/wishlist/check/${product.id}`, {
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

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      if (inWishlist) {
        const response = await fetch(`http://localhost:8080/api/wishlist/remove/${product.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setInWishlist(false);
        }
      } else {
        const response = await fetch(`http://localhost:8080/api/wishlist/add/${product.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok || response.status === 409) {
          setInWishlist(true);
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  // Stagger vertical offset for alternate rows
  const verticalOffset = index % 2 === 1 && index > 0 ? 'lg:mt-12' : '';
  const negativeOffset = index >= 3 && index % 2 === 1 ? 'lg:-mt-12' : '';

  const marginClass = negativeOffset || verticalOffset;

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <article
        className={`group flex flex-col cursor-pointer relative ${marginClass}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Product Image */}
        <div className="w-full aspect-[4/5] bg-surface-container overflow-hidden relative mb-6">
          <img
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
            src={product.image}
            alt={product.name}
          />

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
              inWishlist
                ? 'bg-error/20 text-error hover:bg-error/30'
                : 'bg-white/80 text-on-surface hover:bg-white'
            }`}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <span className="material-symbols-outlined text-xl">
              {inWishlist ? 'favorite' : 'favorite_border'}
            </span>
          </button>

          {/* Add to Bag Button */}
          <div
            className={`absolute inset-x-0 bottom-0 p-4 flex justify-center transition-all duration-300 ease-out ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <button
              onClick={handleAddToCartClick}
              className="w-full bg-primary text-on-primary font-label-sm text-label-sm uppercase py-4 hover:bg-secondary transition-colors tracking-widest"
            >
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
          <div className="flex items-center gap-2 pt-2">
            {product.isDiscountActive && product.discountedPrice < product.price ? (
              <>
                <span className="font-body-md text-body-md text-primary">
                  ₹{product.discountedPrice?.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
                <span className="font-body-md text-on-surface-variant line-through text-sm">
                  ₹{product.price?.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
                <span className="bg-error text-on-error px-2 py-0.5 text-xs font-label-sm uppercase rounded">
                  {product.discountType === 'FIXED' ? `₹${product.discountValue} OFF` : `${product.discountValue}% OFF`}
                </span>
              </>
            ) : (
              <span className="font-body-md text-body-md text-primary">
                ₹{product.price?.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            )}
          </div>
        </div>
      </article>

      {/* Quick Add Modal */}
      <QuickAddModal product={product} isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
