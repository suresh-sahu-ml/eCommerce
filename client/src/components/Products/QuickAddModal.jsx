import React, { useState, useEffect } from 'react';

export default function QuickAddModal({ product, isOpen, onClose }) {
  const [fullProduct, setFullProduct] = useState(product);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch full product details when modal opens (to get sizes)
  useEffect(() => {
    if (isOpen && (!product.sizes || product.sizes.length === 0)) {
      const fetchFullProduct = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/products/${product.id}`);
          if (response.ok) {
            const data = await response.json();
            setFullProduct(data);
            setSelectedSize(data.sizes?.[0]?.sizeId || null);
          }
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      };
      fetchFullProduct();
    } else if (isOpen && product.sizes && product.sizes.length > 0) {
      setFullProduct(product);
      setSelectedSize(product.sizes[0].sizeId);
    }
  }, [isOpen, product]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setMessage('Please select a size');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `http://localhost:8080/api/cart/add?productId=${fullProduct.id || fullProduct.productId}&sizeId=${selectedSize}&quantity=${quantity}`,
        {
          method: 'POST',
          headers,
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('✓ Added to bag!');
        console.log('Cart updated - new count:', data.cart.itemCount);
        localStorage.setItem('cartCount', data.cart.itemCount);
        // Dispatch event to update Header
        window.dispatchEvent(new Event('cartUpdated'));
        // Also trigger custom event with data
        window.dispatchEvent(new CustomEvent('cartCountUpdated', { detail: { count: data.cart.itemCount } }));
        setTimeout(() => {
          onClose();
          setMessage('');
          setQuantity(1);
          setSelectedSize(fullProduct.sizes?.[0]?.sizeId || null);
        }, 1500);
      } else {
        setMessage(`✗ ${data.error || 'Failed to add to bag'}`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setMessage('✗ Error adding to bag');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg p-8 max-w-md w-full mx-4 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline-md text-headline-md text-primary">{fullProduct.name || fullProduct.productName}</h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Product Image */}
        <div className="w-full aspect-square bg-surface-container-high rounded-lg overflow-hidden mb-6">
          <img
            src={fullProduct.image || (fullProduct.imageUrls && fullProduct.imageUrls[0])}
            alt={fullProduct.name || fullProduct.productName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Size Selection */}
        {fullProduct.sizes && fullProduct.sizes.length > 0 && (
          <div className="mb-6">
            <label className="font-label-sm text-label-sm uppercase text-primary block mb-3">
              Size
            </label>
            <div className="flex gap-2 flex-wrap">
              {fullProduct.sizes.map((size) => (
                <button
                  key={size.sizeId}
                  onClick={() => setSelectedSize(size.sizeId)}
                  className={`flex-1 min-w-20 py-2 text-center font-label-sm text-label-sm uppercase tracking-widest transition-all rounded ${
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

        {/* Quantity Selection */}
        <div className="mb-6">
          <label className="font-label-sm text-label-sm uppercase text-primary block mb-3">
            Quantity
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={isLoading}
              className="w-10 h-10 flex items-center justify-center bg-surface-container hover:bg-surface-dim rounded transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
            <span className="font-body-md text-center flex-1">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              disabled={isLoading}
              className="w-10 h-10 flex items-center justify-center bg-surface-container hover:bg-surface-dim rounded transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-3 rounded text-center font-label-sm text-sm ${
            message.includes('✓')
              ? 'bg-success-container text-on-success-container'
              : 'bg-error-container text-on-error-container'
          }`}>
            {message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 bg-surface-container text-primary font-label-sm text-label-sm uppercase tracking-widest hover:bg-surface-dim transition-colors disabled:opacity-50 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="flex-1 py-3 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest hover:bg-secondary transition-colors disabled:opacity-50 rounded"
          >
            {isLoading ? 'Adding...' : 'Add to Bag'}
          </button>
        </div>
      </div>
    </div>
  );
}
