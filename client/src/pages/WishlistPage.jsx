import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';

export default function WishlistPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info', buttons: [] });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');

      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8080/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data);
      } else if (response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      showModal('Error', 'Failed to load wishlist', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showModal = (title, message, type = 'info') => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      buttons: [
        {
          label: 'OK',
          onClick: closeModal,
          variant: 'primary'
        }
      ]
    });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const handleRemoveFromWishlist = async (productId, productName) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      console.log('Removing product from wishlist:', productId);
      const response = await fetch(`http://localhost:8080/api/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Delete response:', data);
        setWishlistItems(wishlistItems.filter(item => item.productId !== productId));
        showModal('Success', `${productName} removed from wishlist!`, 'success');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Delete error response:', errorData);
        showModal('Error', errorData.error || 'Failed to remove from wishlist', 'error');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      showModal('Error', 'An error occurred while removing from wishlist', 'error');
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleAddToBag = async (productId, productName) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch product to get the first size
      const productResponse = await fetch(`http://localhost:8080/api/products/${productId}`);
      if (!productResponse.ok) {
        showModal('Error', 'Failed to fetch product details', 'error');
        return;
      }

      const product = await productResponse.json();
      if (!product.sizes || product.sizes.length === 0) {
        showModal('Error', 'Product has no available sizes', 'error');
        return;
      }

      const firstSize = product.sizes[0];

      // Add to cart with the first size
      const response = await fetch(
        `http://localhost:8080/api/cart/add?productId=${productId}&sizeId=${firstSize.sizeId}&quantity=1`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.cart) {
          localStorage.setItem('cartCount', data.cart.itemCount);
          const event = new CustomEvent('cartCountUpdated', { detail: { count: data.cart.itemCount } });
          window.dispatchEvent(event);
        }
        showModal('Success', `${productName} added to bag successfully!`, 'success');
      } else {
        showModal('Error', 'Failed to add to bag', 'error');
      }
    } catch (error) {
      console.error('Error adding to bag:', error);
      showModal('Error', 'An error occurred while adding to bag', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <Header scrolled={scrolled} activePage="wishlist" />
        <div className="pt-20 flex items-center justify-center h-96">
          <p className="text-on-surface-variant">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <Header scrolled={scrolled} activePage="wishlist" />
      <main className="w-full pt-20 bg-surface">
        <div className="flex flex-col w-full">
          {/* Header */}
          <section className="max-w-6xl mx-auto w-full px-4 md:px-6 py-8">
            <h1 className="font-headline-lg text-headline-lg text-primary mb-2">My Wishlist</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {wishlistItems.length === 0 ? 'Your wishlist is empty' : `${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''} in your wishlist`}
            </p>
          </section>

          {/* Wishlist Items */}
          <section className="max-w-6xl mx-auto w-full px-4 md:px-6 pb-20">
            {wishlistItems.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 block">favorite_border</span>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">Your wishlist is empty. Add products to get started!</p>
                <button
                  onClick={() => navigate('/products')}
                  className="px-6 py-3 bg-primary text-on-primary font-label-sm text-label-sm uppercase rounded hover:bg-secondary transition-colors tracking-widest"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {wishlistItems.map((item) => (
                  <div key={item.wishlistId} className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] transition-shadow">
                    {/* Product Image */}
                    <div
                      className="w-full aspect-square bg-surface-container overflow-hidden cursor-pointer group"
                      onClick={() => handleViewProduct(item.productId)}
                    >
                      <img
                        src={item.imageUrl || 'https://via.placeholder.com/300x300'}
                        alt={item.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">
                        {item.brand || 'Brand'}
                      </p>
                      <h3
                        className="font-headline-md text-headline-md text-primary mb-1 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleViewProduct(item.productId)}
                      >
                        {item.productName}
                      </h3>
                      {item.selectedSizeName && (
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">
                          {item.selectedSizeName}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mb-4">
                        {item.isDiscountActive && item.discountedPrice < item.price ? (
                          <>
                            <span className="font-body-md text-body-md text-primary">
                              ₹{item.discountedPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className="font-body-md text-on-surface-variant line-through text-sm">
                              ₹{item.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className="bg-error text-on-error px-2 py-0.5 text-xs font-label-sm uppercase rounded">
                              {item.discountType === 'FIXED' ? `₹${item.discountValue} OFF` : `${item.discountValue}% OFF`}
                            </span>
                          </>
                        ) : (
                          <span className="font-body-md text-body-md text-primary">
                            ₹{item.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToBag(item.productId, item.productName)}
                          className="flex-1 py-3 bg-primary text-on-primary font-label-sm text-label-sm uppercase rounded hover:bg-secondary transition-colors tracking-widest"
                        >
                          Add to Bag
                        </button>
                        <button
                          onClick={() => handleRemoveFromWishlist(item.productId, item.productName)}
                          className="px-3 py-3 bg-error/10 text-error rounded hover:bg-error/20 transition-colors"
                          title="Remove from Wishlist"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        buttons={modal.buttons}
      />
    </div>
  );
}
