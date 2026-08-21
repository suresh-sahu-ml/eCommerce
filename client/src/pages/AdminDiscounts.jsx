import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';

export default function AdminDiscounts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info', buttons: [] });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    discountType: 'PERCENTAGE',
    discountValue: 0,
    isDiscountActive: false
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/products?size=100');
      console.log('Products response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Products data:', data);
        const productsList = Array.isArray(data) ? data : (data.content || []);
        console.log('Products list:', productsList);
        setProducts(productsList);
      } else {
        console.error('Error response:', response.status);
        showModal('Error', `Failed to load products (${response.status})`, 'error');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showModal('Error', 'Failed to load products: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showModal = (title, message, type = 'info', buttons = []) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      buttons
    });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const handleEditClick = (product) => {
    setEditingId(product.productId);
    setEditForm({
      discountType: product.discountType || 'PERCENTAGE',
      discountValue: product.discountValue || 0,
      isDiscountActive: product.isDiscountActive || false
    });
  };

  const handleSaveDiscount = async (productId) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');

      console.log('Sending discount update:', editForm);

      const response = await fetch(`http://localhost:8080/api/products/${productId}/discount`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        console.log('Discount update response:', updatedProduct);
        console.log('isDiscountActive in response:', updatedProduct.isDiscountActive);

        setProducts(products.map(p => p.productId === productId ? updatedProduct : p));
        setEditingId(null);
        showModal('Success', 'Discount updated successfully', 'success', [
          {
            label: 'OK',
            onClick: closeModal,
            style: 'primary'
          }
        ]);
      } else {
        showModal('Error', 'Failed to update discount', 'error', [
          {
            label: 'OK',
            onClick: closeModal,
            style: 'primary'
          }
        ]);
      }
    } catch (error) {
      console.error('Error updating discount:', error);
      showModal('Error', 'An error occurred while updating discount', 'error', [
        {
          label: 'OK',
          onClick: closeModal,
          style: 'primary'
        }
      ]);
    }
  };

  const handleDeleteDiscount = async (productId, productName) => {
    showModal(
      'Confirm Delete',
      `Remove discount from ${productName}?`,
      'warning',
      [
        {
          label: 'Cancel',
          onClick: closeModal,
          style: 'secondary'
        },
        {
          label: 'Delete',
          onClick: async () => {
            try {
              const token = localStorage.getItem('token') || localStorage.getItem('access_token');
              const response = await fetch(`http://localhost:8080/api/products/${productId}/discount`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              });

              if (response.ok) {
                const updatedProduct = await response.json();
                setProducts(products.map(p => p.productId === productId ? updatedProduct : p));
                closeModal();
                showModal('Success', 'Discount removed successfully', 'success', [
                  {
                    label: 'OK',
                    onClick: closeModal,
                    style: 'primary'
                  }
                ]);
              } else {
                showModal('Error', 'Failed to remove discount', 'error', [
                  {
                    label: 'OK',
                    onClick: closeModal,
                    style: 'primary'
                  }
                ]);
              }
            } catch (error) {
              console.error('Error removing discount:', error);
              showModal('Error', 'An error occurred while removing discount', 'error', [
                {
                  label: 'OK',
                  onClick: closeModal,
                  style: 'primary'
                }
              ]);
            }
          },
          style: 'error'
        }
      ]
    );
  };

  const calculateDiscountedPrice = (price, discountType, discountValue, isActive) => {
    if (!isActive || !discountValue) return price;

    if (discountType === 'FIXED') {
      return price - discountValue;
    } else if (discountType === 'PERCENTAGE') {
      return price - (price * discountValue / 100);
    }
    return price;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <Header />
        <div className="pt-20 flex items-center justify-center h-96">
          <p className="text-on-surface-variant">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface font-body-md text-on-surface scroll-smooth">
      <Header />
      <main className="w-full pt-20 bg-surface min-h-screen scroll-smooth">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-8">
            Discount Management
          </h1>

          <div className="overflow-x-auto bg-surface-container rounded-lg shadow-sm border border-outline-variant/20">
            <table className="w-full">
              <thead className="bg-surface-container-high">
                <tr className="border-b border-outline-variant/30">
                  <th className="px-6 py-4 text-left font-label-sm text-label-sm uppercase tracking-widest text-on-surface">Product Name</th>
                  <th className="px-6 py-4 text-left font-label-sm text-label-sm uppercase tracking-widest text-on-surface">MRP</th>
                  <th className="px-6 py-4 text-left font-label-sm text-label-sm uppercase tracking-widest text-on-surface">Discount Type</th>
                  <th className="px-6 py-4 text-left font-label-sm text-label-sm uppercase tracking-widest text-on-surface">Discount Value</th>
                  <th className="px-6 py-4 text-left font-label-sm text-label-sm uppercase tracking-widest text-on-surface">Active</th>
                  <th className="px-6 py-4 text-left font-label-sm text-label-sm uppercase tracking-widest text-on-surface">Discounted Price</th>
                  <th className="px-6 py-4 text-left font-label-sm text-label-sm uppercase tracking-widest text-on-surface">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.productId} className="border-b border-outline-variant/20 hover:bg-surface-container-high transition-colors">
                    <td className="px-6 py-4 font-body-md text-body-md">{product.productName}</td>
                    <td className="px-6 py-4 font-body-md text-body-md">₹{product.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4">
                      {editingId === product.productId ? (
                        <select
                          value={editForm.discountType}
                          onChange={(e) => setEditForm({ ...editForm, discountType: e.target.value })}
                          className="px-2 py-1 border border-outline-variant/40 rounded font-body-md"
                        >
                          <option value="FIXED">Fixed</option>
                          <option value="PERCENTAGE">Percentage</option>
                        </select>
                      ) : (
                        <span className="font-body-md text-body-md">{product.discountType || '-'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === product.productId ? (
                        <input
                          type="number"
                          value={editForm.discountValue || 0}
                          onChange={(e) => setEditForm({ ...editForm, discountValue: parseFloat(e.target.value) })}
                          className="px-2 py-1 border border-outline-variant/40 rounded font-body-md w-24"
                          step="0.01"
                        />
                      ) : (
                        <span className="font-body-md text-body-md">{product.discountValue ? `${product.discountType === 'PERCENTAGE' ? product.discountValue + '%' : '₹' + product.discountValue}` : '-'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === product.productId ? (
                        <input
                          type="checkbox"
                          checked={editForm.isDiscountActive}
                          onChange={(e) => setEditForm({ ...editForm, isDiscountActive: e.target.checked })}
                          className="w-5 h-5"
                        />
                      ) : (
                        <span className={`font-body-md text-sm ${product.isDiscountActive ? 'text-green-600' : 'text-on-surface-variant'}`}>
                          {product.isDiscountActive ? 'Yes' : 'No'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-headline-md text-headline-md text-primary">
                      ₹{calculateDiscountedPrice(product.price, editingId === product.productId ? editForm.discountType : product.discountType, editingId === product.productId ? editForm.discountValue : product.discountValue, editingId === product.productId ? editForm.isDiscountActive : product.isDiscountActive)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === product.productId ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveDiscount(product.productId)}
                            className="px-4 py-2 bg-primary text-on-primary font-label-sm text-label-sm rounded hover:bg-secondary transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 bg-surface-container text-primary font-label-sm text-label-sm rounded hover:bg-surface-container-high transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="px-4 py-2 bg-primary text-on-primary font-label-sm text-label-sm rounded hover:bg-secondary transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDiscount(product.productId, product.productName)}
                            className="px-4 py-2 bg-error text-on-error font-label-sm text-label-sm rounded hover:bg-error/80 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </div>
  );
}
