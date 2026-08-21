import axios, { AxiosInstance } from "axios";
import { IPublicClientApplication } from "@azure/msal-browser";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

let msalInstance: IPublicClientApplication | null = null;

export const setMsalInstance = (instance: IPublicClientApplication) => {
  msalInstance = instance;
};

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    async (config) => {
      if (msalInstance) {
        try {
          const accounts = msalInstance.getAllAccounts();

          if (accounts.length > 0) {
            const accessTokenResponse = await msalInstance.acquireTokenSilent({
              scopes: [
                `${import.meta.env.VITE_AZURE_CLIENT_ID}/.default`,
              ],
              account: accounts[0],
            });

            config.headers.Authorization = `Bearer ${accessTokenResponse.accessToken}`;
          }
        } catch (error) {
          console.warn("Could not acquire token silently:", error);
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const axiosInstance = createAxiosInstance();
