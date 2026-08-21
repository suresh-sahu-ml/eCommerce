import React, { useState } from 'react';

export default function StorySection() {
  const [isImageHovered, setIsImageHovered] = useState(false);

  return (
    <section className="w-full py-section-gap px-margin-desktop max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
        {/* Image Column */}
        <div className="md:col-span-5 md:col-start-2 relative">
          <div
            className="aspect-[4/5] bg-surface-container relative overflow-hidden group"
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            <img
              className="w-full h-full object-cover transition-transform duration-[2000ms] ease-in-out group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdCwTEifc7-8YwibZWT-5reXl7dNyPCzb2mRnhT1IWWzqv2Fz1HtSVbIqfuB49XULtB8fWrgvtiX2Be443Ma_1-dRWFu9d1g8cvkvkeQsk_TyQnd1nYy6frLV7OgxLbbRudpWRwcIwd1k6wdtYlzddIQItkrsKUXS-ADhruUI9JSz6u2188gldwLfYpMFke64bBMwHheutvVHJJ1VtsP_ohM7IiN9_aqHMgvdDA53AwePOqnzTIPoC"
              alt="Master perfumer at work"
            />
            <div
              className={`absolute inset-0 bg-black/5 transition-opacity duration-700 ${
                isImageHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>

          {/* Decorative Element */}
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-surface-variant/50 rounded-full blur-[40px] -z-10 mix-blend-multiply pointer-events-none" />
        </div>

        {/* Text Column */}
        <div className="md:col-span-4 md:col-start-8 flex flex-col justify-center">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-6">
            Origins
          </span>

          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8">
            Curators of<br />
            Fine Fragrance
          </h2>

          <div className="space-y-6">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Since our inception, The Perfume Shop has stood as a sanctuary for those who seek more than just a scent. We are curators of olfactive art, meticulously sourcing and presenting the world's most exquisite fragrances to a discerning clientele.
            </p>

            <p className="font-body-md text-body-md text-on-surface-variant">
              Our journey began with a simple philosophy: that true luxury lies in the unseen. Every bottle on our shelves represents a narrative, a masterfully blended symphony of notes designed to evoke emotion and capture fleeting moments in time.
            </p>
          </div>

          {/* Location Info */}
          <div className="mt-12 pt-8 relative">
            <div className="absolute top-0 left-0 w-12 h-[1px] bg-on-surface-variant/30" />
            <span className="block font-label-sm text-label-sm text-on-surface uppercase mb-2">
              Visit Our Atelier
            </span>
            <p className="font-body-md text-body-md text-on-surface-variant italic">
              The Perfume Shop<br />
              Near National Mart,<br />
              Sangareddy, Hyderabad
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
