import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Textarea,
  Card,
  CardBody,
  Spinner,
  Divider,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from "../store";
import { clearCart, updateQuantity, removeFromCart } from "../store/cartSlice";
import orderApi from "../api/orderApi";

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, totalPrice } = useAppSelector((state) => state.cart);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitOrder = async () => {
    if (!formData.phone || !formData.address) {
      setError("Please fill in all required fields");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await orderApi.createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        deliveryAddress: formData.address,
        phone: formData.phone,
      });

      dispatch(clearCart());
      navigate(`/order-confirmation/${response.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
        <div className="container-luxury text-center">
          <h1 className="text-luxury mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Continue shopping to add items to your cart
          </p>
          <Button color="primary" onClick={() => navigate("/catalog")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="container-luxury">
        <h1 className="text-luxury mb-12">Checkout</h1>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardBody className="space-y-6">
                <h2 className="font-serif text-2xl font-bold">
                  Delivery Information
                </h2>

                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <Input
                    label="Phone *"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                  <Textarea
                    label="Delivery Address *"
                    minRows={4}
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="space-y-6">
                <h2 className="font-serif text-2xl font-bold">Order Items</h2>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500">${item.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: item.productId,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                        >
                          -
                        </Button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: item.productId,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                        >
                          +
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          color="danger"
                          variant="flat"
                          onClick={() =>
                            dispatch(removeFromCart(item.productId))
                          }
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {error && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-200">
                {error}
              </div>
            )}
          </div>

          <div>
            <Card className="sticky top-4">
              <CardBody className="space-y-6">
                <h2 className="font-serif text-2xl font-bold">Order Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <Divider />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  fullWidth
                  color="primary"
                  size="lg"
                  isLoading={loading}
                  onClick={handleSubmitOrder}
                >
                  {loading ? "Processing..." : "Place Order"}
                </Button>

                <Button
                  fullWidth
                  variant="light"
                  onClick={() => navigate("/catalog")}
                >
                  Continue Shopping
                </Button>
              </CardBody>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
