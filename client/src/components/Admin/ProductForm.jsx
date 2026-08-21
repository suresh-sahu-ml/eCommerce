import React, { useState, useEffect } from 'react';

export default function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    productName: '',
    sku: '',
    description: '',
    price: '',
    stockQuantity: '',
    brand: '',
    volumeMl: '',
    imageUrls: [],
    sizes: [],
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [maxFileSize, setMaxFileSize] = useState(5);  // Default 5MB

  useEffect(() => {
    // Fetch file upload config
    const fetchFileConfig = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/files/config');
        if (response.ok) {
          const config = await response.json();
          setMaxFileSize(config.maxFileSizeMB);
        }
      } catch (error) {
        console.error('Error fetching file config:', error);
      }
    };
    fetchFileConfig();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        description: product.description || '',
        imageUrls: product.imageUrls || [],
        sizes: product.sizes || [],
        isActive: product.isActive !== undefined ? product.isActive : product.active,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const addImageUrl = () => {
    if (formData.imageUrls.length < 4) {
      setFormData({
        ...formData,
        imageUrls: [...formData.imageUrls, ''],
      });
    }
  };

  const removeImageUrl = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const addSize = () => {
    if (formData.sizes.length < 4) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, { sizeName: '', sizeValue: '', price: '' }],
      });
    }
  };

  const removeSize = (index) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((_, i) => i !== index),
    });
  };

  const updateSize = (index, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setFormData({
      ...formData,
      sizes: newSizes,
    });
  };

  const updateImageUrl = (index, value) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = value;
    setFormData({
      ...formData,
      imageUrls: newImageUrls,
    });
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      alert(`File size (${fileSizeMB.toFixed(2)}MB) exceeds maximum limit of ${maxFileSize}MB`);
      return;
    }

    setUploading(true);
    const formDataObj = new FormData();
    formDataObj.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/api/files/upload', {
        method: 'POST',
        body: formDataObj,
      });

      if (response.ok) {
        const data = await response.json();
        // Construct full URL with /api prefix since that's the context-path
        updateImageUrl(index, `http://localhost:8080/api${data.url}`);
      } else {
        const errorData = await response.json();
        alert('File upload failed: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.productName.trim()) newErrors.productName = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (formData.stockQuantity === '' || formData.stockQuantity < 0) {
      newErrors.stockQuantity = 'Stock quantity is required and must be 0 or greater';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-surface-container rounded-lg p-8 max-w-2xl mx-auto">
      <h2 className="font-headline-md text-headline-md text-on-surface mb-6">
        {product ? 'Edit Product' : 'Add New Product'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block font-label-sm text-xs text-on-surface uppercase tracking-widest mb-2">
            Product Name *
          </label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-surface border rounded-md focus:outline-none transition-colors ${
              errors.productName
                ? 'border-error focus:border-error'
                : 'border-outline-variant focus:border-primary'
            }`}
          />
          {errors.productName && <p className="text-error text-sm mt-1">{errors.productName}</p>}
        </div>

        {/* SKU */}
        <div>
          <label className="block font-label-sm text-xs text-on-surface uppercase tracking-widest mb-2">
            SKU *
          </label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="e.g., PERF-001"
            className={`w-full px-4 py-3 bg-surface border rounded-md focus:outline-none transition-colors ${
              errors.sku
                ? 'border-error focus:border-error'
                : 'border-outline-variant focus:border-primary'
            }`}
          />
          {errors.sku && <p className="text-error text-sm mt-1">{errors.sku}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block font-label-sm text-xs text-on-surface uppercase tracking-widest mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-md focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block font-label-sm text-xs text-on-surface uppercase tracking-widest mb-2">
            Brand
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="e.g., Luxury Fragrance Co."
            className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-md focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Volume ML */}
        <div>
          <label className="block font-label-sm text-xs text-on-surface uppercase tracking-widest mb-2">
            Volume (ml)
          </label>
          <input
            type="number"
            name="volumeMl"
            value={formData.volumeMl}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-md focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Images (URL or Upload) */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block font-label-sm text-xs text-on-surface uppercase tracking-widest">
              Images - URL or Upload (Max 4)
            </label>
            <button
              type="button"
              onClick={addImageUrl}
              disabled={formData.imageUrls.length >= 4}
              className={`font-label-sm text-xs uppercase tracking-widest px-3 py-2 transition-colors ${
                formData.imageUrls.length >= 4
                  ? 'bg-surface-container text-on-surface-variant cursor-not-allowed opacity-50'
                  : 'text-on-primary bg-primary hover:bg-secondary'
              }`}
            >
              + Add Image
            </button>
          </div>
          <div className="space-y-3">
            {formData.imageUrls.map((url, index) => (
              <div key={index} className="border border-outline-variant rounded-md p-3 space-y-2">
                <div className="flex gap-2 items-start">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => updateImageUrl(index, e.target.value)}
                    placeholder={`Image URL ${index + 1} or upload file below`}
                    className="flex-1 px-3 py-2 bg-surface border border-outline-variant rounded-md focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeImageUrl(index)}
                    className="px-3 py-2 bg-error/10 text-error font-label-sm text-xs uppercase tracking-widest hover:bg-error/20 transition-colors whitespace-nowrap"
                  >
                    Remove
                  </button>
                </div>
                <div>
                  <label className="text-xs text-on-surface-variant uppercase tracking-widest block mb-1">
                    Or Upload File (JPEG/PNG, Max {maxFileSize}MB)
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(index, e.target.files?.[0])}
                    disabled={uploading}
                    className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-md text-sm cursor-pointer"
                  />
                </div>
                {url && (
                  <div className="w-20 h-20 bg-surface-container rounded overflow-hidden">
                    <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ))}
            {formData.imageUrls.length === 0 && (
              <p className="text-on-surface-variant text-sm italic">No images added yet</p>
            )}
          </div>
          <p className="text-on-surface-variant text-xs mt-3">
            The first image will be used as the primary thumbnail. You can paste a URL or upload a JPEG/PNG file.
          </p>
        </div>

        {/* Price */}
        <div>
          <label className="block font-label-sm text-xs text-on-surface uppercase tracking-widest mb-2">
            Price (₹) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            className={`w-full px-4 py-3 bg-surface border rounded-md focus:outline-none transition-colors ${
              errors.price
                ? 'border-error focus:border-error'
                : 'border-outline-variant focus:border-primary'
            }`}
          />
          {errors.price && <p className="text-error text-sm mt-1">{errors.price}</p>}
        </div>

        {/* Stock Quantity */}
        <div>
          <label className="block font-label-sm text-xs text-on-surface uppercase tracking-widest mb-2">
            Stock Quantity *
          </label>
          <input
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            min="0"
            className={`w-full px-4 py-3 bg-surface border rounded-md focus:outline-none transition-colors ${
              errors.stockQuantity
                ? 'border-error focus:border-error'
                : 'border-outline-variant focus:border-primary'
            }`}
          />
          {errors.stockQuantity && <p className="text-error text-sm mt-1">{errors.stockQuantity}</p>}
        </div>

        {/* Sizes */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block font-label-sm text-xs text-on-surface uppercase tracking-widest">
              Sizes (Max 4)
            </label>
            <button
              type="button"
              onClick={addSize}
              disabled={formData.sizes.length >= 4}
              className={`font-label-sm text-xs uppercase tracking-widest px-3 py-2 transition-colors ${
                formData.sizes.length >= 4
                  ? 'bg-surface-container text-on-surface-variant cursor-not-allowed opacity-50'
                  : 'text-on-primary bg-primary hover:bg-secondary'
              }`}
            >
              + Add Size
            </button>
          </div>
          <div className="space-y-3">
            {formData.sizes.map((size, index) => (
              <div key={index} className="border border-outline-variant rounded-md p-3 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={size.sizeName}
                    onChange={(e) => updateSize(index, 'sizeName', e.target.value)}
                    placeholder="e.g., 50 ml"
                    className="px-3 py-2 bg-surface border border-outline-variant rounded-md focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                  <input
                    type="number"
                    value={size.sizeValue}
                    onChange={(e) => updateSize(index, 'sizeValue', e.target.value)}
                    placeholder="50"
                    className="px-3 py-2 bg-surface border border-outline-variant rounded-md focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                  <input
                    type="number"
                    value={size.price}
                    onChange={(e) => updateSize(index, 'price', e.target.value)}
                    placeholder="Price (₹)"
                    step="0.01"
                    min="0.01"
                    className="px-3 py-2 bg-surface border border-outline-variant rounded-md focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  className="px-3 py-2 bg-error/10 text-error font-label-sm text-xs uppercase tracking-widest hover:bg-error/20 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            {formData.sizes.length === 0 && (
              <p className="text-on-surface-variant text-sm italic">No sizes added yet</p>
            )}
          </div>
          <p className="text-on-surface-variant text-xs mt-3">
            Add different size options. E.g., "50 ml", "100 ml" with their respective prices.
          </p>
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive === true}
            onChange={handleChange}
            className="w-4 h-4 cursor-pointer"
          />
          <label htmlFor="isActive" className="font-label-sm text-on-surface cursor-pointer">
            Active (Checked = Yes)
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 bg-primary text-on-primary font-label-sm uppercase tracking-[0.2em] hover:bg-secondary disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-surface-container text-on-surface font-label-sm uppercase tracking-[0.2em] hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
