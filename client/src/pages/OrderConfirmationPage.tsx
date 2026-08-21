import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-luxury-gradient flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md">
          <CardBody className="space-y-8 py-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-6xl"
            >
              ✓
            </motion.div>

            <div className="space-y-2">
              <h1 className="font-serif text-3xl font-bold text-green-600">
                Order Confirmed!
              </h1>
              <p className="text-gray-600">
                Thank you for your purchase.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2 text-left">
              <p className="text-sm">
                <span className="font-semibold">Order ID:</span> {orderId}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Status:</span> Confirmed
              </p>
              <p className="text-sm">
                <span className="font-semibold">Estimated Delivery:</span> 3-5 business days
              </p>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>
                A confirmation email has been sent to your email address.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                fullWidth
                color="primary"
                onClick={() => navigate("/catalog")}
              >
                Continue Shopping
              </Button>
              <Button
                fullWidth
                variant="light"
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};
