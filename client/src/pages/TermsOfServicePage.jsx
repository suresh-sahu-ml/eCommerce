import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsOfServicePage() {
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
          <h1 className="font-headline-lg text-headline-lg text-primary mb-8">Terms of Service</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8">
            Last updated: August 19, 2026
          </p>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">1. Agreement to Terms</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "you") and The Perfume Shop ("Company", "we", "us", "our"). By accessing and using our website, mobile application, and services, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you may not use our Service.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">2. Use License</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on The Perfume Shop's Service for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-on-surface-variant">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on the Service</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
                <li>Violating any applicable laws or regulations related to access to the Service</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">3. Disclaimer</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                The materials on The Perfume Shop's Service are provided on an 'as is' basis. The Perfume Shop makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">4. Limitations</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                In no event shall The Perfume Shop or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the Service, even if The Perfume Shop or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">5. Accuracy of Materials</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                The materials appearing on The Perfume Shop's Service could include technical, typographical, or photographic errors. The Perfume Shop does not warrant that any of the materials on its Service are accurate, complete, or current. The Perfume Shop may make changes to the materials contained on its Service at any time without notice.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">6. Materials and Links</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                The Perfume Shop has not reviewed all of the sites linked to its Service and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by The Perfume Shop of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">7. Modifications</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                The Perfume Shop may revise these terms of service for its Service at any time without notice. By using this Service, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">8. Governing Law</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">9. User Accounts</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                If you create an account on our Service, you are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                You warrant that the information you provide during account creation is accurate and complete. You agree not to create accounts using fraudulent, fake, or misleading information.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">10. Prohibited Conduct</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                You agree not to engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-on-surface-variant">
                <li>Harassment, abuse, or harm of any kind</li>
                <li>Transmission of obscene or offensive content</li>
                <li>Disruption of normal flow of dialogue or spam</li>
                <li>Uploading viruses or malicious code</li>
                <li>Collecting or tracking personal information of others</li>
                <li>Spamming, phishing, or any fraudulent activity</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">11. Product Information and Pricing</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                We strive to provide accurate product descriptions and pricing on our Service. However, we do not warrant that product descriptions, pricing, or other content is accurate, complete, or error-free. We reserve the right to correct any errors, inaccuracies, or omissions.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                We also reserve the right to limit quantities and to refuse or cancel any order. Prices are subject to change without notice.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">12. Orders and Purchases</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                By placing an order, you are making an offer to purchase the products at the prices stated. We reserve the right to accept or reject your order for any reason. All orders are subject to acceptance and verification by The Perfume Shop.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Payment must be received before the order is processed. We accept various payment methods as displayed on our Service. All payment information is handled securely through our payment partners.
              </p>
            </section>

            {/* Section 13 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">13. Shipping and Delivery</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                We will use reasonable efforts to ship orders within the timeframe specified. However, we do not guarantee delivery dates. Delays may occur due to factors beyond our control.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Risk of loss passes to you upon delivery to the carrier or upon delivery to you, whichever is earlier. You are responsible for inspecting products upon delivery and reporting any damage or discrepancies within 48 hours.
              </p>
            </section>

            {/* Section 14 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">14. Returns and Refunds</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                Please refer to our Shipping &amp; Returns policy for detailed information about our return and refund procedures. This policy is subject to change at any time without notice.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                We reserve the right to refuse returns that do not meet our return policy requirements.
              </p>
            </section>

            {/* Section 15 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">15. Intellectual Property</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                All content on our Service, including text, graphics, logos, images, and software, is the property of The Perfume Shop or its content suppliers and is protected by international copyright laws. You may not reproduce, modify, distribute, or transmit any content without prior written permission from The Perfume Shop.
              </p>
            </section>

            {/* Section 16 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">16. Limitation of Liability</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                IN NO EVENT SHALL THE PERFUME SHOP, ITS DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES RESULTING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
            </section>

            {/* Section 17 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">17. Indemnification</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                You agree to indemnify, defend, and hold harmless The Perfume Shop and its officers, directors, employees, and agents from any and all claims, damages, losses, costs, and expenses (including legal fees) arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            {/* Section 18 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">18. Severability</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect, and the invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.
              </p>
            </section>

            {/* Section 19 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">19. Entire Agreement</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                These Terms of Service, together with our Privacy Policy and any other policies posted on our Service, constitute the entire agreement between you and The Perfume Shop regarding the use of the Service and supersede any prior agreements or understandings.
              </p>
            </section>

            {/* Section 20 */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">20. Contact Information</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-surface-container rounded-lg p-6 space-y-3">
                <p className="font-body-md text-on-surface">
                  <strong>Email:</strong> support@theperfumeshop.com
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
