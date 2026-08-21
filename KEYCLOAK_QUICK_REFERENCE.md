# Keycloak Quick Reference

**After migration from Azure AD B2C to Keycloak**

## 🎯 At a Glance

| What | How |
|------|-----|
| **Start Keycloak** | `docker run -d --name keycloak-perfume -p 8180:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin123 quay.io/keycloak/keycloak:latest start-dev` |
| **Admin Console** | http://localhost:8180/admin (admin/admin123) |
| **Setup Time** | 5 minutes with Docker |
| **Cost** | Free |
| **OIDC Discovery** | http://localhost:8180/realms/perfume-shop/.well-known/openid-configuration |
| **Environment Vars** | `KEYCLOAK_ISSUER_URI`, `KEYCLOAK_JWK_SET_URI` |
| **Token Endpoint** | http://localhost:8180/realms/perfume-shop/protocol/openid-connect/token |
| **Start App** | `./gradlew bootRun` |
| **Test Public API** | `curl http://localhost:8080/api/products` |
| **Get JWT Token** | See "Getting Tokens" section below |
| **Test Protected API** | `curl -H "Authorization: Bearer $token" http://localhost:8080/api/orders` |

---

## 🚀 5-Step Setup

### Step 1: Start Keycloak (2 min)

```bash
docker run -d \
  --name keycloak-perfume \
  -p 8180:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin123 \
  quay.io/keycloak/keycloak:latest \
  start-dev
```

### Step 2: Configure Keycloak (2 min)

1. Go to: http://localhost:8180/admin
2. Login: `admin` / `admin123`
3. **Create Realm:** `perfume-shop`
4. **Create Client:** `perfume-shop-api`
   - Get Client Secret from Credentials tab
5. **Create User:** `testuser@perfumeshop.com`
   - Password: `TestPassword123!`

### Step 3: Set Environment Variables (30 sec)

```powershell
$env:KEYCLOAK_ISSUER_URI = "http://localhost:8180/realms/perfume-shop"
$env:KEYCLOAK_JWK_SET_URI = "http://localhost:8180/realms/perfume-shop/protocol/openid-connect/certs"
$env:DB_URL = "jdbc:oracle:thin:@localhost:1521:ORCL"
$env:DB_USERNAME = "system"
$env:DB_PASSWORD = "OraclePass123"
```

### Step 4: Build & Start App (1 min)

```bash
cd d:\The-Perfume-Shop
./gradlew clean build
./gradlew bootRun
```

### Step 5: Test It (30 sec)

```bash
curl http://localhost:8080/api/products
```

---

## 🔑 Getting JWT Tokens

### Quick PowerShell Script

```powershell
$keycloakUrl = "http://localhost:8180/realms/perfume-shop/protocol/openid-connect/token"
$clientId = "perfume-shop-api"
$clientSecret = "YOUR_CLIENT_SECRET_FROM_KEYCLOAK"
$username = "testuser@perfumeshop.com"
$password = "TestPassword123!"

$body = @{
    grant_type    = "password"
    client_id     = $clientId
    client_secret = $clientSecret
    username      = $username
    password      = $password
}

$response = Invoke-RestMethod -Method Post -Uri $keycloakUrl -Body $body
$token = $response.access_token

Write-Host "Token: $token"
$env:JWT_TOKEN = $token
```

### Using curl

```bash
curl -X POST http://localhost:8180/realms/perfume-shop/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "client_id=perfume-shop-api" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "username=testuser@perfumeshop.com" \
  -d "password=TestPassword123!"
```

---

## 🧪 Testing Endpoints

### Public (No Token Needed)

```bash
# Get all products
curl http://localhost:8080/api/products

# Get product by ID
curl http://localhost:8080/api/products/1

# Get product by SKU
curl http://localhost:8080/api/products/sku/LRP-001
```

### Protected (Token Required)

```bash
# Get user orders
curl -H "Authorization: Bearer $env:JWT_TOKEN" http://localhost:8080/api/orders

# Place order
curl -X POST http://localhost:8080/api/orders \
  -H "Authorization: Bearer $env:JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"shippingAddress":"123 St","orderItems":[{"productId":1,"quantity":2}]}'
```

---

## 📱 Using Bruno

1. Open Bruno
2. File → Open Collection → Select `bruno/` folder
3. Edit `bruno/environments/local.bru`:
   ```groovy
   vars {
     base_url: http://localhost:8080/api
     bearer_token: YOUR_JWT_TOKEN_HERE
   }
   ```
4. Click ▶ on requests to test

---

## 🔍 Verify Token

Decode at: https://jwt.io

Paste your token to see claims:
```json
{
  "sub": "user-id-from-keycloak",
  "email": "testuser@perfumeshop.com",
  "iss": "http://localhost:8180/realms/perfume-shop",
  "exp": 1234567890
}
```

---

## 📊 Key Endpoints

| Endpoint | Purpose |
|----------|---------|
| `http://localhost:8180/admin` | Keycloak Admin Console |
| `http://localhost:8180/realms/perfume-shop/.well-known/openid-configuration` | OIDC Discovery |
| `http://localhost:8180/realms/perfume-shop/protocol/openid-connect/token` | Token endpoint |
| `http://localhost:8180/realms/perfume-shop/protocol/openid-connect/certs` | JWK Set (public keys) |
| `http://localhost:8080/api/products` | Get products (public) |
| `http://localhost:8080/api/orders` | Get orders (protected) |

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| **Port 8180 in use** | `lsof -i :8180` then kill process, or use different port |
| **Connection refused** | Check Keycloak running: `docker ps` |
| **Token invalid** | Check expiration, issuer URI matches config |
| **401 Unauthorized** | Ensure Bearer token in header: `Authorization: Bearer $token` |
| **Client Secret wrong** | Get from Keycloak Admin → Clients → perfume-shop-api → Credentials |

---

## 🔐 Environment Variables

```powershell
# REQUIRED
$env:KEYCLOAK_ISSUER_URI = "http://localhost:8180/realms/perfume-shop"
$env:KEYCLOAK_JWK_SET_URI = "http://localhost:8180/realms/perfume-shop/protocol/openid-connect/certs"
$env:DB_URL = "jdbc:oracle:thin:@localhost:1521:ORCL"
$env:DB_USERNAME = "system"
$env:DB_PASSWORD = "OraclePass123"

# OPTIONAL (use defaults if not set)
# Default values in application.yml
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **KEYCLOAK_SETUP.md** | Complete setup guide (15 min read) |
| **KEYCLOAK_MIGRATION.md** | Migration details & comparison |
| **README.md** | Project documentation |
| **SETUP_GUIDE.md** | General setup guide |

---

## 🎯 Common Tasks

### Create Another User

1. Keycloak Admin → Users → Create user
2. Set password (non-temporary)
3. Set role (admin/customer)

### Change Token Expiration

1. Keycloak Admin → Realm settings → Tokens
2. Update "Access Token Lifespan"
3. Save

### Export Users

1. Keycloak Admin → Manage → Realm settings
2. Click "Export" button
3. Download JSON

### Backup Keycloak

```bash
docker exec keycloak-perfume /opt/keycloak/bin/kc.sh export --realm perfume-shop --file realm-backup.json
docker cp keycloak-perfume:/realm-backup.json ./
```

---

## 🚀 Production Checklist

- [ ] Use HTTPS (not HTTP)
- [ ] Use strong admin password
- [ ] Deploy to Kubernetes
- [ ] Configure PostgreSQL (not embedded)
- [ ] Set up backup/restore
- [ ] Use reverse proxy (Nginx)
- [ ] Configure token expiration
- [ ] Set up monitoring/logging
- [ ] Test failover scenarios
- [ ] Document deployment process

---

## 💾 Commands Cheat Sheet

```bash
# Keycloak
docker ps                          # Check if running
docker logs keycloak-perfume       # View logs
docker stop keycloak-perfume       # Stop
docker start keycloak-perfume      # Start
docker rm keycloak-perfume         # Delete

# Application
./gradlew clean build              # Build
./gradlew bootRun                  # Run
./gradlew test                     # Test
curl http://localhost:8080/api/... # Test endpoint

# Database
sqlplus system/OraclePass123       # Connect to Oracle
```

---

## ❓ Quick FAQ

**Q: Can I switch back to Azure?**  
A: Yes! Just change environment variables. Application is OIDC-agnostic.

**Q: How do I get the Client Secret?**  
A: Keycloak Admin → Clients → perfume-shop-api → Credentials tab

**Q: Token keeps expiring?**  
A: Tokens valid for 5 min (default). Get new token or configure in Keycloak.

**Q: Can I use Keycloak in production?**  
A: Yes! Deploy to Kubernetes with PostgreSQL backend.

**Q: What's the "sub" claim?**  
A: Unique user ID from Keycloak. Used as PK in database.

---

## 🎉 You're Ready!

Everything is configured and the application is compiled.

**Next:** Follow the 5-Step Setup above to start testing!

See **KEYCLOAK_SETUP.md** for detailed steps.
