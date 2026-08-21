# Complete Setup & Testing Guide

## Part 1: Keycloak Setup

⚠️ **IMPORTANT**: This guide has been updated to use **Keycloak** instead of Azure AD B2C.

For detailed Keycloak setup, see [KEYCLOAK_SETUP.md](KEYCLOAK_SETUP.md)

Quick Overview:

### Keycloak Setup (Recommended)

1. **Start Keycloak with Docker:**
   ```bash
   docker run -d \
     --name keycloak-perfume \
     -p 8180:8080 \
     -e KEYCLOAK_ADMIN=admin \
     -e KEYCLOAK_ADMIN_PASSWORD=admin123 \
     quay.io/keycloak/keycloak:latest \
     start-dev
   ```

2. **Access Admin Console:** http://localhost:8180/admin
   - Username: `admin`
   - Password: `admin123`

3. **Create Realm:** `perfume-shop`

4. **Create Client:** `perfume-shop-api`
   - Get Client Secret from Credentials tab

5. **Create Test User:**
   - Username: `testuser@perfumeshop.com`
   - Password: `TestPassword123!`
   - Email verified: ON

6. **Get OpenID Configuration:**
   ```
   http://localhost:8180/realms/perfume-shop/.well-known/openid-configuration
   ```

**For detailed steps, see [KEYCLOAK_SETUP.md](KEYCLOAK_SETUP.md)**

---

## Part 2: Oracle Database Setup

### Option A: Oracle Database on Docker (Easiest for Development)

#### Step 1: Install Docker

```bash
# Download from https://www.docker.com/products/docker-desktop
# Install and start Docker Desktop
```

#### Step 2: Run Oracle 21c Free Edition Container

```bash
# No login required for free edition!
# Pull Oracle Free image
docker pull container-registry.oracle.com/database/free:latest

# Run container
docker run -d \
  --name oracle-perfume \
  -p 1521:1521 \
  -e ORACLE_PWD=OraclePass123 \
  container-registry.oracle.com/database/free:latest

# Wait for startup (~2-3 minutes)
docker logs -f oracle-perfume

# When you see "DATABASE IS READY TO USE!" - it's ready
```

**Note:** Oracle Free Edition has no login requirement and is perfect for development!

#### Step 3: Connect to Database

```bash
# Using sqlplus (if installed)
sqlplus system/OraclePass123@localhost:1521/ORCL

# Or using DBeaver:
# 1. Download DBeaver (free)
# 2. Create new connection:
#    - Database: Oracle
#    - Host: localhost
#    - Port: 1521
#    - SID: ORCL
#    - Username: system
#    - Password: OraclePass123
```

---

### Option B: Oracle Database 21c Free Edition

#### Step 1: Download Oracle

1. Go to [Oracle Database Free](https://www.oracle.com/database/free/get-started/)
2. Download installer for Windows
3. Run installer

#### Step 2: Create Database

1. **Database Configuration Assistant**
2. **Create new database**:
   - Database name: ORCL
   - Admin password: OraclePass123
3. Complete setup

#### Step 3: Create Tablespace (Optional but Recommended)

```sql
-- Connect as system
sqlplus system/OraclePass123

-- Create tablespace
CREATE TABLESPACE perfume_tbs 
  DATAFILE '/u01/oradata/perfume.dbf' 
  SIZE 100M 
  AUTOEXTEND ON;

-- Create user
CREATE USER perfume 
  IDENTIFIED BY PerfumePass123 
  DEFAULT TABLESPACE perfume_tbs;

-- Grant permissions
GRANT CONNECT, RESOURCE, DBA TO perfume;
GRANT UNLIMITED TABLESPACE TO perfume;
```

---

## Part 3: Application Configuration

### Step 1: Set Environment Variables

#### On Windows (PowerShell):

```powershell
# Database Configuration
$env:DB_URL = "jdbc:oracle:thin:@localhost:1521:ORCL"
$env:DB_USERNAME = "system"
$env:DB_PASSWORD = "OraclePass123"

# Keycloak Configuration
$env:KEYCLOAK_ISSUER_URI = "http://localhost:8180/realms/perfume-shop"
$env:KEYCLOAK_JWK_SET_URI = "http://localhost:8180/realms/perfume-shop/protocol/openid-connect/certs"

# Verify
Write-Host "DB_URL: $env:DB_URL"
Write-Host "KEYCLOAK_ISSUER_URI: $env:KEYCLOAK_ISSUER_URI"
```

#### On Linux/Mac (Bash):

```bash
# Database Configuration
export DB_URL="jdbc:oracle:thin:@localhost:1521:ORCL"
export DB_USERNAME="system"
export DB_PASSWORD="OraclePass123"

# Keycloak Configuration
export KEYCLOAK_ISSUER_URI="http://localhost:8180/realms/perfume-shop"
export KEYCLOAK_JWK_SET_URI="http://localhost:8180/realms/perfume-shop/protocol/openid-connect/certs"

# Verify
echo $DB_URL
echo $KEYCLOAK_ISSUER_URI
```

### Step 2: Seed Sample Data

```sql
-- Connect to Oracle
sqlplus system/OraclePass123@localhost:1521/ORCL

-- Create test user (matching your Azure CIAM Object ID)
INSERT INTO users (user_id, ciam_object_id, email, first_name, last_name, is_active, created_date)
VALUES (user_seq.NEXTVAL, '5c536403-e869-4bf7-b7af-6d0d46cf07c1', 'test@perfumeshop.com', 'John', 'Doe', 1, SYSDATE);

-- Create perfume notes
INSERT INTO perfume_notes (note_id, note_name, description, created_date)
VALUES (perfume_note_seq.NEXTVAL, 'Rose', 'Classic rose fragrance', SYSDATE);

INSERT INTO perfume_notes (note_id, note_name, description, created_date)
VALUES (perfume_note_seq.NEXTVAL, 'Sandalwood', 'Warm sandalwood', SYSDATE);

INSERT INTO perfume_notes (note_id, note_name, description, created_date)
VALUES (perfume_note_seq.NEXTVAL, 'Vanilla', 'Sweet vanilla', SYSDATE);

INSERT INTO perfume_notes (note_id, note_name, description, created_date)
VALUES (perfume_note_seq.NEXTVAL, 'Citrus', 'Fresh citrus', SYSDATE);

-- Create sample products
INSERT INTO products (product_id, product_name, sku, description, price, stock_quantity, brand, volume_ml, is_active, created_date)
VALUES (product_seq.NEXTVAL, 'Luxury Rose Eau de Parfum', 'LRP-001', 'Premium rose fragrance for special occasions', 189.99, 50, 'Luxury Brand', 100, 1, SYSDATE);

INSERT INTO products (product_id, product_name, sku, description, price, stock_quantity, brand, volume_ml, is_active, created_date)
VALUES (product_seq.NEXTVAL, 'Sandalwood Elegance', 'SWE-001', 'Elegant sandalwood cologne for daily use', 149.99, 100, 'Premium Scents', 75, 1, SYSDATE);

INSERT INTO products (product_id, product_name, sku, description, price, stock_quantity, brand, volume_ml, is_active, created_date)
VALUES (product_seq.NEXTVAL, 'Vanilla Dreams', 'VD-001', 'Sweet vanilla perfume for romance', 129.99, 75, 'Dream Collection', 50, 1, SYSDATE);

INSERT INTO products (product_id, product_name, sku, description, price, stock_quantity, brand, volume_ml, is_active, created_date)
VALUES (product_seq.NEXTVAL, 'Citrus Sunrise', 'CS-001', 'Fresh citrus fragrance for morning', 99.99, 150, 'Fresh Line', 100, 1, SYSDATE);

COMMIT;

-- Verify data inserted
SELECT * FROM users;
SELECT * FROM products;
```

---

## Part 4: Application Testing

### Step 1: Start the Application

```bash
cd d:\The-Perfume-Shop

# Set environment variables (PowerShell)
$env:DB_URL = "jdbc:oracle:thin:@localhost:1521:ORCL"
$env:DB_USERNAME = "system"
$env:DB_PASSWORD = "OraclePass123"
$env:AZURE_CIAM_ISSUER_URI = "https://perfume-shop-b2c.b2clogin.com/5c536403-e869-4bf7-b7af-6d0d46cf07c1/v2.0/"
$env:AZURE_CIAM_JWK_SET_URI = "https://perfume-shop-b2c.b2clogin.com/perfume-shop-b2c.onmicrosoft.com/discovery/v2.0/keys"

# Run application
./gradlew bootRun
```

#### Expected Startup Output

```
Starting PerfumeShopApplication v1.0.0
Tomcat started on port(s): 8080
Started PerfumeShopApplication in X.XXX seconds
INFO ... liquibase ... Successfully acquired change log lock
INFO ... liquibase ... Executing: CREATE TABLE users
...
INFO ... liquibase ... Successfully released change log lock
```

### Step 2: Test Public Endpoints (No Auth Required)

#### Test 1: Get All Products

```bash
curl -X GET http://localhost:8080/api/products?page=0&size=10
```

**Expected Response** (200 OK):
```json
{
  "content": [
    {
      "productId": 1,
      "productName": "Luxury Rose Eau de Parfum",
      "sku": "LRP-001",
      "price": 189.99,
      "stockQuantity": 50,
      "brand": "Luxury Brand",
      "volumeMl": 100,
      "perfumeNotes": ["Rose"]
    },
    {
      "productId": 2,
      "productName": "Sandalwood Elegance",
      "sku": "SWE-001",
      "price": 149.99,
      "stockQuantity": 100,
      "brand": "Premium Scents",
      "volumeMl": 75,
      "perfumeNotes": ["Sandalwood"]
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 4
  }
}
```

#### Test 2: Get Single Product

```bash
curl -X GET http://localhost:8080/api/products/1
```

**Expected Response** (200 OK):
```json
{
  "productId": 1,
  "productName": "Luxury Rose Eau de Parfum",
  "sku": "LRP-001",
  "description": "Premium rose fragrance for special occasions",
  "price": 189.99,
  "stockQuantity": 50,
  "brand": "Luxury Brand",
  "volumeMl": 100,
  "perfumeNotes": ["Rose"],
  "createdDate": "2026-08-14T10:30:00"
}
```

#### Test 3: Get Product by SKU

```bash
curl -X GET http://localhost:8080/api/products/sku/LRP-001
```

**Expected Response** (200 OK): Same as single product above

---

### Step 3: Get JWT Token from Azure CIAM

#### Using Azure AD B2C

```bash
# Get authorization code (opens browser)
# Navigate to:
https://perfume-shop-b2c.b2clogin.com/perfume-shop-b2c.onmicrosoft.com/oauth2/v2.0/authorize?client_id=<CLIENT_ID>&response_type=code&redirect_uri=http://localhost:3000&scope=openid

# Or use this PowerShell script to get token directly:
```

#### PowerShell Script to Get JWT Token

```powershell
# Set your values
$tenantName = "perfume-shop-b2c"  # Your B2C tenant name
$clientId = "<YOUR_CLIENT_ID>"
$clientSecret = "<YOUR_CLIENT_SECRET>"
$username = "test@perfumeshop.com"
$password = "TestPassword123!"

# Get token
$tokenUrl = "https://$tenantName.b2clogin.com/$tenantName.onmicrosoft.com/oauth2/v2.0/token"

$body = @{
    client_id     = $clientId
    client_secret = $clientSecret
    username      = $username
    password      = $password
    grant_type    = "password"
    scope         = "openid offline_access"
}

$response = Invoke-RestMethod -Method Post -Uri $tokenUrl -Body $body

$token = $response.access_token
Write-Host "Token: $token"
Write-Host ""
Write-Host "Expires in: $($response.expires_in) seconds"
```

#### Decode JWT Token (to verify claims)

```powershell
# Use online tool: https://jwt.io
# Or decode locally:

function Decode-JWT {
    param([string]$token)
    
    $parts = $token.Split('.')
    $payload = $parts[1]
    
    # Add padding if needed
    $padding = 4 - ($payload.Length % 4)
    if ($padding -ne 4) { $payload += '=' * $padding }
    
    $decodedBytes = [System.Convert]::FromBase64String($payload)
    $decodedString = [System.Text.Encoding]::UTF8.GetString($decodedBytes)
    
    $decodedString | ConvertFrom-Json
}

Decode-JWT $token
```

**Expected Token Payload**:
```json
{
  "aud": "CLIENT_ID",
  "iss": "https://perfume-shop-b2c.b2clogin.com/5c536403-e869-4bf7-b7af-6d0d46cf07c1/v2.0/",
  "iat": 1724575707,
  "nbf": 1724575707,
  "exp": 1724579307,
  "sub": "5c536403-e869-4bf7-b7af-6d0d46cf07c1",
  "email": "test@perfumeshop.com",
  "name": "John Doe"
}
```

---

### Step 4: Test Protected Endpoints (Auth Required)

#### Test 1: Get User Orders (Authenticated)

```bash
# Replace TOKEN with actual JWT token
$token = "eyJhbGc..."

curl -X GET http://localhost:8080/api/orders `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json"
```

**Expected Response** (200 OK):
```json
[
  {
    "orderId": 1,
    "orderNumber": "ORD-1724575707000",
    "totalAmount": 339.98,
    "status": "PENDING",
    "shippingAddress": "123 Luxury Ave, Paris, France",
    "orderItems": [
      {
        "orderItemId": 1,
        "productId": 1,
        "productName": "Luxury Rose Eau de Parfum",
        "quantity": 2,
        "unitPrice": 189.99,
        "lineTotal": 379.98
      }
    ],
    "createdDate": "2026-08-14T10:30:00"
  }
]
```

**Error if no token** (401 Unauthorized):
```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource"
}
```

#### Test 2: Place Order (Authenticated)

```bash
$token = "eyJhbGc..."

$body = @{
    shippingAddress = "123 Luxury Avenue, Paris, France"
    orderItems = @(
        @{
            productId = 1
            quantity = 2
        },
        @{
            productId = 2
            quantity = 1
        }
    )
} | ConvertTo-Json

curl -X POST http://localhost:8080/api/orders `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -d $body
```

**Expected Response** (201 Created):
```json
{
  "orderId": 2,
  "orderNumber": "ORD-1724575708123",
  "totalAmount": 530.97,
  "status": "PENDING",
  "shippingAddress": "123 Luxury Avenue, Paris, France",
  "orderItems": [
    {
      "orderItemId": 2,
      "productId": 1,
      "productName": "Luxury Rose Eau de Parfum",
      "quantity": 2,
      "unitPrice": 189.99,
      "lineTotal": 379.98
    },
    {
      "orderItemId": 3,
      "productId": 2,
      "productName": "Sandalwood Elegance",
      "quantity": 1,
      "unitPrice": 149.99,
      "lineTotal": 149.99
    }
  ]
}
```

#### Test 3: Get Specific Order

```bash
$token = "eyJhbGc..."

curl -X GET http://localhost:8080/api/orders/ORD-1724575708123 `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json"
```

---

### Step 5: Testing with Bruno (Recommended)

#### Setup

1. **Download Bruno**: [https://www.usebruno.com/](https://www.usebruno.com/)
2. **Open Bruno** → File → Open Collection
3. **Select**: `d:\The-Perfume-Shop\bruno`
4. **Select environment**: `local`

#### Configure Bearer Token

1. **Open** `bruno/environments/local.bru`
2. **Replace** the `bearer_token` variable:
   ```groovy
   vars {
     base_url: http://localhost:8080/api
     bearer_token: <your-actual-jwt-token>
   }
   ```
3. **Save**

#### Run Requests

| Request | Auth | Expected |
|---------|------|----------|
| Get All Products | ❌ | 200 OK, products array |
| Get Product by ID | ❌ | 200 OK, single product |
| Get User Orders | ✅ | 200 OK, orders array |
| Place Order | ✅ | 201 Created, order details |
| Get Order by Number | ✅ | 200 OK, order details |

---

## Part 5: Verify Database Schema

### Connect to Oracle and Verify Tables

```sql
sqlplus system/OraclePass123@localhost:1521/ORCL

-- List all tables
SELECT table_name FROM user_tables ORDER BY table_name;

-- Expected output:
-- CART
-- CART_ITEMS
-- LIQUIBASECHANGELOG
-- LIQUIBASECHANGELOGLOCK
-- ORDER_ITEMS
-- ORDERS
-- PERFUME_NOTES
-- PRODUCT_NOTES
-- PRODUCTS
-- USERS

-- Check Liquibase history
SELECT * FROM liquibasechangelog ORDER BY orderexecuted;

-- Verify data
SELECT COUNT(*) as product_count FROM products;
SELECT * FROM users;
SELECT * FROM orders;
```

---

## Part 6: Troubleshooting

### Issue: Database Connection Failed

```
ERROR: java.sql.SQLException: ORA-12514: TNS:listener could not resolve the connect identifier given
```

**Solution**:
1. Verify Oracle is running: `docker ps` or Check Windows Services
2. Verify environment variables:
   ```powershell
   Write-Host $env:DB_URL
   Write-Host $env:DB_USERNAME
   ```
3. Test connection manually:
   ```bash
   sqlplus system/OraclePass123@localhost:1521/ORCL
   ```

---

### Issue: Invalid JWT Token

```
ERROR: org.springframework.security.oauth2.jwt.BadJwtException: An error occurred while attempting to decode the JWT
```

**Solution**:
1. Verify token is from your Azure CIAM tenant
2. Check token hasn't expired (exp claim in JWT)
3. Verify AZURE_CIAM_ISSUER_URI matches token issuer
4. Decode token at https://jwt.io to inspect claims

---

### Issue: 401 Unauthorized on Protected Endpoints

```json
{
  "status": 401,
  "error": "Unauthorized"
}
```

**Solution**:
1. Ensure Bearer token in request header: `Authorization: Bearer <token>`
2. Token must be from configured Azure CIAM
3. Verify `sub` claim in token matches a user in database (optional for this demo)

---

### Issue: Liquibase Lock

```
ERROR: Could not acquire change log lock: ORA-00001: unique constraint violated
```

**Solution**:
```sql
-- Clear lock (if stuck)
DELETE FROM liquibasechangeloglock;
COMMIT;
```

---

## Complete Testing Checklist

- [ ] Oracle database running and accessible
- [ ] Application starts with `./gradlew bootRun`
- [ ] Liquibase migrations executed (check logs for "Successfully released change log lock")
- [ ] GET /api/products returns 200 with product list
- [ ] GET /api/products/1 returns 200 with product details
- [ ] GET /api/products/sku/LRP-001 returns 200 with product details
- [ ] GET /api/orders without token returns 401
- [ ] GET /api/orders with valid token returns 200 with orders
- [ ] POST /api/orders with valid token returns 201 with order created
- [ ] POST /api/orders without token returns 401
- [ ] Bruno API collection runs successfully
- [ ] Database contains correct schema (8 tables + Liquibase tables)
- [ ] Sample data visible in database

---

## Summary Commands

```bash
# Setup
cd d:\The-Perfume-Shop
$env:DB_URL = "jdbc:oracle:thin:@localhost:1521:ORCL"
$env:DB_USERNAME = "system"
$env:DB_PASSWORD = "OraclePass123"
$env:AZURE_CIAM_ISSUER_URI = "https://perfume-shop-b2c.b2clogin.com/YOUR_TENANT_ID/v2.0/"
$env:AZURE_CIAM_JWK_SET_URI = "https://perfume-shop-b2c.b2clogin.com/YOUR_TENANT.onmicrosoft.com/discovery/v2.0/keys"

# Build
./gradlew clean build

# Run
./gradlew bootRun

# Test public endpoint
curl http://localhost:8080/api/products

# Test protected endpoint (replace TOKEN)
curl -H "Authorization: Bearer TOKEN" http://localhost:8080/api/orders
```

---

For more details on Azure CIAM or Oracle setup, refer to:
- Azure AD B2C: https://docs.microsoft.com/en-us/azure/active-directory-b2c/
- Oracle Database: https://docs.oracle.com/database/
- Spring Security OAuth2: https://spring.io/projects/spring-security-oauth2-resource-server
