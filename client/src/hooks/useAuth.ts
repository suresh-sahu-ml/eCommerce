import { useMsal } from "@azure/msal-react";
import { useCallback } from "react";

export const useAuth = () => {
  const { instance, accounts } = useMsal();

  const isAuthenticated = accounts.length > 0;
  const user = accounts[0];

  const login = useCallback(async () => {
    try {
      await instance.loginPopup({
        scopes: [`${import.meta.env.VITE_AZURE_CLIENT_ID}/.default`],
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  }, [instance]);

  const logout = useCallback(async () => {
    try {
      await instance.logoutPopup();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [instance]);

  return {
    isAuthenticated,
    user,
    login,
    logout,
    instance,
  };
};
