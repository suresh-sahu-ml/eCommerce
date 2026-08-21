import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPolicyPage() {
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
      <Header scrolled={scrolled} />
      <main className="w-full pt-20 bg-surface">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
          {/* Page Title */}
          <h1 className="font-headline-lg text-headline-lg text-primary mb-8">Privacy Policy</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8">
            Last updated: August 19, 2026
          </p>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">1. Introduction</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                The Perfume Shop ("we", "us", "our", or "Company") operates the website and mobile application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                We use your data to provide and improve our Service. By using our Service, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">2. Information Collection and Use</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                We collect several different types of information for various purposes to provide and improve our Service to you.
              </p>

              <h3 className="font-headline-sm text-headline-sm text-primary mb-3 mt-4">Types of Data Collected:</h3>
              <ul className="list-disc list-inside space-y-2 text-on-surface-variant">
                <li><strong>Personal Data:</strong> Name, email address, phone number, postal address, and purchase history</li>
                <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, time spent on pages, and referral source</li>
                <li><strong>Device Data:</strong> Device type, operating system, and unique device identifiers</li>
                <li><strong>Payment Data:</strong> Credit/debit card information processed securely through our payment partners</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">3. Use of Data</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                The Perfume Shop uses the collected data for various purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-on-surface-variant">
                <li>To provide and maintain our Service</li>
                <li>To notify you about changes to our Service</li>
                <li>To provide customer support and respond to your inquiries</li>
                <li>To gather analysis or valuable information so that we can improve our Service</li>
                <li>To monitor the usage of our Service</li>
                <li>To detect, prevent, and address technical and security issues</li>
                <li>To send promotional communications (only with your consent)</li>
                <li>To fulfill orders and process transactions</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">4. Security of Data</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">5. Cookies and Tracking</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                Our Service uses cookies and similar tracking technologies to enhance your experience. These help us:
              </p>
              <ul className="list-disc list-inside space-y-2 text-on-surface-variant">
                <li>Remember your preferences and login information</li>
                <li>Understand how you interact with our Service</li>
                <li>Provide personalized recommendations</li>
                <li>Analyze traffic patterns and measure campaign effectiveness</li>
              </ul>
              <p className="font-body-md text-body-md text-on-surface-variant mt-4">
                You can control cookie settings through your browser preferences. However, disabling cookies may affect the functionality of our Service.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">6. Third-Party Links</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Our Service may contain links to third-party websites, applications, and services that are not operated by us. This Privacy Policy does not apply to third-party services, and we are not responsible for their privacy practices. We encourage you to review their privacy policies before providing any personal information.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">7. Your Rights</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                You have certain rights regarding your personal data, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-on-surface-variant">
                <li>The right to access your personal data</li>
                <li>The right to rectify inaccurate data</li>
                <li>The right to request deletion of your data</li>
                <li>The right to object to the processing of your data</li>
                <li>The right to restrict processing of your data</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent at any time</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">8. Retention of Data</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                The Perfume Shop will retain your Personal Data only for as long as necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">9. Changes to This Privacy Policy</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">10. Contact Us</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-surface-container rounded-lg p-6 space-y-3">
                <p className="font-body-md text-on-surface">
                  <strong>Email:</strong> privacy@theperfumeshop.com
                </p>
                <p className="font-body-md text-on-surface">
                  <strong>Phone:</strong> +91 (555) 123-4567
                </p>
                <p className="font-body-md text-on-surface">
                  <strong>Address:</strong> Hyderabad, India
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
