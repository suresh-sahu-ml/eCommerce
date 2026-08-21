import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
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

      const response = await fetch('http://localhost:8080/api/orders', { headers });

      if (response.status === 401) {
        localStorage.clear();
        navigate('/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
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

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(order => {
        if (activeTab === 'active') return ['CONFIRMED', 'PENDING', 'SHIPPED'].includes(order.status);
        if (activeTab === 'delivered') return order.status === 'DELIVERED';
        if (activeTab === 'cancelled') return order.status === 'CANCELLED';
        return true;
      });

  const tabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'active', label: 'Active' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <Header activePage="orders" />
      <main className="w-full pt-20 bg-surface">
        <div className="flex flex-col w-full">
          {/* Header Section */}
          <section className="max-w-[1440px] mx-auto w-full px-margin-mobile lg:px-margin-desktop py-12 flex flex-col items-center justify-center">
            <h1 className="font-display-lg text-display-lg text-primary text-center mb-4">My Orders</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant text-center max-w-2xl text-sm">
              A curated history of your olfactory journeys. Review past acquisitions, track current deliveries, and rediscover your signature scents.
            </p>
          </section>

          {/* Tab Navigation */}
          <section className="max-w-[1440px] mx-auto w-full px-margin-mobile lg:px-margin-desktop mb-8">
            <div className="flex items-center justify-center gap-6 relative pb-3 border-b border-outline-variant/30">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`font-label-sm text-label-sm uppercase tracking-wide pb-3 transition-colors text-xs ${
                    activeTab === tab.id
                      ? 'text-primary border-b-[2px] border-primary'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </section>

          {/* Orders List */}
          <section className="max-w-4xl mx-auto w-full px-margin-mobile lg:px-margin-desktop pb-8 flex flex-col gap-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-on-surface-variant">Loading your orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-on-surface-variant">No orders found</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const itemCount = order.orderItems?.length || 0;

                return (
                  <article key={order.orderId} className="group bg-white p-6 flex flex-col md:flex-row gap-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1 rounded-lg">
                    <div className="flex-1 flex flex-col gap-4">
                      {/* Order Header */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase text-xs">Order Number</span>
                          <span className="font-headline-md text-headline-md text-primary text-lg">#{order.orderNumber.split('-')[1]}</span>
                        </div>
                        <div className="flex flex-col gap-1 md:text-center">
                          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase text-xs">Date</span>
                          <span className="font-body-md text-body-md text-primary text-sm">
                            {new Date(order.createdDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 md:text-right">
                          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase text-xs">Total</span>
                          <span className="font-body-md text-body-md text-primary text-sm">
                            ₹{order.totalAmount?.toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Status & Items */}
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 relative border-t border-outline-variant/20">
                        <div className="flex items-center gap-3 pt-2">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${statusInfo.color}`}>
                            <span className="material-symbols-outlined text-[16px] text-on-surface">{statusInfo.icon}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label-sm text-label-sm uppercase text-on-surface text-xs">{statusInfo.label}</span>
                            <span className="font-body-md text-body-md text-on-surface-variant text-xs">
                              {order.status === 'SHIPPED' && 'Estimated arrival: Oct 24'}
                              {order.status === 'DELIVERED' && `Delivered on ${new Date(order.createdDate).toLocaleDateString()}`}
                              {order.status === 'CONFIRMED' && 'Order confirmed'}
                              {order.status === 'PENDING' && 'Processing'}
                            </span>
                          </div>
                        </div>

                        {/* Product Images */}
                        <div className="flex gap-2">
                          {order.orderItems?.slice(0, 2).map((item, idx) => (
                            <div
                              key={idx}
                              className="w-14 h-18 bg-cover bg-center shadow-sm rounded border border-outline-variant/20"
                              style={{
                                backgroundImage: `url('${item.imageUrl || 'https://via.placeholder.com/56x72'}')`,
                              }}
                              title={item.productName}
                            ></div>
                          ))}
                          {itemCount > 2 && (
                            <div className="w-14 h-18 bg-surface-container-high shadow-sm rounded border border-outline-variant/20 flex items-center justify-center">
                              <span className="font-label-sm text-label-sm text-primary text-xs">+{itemCount - 2}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="md:w-48 flex flex-col justify-end gap-2 relative pt-2 overflow-hidden">
                      <div className="absolute left-0 top-0 h-full w-[1px] bg-outline-variant/20 hidden md:block"></div>
                      <div className="md:pl-6 flex flex-col gap-2 absolute inset-x-0 bottom-0 p-4 flex justify-center transition-all duration-300 ease-out opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 md:static md:opacity-100 md:translate-y-0">
                        {order.status === 'SHIPPED' ? (
                          <>
                            <button className="w-full bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-[0.2em] py-4 hover:bg-secondary transition-colors relative overflow-hidden group">
                              Track Delivery
                            </button>
                            <button onClick={() => navigate(`/orders/${order.orderNumber}`)} className="w-full bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-[0.2em] py-4 hover:bg-secondary transition-colors relative overflow-hidden group">
                              View Details
                            </button>
                          </>
                        ) : order.status === 'DELIVERED' ? (
                          <>
                            <button onClick={() => navigate(`/orders/${order.orderNumber}`)} className="w-full bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-[0.2em] py-4 hover:bg-secondary transition-colors relative overflow-hidden group">
                              View Details
                            </button>
                            <button className="w-full bg-transparent text-primary font-label-sm text-label-sm uppercase tracking-[0.2em] py-4 hover:bg-surface-container transition-colors">
                              Write Review
                            </button>
                          </>
                        ) : (
                          <button onClick={() => navigate(`/orders/${order.orderNumber}`)} className="w-full bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-[0.2em] py-4 hover:bg-secondary transition-colors relative overflow-hidden group">
                            View Details
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </section>

          {/* Support Section */}
          <section className="max-w-[1440px] mx-auto w-full px-margin-mobile lg:px-margin-desktop pb-8">
            <div className="bg-surface-container-high p-8 md:p-12 flex flex-col items-center justify-center text-center rounded-lg">
              <h2 className="font-headline-lg text-headline-lg text-primary mb-4">Need Assistance?</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mb-6 text-sm">
                Our concierges are available to assist you with tracking inquiries, bespoke recommendations, or returns. We aim to ensure your experience is as seamless as our scents.
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wide py-3 px-6 hover:bg-secondary transition-colors duration-300 text-xs"
              >
                Contact Concierge
              </button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
