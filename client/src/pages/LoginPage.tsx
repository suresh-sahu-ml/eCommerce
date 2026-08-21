import React from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody, Spinner } from "@nextui-org/react";
import { motion } from "framer-motion";

export const LoginPage: React.FC = () => {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (accounts.length > 0) {
      navigate("/catalog");
    }
  }, [accounts, navigate]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await instance.loginPopup({
        scopes: [`${import.meta.env.VITE_AZURE_CLIENT_ID}/.default`],
      });
      navigate("/catalog");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-gradient flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-md">
          <CardBody className="space-y-8 py-12">
            <div className="text-center space-y-2">
              <h1 className="font-serif text-4xl font-bold text-primary-600">
                The Perfume Shop
              </h1>
              <p className="text-gray-600">Login to Your Account</p>
            </div>

            <div className="space-y-4">
              <p className="text-center text-gray-600">
                Sign in with your Azure account to access the catalog and make purchases.
              </p>

              <Button
                fullWidth
                size="lg"
                color="primary"
                onClick={handleLogin}
                isLoading={loading}
              >
                {loading ? "Signing in..." : "Sign in with Azure"}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>First time here?</p>
              <p>Click "Sign in with Azure" to create a new account</p>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};
