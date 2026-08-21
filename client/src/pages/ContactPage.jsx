import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';

export default function ContactPage() {
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info', buttons: [] });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showModal = (title, message, type = 'info') => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      buttons: [
        {
          label: 'OK',
          onClick: () => {
            if (type === 'success') {
              setFormData({ name: '', email: '', subject: '', message: '' });
            }
            closeModal();
          },
          variant: 'primary'
        }
      ]
    });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      showModal('Error', 'Please fill in all fields', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showModal('Error', 'Please enter a valid email address', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showModal('Success', 'Thank you! We have received your message and will get back to you shortly.', 'success');
      } else {
        showModal('Error', 'Failed to send message. Please try again later.', 'error');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      showModal('Error', 'An error occurred. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <Header scrolled={scrolled} activePage="contact-us" />
      <main className="w-full pt-20 bg-surface">
        <div className="flex flex-col w-full items-center px-4 pb-20">
          {/* Page Title */}
          <div className="max-w-2xl w-full text-center mb-12">
            <h1 className="font-headline-lg text-headline-lg text-primary mb-4">Contact Us</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              We'd love to hear from you. Whether you have a question about our fragrances, a special request, or feedback, feel free to reach out.
            </p>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl w-full">
            <div className="bg-surface-container rounded-lg p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block font-label-sm text-label-sm uppercase text-on-surface-variant mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-outline-variant/40 rounded bg-surface font-body-md text-body-md focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block font-label-sm text-label-sm uppercase text-on-surface-variant mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-outline-variant/40 rounded bg-surface font-body-md text-body-md focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <label className="block font-label-sm text-label-sm uppercase text-on-surface-variant mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What is this about?"
                    className="w-full px-4 py-3 border border-outline-variant/40 rounded bg-surface font-body-md text-body-md focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="block font-label-sm text-label-sm uppercase text-on-surface-variant mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Your message..."
                    rows="6"
                    className="w-full px-4 py-3 border border-outline-variant/40 rounded bg-surface font-body-md text-body-md focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-on-primary font-label-sm text-label-sm uppercase py-4 rounded hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-widest"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="max-w-2xl w-full mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Email */}
            <div className="text-center">
              <span className="material-symbols-outlined text-3xl text-primary mb-3 block">mail</span>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Email</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                support@theperfumeshop.com
              </p>
            </div>

            {/* Phone */}
            <div className="text-center ml-8">
              <span className="material-symbols-outlined text-3xl text-primary mb-3 block">phone</span>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Phone</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                +91 (555) 123-4567
              </p>
            </div>

            {/* Address */}
            <div className="text-center">
              <span className="material-symbols-outlined text-3xl text-primary mb-3 block">location_on</span>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Address</h3>
              <a
                href="https://maps.google.com/?q=The+Perfume+Shop,+Sangareddy,+Telangana,+502001"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
              >
                Near National Mart,<br />
                Sangareddy, Telangana<br />
                502001
              </a>
            </div>
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
