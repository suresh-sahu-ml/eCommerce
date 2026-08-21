import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductList from '../components/Admin/ProductList';
import ProductForm from '../components/Admin/ProductForm';
import authService from '../services/authService';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/products');

      if (response.ok) {
        const data = await response.json();
        // API returns a Page object, extract content array
        const productsList = data.content || data;
        setProducts(productsList);
        setError('');
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('Error fetching products: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      const url = editingProduct
        ? `http://localhost:8080/api/products/${editingProduct.productId}`
        : 'http://localhost:8080/api/products';

      const method = editingProduct ? 'PUT' : 'POST';

      console.log('Sending product data:', productData);
      console.log('isActive value:', productData.isActive);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingProduct(null);
        await fetchProducts();
      } else {
        const text = await response.text();
        console.log('Backend error response:', text);
        try {
          const errorData = JSON.parse(text);
          setError(errorData.message || errorData.error || 'Failed to save product');
        } catch {
          setError(text || 'Failed to save product');
        }
      }
    } catch (err) {
      setError('Error saving product: ' + err.message);
      console.error(err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
        },
      });

      if (response.ok) {
        await fetchProducts();
      } else {
        setError('Failed to delete product');
      }
    } catch (err) {
      setError('Error deleting product: ' + err.message);
      console.error(err);
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface scroll-smooth">
      <Header scrolled={false} activePage={null} />
      <main className="w-full pt-20 bg-surface min-h-screen scroll-smooth">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="font-headline-lg text-headline-lg text-on-surface">
                Product Management
              </h1>
              <button
                onClick={handleAddProduct}
                className="px-6 py-3 bg-primary text-on-primary font-label-sm uppercase tracking-[0.2em] hover:bg-secondary transition-colors"
              >
                Add Product
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-error-container/20 border border-error/30 rounded-md p-4 mb-6">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            {/* Form or List */}
            {showForm ? (
              <ProductForm
                product={editingProduct}
                onSave={handleSaveProduct}
                onCancel={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
              />
            ) : (
              <ProductList
                products={products}
                loading={loading}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
