import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import authService from '../services/authService';

export default function OrderDetailPage() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info', buttons: [] });

  useEffect(() => {
    fetchOrderDetails();
  }, [orderNumber]);

  useEffect(() => {
    if (order?.orderItems) {
      checkWishlistStatus();
    }
  }, [order]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');

      if (!token) {
        navigate('/login');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const response = await fetch(`http://localhost:8080/api/orders/${orderNumber}`, { headers });

      if (response.status === 401) {
        localStorage.clear();
        navigate('/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
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

  const checkWishlistStatus = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (!token) return;

      const newWishlistItems = new Set();
      for (const item of order.orderItems) {
        const response = await fetch(`http://localhost:8080/api/wishlist/check/${item.productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.inWishlist) {
            newWishlistItems.add(item.productId);
          }
        }
      }
      setWishlistItems(newWishlistItems);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleAddToWishlist = async (productId, productName) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/wishlist/add/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const newSet = new Set(wishlistItems);
        newSet.add(productId);
        setWishlistItems(newSet);
        showModal('Success', `${productName} added to wishlist!`, 'success');
      } else if (response.status === 409) {
        showModal('Info', `${productName} is already in your wishlist`, 'info');
      } else {
        showModal('Error', 'Failed to add to wishlist', 'error');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      showModal('Error', 'An error occurred while adding to wishlist', 'error');
    }
  };

  const handleRemoveFromWishlist = async (productId, productName) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const newSet = new Set(wishlistItems);
        newSet.delete(productId);
        setWishlistItems(newSet);
        showModal('Success', `${productName} removed from wishlist!`, 'success');
      } else {
        showModal('Error', 'Failed to remove from wishlist', 'error');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      showModal('Error', 'An error occurred while removing from wishlist', 'error');
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      CONFIRMED: { label: 'Order Placed', icon: 'shopping_bag', color: 'bg-yellow-100' },
      PENDING: { label: 'Processing', icon: 'schedule', color: 'bg-yellow-100' },
      SHIPPED: { label: 'In Transit', icon: 'local_shipping', color: 'bg-blue-100' },
      DELIVERED: { label: 'Delivered', icon: 'check_circle', color: 'bg-green-100' },
      CANCELLED: { label: 'Cancelled', icon: 'cancel', color: 'bg-red-100' },
    };
    return statusMap[status] || statusMap.CONFIRMED;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <Header activePage="orders" />
        <div className="pt-20 flex items-center justify-center h-96">
          <p className="text-on-surface-variant">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-surface">
        <Header activePage="orders" />
        <div className="pt-20 flex items-center justify-center h-96">
          <p className="text-on-surface-variant">Order not found</p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const subtotal = order.totalAmount;
  const tax = subtotal * 0.18;
  const shipping = 0;
  const total = subtotal + tax + shipping;

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <Header activePage="orders" />
      <main className="w-full pt-20 bg-surface">
        <div className="flex flex-col w-full">
          {/* Header */}
          <section className="max-w-4xl mx-auto w-full px-margin-mobile lg:px-margin-desktop py-8 flex items-center gap-4">
            <button
              onClick={() => navigate(authService.isAdmin() ? '/admin/orders' : '/orders')}
              className="text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-headline-lg text-headline-lg text-primary">Order #{order.orderNumber.split('-')[1]}</h1>
          </section>

          {/* Order Status */}
          <section className="max-w-4xl mx-auto w-full px-margin-mobile lg:px-margin-desktop pb-8">
            <div className="bg-white p-6 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-4 mb-6">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${statusInfo.color}`}>
                  <span className="material-symbols-outlined text-[24px]">{statusInfo.icon}</span>
                </div>
                <div>
                  <p className="font-headline-md text-headline-md text-primary">{statusInfo.label}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                    Ordered on {new Date(order.createdDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-outline-variant/20">
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase text-xs mb-2">Order Number</p>
                  <p className="font-body-md text-body-md text-primary">#{order.orderNumber.split('-')[1]}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase text-xs mb-2">Order Date</p>
                  <p className="font-body-md text-body-md text-primary">
                    {new Date(order.createdDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase text-xs mb-2">Total Amount</p>
                  <p className="font-body-md text-body-md text-primary">
                    ₹{total.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-outline-variant/20">
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase text-xs mb-3">Delivery Address</p>
                <p className="font-body-md text-body-md text-on-surface whitespace-pre-wrap">
                  {order.shippingAddress || 'No delivery address provided'}
                </p>
              </div>
            </div>
          </section>

          {/* Order Items */}
          <section className="max-w-4xl mx-auto w-full px-margin-mobile lg:px-margin-desktop pb-8">
            <h2 className="font-headline-md text-headline-md text-primary mb-4">Order Items</h2>
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className={`p-6 flex gap-6 ${idx > 0 ? 'border-t border-outline-variant/20' : ''}`}>
                  <div className="w-24 h-32 bg-cover bg-center rounded-lg flex-shrink-0" style={{
                    backgroundImage: `url('${item.imageUrl || 'https://via.placeholder.com/96x128'}')`,
                  }}></div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-headline-md text-headline-md text-primary mb-2">{item.productName}</p>
                      <p className="font-body-md text-body-md text-on-surface-variant text-sm mb-4">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="flex justify-between items-end">
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        ₹{item.unitPrice?.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })} each
                      </p>
                      <div className="flex items-center gap-4">
                        <p className="font-headline-md text-headline-md text-primary">
                          ₹{item.lineTotal?.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <button
                          onClick={() => {
                            if (wishlistItems.has(item.productId)) {
                              handleRemoveFromWishlist(item.productId, item.productName);
                            } else {
                              handleAddToWishlist(item.productId, item.productName);
                            }
                          }}
                          className={`p-2 rounded transition-colors ${
                            wishlistItems.has(item.productId)
                              ? 'bg-error/20 text-error hover:bg-error/30'
                              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                          }`}
                          title={wishlistItems.has(item.productId) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {wishlistItems.has(item.productId) ? 'favorite' : 'favorite_border'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Order Summary */}
          <section className="max-w-4xl mx-auto w-full px-margin-mobile lg:px-margin-desktop pb-8">
            <h2 className="font-headline-md text-headline-md text-primary mb-4">Order Summary</h2>
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-outline-variant/20">
                  <span className="font-body-md text-body-md text-on-surface-variant">Subtotal</span>
                  <span className="font-body-md text-body-md text-primary">
                    ₹{subtotal.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-outline-variant/20">
                  <span className="font-body-md text-body-md text-on-surface-variant">Shipping</span>
                  <span className="font-body-md text-body-md text-primary">Free</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-outline-variant/20">
                  <span className="font-body-md text-body-md text-on-surface-variant">Tax (18%)</span>
                  <span className="font-body-md text-body-md text-primary">
                    ₹{tax.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="font-headline-md text-headline-md text-primary">Total</span>
                  <span className="font-headline-md text-headline-md text-primary text-lg">
                    ₹{total.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <section className="max-w-4xl mx-auto w-full px-margin-mobile lg:px-margin-desktop pb-16">
              <h2 className="font-headline-md text-headline-md text-primary mb-4">Shipping Address</h2>
              <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
                <p className="font-body-md text-body-md text-on-surface whitespace-pre-wrap">{order.shippingAddress}</p>
              </div>
            </section>
          )}
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
