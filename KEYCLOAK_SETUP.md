# Keycloak Setup Guide for The Perfume Shop

Replace Azure AD B2C authentication with Keycloak for local development and production use.

## Table of Contents
1. [Keycloak Installation](#keycloak-installation)
2. [Keycloak Configuration](#keycloak-configuration)
3. [Application Configuration](#application-configuration)
4. [Testing](#testing)
5. [Getting JWT Tokens](#getting-jwt-tokens)
6. [Troubleshooting](#troubleshooting)

---

## Keycloak Installation

### Option A: Docker (Recommended & Easiest)

```bash
# Start Keycloak container
docker run -d \
  --name keycloak-perfume \
  -p 8180:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin123 \
  quay.io/keycloak/keycloak:latest \
  start-dev

# Wait for startup (~30 seconds)
# Access Keycloak Admin Console at: http://localhost:8180/admin

# Default credentials:
# Username: admin
# Password: admin123
```

### Option B: Local Installation (Windows)

```powershell
# Download Keycloak from https://www.keycloak.org/downloads
# Extract zip file

# On Windows, run:
cd keycloak-xx.x.x
.\bin\kc.bat start-dev

# Or on PowerShell:
& ".\bin\kc.bat" start-dev

# Access at: http://localhost:8180/admin
```

### Option C: Local Installation (Linux/Mac)

```bash
# Download and extract Keycloak
cd keycloak-xx.x.x

# Run:
./bin/kc.sh start-dev

# Access at: http://localhost:8180/admin
```

---

## Keycloak Configuration

### Step 1: Login to Admin Console

1. Go to: `http://localhost:8180/admin`
2. Username: `admin`
3. Password: `admin123`

### Step 2: Create Realm

1. **Hover over "Master"** (top left)
2. **Click "Create Realm"**
3. **Fill in:**
   - Name: `perfume-shop`
   - Leave other fields default
4. **Click "Create"**

### Step 3: Create Client

1. **Left menu → Clients**
2. **Click "Create client"**
3. **Fill in:**
   - Client ID: `perfume-shop-api`
   - Client Protocol: `openid-connect`
4. **Next**
5. **Enable:**
   - ✓ Client authentication: ON
   - ✓ Authorization: ON
6. **Next**
7. **Set Valid redirect URIs:**
   ```
   http://localhost:8080/*
   http://localhost:3000/*
   ```
8. **Save**

### Step 4: Get Client Credentials

1. **From Clients page, click: "perfume-shop-api"**
2. **Go to "Credentials" tab**
3. **Copy the "Client Secret"** (you'll need this)
4. **Note the "Client ID"**: `perfume-shop-api`

### Step 5: Create Realm Roles

1. **Left menu → Realm roles**
2. **Click "Create role"**
3. **Create 4 roles:**
   - `admin`
   - `customer`
   - `manager`
   - `support`

### Step 6: Create Test User

1. **Left menu → Users**
2. **Click "Add user"**
3. **Fill in:**
   - Username: `testuser@perfumeshop.com`
   - Email: `testuser@perfumeshop.com`
   - Email verified: ON
   - Enabled: ON
4. **Create**
5. **Go to "Credentials" tab**
6. **Set password:**
   - Temporary: OFF
   - Password: `TestPassword123!`
7. **Set password**
8. **Go to "Role mapping" tab**
9. **Assign role: "customer"**

### Step 7: Create Another Test User (for admin testing)

1. Repeat steps 2-9 with:
   - Username: `admin@perfumeshop.com`
   - Password: `AdminPassword123!`
   - Role: `admin`

### Step 8: Configure User Attributes (Optional but Recommended)

1. **Left menu → Users → User profile**
2. **Click "Create attribute"** for each:
   - First name
   - Last name
   - Phone number
3. **Save**

### Step 9: Get OpenID Configuration

Visit this URL (copy the issuer and jwks_uri):
```
http://localhost:8180/realms/perfume-shop/.well-known/openid-configuration
```

**Key values needed:**
```
issuer: http://localhost:8180/realms/perfume-shop
token_endpoint: http://localhost:8180/realms/perfume-shop/protocol/openid-connect/token
userinfo_endpoint: http://localhost:8180/realms/perfume-shop/protocol/openid-connect/userinfo
jwks_uri: http://localhost:8180/realms/perfume-shop/protocol/openid-connect/certs
```

---

## Application Configuration

### Step 1: Set Environment Variables

#### PowerShell (Windows)

```powershell
$env:KEYCLOAK_ISSUER_URI = "http://localhost:8180/realms/perfume-shop"
$env:KEYCLOAK_JWK_SET_URI = "http://localhost:8180/realms/perfume-shop/protocol/openid-connect/certs"
$env:DB_URL = "jdbc:oracle:thin:@localhost:1521:ORCL"
$env:DB_USERNAME = "system"
$env:DB_PASSWORD = "OraclePass123"

# Verify
Write-Host "KEYCLOAK_ISSUER_URI: $env:KEYCLOAK_ISSUER_URI"
Write-Host "KEYCLOAK_JWK_SET_URI: $env:KEYCLOAK_JWK_SET_URI"
```

#### Bash (Linux/Mac)

```bash
export KEYCLOAK_ISSUER_URI="http://localhost:8180/realms/perfume-shop"
export KEYCLOAK_JWK_SET_URI="http://localhost:8180/realms/perfume-shop/protocol/openid-connect/certs"
export DB_URL="jdbc:oracle:thin:@localhost:1521:ORCL"
export DB_USERNAME="system"
export DB_PASSWORD="OraclePass123"

# Verify
echo $KEYCLOAK_ISSUER_URI
echo $KEYCLOAK_JWK_SET_URI
```

### Step 2: Verify application.yml

File: `src/main/resources/application.yml`

Should have:
```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: ${KEYCLOAK_ISSUER_URI:http://localhost:8180/realms/perfume-shop}
          jwk-set-uri: ${KEYCLOAK_JWK_SET_URI:http://localhost:8180/realms/perfume-shop/protocol/openid-connect/certs}
```

### Step 3: Rebuild Application

```powershell
cd d:\The-Perfume-Shop
./gradlew clean build
```

---

## Testing

### Test 1: Start Application

```powershell
./gradlew bootRun

# Wait for:
# - "Tomcat started on port(s): 8080"
# - "Started PerfumeShopApplication"
```

### Test 2: Test Public Endpoint (No Auth)

```powershell
curl http://localhost:8080/api/products

# Expected: JSON array of products (or empty if no data)
```

### Test 3: Test Protected Endpoint Without Token

```powershell
curl -X GET http://localhost:8080/api/orders

# Expected: 401 Unauthorized
```

---

## Getting JWT Tokens

### Method 1: Using PowerShell

```powershell
# Keycloak configuration
$keycloakUrl = "http://localhost:8180/realms/perfume-shop/protocol/openid-connect/token"
$clientId = "perfume-shop-api"
$clientSecret = "YOUR_CLIENT_SECRET" # From Keycloak Credentials tab
$username = "testuser@perfumeshop.com"
$password = "TestPassword123!"

# Request token
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

# Save for later
$env:JWT_TOKEN = $token
```

### Method 2: Using Keycloak Admin Console

1. **Go to: http://localhost:8180/admin**
2. **Select realm: perfume-shop**
3. **Left menu → Clients → perfume-shop-api**
4. **Click "Download installation" → select "Keycloak OIDC JSON"**
5. Or use Keycloak's built-in OAuth Playground:
   - **Left menu → Clients → perfume-shop-api → Actions → Authorization → Consent**

### Method 3: Using curl

```bash
curl -X POST http://localhost:8180/realms/perfume-shop/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "client_id=perfume-shop-api" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "username=testuser@perfumeshop.com" \
  -d "password=TestPassword123!"
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cC...",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  "refresh_token": "...",
  "token_type": "Bearer",
  "scope": "..."
}
```

### Decode Token (Verify Claims)

Go to: https://jwt.io and paste the token

**Expected claims:**
```json
{
  "sub": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",  // User ID from Keycloak
  "email": "testuser@perfumeshop.com",
  "email_verified": true,
  "name": "Test User",
  "given_name": "Test",
  "family_name": "User",
  "iat": 1724575707,
  "exp": 1724576007,
  "iss": "http://localhost:8180/realms/perfume-shop"
}
```

---

## Testing Protected Endpoints

### Test 1: Get Orders

```powershell
$token = $env:JWT_TOKEN

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type"  = "application/json"
}

curl -X GET "http://localhost:8080/api/orders" -Headers $headers

# Expected: 200 OK with orders array (or empty if no data)
```

### Test 2: Place Order

```powershell
$token = $env:JWT_TOKEN

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type"  = "application/json"
}

$orderRequest = @{
    shippingAddress = "123 Luxury Avenue, Paris, France"
    orderItems = @(
        @{
            productId = 1
            quantity  = 2
        }
    )
} | ConvertTo-Json

curl -X POST "http://localhost:8080/api/orders" `
  -Headers $headers `
  -Body $orderRequest

# Expected: 201 Created with order details
```

---

## Database User Mapping

The User entity in the application stores the Keycloak user ID (from JWT "sub" claim) as the unique identifier:

```sql
-- Connect to Oracle
sqlplus system/OraclePass123@localhost:1521/ORCL

-- Insert user matching Keycloak user ID
-- Replace KEYCLOAK_USER_ID with the actual "sub" from the JWT token
INSERT INTO users (user_id, ciam_object_id, email, first_name, last_name, is_active, created_date)
VALUES (user_seq.NEXTVAL, 'KEYCLOAK_USER_ID', 'testuser@perfumeshop.com', 'Test', 'User', 1, SYSDATE);

COMMIT;
```

**How to get the Keycloak User ID:**
1. Decode the JWT token at jwt.io
2. Look for the "sub" claim - this is the Keycloak User ID
3. Or in Keycloak Admin Console: Users → click user → copy "ID" field at top

---

## Using Bruno for Testing

### Setup

1. **Open Bruno**
2. **File → Open Collection**
3. **Select: d:\The-Perfume-Shop\bruno**
4. **Environment: Select "local"**

### Update Environment Variables

1. **Edit: bruno/environments/local.bru**
2. **Update:**
   ```groovy
   vars {
     base_url: http://localhost:8080/api
     bearer_token: YOUR_JWT_TOKEN_HERE
   }
   ```
3. **Save** (Ctrl+S)

### Run Requests

1. **Products → Get All Products** (no auth needed)
2. **Orders → Get User Orders** (uses bearer_token)
3. **Orders → Place Order** (uses bearer_token)

---

## Troubleshooting

### Issue: Connection refused to Keycloak

```
ERROR: Connection refused to http://localhost:8180
```

**Solution:**
1. Verify Keycloak is running: `docker ps` or check console
2. Check port 8180 is accessible: `telnet localhost 8180`
3. Start Keycloak if stopped: `docker start keycloak-perfume`

---

### Issue: Invalid Client Secret

```
ERROR: invalid_client: Client authentication failed
```

**Solution:**
1. Go to Keycloak Admin Console
2. Clients → perfume-shop-api → Credentials
3. Copy the correct Client Secret
4. Make sure it matches in your PowerShell script

---

### Issue: User Not Found

```
ERROR: invalid_grant: Invalid user credentials
```

**Solution:**
1. Verify user exists in Keycloak
2. Check username/password are correct
3. Verify user is enabled (not disabled)
4. In Keycloak: Users → click user → verify "Enabled" is ON

---

### Issue: Token Rejected (401 Unauthorized)

```
ERROR: Full authentication is required to access this resource
```

**Solution:**
1. Verify issuer-uri matches: `http://localhost:8180/realms/perfume-shop`
2. Verify jwk-set-uri is correct
3. Check token hasn't expired (exp claim)
4. Ensure Bearer token in Authorization header

---

### Issue: CORS Error

```
ERROR: Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
If accessing from browser, Keycloak needs CORS configured:

1. **Keycloak Admin → Realm settings → CORS**
2. **Set Web Origins:**
   ```
   http://localhost:3000
   http://localhost:8080
   *
   ```

---

## Keycloak vs Azure AD B2C Comparison

| Feature | Keycloak | Azure AD B2C |
|---------|----------|-------------|
| **Deployment** | Self-hosted or Docker | Cloud SaaS |
| **Cost** | Free (self-hosted) | Pay-per-use |
| **Setup Time** | 5 minutes (Docker) | 15+ minutes (Portal) |
| **Learning Curve** | Easy | Medium |
| **Control** | Full | Limited |
| **Scaling** | Self-managed | Automatic |
| **JWT Issuer** | `http://localhost:8180/realms/...` | `https://tenant.b2clogin.com/...` |

---

## Quick Reference

| Task | Command |
|------|---------|
| **Start Keycloak (Docker)** | `docker run -d --name keycloak-perfume -p 8180:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin123 quay.io/keycloak/keycloak:latest start-dev` |
| **Stop Keycloak** | `docker stop keycloak-perfume` |
| **Start Keycloak again** | `docker start keycloak-perfume` |
| **Access Admin Console** | http://localhost:8180/admin |
| **Get token (PowerShell)** | Run script in "Getting JWT Tokens" section |
| **Test API** | `curl http://localhost:8080/api/products` |
| **View logs** | `docker logs keycloak-perfume` |

---

## Common Configuration Changes

### If Keycloak is on Different Host

```yaml
# application.yml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://your-keycloak-host:8180/realms/perfume-shop
          jwk-set-uri: http://your-keycloak-host:8180/realms/perfume-shop/protocol/openid-connect/certs
```

### If Using Production Keycloak

```yaml
# application.yml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://keycloak.yourcompany.com/realms/perfume-shop
          jwk-set-uri: https://keycloak.yourcompany.com/realms/perfume-shop/protocol/openid-connect/certs
```

### If Using Different Realm Name

```yaml
# application.yml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8180/realms/your-realm-name
          jwk-set-uri: http://localhost:8180/realms/your-realm-name/protocol/openid-connect/certs
```

---

## Next Steps

1. ✓ Install and start Keycloak
2. ✓ Create realm, client, users
3. ✓ Set environment variables
4. ✓ Rebuild application: `./gradlew clean build`
5. → Start application: `./gradlew bootRun`
6. → Get JWT token (PowerShell script above)
7. → Test endpoints with Bruno or curl
8. → Deploy Keycloak to production when ready

---

For more info: https://www.keycloak.org/documentation.html
