import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import keycloak from './services/keycloakConfig'

keycloak.init({
  onLoad: 'check-sso',
  checkLoginIframe: false,
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  flow: 'standard',
}).then((authenticated) => {
  console.log('Keycloak initialized. Authenticated:', authenticated);
  if (authenticated && keycloak.token) {
    // Notify backend about OAuth login to create/update user
    fetch('http://localhost:8080/api/auth/oauth-callback', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${keycloak.token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(res => res.json())
    .then(data => {
      console.log('OAuth callback response:', data);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          userId: data.userId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        }));
      }
    })
    .catch(err => console.error('OAuth callback error:', err));
  }
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}).catch((error) => {
  console.error('Failed to initialize Keycloak:', error);
})
