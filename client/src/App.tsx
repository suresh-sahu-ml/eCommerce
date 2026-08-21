import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import { Provider } from "react-redux";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { store } from "./store";
import { setMsalInstance } from "./api/axiosInstance";
import msalConfig from "./config/msalConfig";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { CatalogPage } from "./pages/CatalogPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { LoginPage } from "./pages/LoginPage";
import { AboutPage } from "./pages/AboutPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";
import "./styles/globals.css";

const msalInstance = new PublicClientApplication(msalConfig);
setMsalInstance(msalInstance);

export const App = () => {
  return (
    <Provider store={store}>
      <MsalProvider instance={msalInstance}>
        <NextUIProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/catalog" element={<CatalogPage />} />
                  <Route path="/product/:id" element={<ProductDetailsPage />} />
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order-confirmation/:orderId"
                    element={
                      <ProtectedRoute>
                        <OrderConfirmationPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
            </div>
          </Router>
        </NextUIProvider>
      </MsalProvider>
    </Provider>
  );
};

export default App;
