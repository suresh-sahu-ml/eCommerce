import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardFooter, Button, Chip } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="card-luxury">
        <CardBody className="overflow-visible py-2">
          <img
            alt={product.name}
            className="object-cover w-full h-64 rounded-lg"
            src={product.image}
          />
        </CardBody>

        <CardFooter className="flex flex-col gap-2">
          <div className="w-full">
            <h3 className="font-serif font-bold text-lg">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.brand}</p>
          </div>

          <div className="flex gap-1 flex-wrap">
            {product.topNotes.slice(0, 2).map((note) => (
              <Chip key={note} size="sm" variant="flat" color="secondary">
                {note}
              </Chip>
            ))}
          </div>

          <div className="flex justify-between items-center w-full">
            <span className="font-serif text-2xl font-bold text-primary-600">
              ${product.price}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="text-sm font-medium">
                {product.rating} ({product.reviewCount})
              </span>
            </div>
          </div>

          <Button
            fullWidth
            color="primary"
            className="mt-2"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
