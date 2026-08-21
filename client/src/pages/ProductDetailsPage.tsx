import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Chip,
  Card,
  CardBody,
  Spinner,
  Input,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { useProductById } from "../hooks/useCatalog";
import { useAppDispatch } from "../store";
import { addToCart, openCartDrawer } from "../store/cartSlice";

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { product, loading, error } = useProductById(id || "");
  const [quantity, setQuantity] = useState(1);

  if (!id) return <div>Product not found</div>;

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner label="Loading product..." />
      </div>
    );

  if (error || !product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardBody>
            <p className="text-red-600">{error || "Product not found"}</p>
            <Button onClick={() => navigate("/catalog")} className="mt-4">
              Back to Catalog
            </Button>
          </CardBody>
        </Card>
      </div>
    );

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
        notes: [...product.topNotes, ...product.heartNotes, ...product.baseNotes],
      })
    );
    dispatch(openCartDrawer());
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="container-luxury">
        <Button
          variant="light"
          onClick={() => navigate("/catalog")}
          className="mb-8"
        >
          ← Back to Catalog
        </Button>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <img
              alt={product.name}
              className="w-full h-auto object-cover rounded-xl shadow-lg"
              src={product.image}
            />
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-primary-600 font-semibold mb-2">{product.brand}</p>
              <h1 className="text-luxury">{product.name}</h1>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-gray-500">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4">
                ${product.price}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold mb-3">
                Fragrance Profile
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Top Notes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.topNotes.map((note) => (
                      <Chip key={note} variant="flat">
                        {note}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Heart Notes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.heartNotes.map((note) => (
                      <Chip key={note} variant="flat" color="secondary">
                        {note}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Base Notes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.baseNotes.map((note) => (
                      <Chip key={note} variant="flat" color="warning">
                        {note}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg space-y-2">
              <p className="text-sm">
                <span className="font-semibold">Volume:</span> {product.volume}ml
              </p>
              <p className="text-sm">
                <span className="font-semibold">Concentration:</span>{" "}
                {product.concentration}
              </p>
              <p className={`text-sm font-semibold ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </p>
            </div>

            <div className="space-y-4">
              <Input
                type="number"
                label="Quantity"
                min={1}
                max={10}
                value={quantity.toString()}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />

              <Button
                fullWidth
                size="lg"
                color="primary"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
