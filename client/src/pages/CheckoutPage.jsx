import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info', buttons: [] });
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    flatNo: '',
    area: '',
    landmark: '',
    city: '',
    state: '',
    pin: '',
    country: 'IN',
  });

  useEffect(() => {
    fetchCart();
    // Load Razorpay script if not already loaded
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');

      if (!token) {
        navigate('/login');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const response = await fetch('http://localhost:8080/api/cart', { headers });

      if (response.status === 401) {
        localStorage.clear();
        navigate('/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
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
      buttons,
    });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));

    // Float label when user types
    const label = e.target.nextElementSibling;
    if (label) {
      if (value) {
        label.style.transform = 'translateY(-20px)';
        label.style.opacity = '1';
      } else {
        label.style.transform = 'translateY(0)';
        label.style.opacity = '0.6';
      }
    }
  };

  const handleInputFocus = (e) => {
    const label = e.target.nextElementSibling;
    if (label && !e.target.value) {
      label.style.transform = 'translateY(-20px)';
      label.style.opacity = '1';
    }
  };

  const handleInputBlur = (e) => {
    const label = e.target.nextElementSibling;
    if (label && !e.target.value) {
      label.style.transform = 'translateY(0)';
      label.style.opacity = '0.6';
    }
  };

  const handleProceedToPayment = async () => {
    if (!formData.email || !formData.phone || !formData.firstName || !formData.lastName || !formData.flatNo || !formData.area || !formData.city || !formData.state || !formData.pin) {
      showModal('Missing Fields', 'Please fill in all required fields', 'warning');
      return;
    }

    // Validate phone number (10 digits for India)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      showModal('Invalid Phone', 'Please enter a valid 10-digit phone number', 'error');
      return;
    }

    // Validate PIN code (6 digits for India)
    const pinRegex = /^[0-9]{6}$/;
    if (!pinRegex.test(formData.pin)) {
      showModal('Invalid PIN', 'Please enter a valid 6-digit PIN code', 'error');
      return;
    }

    setProcessingPayment(true);
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');

    try {
      if (!window.Razorpay) {
        showModal('System Error', 'Payment system not loaded. Please refresh and try again.', 'error');
        setProcessingPayment(false);
        return;
      }

      // Fetch Razorpay key from backend
      const configResponse = await fetch('http://localhost:8080/api/payments/config', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!configResponse.ok) {
        showModal('Configuration Error', 'Failed to fetch payment configuration', 'error');
        setProcessingPayment(false);
        return;
      }

      const config = await configResponse.json();
      const razorpayKey = config.keyId;

      // Create order on backend
      const createOrderResponse = await fetch(
        `http://localhost:8080/api/payments/create-order?cartId=${cart.cartId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: cart.totalAmount,
            currency: 'INR',
            receipt: `order_${cart.cartId}_${Date.now()}`,
            notes: `Checkout for ${formData.firstName} ${formData.lastName}, ${formData.address}`,
          }),
        }
      );

      if (!createOrderResponse.ok) {
        const error = await createOrderResponse.json();
        showModal('Order Error', `Failed to create order: ${error.error}`, 'error');
        setProcessingPayment(false);
        return;
      }

      const orderData = await createOrderResponse.json();

      // Open Razorpay checkout
      const options = {
        key: razorpayKey,
        order_id: orderData.order.orderId,
        amount: orderData.order.amount,
        currency: 'INR',
        name: 'The Perfume Shop',
        description: `Order for ${cart.itemCount} items`,
        handler: async function (response) {
          // Verify payment on backend
          const verifyResponse = await fetch('http://localhost:8080/api/payments/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          if (verifyResponse.ok) {
            showModal('Order Placed', 'Payment successful! Your order has been placed.', 'success', [
              { label: 'View Orders', variant: 'primary', onClick: () => navigate('/orders') }
            ]);
            localStorage.setItem('cartCount', '0');
            window.dispatchEvent(new Event('cartUpdated'));
            navigate('/orders');
          } else {
            const error = await verifyResponse.json();
            showModal('Verification Error', `Payment verification failed: ${error.error}`, 'error');
          }
        },
        prefill: {
          email: formData.email,
          contact: '',
        },
        theme: {
          color: '#3f51b5',
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', function (response) {
        showModal('Payment Failed', `${response.error.description}`, 'error');
        setProcessingPayment(false);
      });
    } catch (error) {
      console.error('Error during checkout:', error);
      showModal('Checkout Error', 'An error occurred during checkout. Please try again.', 'error');
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <Header activePage="checkout" />
        <div className="pt-20 flex items-center justify-center h-96">
          <p className="text-on-surface-variant">Loading checkout...</p>
        </div>
      </div>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-surface">
        <Header activePage="checkout" />
        <div className="pt-20 flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-on-surface-variant mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/cart')}
              className="px-8 py-4 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest hover:bg-secondary transition-colors"
            >
              Return to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <Header activePage="checkout" />
      <main className="w-full pt-20 bg-surface">
        <div className="flex flex-col w-full">
          <div className="max-w-6xl mx-auto w-full px-margin-mobile lg:px-margin-desktop py-6">
            <div className="mb-4">
              <h1 className="font-headline-lg text-headline-lg text-primary mb-1 tracking-tight text-lg">Checkout</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl text-sm">
                Complete your order. All orders include complimentary standard shipping.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Forms */}
              <div className="lg:col-span-7 flex flex-col gap-8">
                {/* Contact Section */}
                <section className="flex flex-col gap-6">
                  <h2 className="font-headline-md text-headline-md text-primary text-sm">Contact</h2>
                  <div className="relative group">
                    <input
                      className="w-full bg-transparent border-b border-outline-variant/40 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
                      id="email"
                      placeholder=" "
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                    <label
                      className="absolute left-0 top-3 text-xs text-on-surface-variant uppercase tracking-wide opacity-60 transition-all duration-200 cursor-text pointer-events-none font-light"
                      htmlFor="email"
                    >
                      Email Address <span className="text-error">*</span>
                    </label>
                  </div>
                  <div className="relative group">
                    <input
                      className="w-full bg-transparent border-b border-outline-variant/40 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
                      id="phone"
                      placeholder=" "
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                    <label
                      className="absolute left-0 top-3 text-xs text-on-surface-variant uppercase tracking-wide opacity-60 transition-all duration-200 cursor-text pointer-events-none font-light"
                      htmlFor="phone"
                    >
                      Phone Number <span className="text-error">*</span>
                    </label>
                  </div>
                </section>

                {/* Delivery Section */}
                <section className="flex flex-col gap-3">
                  <h2 className="font-headline-md text-headline-md text-primary text-sm">Delivery</h2>
                  <div className="flex flex-col gap-4">
                    <div className="py-3 border-b border-outline-variant/40">
                      <p className="font-body-md text-body-md text-on-surface">India</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative group">
                        <input
                          className="w-full bg-transparent border-b border-outline-variant/40 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
                          id="firstName"
                          placeholder=" "
                          type="text"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                        />
                        <label
                          className="absolute left-0 top-3 text-xs text-on-surface-variant uppercase tracking-wide opacity-60 transition-all duration-200 cursor-text pointer-events-none font-light"
                          htmlFor="firstName"
                        >
                          First Name <span className="text-error">*</span>
                        </label>
                      </div>
                      <div className="relative group">
                        <input
                          className="w-full bg-transparent border-b border-outline-variant/40 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
                          id="lastName"
                          placeholder=" "
                          type="text"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                        />
                        <label
                          className="absolute left-0 top-3 text-xs text-on-surface-variant uppercase tracking-wide opacity-60 transition-all duration-200 cursor-text pointer-events-none font-light"
                          htmlFor="lastName"
                        >
                          Last Name <span className="text-error">*</span>
                        </label>
                      </div>
                    </div>

                    <div className="relative group">
                      <input
                        className="w-full bg-transparent border-b border-outline-variant/40 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
                        id="flatNo"
                        placeholder=" "
                        type="text"
                        value={formData.flatNo}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                      <label
                        className="absolute left-0 top-3 text-xs text-on-surface-variant uppercase tracking-wide opacity-60 transition-all duration-200 cursor-text pointer-events-none font-light"
                        htmlFor="flatNo"
                      >
                        Flat, House no., Building, Company, Apartment <span className="text-error">*</span>
                      </label>
                    </div>

                    <div className="relative group">
                      <input
                        className="w-full bg-transparent border-b border-outline-variant/40 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
                        id="area"
                        placeholder=" "
                        type="text"
                        value={formData.area}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                      <label
                        className="absolute left-0 top-3 text-xs text-on-surface-variant uppercase tracking-wide opacity-60 transition-all duration-200 cursor-text pointer-events-none font-light"
                        htmlFor="area"
                      >
                        Area, Street, Sector, Village <span className="text-error">*</span>
                      </label>
                    </div>

                    <div className="relative group">
                      <input
                        className="w-full bg-transparent border-b border-outline-variant/40 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
                        id="landmark"
                        placeholder=" "
                        type="text"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                      <label
                        className="absolute left-0 top-3 text-xs text-on-surface-variant uppercase tracking-wide opacity-60 transition-all duration-200 cursor-text pointer-events-none font-light"
                        htmlFor="landmark"
                      >
                        Landmark (optional)
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="relative group">
                        <input
                          className="w-full bg-transparent border-b border-outline-variant/40 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
                          id="city"
                          placeholder=" "
                          type="text"
                          value={formData.city}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                        />
                        <label
                          className="absolute left-0 top-3 text-xs text-on-surface-variant uppercase tracking-wide opacity-60 transition-all duration-200 cursor-text pointer-events-none font-light"
                          htmlFor="city"
                        >
                          Town/City <span className="text-error">*</span>
                        </label>
                      </div>
                      <div className="relative group">
                        <select
                          className="w-full bg-transparent border-b border-outline-variant/40 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors appearance-none cursor-pointer"
                          id="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                        >
                          <option value=""> </option>
                          <option value="AP">Andhra Pradesh</option>
                          <option value="AS">Assam</option>
                          <option value="BR">Bihar</option>
                          <option value="CG">Chhattisgarh</option>
                          <option value="GA">Goa</option>
                          <option value="GJ">Gujarat</option>
                          <option value="HR">Haryana</option>
                          <option value="HP">Himachal Pradesh</option>
                          <option value="JK">Jammu and Kashmir</option>
                          <option value="JH">Jharkhand</option>
                          <option value="KA">Karnataka</option>
                          <option value="KL">Kerala</option>
                          <option value="MP">Madhya Pradesh</option>
                          <option value="MH">Maharashtra</option>
                          <option value="MN">Manipur</option>
                          <option value="ML">Meghalaya</option>
                          <option value="MZ">Mizoram</option>
                          <option value="NL">Nagaland</option>
                          <option value="OD">Odisha</option>
                          <option value="PB">Punjab</option>
                          <option value="RJ">Rajasthan</option>
                          <option value="SK">Sikkim</option>
                          <option value="TN">Tamil Nadu</option>
                          <option value="TG">Telangana</option>
                          <option value="TR">Tripura</option>
                          <option value="UP">Uttar Pradesh</option>
                          <option value="UK">Uttarakhand</option>
                          <option value="WB">West Bengal</option>
                          <option value="AN">Andaman and Nicobar</option>
                          <option value="CH">Chandigarh</option>
                          <option value="DD">Dadra and Nagar Haveli</option>
                          <option value="DL">Delhi</option>
                          <option value="LD">Lakshadweep</option>
                          <option value="PY">Puducherry</option>
                        </select>
                        <label
                          className="absolute left-0 top-3 text-xs text-on-surface-variant uppercase tracking-wide opacity-60 transition-all duration-200 cursor-text pointer-events-none font-light"
                          htmlFor="state"
                          style={formData.state ? { transform: 'translateY(-20px)', opacity: '1' } : {}}
                        >
                          State/UT <span className="text-error">*</span>
                        </label>
                        <span className="material-symbols-outlined absolute right-0 bottom-3 text-on-surface-variant pointer-events-none text-[20px]">
                          expand_more
                        </span>
                      </div>
                      <div className="relative group">
                        <input
                          className="w-full bg-transparent border-b border-outline-variant/40 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
                          id="pin"
                          placeholder=" "
                          type="text"
                          value={formData.pin}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                        />
                        <label
                          className="absolute left-0 top-3 text-xs text-on-surface-variant uppercase tracking-wide opacity-60 transition-all duration-200 cursor-text pointer-events-none font-light"
                          htmlFor="pin"
                        >
                          PIN code <span className="text-error">*</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-5 relative">
                <div className="sticky top-24 bg-surface-container-lowest p-6 md:p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] rounded-sm flex flex-col gap-4">
                  <h2 className="font-headline-md text-headline-md text-primary text-lg border-b border-outline-variant/30 pb-3 text-center">
                    Summary
                  </h2>

                  {/* Cart Items */}
                  <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
                    {cart.items.map((item) => (
                      <div key={item.cartItemId} className="flex items-start gap-3 pb-3 border-b border-outline-variant/20">
                        <div className="w-12 h-16 bg-surface-container-high rounded-sm overflow-hidden flex-shrink-0">
                          <img
                            className="w-full h-full object-cover"
                            src={item.imageUrl || 'https://via.placeholder.com/48x64?text=Product'}
                            alt={item.productName}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-headline-md text-sm text-primary leading-tight truncate">{item.productName}</h4>
                          <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mt-0.5">
                            {item.sizeName}
                          </p>
                          <p className="font-body-md text-xs text-on-surface-variant mt-0.5">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-body-md text-sm text-primary whitespace-nowrap">
                          ₹
                          {item.totalPrice.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="flex flex-col gap-2 pt-3 border-t border-outline-variant/30">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-on-surface-variant text-xs">Subtotal</span>
                      <span className="text-xs">
                        ₹
                        {cart.totalAmount.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-on-surface-variant text-xs">Shipping</span>
                      <span className="font-light text-xs">Free</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-on-surface-variant text-xs">Tax (18%)</span>
                      <span className="text-xs">
                        ₹
                        {(cart.totalAmount * 0.18).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end border-t border-outline-variant/30 pt-3 mt-2">
                    <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest text-xs">Total</span>
                    <span className="font-headline-md text-lg text-primary">
                      ₹
                      {(cart.totalAmount * 1.18).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <button
                    onClick={handleProceedToPayment}
                    disabled={processingPayment}
                    className="w-full bg-primary text-on-primary py-4 font-label-sm text-label-sm uppercase tracking-widest hover:bg-secondary hover:text-on-secondary transition-colors duration-500 mt-3 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <span className="relative z-10">{processingPayment ? 'Processing...' : 'Proceed to Payment'}</span>
                    <div className="absolute inset-0 w-full h-full bg-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-0"></div>
                  </button>

                  <div className="flex justify-center gap-1 mt-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-[14px]">lock</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-xs">
                      Secure Checkout
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        buttons={modal.buttons}
        onClose={closeModal}
      />
      <Footer />
    </div>
  );
}
