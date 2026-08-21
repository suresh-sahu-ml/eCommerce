import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";

interface FeaturedProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  description: string;
}

export const HomePage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const scaleVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  // Featured perfumes - using placeholder images
  const featuredProducts: FeaturedProduct[] = [
    {
      id: "1",
      name: "Midnight Elegance",
      brand: "Chanel",
      price: 155,
      image:
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=500&fit=crop",
      description: "A sophisticated blend of jasmine and sandalwood",
    },
    {
      id: "2",
      name: "Golden Dreams",
      brand: "Dior",
      price: 180,
      image:
        "https://images.unsplash.com/photo-1588405748036-6f91f765a65d?w=400&h=500&fit=crop",
      description: "Luxurious notes of amber and vanilla",
    },
    {
      id: "3",
      name: "Ocean Whisper",
      brand: "Guerlain",
      price: 165,
      image:
        "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=500&fit=crop",
      description: "Fresh citrus with aquatic undertones",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section with Video Background */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source
              src="https://videos.pexels.com/video-files/5632402/5632402-sd_640_360_30fps.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
        </motion.div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 container-luxury text-center space-y-8 px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl font-bold text-white drop-shadow-lg">
              The Perfume Shop
            </h1>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl text-gray-100 max-w-2xl mx-auto drop-shadow-md"
          >
            Discover Luxury in Every Spray
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-gray-200 max-w-3xl mx-auto drop-shadow-md"
          >
            Explore our curated collection of the world's finest fragrances,
            crafted by prestigious brands and perfumers.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-4 pt-8"
          >
            <Link to="/catalog">
              <Button
                size="lg"
                className="bg-luxury-gold text-luxury-charcoal hover:bg-yellow-300 font-bold text-base px-8"
              >
                Shop Collection
              </Button>
            </Link>
            <Link to="/about">
              <Button
                size="lg"
                variant="bordered"
                className="border-2 border-white text-white hover:bg-white hover:text-luxury-charcoal font-bold text-base px-8"
              >
                Learn More
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-white text-center">
            <p className="text-sm mb-2">Scroll to explore</p>
            <svg
              className="w-6 h-6 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <motion.div
          className="container-luxury"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Fragrances
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Handpicked selections from our luxury collection
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                variants={scaleVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Card className="card-luxury overflow-hidden h-full group cursor-pointer">
                  <div className="relative overflow-hidden h-64 bg-gray-200 dark:bg-gray-700">
                    <motion.img
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={product.image}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          `https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=500&fit=crop&q=${idx}`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-white text-sm font-medium">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <CardBody className="flex flex-col justify-between p-6">
                    <div>
                      <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold mb-1">
                        {product.brand}
                      </p>
                      <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="font-serif text-2xl font-bold text-primary-600 dark:text-primary-400">
                        ${product.price}
                      </span>
                      <Link to={`/product/${product.id}`}>
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                        >
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Link to="/catalog">
              <Button
                size="lg"
                color="primary"
                className="font-bold"
              >
                View All Perfumes →
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-50 to-secondary/10 dark:from-gray-800 dark:to-gray-900">
        <motion.div
          className="container-luxury"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: "✨",
                title: "Curated Collection",
                description:
                  "Handpicked fragrances from the world's most prestigious brands",
              },
              {
                icon: "🏆",
                title: "Premium Quality",
                description:
                  "Authentic products with guaranteed authenticity and satisfaction",
              },
              {
                icon: "🎁",
                title: "Luxury Experience",
                description:
                  "Premium packaging and personalized service for every customer",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <motion.div
          className="container-luxury text-center space-y-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            variants={itemVariants}
            className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white"
          >
            Ready to Find Your Signature Scent?
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto"
          >
            Explore our complete collection and discover fragrances that match
            your personality and style.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/catalog">
              <Button
                size="lg"
                className="bg-luxury-gold text-luxury-charcoal hover:bg-yellow-300 font-bold px-8"
              >
                Shop Now
              </Button>
            </Link>
            <Link to="/about">
              <Button
                size="lg"
                variant="bordered"
                className="border-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-bold px-8"
              >
                About Us
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};
