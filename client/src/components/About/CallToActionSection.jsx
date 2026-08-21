import React from 'react';

export default function CallToActionSection() {
  const shopAddress = "Near National Mart, Sangareddy, Telangana, 502001";
  const mapsLink = "https://maps.google.com/?q=The+Perfume+Shop,+Sangareddy,+Telangana,+502001";

  return (
    <section className="w-full py-section-gap bg-surface flex flex-col items-center justify-center text-center px-gutter">
      <h2 className="font-display-lg text-display-lg text-on-surface mb-8">
        Discover Your Signature
      </h2>

      <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mb-12">
        Step into our sanctuary of scent and allow our experts to guide you to the fragrance that speaks your silent language.
      </p>

      <div className="flex flex-col items-center gap-6">
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest py-4 px-12 hover:bg-secondary transition-colors duration-300 group"
        >
          <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
            location_on
          </span>
          Visit Our Shop
        </a>

        <p className="font-body-md text-on-surface-variant">
          {shopAddress}
        </p>
      </div>
    </section>
  );
}
