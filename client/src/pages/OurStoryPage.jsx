import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function OurStoryPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const milestones = [
    {
      year: '2019',
      title: 'The Beginning',
      description: 'Founded with a passion for curating the world\'s finest fragrances for the discerning customer.',
      icon: 'lightbulb'
    },
    {
      year: '2020',
      title: 'Expansion',
      description: 'Opened our flagship store in Sangareddy, establishing our presence in Telangana.',
      icon: 'storefront'
    },
    {
      year: '2021',
      title: 'Recognition',
      description: 'Became a trusted name in premium fragrances with thousands of satisfied customers.',
      icon: 'star'
    },
    {
      year: '2023',
      title: 'Digital Journey',
      description: 'Launched our online platform to reach fragrance lovers across India.',
      icon: 'computer'
    },
    {
      year: '2025',
      title: 'Innovation',
      description: 'Introduced AI-powered Fragrance Finder to help customers discover their signature scent.',
      icon: 'psychology'
    }
  ];

  const values = [
    {
      title: 'Authenticity',
      description: 'Every fragrance in our collection is genuine and sourced from trusted suppliers worldwide.',
      icon: 'verified'
    },
    {
      title: 'Expertise',
      description: 'Our team of fragrance specialists provides personalized recommendations for your unique taste.',
      icon: 'school'
    },
    {
      title: 'Quality',
      description: 'We curate only the finest fragrances that meet our rigorous standards for excellence.',
      icon: 'verified_user'
    },
    {
      title: 'Sustainability',
      description: 'We are committed to eco-friendly practices and responsible sourcing of ingredients.',
      icon: 'eco'
    },
    {
      title: 'Customer Care',
      description: 'Your satisfaction is our priority. We offer hassle-free returns and dedicated support.',
      icon: 'favorite'
    },
    {
      title: 'Innovation',
      description: 'Continuously evolving to bring you cutting-edge tools and services in fragrance discovery.',
      icon: 'lightbulb_circle'
    }
  ];

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <Header scrolled={scrolled} activePage="about-us" />
      <main className="w-full pt-20 bg-surface">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-cover bg-center opacity-20"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuApbWz7j1ivDsR5hFSiaKX37LnzMV5NGkTUdefUXxxREFBqR7qbH9sIF-_dUSx6tOPcSmXy1nZxPwrJ1QFLP9nZy30eFqfvDk4DYr5ECLKnm4isedM8dYlO7kO6df88MEWY8aXjAc71HJ17WD9WxTRi0OicVyShn_j-e9CLWWK2ijwT0f95OCTMo1mHV92xFD0tc3d1Km8oRDYeaZ9tqm22SyLjCPzRo0awucHnht1n4zvCwJ6Tn-WL")'
            }}
          />
          <div className="relative max-w-4xl mx-auto text-center">
            <h1 className="font-display-lg text-display-lg text-primary mb-6">
              Our Story
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              A journey of passion, artistry, and the pursuit of olfactory perfection
            </p>
          </div>
        </section>

        {/* Origin Story */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">
                The Beginning of a Fragrant Journey
              </h2>
              <p className="font-body-md text-on-surface-variant mb-4 leading-relaxed">
                The Perfume Shop was born from a simple yet profound belief: that fragrance is not merely a commodity, but a form of personal expression and art. What began as a passion project has blossomed into a carefully curated sanctuary for fragrance enthusiasts.
              </p>
              <p className="font-body-md text-on-surface-variant mb-4 leading-relaxed">
                Our founder, driven by an obsession with the world's finest scents, embarked on a global expedition to discover and bring together the most exquisite fragrances. From the perfume capitals of Paris to the fragrant gardens of Grasse, each piece in our collection tells a story of craftsmanship and dedication.
              </p>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Today, we stand as custodians of olfactory excellence, committed to helping every customer discover their signature scent—the fragrance that speaks their silent language.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-8xl text-primary/50">
                  auto_awesome
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="bg-surface-container py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-headline-lg text-headline-lg text-on-surface text-center mb-12">
              Our Mission & Vision
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Mission */}
              <div className="bg-surface rounded-lg p-8 border border-outline-variant/20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-4xl text-primary">
                    target
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface">
                    Our Mission
                  </h3>
                </div>
                <p className="font-body-md text-on-surface-variant leading-relaxed">
                  To be the trusted destination for authentic, premium fragrances, empowering individuals to express their unique personality through scent. We are committed to delivering exceptional customer experiences through expert curation, personalized recommendations, and unwavering quality standards.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-surface rounded-lg p-8 border border-outline-variant/20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-4xl text-primary">
                    visibility
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface">
                    Our Vision
                  </h3>
                </div>
                <p className="font-body-md text-on-surface-variant leading-relaxed">
                  To become the world's premier fragrance destination, recognized for our unwavering commitment to authenticity, innovation, and customer satisfaction. We envision a future where The Perfume Shop is synonymous with fragrance excellence globally.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="font-headline-lg text-headline-lg text-on-surface text-center mb-12">
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-surface-container rounded-lg p-6 hover:shadow-lg transition-shadow h-full">
                <div className="flex flex-col items-start gap-4 h-full">
                  <span className="material-symbols-outlined text-3xl text-primary flex-shrink-0">
                    {value.icon}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-label-lg text-label-lg text-on-surface mb-2 line-clamp-2">
                      {value.title}
                    </h3>
                    <p className="font-body-sm text-on-surface-variant">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-surface-container py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-headline-lg text-headline-lg text-on-surface text-center mb-12">
              Our Journey Through Time
            </h2>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6">
                  {/* Timeline Dot */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl text-primary">
                        {milestone.icon}
                      </span>
                    </div>
                    {index !== milestones.length - 1 && (
                      <div className="w-1 h-12 bg-primary/30 mt-4" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <p className="font-label-lg text-label-lg text-secondary mb-1">
                      {milestone.year}
                    </p>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                      {milestone.title}
                    </h3>
                    <p className="font-body-md text-on-surface-variant">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="font-headline-lg text-headline-lg text-on-surface text-center mb-12">
            Why Choose The Perfume Shop?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-2xl text-primary flex-shrink-0">
                check_circle
              </span>
              <div>
                <h3 className="font-label-lg text-label-lg text-on-surface mb-2">
                  Curated Collection
                </h3>
                <p className="font-body-sm text-on-surface-variant">
                  Every fragrance is hand-picked by our experts to ensure quality and authenticity.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="material-symbols-outlined text-2xl text-primary flex-shrink-0">
                check_circle
              </span>
              <div>
                <h3 className="font-label-lg text-label-lg text-on-surface mb-2">
                  Expert Guidance
                </h3>
                <p className="font-body-sm text-on-surface-variant">
                  Our fragrance specialists provide personalized recommendations tailored to you.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="material-symbols-outlined text-2xl text-primary flex-shrink-0">
                check_circle
              </span>
              <div>
                <h3 className="font-label-lg text-label-lg text-on-surface mb-2">
                  Guaranteed Authenticity
                </h3>
                <p className="font-body-sm text-on-surface-variant">
                  100% authentic fragrances with verifiable source documentation for every product.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="material-symbols-outlined text-2xl text-primary flex-shrink-0">
                check_circle
              </span>
              <div>
                <h3 className="font-label-lg text-label-lg text-on-surface mb-2">
                  Hassle-Free Returns
                </h3>
                <p className="font-body-sm text-on-surface-variant">
                  30-day return policy with free return shipping for complete peace of mind.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="material-symbols-outlined text-2xl text-primary flex-shrink-0">
                check_circle
              </span>
              <div>
                <h3 className="font-label-lg text-label-lg text-on-surface mb-2">
                  Fast Shipping
                </h3>
                <p className="font-body-sm text-on-surface-variant">
                  Quick delivery with free shipping on orders above ₹500 across India.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="material-symbols-outlined text-2xl text-primary flex-shrink-0">
                check_circle
              </span>
              <div>
                <h3 className="font-label-lg text-label-lg text-on-surface mb-2">
                  Fragrance Finder AI
                </h3>
                <p className="font-body-sm text-on-surface-variant">
                  Advanced quiz to discover your perfect fragrance based on preferences and personality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/10 py-16 px-4 my-12 rounded-lg">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
              Join Our Fragrant Community
            </h2>
            <p className="font-body-md text-on-surface-variant mb-8">
              Discover your signature scent today and become part of a community that celebrates the art of fragrance.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="/fragrance-finder"
                className="px-8 py-3 bg-primary text-on-primary font-label-sm uppercase tracking-widest rounded hover:bg-secondary transition-colors"
              >
                Try Fragrance Finder
              </a>
              <a
                href="/products"
                className="px-8 py-3 border border-primary text-primary font-label-sm uppercase tracking-widest rounded hover:bg-primary hover:text-on-primary transition-colors"
              >
                Browse Collection
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
