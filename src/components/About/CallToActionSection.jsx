import React from 'react';

export default function CallToActionSection() {
  const handleBookConsultation = () => {
    console.log('Booking consultation...');
  };

  return (
    <section className="w-full py-section-gap bg-surface flex flex-col items-center justify-center text-center px-gutter">
      <h2 className="font-display-lg text-display-lg text-on-surface mb-8">
        Discover Your Signature
      </h2>

      <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mb-12">
        Step into our sanctuary of scent and allow our experts to guide you to the fragrance that speaks your silent language.
      </p>

      <button
        onClick={handleBookConsultation}
        className="bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest py-4 px-12 hover:bg-secondary transition-colors duration-300"
      >
        Book a Consultation
      </button>
    </section>
  );
}
