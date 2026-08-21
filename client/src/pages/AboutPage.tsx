import React from "react";
import { Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="container-luxury space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-luxury mb-8">About The Perfume Shop</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardBody className="space-y-4">
                <h2 className="font-serif text-2xl font-bold">Our Story</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Founded in 2020, The Perfume Shop is dedicated to bringing the
                  world's finest fragrances to discerning customers. We believe
                  that a perfect perfume is more than just a scent—it's a
                  personal statement, a memory, and a luxury experience.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="space-y-4">
                <h2 className="font-serif text-2xl font-bold">Our Mission</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We are committed to offering authentic, luxury fragrances from
                  the world's most prestigious brands. Our mission is to make
                  luxury accessible while maintaining the highest standards of
                  quality and customer service.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="space-y-4">
                <h2 className="font-serif text-2xl font-bold">Quality Assurance</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Every fragrance in our collection is carefully curated and
                  authenticated. We work directly with authorized distributors to
                  ensure that every bottle meets our rigorous standards for
                  quality and authenticity.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="space-y-4">
                <h2 className="font-serif text-2xl font-bold">Expert Support</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Our team of fragrance experts is here to help you find the
                  perfect scent. Whether you're looking for a signature fragrance
                  or exploring new possibilities, we're here to guide you through
                  your fragrance journey.
                </p>
              </CardBody>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
