import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

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

      const response = await fetch('http://localhost:8080/api/orders/all', { headers });

      if (response.status === 401) {
        localStorage.clear();
        navigate('/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      CONFIRMED: 'bg-yellow-100 text-yellow-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      SHIPPED: 'bg-blue-100 text-blue-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      CONFIRMED: 'shopping_bag',
      PENDING: 'schedule',
      SHIPPED: 'local_shipping',
      DELIVERED: 'check_circle',
      CANCELLED: 'cancel',
    };
    return icons[status] || 'info';
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortValue = (order, column) => {
    switch (column) {
      case 'orderNumber':
        return parseInt(order.orderNumber?.split('-')[1] || 0);
      case 'customer':
        return `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.toLowerCase();
      case 'email':
        return order.user?.email?.toLowerCase() || '';
      case 'date':
        return new Date(order.createdDate).getTime();
      case 'items':
        return order.orderItems?.length || 0;
      case 'amount':
        return order.totalAmount || 0;
      case 'status':
        return order.status?.toLowerCase() || '';
      default:
        return '';
    }
  };

  const filteredOrders = orders
    .filter(order => {
      if (filter !== 'all' && order.status !== filter) return false;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          order.orderNumber?.toLowerCase().includes(search) ||
          order.user?.email?.toLowerCase().includes(search) ||
          order.user?.firstName?.toLowerCase().includes(search) ||
          order.user?.lastName?.toLowerCase().includes(search)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const aValue = getSortValue(a, sortColumn);
      const bValue = getSortValue(b, sortColumn);

      if (typeof aValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });

  const stats = {
    total: orders.length,
    confirmed: orders.filter(o => o.status === 'CONFIRMED').length,
    shipped: orders.filter(o => o.status === 'SHIPPED').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    cancelled: orders.filter(o => o.status === 'CANCELLED').length,
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <Header activePage="admin" />
      <main className="w-full pt-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Orders Management</h1>
            <p className="font-body-md text-on-surface-variant">
              Track and manage all customer orders
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-surface-container rounded-lg p-6">
              <p className="font-body-sm text-on-surface-variant mb-2">Total Orders</p>
              <p className="font-headline-lg text-primary">{stats.total}</p>
            </div>
            <div className="bg-surface-container rounded-lg p-6">
              <p className="font-body-sm text-on-surface-variant mb-2">Confirmed</p>
              <p className="font-headline-lg text-yellow-600">{stats.confirmed}</p>
            </div>
            <div className="bg-surface-container rounded-lg p-6">
              <p className="font-body-sm text-on-surface-variant mb-2">Shipped</p>
              <p className="font-headline-lg text-blue-600">{stats.shipped}</p>
            </div>
            <div className="bg-surface-container rounded-lg p-6">
              <p className="font-body-sm text-on-surface-variant mb-2">Delivered</p>
              <p className="font-headline-lg text-green-600">{stats.delivered}</p>
            </div>
            <div className="bg-surface-container rounded-lg p-6">
              <p className="font-body-sm text-on-surface-variant mb-2">Total Revenue</p>
              <p className="font-headline-lg text-primary">₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-surface-container rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block font-label-sm text-label-sm uppercase mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Order #, Email, or Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-outline-variant rounded bg-surface font-body-md focus:outline-none focus:border-primary"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block font-label-sm text-label-sm uppercase mb-2">Status</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-outline-variant rounded bg-surface font-body-md focus:outline-none focus:border-primary"
                >
                  <option value="all">All Orders</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PENDING">Pending</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-surface-container rounded-lg overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <p className="text-on-surface-variant">Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-on-surface-variant">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-outline-variant/20 bg-surface-container-high">
                      <th className="px-6 py-4 text-left font-label-sm text-label-sm uppercase cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('orderNumber')}>
                        Order # {sortColumn === 'orderNumber' && <span className="inline ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                      </th>
                      <th className="px-6 py-4 text-left font-label-sm text-label-sm uppercase cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('customer')}>
                        Customer {sortColumn === 'customer' && <span className="inline ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                      </th>
                      <th className="px-6 py-4 text-left font-label-sm text-label-sm uppercase cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('email')}>
                        Email {sortColumn === 'email' && <span className="inline ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                      </th>
                      <th className="px-6 py-4 text-left font-label-sm text-label-sm uppercase cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('date')}>
                        Date {sortColumn === 'date' && <span className="inline ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                      </th>
                      <th className="px-6 py-4 text-center font-label-sm text-label-sm uppercase cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('items')}>
                        Items {sortColumn === 'items' && <span className="inline ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                      </th>
                      <th className="px-6 py-4 text-right font-label-sm text-label-sm uppercase cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('amount')}>
                        Amount {sortColumn === 'amount' && <span className="inline ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                      </th>
                      <th className="px-6 py-4 text-left font-label-sm text-label-sm uppercase cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('status')}>
                        Status {sortColumn === 'status' && <span className="inline ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                      </th>
                      <th className="px-6 py-4 text-center font-label-sm text-label-sm uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <tr
                        key={order.orderId || index}
                        className="border-b border-outline-variant/10 hover:bg-surface-container-high transition-colors"
                      >
                        <td className="px-6 py-4 font-label-sm text-primary">
                          #{order.orderNumber?.split('-')[1] || order.orderId}
                        </td>
                        <td className="px-6 py-4 font-body-sm">
                          {order.user?.firstName} {order.user?.lastName}
                        </td>
                        <td className="px-6 py-4 font-body-sm text-on-surface-variant text-sm">
                          {order.user?.email}
                        </td>
                        <td className="px-6 py-4 font-body-sm text-sm">
                          {new Date(order.createdDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 font-body-sm text-center">
                          {order.orderItems?.length || 0}
                        </td>
                        <td className="px-6 py-4 font-label-sm text-right text-primary">
                          ₹{order.totalAmount?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-label-sm ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => navigate(`/orders/${order.orderNumber}`)}
                            className="px-4 py-2 bg-primary text-on-primary text-xs font-label-sm uppercase tracking-wider hover:bg-secondary transition-colors rounded"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="mt-6 text-center font-body-sm text-on-surface-variant">
            <p>
              Showing <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> orders
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
