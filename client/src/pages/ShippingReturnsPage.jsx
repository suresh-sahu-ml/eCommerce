import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ShippingReturnsPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <Header scrolled={scrolled} activePage={null} />
      <main className="w-full pt-20 bg-surface">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="font-headline-lg text-headline-lg text-primary mb-4">Shipping & Returns</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              We want you to be completely satisfied with your purchase. Here's everything you need to know about shipping and returns.
            </p>
          </div>

          {/* Shipping Section */}
          <section className="mb-12">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Shipping Information</h2>

            <div className="space-y-6">
              <div className="bg-surface-container rounded-lg p-6">
                <h3 className="font-label-lg text-label-lg text-primary mb-3">Domestic Shipping</h3>
                <ul className="font-body-md text-on-surface-variant space-y-2">
                  <li>• Free shipping on orders above ₹500</li>
                  <li>• Standard delivery: 3-5 business days</li>
                  <li>• Express delivery: 1-2 business days (additional charges apply)</li>
                  <li>• Shipping available to all locations in India</li>
                </ul>
              </div>

              <div className="bg-surface-container rounded-lg p-6">
                <h3 className="font-label-lg text-label-lg text-primary mb-3">International Shipping</h3>
                <ul className="font-body-md text-on-surface-variant space-y-2">
                  <li>• International orders are available to select countries</li>
                  <li>• Delivery time: 7-14 business days</li>
                  <li>• Customs duties and import taxes are the responsibility of the customer</li>
                  <li>• Contact us for international shipping quotes</li>
                </ul>
              </div>

              <div className="bg-surface-container rounded-lg p-6">
                <h3 className="font-label-lg text-label-lg text-primary mb-3">Order Tracking</h3>
                <p className="font-body-md text-on-surface-variant">
                  Once your order is dispatched, you'll receive a tracking number via email. You can use this to track your package in real-time.
                </p>
              </div>
            </div>
          </section>

          {/* Returns Section */}
          <section className="mb-12">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Returns & Exchange Policy</h2>

            <div className="space-y-6">
              <div className="bg-surface-container rounded-lg p-6">
                <h3 className="font-label-lg text-label-lg text-primary mb-3">Return Eligibility</h3>
                <ul className="font-body-md text-on-surface-variant space-y-2">
                  <li>• Returns accepted within 30 days of purchase</li>
                  <li>• Product must be unused and in original packaging</li>
                  <li>• All original documents and tags must be intact</li>
                  <li>• Items should be in resalable condition</li>
                </ul>
              </div>

              <div className="bg-surface-container rounded-lg p-6">
                <h3 className="font-label-lg text-label-lg text-primary mb-3">How to Return</h3>
                <ol className="font-body-md text-on-surface-variant space-y-2">
                  <li>1. Contact our customer service team at support@theperfumeshop.com</li>
                  <li>2. Provide your order number and reason for return</li>
                  <li>3. We'll provide you with a prepaid return shipping label</li>
                  <li>4. Pack the item securely and ship it back to us</li>
                  <li>5. Once received and verified, we'll process your refund within 5-7 business days</li>
                </ol>
              </div>

              <div className="bg-surface-container rounded-lg p-6">
                <h3 className="font-label-lg text-label-lg text-primary mb-3">Refund Details</h3>
                <ul className="font-body-md text-on-surface-variant space-y-2">
                  <li>• Refunds will be issued to the original payment method</li>
                  <li>• Original shipping charges are non-refundable</li>
                  <li>• Return shipping costs are covered by us for eligible returns</li>
                  <li>• Processing time: 5-7 business days after verification</li>
                </ul>
              </div>

              <div className="bg-surface-container rounded-lg p-6">
                <h3 className="font-label-lg text-label-lg text-primary mb-3">Exchanges</h3>
                <p className="font-body-md text-on-surface-variant mb-3">
                  We offer exchanges for different sizes or variants. To exchange:
                </p>
                <ul className="font-body-md text-on-surface-variant space-y-2">
                  <li>• Contact us with your order number and exchange request</li>
                  <li>• We'll arrange pickup of the current item</li>
                  <li>• New item will be shipped once the original is verified</li>
                  <li>• No additional charges for size/variant changes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Non-Returnable Items */}
          <section className="mb-12">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Non-Returnable Items</h2>
            <div className="bg-surface-container rounded-lg p-6">
              <ul className="font-body-md text-on-surface-variant space-y-2">
                <li>• Items without original packaging or tags</li>
                <li>• Used or opened products</li>
                <li>• Items damaged due to misuse or negligence</li>
                <li>• Products purchased during clearance or final sale events</li>
              </ul>
            </div>
          </section>

          {/* Contact Support */}
          <section className="mb-12">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Need Help?</h2>
            <div className="bg-surface-container rounded-lg p-6">
              <p className="font-body-md text-on-surface-variant mb-4">
                If you have any questions about shipping or returns, please don't hesitate to contact us:
              </p>
              <div className="space-y-2 font-body-md">
                <p><span className="text-primary font-label-sm">Email:</span> support@theperfumeshop.com</p>
                <p><span className="text-primary font-label-sm">Phone:</span> +91 (555) 123-4567</p>
                <p>
                  <span className="text-primary font-label-sm">Address:</span> Near National Mart, Sangareddy, Telangana, 502001
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
