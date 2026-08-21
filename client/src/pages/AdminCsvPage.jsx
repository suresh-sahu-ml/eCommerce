import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';

export default function AdminCsvPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info', buttons: [] });

  const showModal = (title, message, type = 'info', buttons = null) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      buttons: buttons || [
        {
          label: 'OK',
          onClick: () => setModal({ ...modal, isOpen: false }),
          variant: 'primary'
        }
      ]
    });
  };

  const handleDownloadTemplate = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (!token) {
        showModal('Error', 'You must be logged in as an admin', 'error');
        return;
      }

      const response = await fetch('http://localhost:8080/api/products/csv/template', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'product_template.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        showModal('Success', 'Template downloaded successfully!', 'success');
      } else if (response.status === 403) {
        showModal('Error', 'You do not have admin permissions', 'error');
      } else {
        showModal('Error', 'Failed to download template', 'error');
      }
    } catch (error) {
      console.error('Error downloading template:', error);
      showModal('Error', 'An error occurred while downloading the template', 'error');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        showModal('Error', 'Please select a CSV file', 'error');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showModal('Error', 'Please select a CSV file to upload', 'error');
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (!token) {
        showModal('Error', 'You must be logged in as an admin', 'error');
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:8080/api/products/csv/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadResult(data);
        showModal('Upload Complete', `Successfully imported ${data.successfulImports} products. Failed: ${data.failedImports}`, 'success');
        setSelectedFile(null);
        document.querySelector('input[type="file"]').value = '';
      } else if (response.status === 403) {
        showModal('Error', 'You do not have admin permissions', 'error');
      } else {
        showModal('Error', data.error || 'Failed to upload CSV', 'error');
      }
    } catch (error) {
      console.error('Error uploading CSV:', error);
      showModal('Error', 'An error occurred while uploading the CSV', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface scroll-smooth">
      <Header activePage="admin" />
      <main className="w-full pt-20 bg-surface min-h-screen scroll-smooth">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
          {/* Header */}
          <section className="mb-12">
            <h1 className="font-headline-lg text-headline-lg text-primary mb-4">Product CSV Import</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Bulk import products into your catalog using a CSV file
            </p>
          </section>

          {/* Template Section */}
          <section className="bg-surface-container rounded-lg p-8 mb-8 shadow-sm">
            <h2 className="font-headline-md text-headline-md text-primary mb-4">Step 1: Download Template</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Start by downloading our CSV template which contains all the required columns and an example row to guide you.
            </p>
            <button
              onClick={handleDownloadTemplate}
              className="px-8 py-3 bg-primary text-on-primary font-label-sm text-label-sm uppercase rounded hover:bg-secondary transition-colors tracking-widest flex items-center gap-2"
            >
              <span className="material-symbols-outlined">download</span>
              Download Template
            </button>
          </section>

          {/* Instructions Section */}
          <section className="bg-surface-container rounded-lg p-8 mb-8 shadow-sm">
            <h2 className="font-headline-md text-headline-md text-primary mb-4">Column Guide</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-outline">
                  <tr>
                    <th className="pb-3 pr-4 font-label-sm text-label-sm text-on-surface">Column</th>
                    <th className="pb-3 pr-4 font-label-sm text-label-sm text-on-surface">Required</th>
                    <th className="pb-3 pr-4 font-label-sm text-label-sm text-on-surface">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-outline-variant">
                    <td className="py-3 pr-4 font-body-sm text-body-sm">productName</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm text-error">Yes</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm">Name of the perfume product</td>
                  </tr>
                  <tr className="border-b border-outline-variant">
                    <td className="py-3 pr-4 font-body-sm text-body-sm">sku</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm text-error">Yes</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm">Unique stock keeping unit (must be unique)</td>
                  </tr>
                  <tr className="border-b border-outline-variant">
                    <td className="py-3 pr-4 font-body-sm text-body-sm">price</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm text-error">Yes</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm">Product price (decimal, e.g., 8500.00)</td>
                  </tr>
                  <tr className="border-b border-outline-variant">
                    <td className="py-3 pr-4 font-body-sm text-body-sm">stockQuantity</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm text-error">Yes</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm">Quantity in stock (integer, e.g., 50)</td>
                  </tr>
                  <tr className="border-b border-outline-variant">
                    <td className="py-3 pr-4 font-body-sm text-body-sm">description</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm text-on-surface-variant">No</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm">Product description</td>
                  </tr>
                  <tr className="border-b border-outline-variant">
                    <td className="py-3 pr-4 font-body-sm text-body-sm">brand</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm text-on-surface-variant">No</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm">Brand name (e.g., CHANEL)</td>
                  </tr>
                  <tr className="border-b border-outline-variant">
                    <td className="py-3 pr-4 font-body-sm text-body-sm">volumeMl</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm text-on-surface-variant">No</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm">Volume in milliliters (integer)</td>
                  </tr>
                  <tr className="border-b border-outline-variant">
                    <td className="py-3 pr-4 font-body-sm text-body-sm">olfactiveFamily</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm text-on-surface-variant">No</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm">Fragrance family (e.g., Floral, Oriental)</td>
                  </tr>
                  <tr className="border-b border-outline-variant">
                    <td className="py-3 pr-4 font-body-sm text-body-sm">isActive</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm text-on-surface-variant">No</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm">Visibility (true/false, default: true)</td>
                  </tr>
                  <tr className="border-b border-outline-variant">
                    <td className="py-3 pr-4 font-body-sm text-body-sm">discountType</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm text-on-surface-variant">No</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm">FIXED or PERCENTAGE</td>
                  </tr>
                  <tr className="border-b border-outline-variant">
                    <td className="py-3 pr-4 font-body-sm text-body-sm">discountValue</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm text-on-surface-variant">No</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm">Discount amount (e.g., 500 or 10)</td>
                  </tr>
                  <tr className="border-b border-outline-variant">
                    <td className="py-3 pr-4 font-body-sm text-body-sm">isDiscountActive</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm text-on-surface-variant">No</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm">true/false (default: false)</td>
                  </tr>
                  <tr className="border-b border-outline-variant">
                    <td className="py-3 pr-4 font-body-sm text-body-sm">imageUrl</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm text-on-surface-variant">No</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm">Primary product image URL</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-body-sm text-body-sm">additionalImages</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm text-on-surface-variant">No</td>
                    <td className="py-3 pr-4 font-body-sm text-body-sm">Additional URLs separated by semicolons (;)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Upload Section */}
          <section className="bg-surface-container rounded-lg p-8 mb-8 shadow-sm">
            <h2 className="font-headline-md text-headline-md text-primary mb-4">Step 2: Upload CSV</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Select your filled CSV file and upload to import products into the catalog.
            </p>
            <div className="flex flex-col gap-4">
              <div className="border-2 border-dashed border-outline-variant rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-[48px] text-on-surface-variant">
                    upload_file
                  </span>
                  <p className="font-body-md text-body-md text-on-surface">
                    {selectedFile ? `Selected: ${selectedFile.name}` : 'Click to select or drag CSV file here'}
                  </p>
                </label>
              </div>

              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className={`px-8 py-3 font-label-sm text-label-sm uppercase rounded tracking-widest flex items-center justify-center gap-2 transition-colors ${
                  !selectedFile || uploading
                    ? 'bg-on-surface-variant/30 text-on-surface-variant cursor-not-allowed'
                    : 'bg-primary text-on-primary hover:bg-secondary'
                }`}
              >
                <span className="material-symbols-outlined">
                  {uploading ? 'hourglass_empty' : 'upload'}
                </span>
                {uploading ? 'Uploading...' : 'Upload Products'}
              </button>
            </div>
          </section>

          {/* Results Section */}
          {uploadResult && (
            <section className="bg-surface-container rounded-lg p-8 shadow-sm">
              <h2 className="font-headline-md text-headline-md text-primary mb-6">Import Results</h2>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-surface rounded p-4 text-center">
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-2">Total Rows</p>
                  <p className="font-headline-lg text-headline-lg text-primary">{uploadResult.totalRows}</p>
                </div>
                <div className="bg-surface rounded p-4 text-center">
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-2">Successful</p>
                  <p className="font-headline-lg text-headline-lg text-tertiary">{uploadResult.successfulImports}</p>
                </div>
                <div className="bg-surface rounded p-4 text-center">
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-2">Failed</p>
                  <p className="font-headline-lg text-headline-lg text-error">{uploadResult.failedImports}</p>
                </div>
              </div>

              {/* Success Messages */}
              {uploadResult.successMessages && uploadResult.successMessages.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-3 tracking-widest">
                    Successful Imports ({uploadResult.successMessages.length})
                  </h3>
                  <div className="bg-surface rounded p-4 max-h-40 overflow-y-auto">
                    {uploadResult.successMessages.map((msg, idx) => (
                      <p key={idx} className="font-body-sm text-body-sm text-tertiary mb-1">
                        ✓ {msg}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Messages */}
              {uploadResult.errorMessages && uploadResult.errorMessages.length > 0 && (
                <div>
                  <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-3 tracking-widest">
                    Failed Imports ({uploadResult.errorMessages.length})
                  </h3>
                  <div className="bg-surface rounded p-4 max-h-40 overflow-y-auto">
                    {uploadResult.errorMessages.map((msg, idx) => (
                      <p key={idx} className="font-body-sm text-body-sm text-error mb-1">
                        ✗ {msg}
                      </p>
                    ))}
                  </div>
                </div>
              )}
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
