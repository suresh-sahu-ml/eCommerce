import { Configuration } from "@azure/msal-browser";

const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || "your-client-id",
    authority: import.meta.env.VITE_AZURE_AUTHORITY || "https://login.microsoftonline.com/common",
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || window.location.origin,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        console.log(message);
      },
    },
  },
};

export const loginRequest = {
  scopes: [
    `${import.meta.env.VITE_AZURE_CLIENT_ID}/.default`,
  ],
};

export default msalConfig;
