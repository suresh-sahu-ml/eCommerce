# Complete Testing Flow - Step by Step

## Complete Workflow

```
┌─────────────────┐
│  Start Here     │
└────────┬────────┘
         │
         ▼
    ┌────────────────────┐
    │ 1. Setup Oracle    │
    │    Database        │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ 2. Configure       │
    │    Environment     │
    │    Variables       │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ 3. Build App       │
    │    (Gradle)        │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ 4. Start App       │
    │    (Spring Boot)   │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ 5. Test Public     │
    │    Endpoints       │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ 6. Get JWT Token   │
    │    from Azure CIAM │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ 7. Test Protected  │
    │    Endpoints       │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ 8. Verify Database │
    │    Schema          │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ ✓ Testing Complete │
    └────────────────────┘
```

---

## Step 1: Setup Oracle Database

### Option A: Docker (Recommended)

```powershell
# Check Docker is installed
docker --version

# Run Oracle container
docker run -d `
  --name oracle-perfume `
  -p 1521:1521 `
  -e ORACLE_PWD=OraclePass123 `
  container-registry.oracle.com/database/free:latest

# Wait for startup (watch logs)
docker logs -f oracle-perfume

# Expected output (when ready):
# DATABASE IS READY TO USE!

# Stop (when done testing)
docker stop oracle-perfume

# Start again later
docker start oracle-perfume
```

### Option B: Local Oracle Installation

```powershell
# Verify Oracle is running
# On Windows, check Services: Oracle Database

# Test connection
sqlplus system/OraclePass123@localhost:1521/ORCL

# If successful, you'll see the SQL> prompt
# Type "exit" to quit
```

---

## Step 2: Configure Environment Variables

### PowerShell (Windows)

```powershell
# Database Configuration
$env:DB_URL = "jdbc:oracle:thin:@localhost:1521:ORCL"
$env:DB_USERNAME = "system"
$env:DB_PASSWORD = "OraclePass123"

# Azure CIAM Configuration (example - replace with your values)
$env:AZURE_CIAM_ISSUER_URI = "https://perfume-shop-b2c.b2clogin.com/5c536403-e869-4bf7-b7af-6d0d46cf07c1/v2.0/"
$env:AZURE_CIAM_JWK_SET_URI = "https://perfume-shop-b2c.b2clogin.com/perfume-shop-b2c.onmicrosoft.com/discovery/v2.0/keys"

# Verify they're set
Write-Host "DB_URL: $env:DB_URL"
Write-Host "AZURE_CIAM_ISSUER_URI: $env:AZURE_CIAM_ISSUER_URI"
```

### Bash (Linux/Mac)

```bash
# Database Configuration
export DB_URL="jdbc:oracle:thin:@localhost:1521:ORCL"
export DB_USERNAME="system"
export DB_PASSWORD="OraclePass123"

# Azure CIAM Configuration
export AZURE_CIAM_ISSUER_URI="https://perfume-shop-b2c.b2clogin.com/5c536403-e869-4bf7-b7af-6d0d46cf07c1/v2.0/"
export AZURE_CIAM_JWK_SET_URI="https://perfume-shop-b2c.b2clogin.com/perfume-shop-b2c.onmicrosoft.com/discovery/v2.0/keys"

# Verify
echo $DB_URL
echo $AZURE_CIAM_ISSUER_URI
```

---

## Step 3: Build Application

```powershell
cd d:\The-Perfume-Shop

# Build
./gradlew clean build

# Expected output:
# BUILD SUCCESSFUL in 25s

# If it fails, check:
# - Java 21 is installed: java --version
# - Environment variables are set
# - Oracle is running
```

---

## Step 4: Start Application

```powershell
# Terminal 1: Start the application
cd d:\The-Perfume-Shop
./gradlew bootRun

# Wait for startup messages:
# - "Tomcat started on port(s): 8080"
# - "Started PerfumeShopApplication in X.XXX seconds"
# - "Liquibase ... Successfully released change log lock"

# Application is now running on http://localhost:8080/api
```

---

## Step 5: Test Public Endpoints (No Auth Required)

### Test 1: Get All Products

```powershell
# Terminal 2: Open new PowerShell window and test

curl -X GET "http://localhost:8080/api/products?page=0&size=10"
```

**Expected Response (200 OK)**:
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
      "perfumeNotes": ["Rose"]
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 4
  }
}
```

**If Empty (No Products)**:
```json
{
  "content": [],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 0
  }
}
```

→ **This is OK!** Seed data later.

---

### Test 2: Get Single Product

```powershell
curl -X GET "http://localhost:8080/api/products/1"
```

**Expected Response (200 OK)**:
```json
{
  "productId": 1,
  "productName": "Luxury Rose Eau de Parfum",
  "sku": "LRP-001",
  "description": "Premium rose fragrance",
  "price": 189.99,
  "stockQuantity": 50,
  "brand": "Luxury Brand",
  "volumeMl": 100,
  "createdDate": "2026-08-14T10:30:00"
}
```

**If Product Not Found (404)**:
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "No value present"
}
```

→ **This is OK!** Means no data seeded yet.

---

### Test 3: Get Product by SKU

```powershell
curl -X GET "http://localhost:8080/api/products/sku/LRP-001"
```

**Expected Response**: Same as Test 2 (if product exists)

---

## Step 6: Get JWT Token from Azure CIAM

### Using PowerShell (Direct Token Request)

```powershell
# Replace these values with your actual Azure AD B2C credentials
$tenantName = "perfume-shop-b2c"
$clientId = "YOUR_CLIENT_ID"
$clientSecret = "YOUR_CLIENT_SECRET"
$username = "test@perfumeshop.com"
$password = "TestPassword123!"

# Request token
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
Write-Host "Token received!"
Write-Host "Token: $token"

# Save for later use
$env:JWT_TOKEN = $token
```

### Alternative: Using Azure Portal

1. **Go to Azure Portal**
2. **Navigate to your AD B2C tenant**
3. **App registrations → Your app → Token URL**
4. **Open in browser** (will show authorization flow)
5. **After login**, token appears in URL bar

### Decode Token (Verify Claims)

```powershell
function Decode-JWT {
    param([string]$token)
    
    $parts = $token.Split('.')
    $payload = $parts[1]
    
    # Add padding
    $padding = 4 - ($payload.Length % 4)
    if ($padding -ne 4) { $payload += '=' * $padding }
    
    $decodedBytes = [System.Convert]::FromBase64String($payload)
    $decodedString = [System.Text.Encoding]::UTF8.GetString($decodedBytes)
    
    $decodedString | ConvertFrom-Json | Format-Table -AutoSize
}

Decode-JWT $env:JWT_TOKEN
```

**Expected Claims**:
```
aud   : YOUR_CLIENT_ID
iss   : https://perfume-shop-b2c.b2clogin.com/YOUR_TENANT_ID/v2.0/
sub   : YOUR_CIAM_OBJECT_ID (this is the important one!)
email : test@perfumeshop.com
name  : Test User
exp   : 1724579307
iat   : 1724575707
```

---

## Step 7: Test Protected Endpoints (Auth Required)

### Test 1: Get User Orders

```powershell
# Store token
$token = $env:JWT_TOKEN

# Create headers
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type"  = "application/json"
}

# Make request
curl -X GET "http://localhost:8080/api/orders" `
  -Headers $headers
```

**Expected Response (200 OK)**:
```json
[
  {
    "orderId": 1,
    "orderNumber": "ORD-1724575707000",
    "totalAmount": 339.98,
    "status": "PENDING",
    "shippingAddress": "123 Luxury Ave, Paris",
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

**If No Orders (Empty Array)**:
```json
[]
```

→ **This is OK!** Place an order to create one.

---

### Test 2: Place an Order

```powershell
$token = $env:JWT_TOKEN

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type"  = "application/json"
}

# Create order request
$orderRequest = @{
    shippingAddress = "123 Luxury Avenue, Paris, France"
    orderItems = @(
        @{
            productId = 1
            quantity  = 2
        },
        @{
            productId = 2
            quantity  = 1
        }
    )
} | ConvertTo-Json

# Place order
curl -X POST "http://localhost:8080/api/orders" `
  -Headers $headers `
  -Body $orderRequest
```

**Expected Response (201 Created)**:
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

---

### Test 3: Get Specific Order

```powershell
$token = $env:JWT_TOKEN
$orderNumber = "ORD-1724575708123"

$headers = @{
    "Authorization" = "Bearer $token"
}

curl -X GET "http://localhost:8080/api/orders/$orderNumber" `
  -Headers $headers
```

**Expected Response**: Same as Test 1 (single order object)

---

## Step 8: Verify Database Schema

### Connect to Oracle

```powershell
# Using sqlplus (if installed)
sqlplus system/OraclePass123@localhost:1521/ORCL

# Or use DBeaver:
# 1. Download from https://dbeaver.io/download/
# 2. Create new connection (Oracle)
# 3. Host: localhost, Port: 1521, SID: ORCL
# 4. Username: system, Password: OraclePass123
```

### Verify Tables

```sql
-- Check all tables
SELECT table_name FROM user_tables ORDER BY table_name;

-- Expected tables:
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

-- Check data
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as product_count FROM products;
SELECT COUNT(*) as order_count FROM orders;

-- View users
SELECT user_id, ciam_object_id, email, first_name, last_name FROM users;

-- View products
SELECT product_id, product_name, sku, price, stock_quantity FROM products;

-- View orders
SELECT order_id, order_number, user_id, total_amount, status FROM orders;
```

---

## Common Test Scenarios

### Scenario 1: Testing Without JWT Token

```powershell
# This should return 401 Unauthorized
curl -X GET "http://localhost:8080/api/orders"
```

**Expected Response (401)**:
```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource"
}
```

---

### Scenario 2: Testing With Invalid JWT Token

```powershell
$invalidToken = "not.a.valid.token"

$headers = @{
    "Authorization" = "Bearer $invalidToken"
}

curl -X GET "http://localhost:8080/api/orders" `
  -Headers $headers
```

**Expected Response (401)**:
```json
{
  "status": 401,
  "error": "Unauthorized"
}
```

---

### Scenario 3: Testing With Expired Token

A token is expired if the `exp` claim has passed. Application will reject it:

```powershell
# This returns 401 Unauthorized
curl -X GET "http://localhost:8080/api/orders" `
  -Headers @{ "Authorization" = "Bearer <expired-token>" }
```

---

### Scenario 4: Testing With Token From Wrong Tenant

If token is from a different Azure AD B2C tenant:

```powershell
# This returns 401 Unauthorized (issuer mismatch)
curl -X GET "http://localhost:8080/api/orders" `
  -Headers @{ "Authorization" = "Bearer <token-from-different-tenant>" }
```

---

## Quick Troubleshooting Matrix

| Issue | Cause | Solution |
|-------|-------|----------|
| **Connection refused on :8080** | App not running | Run `./gradlew bootRun` |
| **Cannot connect to database** | Oracle not running | Start Docker/Oracle service |
| **Empty products list** | No data seeded | Run SQL INSERT statements |
| **401 Unauthorized (no token)** | Expected! | Get JWT token from Azure CIAM |
| **401 Unauthorized (with token)** | Token invalid/expired | Get new token or check issuer URI |
| **404 Product Not Found** | Product doesn't exist | Seed sample data |
| **Liquibase lock error** | Migration stuck | Clear lock: `DELETE FROM liquibasechangeloglock` |
| **Invalid JWT format** | Wrong encoding | Verify token from jwt.io |

---

## Using Bruno for Testing (Easier!)

### Setup Bruno

1. **Download**: https://www.usebruno.com/
2. **Open Bruno**
3. **File → Open Collection**
4. **Select**: `d:\The-Perfume-Shop\bruno`
5. **Environment**: Click "local"

### Configure Token

1. **Edit `bruno/environments/local.bru`**
2. **Replace bearer_token**:
   ```groovy
   vars {
     base_url: http://localhost:8080/api
     bearer_token: your-jwt-token-here
   }
   ```
3. **Save** (Ctrl+S)

### Run Tests

1. **Products → Get All Products** (click ▶)
2. **Products → Get Product by ID** (click ▶)
3. **Orders → Get User Orders** (requires token, click ▶)
4. **Orders → Place Order** (requires token, click ▶)

**Bruno will automatically**:
- Inject the base URL
- Add Bearer token to headers
- Show response in JSON format
- Run tests

---

## Testing Complete Checklist

- [ ] Oracle database is running
- [ ] Environment variables are set
- [ ] Application started without errors
- [ ] GET /api/products returns 200
- [ ] GET /api/products/1 returns 200 or 404 (OK either way)
- [ ] GET /api/orders without token returns 401
- [ ] Got JWT token from Azure CIAM
- [ ] GET /api/orders with token returns 200
- [ ] POST /api/orders with token returns 201
- [ ] Database schema verified (8 tables + Liquibase tables)
- [ ] Sample data visible in database
- [ ] Bruno collection runs all requests successfully

✓ When all checked: **Testing is complete!**

---

For detailed setup instructions, see `SETUP_GUIDE.md`
For API documentation, see `README.md`
