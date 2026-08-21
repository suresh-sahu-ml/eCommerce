import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Badge,
} from "@nextui-org/react";
import { useMsal } from "@azure/msal-react";
import { useAppSelector } from "../store";

export const Navbar: React.FC = () => {
  const { accounts, instance } = useMsal();
  const navigate = useNavigate();
  const cartItems = useAppSelector((state) => state.cart.totalItems);

  const handleLogout = async () => {
    await instance.logoutPopup();
    navigate("/");
  };

  const handleLogin = async () => {
    try {
      await instance.loginPopup({
        scopes: [`${import.meta.env.VITE_AZURE_CLIENT_ID}/.default`],
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <NextUINavbar isBordered className="bg-white dark:bg-gray-900">
      <NavbarBrand className="gap-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold text-primary-600">
            The Perfume Shop
          </span>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-8">
        <NavbarItem>
          <Link to="/catalog" className="text-base hover:text-primary-600">
            Catalog
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/about" className="text-base hover:text-primary-600">
            About
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end" className="gap-4">
        <NavbarItem>
          <Badge content={cartItems} color="danger" shape="circle">
            <Link
              to="/cart"
              className="text-base hover:text-primary-600"
            >
              Cart
            </Link>
          </Badge>
        </NavbarItem>

        {accounts.length > 0 ? (
          <>
            <NavbarItem>
              <span className="text-sm">
                {accounts[0]?.name || "User"}
              </span>
            </NavbarItem>
            <NavbarItem>
              <Button
                color="danger"
                variant="flat"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </NavbarItem>
          </>
        ) : (
          <NavbarItem>
            <Button
              color="primary"
              onClick={handleLogin}
            >
              Login
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
    </NextUINavbar>
  );
};
