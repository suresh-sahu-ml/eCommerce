import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdminPanel from './AdminPanel';
import AdminDiscounts from './AdminDiscounts';
import AdminCsvPage from './AdminCsvPage';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');

  const tabs = [
    { id: 'products', label: 'Products', component: AdminPanel },
    { id: 'discounts', label: 'Discounts', component: AdminDiscounts },
    { id: 'bulkupload', label: 'Bulk Import', component: AdminCsvPage },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component;

  return (
    <div className="bg-surface font-body-md text-on-surface scroll-smooth">
      <Header activePage="admin" />
      <main className="w-full pt-20 bg-surface min-h-screen scroll-smooth">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
          {/* Admin Navigation Tabs - Fixed/Sticky */}
          <div className="sticky top-20 z-40 flex gap-4 mb-8 border-b border-outline pb-4 bg-surface">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-label-sm uppercase tracking-[0.2em] transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-on-primary'
                    : 'bg-on-surface/10 text-on-surface hover:bg-on-surface/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {ActiveComponent && (
            <div className="admin-tab-content">
              <ActiveComponent hideHeader={true} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
