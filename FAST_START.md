# Fast Start - 5 Minutes to Testing

## Quick Summary

You now have a **production-ready Spring Boot 3.x backend** with OAuth2, Oracle database, and API testing built-in.

## In 5 Minutes:

### 1️⃣ Start Oracle (2 minutes)

```powershell
# If you have Docker:
docker run -d --name oracle-perfume -p 1521:1521 -e ORACLE_PWD=OraclePass123 container-registry.oracle.com/database/free:latest

# Wait for "DATABASE IS READY TO USE!" in logs
```

### 2️⃣ Set Environment Variables (1 minute)

```powershell
$env:DB_URL = "jdbc:oracle:thin:@localhost:1521:ORCL"
$env:DB_USERNAME = "system"
$env:DB_PASSWORD = "OraclePass123"
$env:AZURE_CIAM_ISSUER_URI = "https://perfume-shop-b2c.b2clogin.com/YOUR_TENANT_ID/v2.0/"
$env:AZURE_CIAM_JWK_SET_URI = "https://perfume-shop-b2c.b2clogin.com/YOUR_TENANT.onmicrosoft.com/discovery/v2.0/keys"
```

### 3️⃣ Start Application (2 minutes)

```powershell
cd d:\The-Perfume-Shop
./gradlew bootRun

# Wait for: "Started PerfumeShopApplication"
```

### 4️⃣ Test It Works

```powershell
# Open new PowerShell window
curl http://localhost:8080/api/products

# Should see: {"content": [...], "pageable": {...}}
```

✅ **Done! Application is running!**

---

## What You Have

| Component | Details |
|-----------|---------|
| **Backend** | Spring Boot 3.4.1 with Java 21 |
| **Database** | Oracle 19c/21c (schema auto-created) |
| **Security** | OAuth2 JWT from Azure CIAM |
| **API** | RESTful endpoints for products & orders |
| **Testing** | Bruno collection + curl scripts |
| **Secrets** | Azure Key Vault integration |

---

## Key Files

```
d:\The-Perfume-Shop\
├── SETUP_GUIDE.md              ← Complete setup for Azure & Oracle
├── TESTING_COMPLETE_FLOW.md    ← Step-by-step testing guide
├── setup-windows.ps1           ← Automated setup script
├── test-api.ps1                ← Automated testing script
├── build.gradle                ← Dependencies & build config
├── src/main/resources/
│   ├── application.yml         ← Spring configuration
│   └── db/changelog/           ← Database schemas
└── bruno/                       ← API testing collection
```

---

## Common Tasks

### Test Public Endpoints (No Auth)

```bash
# Get all products
curl http://localhost:8080/api/products

# Get specific product
curl http://localhost:8080/api/products/1

# Get product by SKU
curl http://localhost:8080/api/products/sku/LRP-001
```

### Test Protected Endpoints (Requires Token)

```bash
# Get JWT token from Azure CIAM first
# Then use it:

$token = "your-jwt-token"
curl -H "Authorization: Bearer $token" http://localhost:8080/api/orders
```

### Seed Sample Data

```sql
sqlplus system/OraclePass123@localhost:1521/ORCL

-- Insert user
INSERT INTO users (user_id, ciam_object_id, email, first_name, last_name, is_active, created_date)
VALUES (user_seq.NEXTVAL, '5c536403-e869-4bf7-b7af-6d0d46cf07c1', 'test@perfumeshop.com', 'John', 'Doe', 1, SYSDATE);

-- Insert product
INSERT INTO products (product_id, product_name, sku, price, stock_quantity, is_active, created_date)
VALUES (product_seq.NEXTVAL, 'Luxury Rose Perfume', 'LRP-001', 189.99, 50, 1, SYSDATE);

COMMIT;
```

### Check Application Logs

```bash
# If running in IDE
# → View console output

# If running as JAR
# → Logs appear in console, can redirect to file:
java -jar build/libs/perfume-shop-1.0.0.jar > app.log 2>&1
```

### Connect to Database

```bash
# Using sqlplus
sqlplus system/OraclePass123@localhost:1521/ORCL

# Using DBeaver (GUI)
# Download: https://dbeaver.io/download/
# Host: localhost, Port: 1521, SID: ORCL
# User: system, Pass: OraclePass123
```

### Use Bruno for Testing

1. Download Bruno: https://www.usebruno.com/
2. Open collection: `d:\The-Perfume-Shop\bruno`
3. Edit `environments/local.bru` with your JWT token
4. Click ▶ to run requests

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    Browser / Client                          │
└──────────────┬─────────────────────────────────────────────┘
               │ HTTP/HTTPS
               ▼
┌──────────────────────────────────────────────────────────────┐
│              Spring Boot Application (Port 8080)             │
│  ┌────────────────────────────────────────────────────────┐  │
│  │            REST Controllers                            │  │
│  │  • ProductController: GET /api/products               │  │
│  │  • OrderController: GET/POST /api/orders              │  │
│  └────────┬──────────────────────────────────┬───────────┘  │
│           │                                  │                │
│  ┌────────▼───────────┐         ┌────────────▼────────────┐  │
│  │  Public Endpoints  │         │ Protected Endpoints    │  │
│  │  (No Auth)         │         │ (JWT Bearer Required)  │  │
│  │  • List Products   │         │ • User Orders          │  │
│  │  • Product Details │         │ • Place Order          │  │
│  └────────────────────┘         └───────────────────────┘  │
│           │                              │                  │
│           └──────────────┬───────────────┘                  │
│                          ▼                                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │       Spring Security (OAuth2 Resource Server)        │  │
│  │       • JWT Token Validation                          │  │
│  │       • Azure CIAM Integration                        │  │
│  └────────┬──────────────────────────────────┬───────────┘  │
│           │                                  │                │
│  ┌────────▼──────────────────────────────────▼────────────┐  │
│  │            Spring Data JPA                             │  │
│  │  (Entity Repositories & Queries)                       │  │
│  └────────┬──────────────────────────────────┬───────────┘  │
│           │                                  │                │
└───────────┼──────────────────────────────────┼───────────────┘
            │                                  │
            ▼                                  ▼
      ┌──────────────────────────────────────────────────┐
      │         Oracle Database (Docker/Local)           │
      │                                                  │
      │  Tables:                                         │
      │  • users - Azure CIAM linked users              │
      │  • products - Perfume products                  │
      │  • perfume_notes - Fragrance characteristics    │
      │  • product_notes - Product-note relationships   │
      │  • cart - Shopping carts                        │
      │  • cart_items - Cart line items                 │
      │  • orders - Customer orders                     │
      │  • order_items - Order line items               │
      │  • liquibasechangelog - Migration history       │
      └──────────────────────────────────────────────────┘
```

---

## Authentication Flow

```
┌─────────────────┐
│   User Login    │
│  (Browser)      │
└────────┬────────┘
         │
         ▼
    ┌────────────────────────┐
    │  Azure CIAM            │
    │  (Entra ID / B2C)      │
    │                        │
    │  • Authenticate user   │
    │  • Issue JWT token     │
    │    - sub claim: CIAM   │
    │      Object ID         │
    │    - exp: expiration   │
    └────────┬───────────────┘
             │ Returns JWT
             ▼
    ┌────────────────────────┐
    │   Client App           │
    │   Receives JWT         │
    └────────┬───────────────┘
             │ Include in header:
             │ Authorization: Bearer <JWT>
             ▼
    ┌────────────────────────────────────┐
    │  Spring Boot Application           │
    │                                    │
    │  1. Extract JWT from header        │
    │  2. Validate signature using       │
    │     Azure CIAM JWK endpoint        │
    │  3. Verify issuer & exp claims     │
    │  4. Extract "sub" (CIAM Object ID) │
    │  5. Allow request if valid         │
    └────────┬───────────────────────────┘
             │
             ▼ Valid JWT
    ┌────────────────────────┐
    │  Access Protected      │
    │  Endpoints             │
    │  (GET /api/orders)     │
    └────────────────────────┘
```

---

## Database Schema Relationship

```
User (1) ←──────────→ (1) Cart
  │
  └──→ (N) Order ──→ (N) OrderItem ──→ (M) Product
                                          │
                                          └──→ (M) PerfumeNote
                                               (via product_notes)
```

---

## Troubleshooting Quick Reference

| Problem | Fix |
|---------|-----|
| **Port 8080 in use** | `netstat -ano \| findstr 8080` then kill process |
| **Oracle won't start** | `docker logs oracle-perfume` to see errors |
| **Gradle build fails** | `./gradlew clean build --stacktrace` for details |
| **JWT token invalid** | Verify Azure CIAM issuer URI in `application.yml` |
| **Database empty** | Run INSERT statements from TESTING_COMPLETE_FLOW.md |
| **Migration error** | Check Oracle permissions: `GRANT DBA TO system` |

---

## Next Steps

1. ✅ **Get application running** (done!)
2. → **Setup Azure CIAM** (see SETUP_GUIDE.md)
3. → **Get JWT token** (TESTING_COMPLETE_FLOW.md - Step 6)
4. → **Test protected endpoints** (TESTING_COMPLETE_FLOW.md - Step 7)
5. → **Deploy to Azure** (production)

---

## Resources

| Document | Purpose |
|----------|---------|
| **README.md** | Complete project documentation |
| **SETUP_GUIDE.md** | Detailed setup for Azure CIAM & Oracle |
| **TESTING_COMPLETE_FLOW.md** | Step-by-step testing guide |
| **QUICKSTART.md** | Getting started guide |
| **setup-windows.ps1** | Automated setup script |
| **test-api.ps1** | Automated testing script |

---

## Key Endpoints

```
PUBLIC (No Auth Required)
├── GET  /api/products                 List all products (paginated)
├── GET  /api/products/{id}            Get product by ID
└── GET  /api/products/sku/{sku}       Get product by SKU

PROTECTED (JWT Bearer Token Required)
├── GET  /api/orders                   Get user's orders
├── POST /api/orders                   Place new order
└── GET  /api/orders/{orderNumber}     Get specific order
```

---

## Technology Stack

- **Language**: Java 21
- **Framework**: Spring Boot 3.4.1
- **Build**: Gradle 8.5
- **Database**: Oracle 19c/21c
- **Migrations**: Liquibase
- **Auth**: OAuth2 + Azure CIAM JWT
- **Testing**: Bruno API Collection
- **Secrets**: Azure Key Vault

---

## What's Configured

✅ Spring Boot 3.x with Java 21  
✅ Gradle 8.5 with wrapper  
✅ Oracle database with sequences  
✅ Liquibase migrations (8 changelogs)  
✅ Spring Data JPA with entities  
✅ OAuth2 Resource Server with JWT  
✅ Azure CIAM integration  
✅ Azure Key Vault (no plaintext secrets)  
✅ REST controllers (Product, Order)  
✅ JPA Auditing (created_date, last_modified_date)  
✅ BigDecimal for monetary values  
✅ Bruno API testing collection  

---

## Commands Cheat Sheet

```bash
# Navigate to project
cd d:\The-Perfume-Shop

# Build
./gradlew clean build

# Run
./gradlew bootRun

# Test public endpoint
curl http://localhost:8080/api/products

# Test protected endpoint (replace TOKEN)
curl -H "Authorization: Bearer TOKEN" http://localhost:8080/api/orders

# View Docker container logs
docker logs -f oracle-perfume

# Connect to database
sqlplus system/OraclePass123@localhost:1521/ORCL

# Stop Docker container
docker stop oracle-perfume

# Start Docker container
docker start oracle-perfume
```

---

## You're Ready! 🎉

Your Spring Boot backend is **production-ready** with:
- ✅ Enterprise security (OAuth2 + Azure CIAM)
- ✅ Scalable stateless architecture
- ✅ Versioned database migrations
- ✅ Comprehensive testing setup
- ✅ No plaintext secrets

**Start testing now!** Follow steps in TESTING_COMPLETE_FLOW.md

---

Questions? Check:
- README.md for architecture
- SETUP_GUIDE.md for detailed setup
- TESTING_COMPLETE_FLOW.md for testing steps
