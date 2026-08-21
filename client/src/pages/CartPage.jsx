import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info', buttons: [] });

  useEffect(() => {
    fetchCart();
    fetchRecommendations();
  }, []);

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      // Check for token (email/password login stores as 'token', Keycloak as 'access_token')
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');

      console.log('Cart page - token present:', !!token);

      // Require authentication to view cart
      if (!token) {
        console.log('No authentication found - redirecting to login');
        navigate('/login');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('Fetching cart with headers:', Object.keys(headers));
      const response = await fetch('http://localhost:8080/api/cart', { headers });

      console.log('Cart response status:', response.status);

      if (response.status === 401) {
        console.log('Received 401 - clearing auth and redirecting to login');
        localStorage.clear();
        navigate('/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        console.log('Cart loaded successfully:', data);
        // Sort items by cartItemId to maintain consistent order
        if (data.items) {
          data.items.sort((a, b) => a.cartItemId - b.cartItemId);
        }
        setCart(data);
        // Update cart count in localStorage to match actual cart
        localStorage.setItem('cartCount', data.itemCount);
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products/active?limit=10');
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.slice(0, 10));
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('Removing cart item:', cartItemId);
      const response = await fetch(`http://localhost:8080/api/cart/item/${cartItemId}`, {
        method: 'DELETE',
        headers,
      });

      console.log('Response status:', response.status, 'OK:', response.ok);

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (response.ok) {
        const updatedCart = await response.json();
        console.log('Updated cart:', updatedCart);
        // Sort items by cartItemId to maintain consistent order
        if (updatedCart.items) {
          updatedCart.items.sort((a, b) => a.cartItemId - b.cartItemId);
        }
        setCart(updatedCart);
        localStorage.setItem('cartCount', updatedCart.itemCount);
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:8080/api/cart/item/${cartItemId}?quantity=${newQuantity}`, {
        method: 'PUT',
        headers,
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (response.ok) {
        const updatedCart = await response.json();
        // Sort items by cartItemId to maintain consistent order
        if (updatedCart.items) {
          updatedCart.items.sort((a, b) => a.cartItemId - b.cartItemId);
        }
        setCart(updatedCart);
        localStorage.setItem('cartCount', updatedCart.itemCount);
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  };

  const handleClearCart = () => {
    setModal({
      isOpen: true,
      title: 'Clear Cart',
      message: 'Are you sure you want to remove all items from your cart?',
      type: 'warning',
      buttons: [
        {
          label: 'Cancel',
          onClick: () => setModal({ ...modal, isOpen: false }),
          style: 'secondary'
        },
        {
          label: 'Clear Cart',
          onClick: confirmClearCart,
          style: 'error'
        }
      ]
    });
  };

  const confirmClearCart = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:8080/api/cart/clear', {
        method: 'DELETE',
        headers,
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (response.ok) {
        setCart({ items: [], totalAmount: 0, itemCount: 0 });
        localStorage.setItem('cartCount', 0);
        window.dispatchEvent(new Event('cartUpdated'));
        setModal({ ...modal, isOpen: false });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <Header activePage="cart" />
        <div className="pt-20 flex items-center justify-center h-96">
          <p className="text-on-surface-variant">Loading your bag...</p>
        </div>
      </div>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <Header activePage="cart" />
      <main className="w-full pt-20 bg-surface">
        <div className="flex flex-col w-full">
          <div className="max-w-6xl mx-auto w-full px-margin-mobile lg:px-margin-desktop py-2">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center min-h-96 gap-6">
                <span className="material-symbols-outlined text-[64px] text-on-surface-variant">
                  shopping_bag
                </span>
                <h2 className="font-headline-md text-headline-md text-primary">Your bag is empty</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                  Explore our collection and add your favorite fragrances.
                </p>
                <button
                  onClick={() => navigate('/products')}
                  className="px-8 py-4 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest hover:bg-secondary transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-12 xl:gap-24">
                {/* Left Column: Your Bag */}
                <div className="flex-1 flex flex-col w-full">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="font-headline-lg text-headline-lg text-primary uppercase tracking-widest text-center lg:text-left">
                      Your Bag
                    </h1>
                    <button
                      onClick={handleClearCart}
                      className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest hover:text-error transition-colors"
                    >
                      Clear Cart
                    </button>
                  </div>

                  <div className="flex flex-col gap-8 w-full">
                    {/* Cart Items */}
                    {cart.items.map((item) => (
                      <div key={item.cartItemId} className="flex flex-col sm:flex-row gap-8 w-full group relative">
                        <div className="w-full sm:w-48 aspect-square relative overflow-hidden bg-surface-container-high rounded-sm">
                          <img
                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                            src={item.imageUrl || 'https://via.placeholder.com/200x200?text=Product'}
                            alt={item.productName}
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between py-2">
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-start gap-4">
                              <h3 className="font-headline-md text-headline-md text-primary">{item.productName}</h3>
                              <span className="font-body-md text-body-md text-primary whitespace-nowrap">
                                ₹{item.totalPrice.toLocaleString('en-IN', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </div>
                            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
                              {item.sizeName}
                            </p>
                            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                              Unit Price: ₹
                              {item.price.toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-6 sm:mt-0">
                            <div className="flex items-center gap-4 bg-surface-container rounded-full px-4 py-2">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))
                                }
                                className="material-symbols-outlined text-primary hover:text-secondary transition-colors text-[18px]"
                              >
                                remove
                              </button>
                              <span className="font-label-sm text-label-sm text-primary w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity + 1)}
                                className="material-symbols-outlined text-primary hover:text-secondary transition-colors text-[18px]"
                              >
                                add
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.cartItemId)}
                              className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest hover:text-error transition-colors flex items-center gap-2 relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-error hover:after:w-full after:transition-all after:duration-300"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Top Picks Section */}
                  {recommendations.length > 0 && (
                    <div className="mt-12 w-full">
                      <h3 className="font-headline-md text-headline-md text-primary mb-8 text-center sm:text-left">
                        Top Picks
                      </h3>
                      <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory">
                        {recommendations
                          .filter(product => !cart.items.some(item => item.productId === product.productId))
                          .slice(0, 3)
                          .map((product) => (
                          <div key={product.productId} className="flex-none w-48 snap-start group cursor-pointer">
                            <div
                              className="w-full aspect-[4/5] bg-surface-container-high mb-4 overflow-hidden rounded-sm relative"
                              onClick={() => navigate(`/products/${product.productId}`)}
                            >
                              <img
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                src={
                                  product.imageUrls && product.imageUrls[0]
                                    ? product.imageUrls[0]
                                    : 'https://via.placeholder.com/200x250?text=Product'
                                }
                                alt={product.productName}
                              />
                              <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="material-symbols-outlined text-on-primary text-[16px]">
                                  add
                                </span>
                              </div>
                            </div>
                            <h4 className="font-headline-md text-body-lg text-primary">{product.productName}</h4>
                            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                              ₹
                              {product.price.toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Checkout */}
                <div className="w-full lg:w-80 flex-none">
                  <div className="sticky top-32 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Total</span>
                      <span className="font-headline-lg text-primary">
                        ₹
                        {cart.totalAmount.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    <button
                      onClick={handleProceedToCheckout}
                      className="w-full bg-primary text-on-primary py-4 font-label-sm text-label-sm uppercase tracking-widest hover:bg-secondary transition-colors duration-300 relative overflow-hidden group"
                    >
                      <span className="relative z-10">Proceed to Checkout</span>
                    </button>

                    <div className="flex justify-center gap-2 opacity-50">
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                      <span className="font-label-sm text-label-sm uppercase tracking-widest text-xs">Secure Checkout</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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
      <style>{`
        .flex::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
