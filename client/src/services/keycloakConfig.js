import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8180',
  realm: 'perfume-shop',
  clientId: 'perfume-shop-api',
});

export default keycloak;
