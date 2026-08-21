import keycloak from './keycloakConfig';

const API_BASE_URL = 'http://localhost:8080/api/auth';

class AuthService {
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        userId: data.userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      }));
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signup(formData) {
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        termsAccepted: formData.termsAccepted,
      };

      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async verify(userId, code) {
    try {
      const response = await fetch(`${API_BASE_URL}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          code,
        }),
      });

      const text = await response.text();
      console.log('Verify response status:', response.status);
      console.log('Verify response text:', text);

      if (!response.ok) {
        let errorMessage = 'Verification failed';
        try {
          const error = JSON.parse(text);
          errorMessage = error.message || error.error || errorMessage;
        } catch (e) {
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = JSON.parse(text);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        userId: data.userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      }));
      return data;
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  }

  async resendCode(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/resend-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to resend code');
      }

      return await response.json();
    } catch (error) {
      console.error('Resend code error:', error);
      throw error;
    }
  }

  async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send reset link');
      }

      return await response.json();
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  async resetPassword(token, newPassword, confirmPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
          confirmPassword,
        }),
      });

      const text = await response.text();

      if (!response.ok) {
        let errorMessage = 'Reset password failed';
        try {
          const error = JSON.parse(text);
          errorMessage = error.message || error.error || errorMessage;
        } catch (e) {
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = JSON.parse(text);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        userId: data.userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      }));
      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Keycloak social login methods - use kc_idp_hint to skip Keycloak login page
  loginWithGoogle() {
    console.log('Initiating Google login via Keycloak...');
    this.redirectToIdentityProvider('google');
  }

  loginWithMicrosoft() {
    console.log('Initiating Microsoft login via Keycloak...');
    this.redirectToIdentityProvider('microsoft');
  }

  loginWithFacebook() {
    console.log('Initiating Facebook login via Keycloak...');
    this.redirectToIdentityProvider('facebook');
  }

  loginWithLinkedin() {
    console.log('Initiating LinkedIn login via Keycloak...');
    this.redirectToIdentityProvider('linkedin-openid-connect');
  }

  async redirectToIdentityProvider(provider) {
    const keycloakURL = 'http://localhost:8180';
    const realm = 'perfume-shop';
    const clientId = 'perfume-shop-api';
    const redirectUri = window.location.origin + '/login';

    // Generate PKCE parameters
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    // Store code verifier in sessionStorage
    sessionStorage.setItem('pkce_code_verifier', codeVerifier);

    // Use standard OAuth endpoint with kc_idp_hint to auto-redirect to provider
    const url = `${keycloakURL}/realms/${realm}/protocol/openid-connect/auth` +
      `?response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=openid+profile+email` +
      `&kc_idp_hint=${provider}` +
      `&code_challenge=${codeChallenge}` +
      `&code_challenge_method=S256`;

    window.location.href = url;
  }

  generateCodeVerifier() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  async generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const buffer = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('cartCount');
    localStorage.removeItem('cartData');
    if (keycloak && keycloak.logout) {
      keycloak.logout({ redirectUri: window.location.origin + '/' });
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Extract roles from JWT token
  getUserRoles() {
    const token = this.getToken();
    if (!token) return [];

    try {
      // Decode JWT payload
      const parts = token.split('.');
      if (parts.length !== 3) return [];

      const payload = parts[1];
      const padded = payload + '='.repeat((4 - payload.length % 4) % 4);
      const decoded = JSON.parse(atob(padded));

      // Extract roles from different JWT formats
      // Keycloak JWT
      if (decoded.realm_access && decoded.realm_access.roles) {
        return decoded.realm_access.roles;
      }

      // Custom JWT (if we add roles there)
      if (decoded.roles) {
        return decoded.roles;
      }

      return [];
    } catch (error) {
      console.error('Error extracting roles from token:', error);
      return [];
    }
  }

  // Check if user has specific role
  hasRole(role) {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }

  // Check if user is admin
  isAdmin() {
    return this.hasRole('ADMIN');
  }
}

export default new AuthService();
