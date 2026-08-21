# Quick Start Guide

## Prerequisites

- **Java 21+** installed and in PATH
- **Gradle 8.5+** (optional; wrapper included)
- **Oracle Database 19c/21c** running (or use Docker)
- **Azure CIAM Tenant** configured (Azure AD B2C or Entra External ID)
- **Azure Key Vault** with secrets configured

## 1. Setup Oracle Database (Docker)

```bash
# Run Oracle in Docker
docker run -d \
  --name oracle-db \
  -p 1521:1521 \
  -e ORACLE_PWD=oracle \
  container-registry.oracle.com/database/free:latest

# Wait for startup (3-5 minutes)
docker logs -f oracle-db

# Connection details
# Host: localhost
# Port: 1521
# SID: ORCL
# User: system
# Password: oracle
```

## 2. Configure Environment Variables

```bash
# Database
export DB_URL=jdbc:oracle:thin:@localhost:1521:ORCL
export DB_USERNAME=system
export DB_PASSWORD=oracle

# Azure CIAM
export AZURE_CIAM_ISSUER_URI=https://YOUR_TENANT.b2clogin.com/YOUR_TENANT.onmicrosoft.com/v2.0
export AZURE_CIAM_JWK_SET_URI=https://YOUR_TENANT.b2clogin.com/YOUR_TENANT.onmicrosoft.com/discovery/v2.0/keys

# Azure Key Vault (optional; uses DefaultAzureCredential)
export AZURE_KEYVAULT_ENDPOINT=https://YOUR_VAULT_NAME.vault.azure.net/
export AZURE_TENANT_ID=your-tenant-id
export AZURE_CLIENT_ID=your-client-id
export AZURE_CLIENT_SECRET=your-client-secret
```

## 3. Build the Project

```bash
# Navigate to project directory
cd d:\The-Perfume-Shop

# Build with wrapper
./gradlew clean build

# Or build and skip tests
./gradlew clean build -x test
```

## 4. Run the Application

```bash
# Method 1: Using Gradle
./gradlew bootRun

# Method 2: Run JAR directly
java -jar build/libs/perfume-shop-1.0.0.jar

# Method 3: Using IDE
# - Open build.gradle in IntelliJ IDEA or VS Code
# - Run PerfumeShopApplication.main()
```

## 5. Verify Application Started

```bash
# Check if application is running
curl http://localhost:8080/api/products

# Expected response: 200 OK with paginated products array
# (Will be empty initially until data is seeded)
```

## 6. Test with Bruno API Collection

1. **Open Bruno** → Import collection from `bruno/` directory
2. **Select environment**: `local`
3. **Update Bearer Token** in `environments/local.bru`:
   ```groovy
   vars {
     base_url: http://localhost:8080/api
     bearer_token: <paste-your-actual-jwt-token>
   }
   ```
4. **Run requests**:
   - `GET /api/products` (public, no token needed)
   - `GET /api/orders` (requires token)
   - `POST /api/orders` (requires token, place order)

## 7. Seed Sample Data

```sql
-- Connect to Oracle
sqlplus system/oracle@localhost:1521/ORCL

-- Insert sample user (replace with your Azure CIAM Object ID)
INSERT INTO users (user_id, ciam_object_id, email, first_name, last_name, is_active, created_date)
VALUES (user_seq.NEXTVAL, '5c536403-e869-4bf7-b7af-6d0d46cf07c1', 'customer@perfumeshop.com', 'John', 'Doe', 1, SYSDATE);
COMMIT;

-- Insert sample perfume notes
INSERT INTO perfume_notes (note_id, note_name, description, created_date)
VALUES (perfume_note_seq.NEXTVAL, 'Rose', 'Classic rose fragrance', SYSDATE);
INSERT INTO perfume_notes (note_id, note_name, description, created_date)
VALUES (perfume_note_seq.NEXTVAL, 'Sandalwood', 'Warm sandalwood', SYSDATE);
COMMIT;

-- Insert sample products
INSERT INTO products (product_id, product_name, sku, description, price, stock_quantity, brand, volume_ml, is_active, created_date)
VALUES (product_seq.NEXTVAL, 'Luxury Rose Eau de Parfum', 'LRP-001', 'Premium rose fragrance', 189.99, 50, 'Luxury Brand', 100, 1, SYSDATE);
INSERT INTO products (product_id, product_name, sku, description, price, stock_quantity, brand, volume_ml, is_active, created_date)
VALUES (product_seq.NEXTVAL, 'Sandalwood Elegance', 'SWE-001', 'Elegant sandalwood cologne', 149.99, 100, 'Premium Scents', 75, 1, SYSDATE);
COMMIT;
```

## Troubleshooting

### Build Fails - Dependencies Not Found
```bash
# Clear Gradle cache
rm -rf ~/.gradle/caches

# Rebuild
./gradlew clean build
```

### Database Connection Fails
```bash
# Check Oracle is running
docker ps | grep oracle

# Verify connection string in application.yml
# Check environment variables are set: echo $DB_URL
```

### JWT Token Invalid
1. Ensure token is from your Azure CIAM tenant
2. Check token hasn't expired (`exp` claim)
3. Verify issuer URI matches in application.yml

### Liquibase Migrations Fail
1. Ensure database user has CREATE TABLE, CREATE SEQUENCE permissions
2. Check Oracle is accessible from application
3. Review logs: search for "liquibase" in console output

### 401 Unauthorized on Authenticated Endpoints
1. Ensure Bearer token is included: `Authorization: Bearer <token>`
2. Token must be from configured Azure CIAM issuer
3. Check `sub` claim matches or create user record in database

## Project Structure Overview

```
src/
├── main/java/com/perfumeshop/
│   ├── auth/          → User authentication domain
│   ├── catalog/       → Product catalog domain
│   ├── order/         → Order management domain
│   ├── payment/       → Payment domain (placeholder)
│   └── common/        → Shared configs & entities
│
└── main/resources/
    ├── application.yml        → Spring configuration
    └── db/changelog/          → Liquibase migrations

bruno/                          → API test collection
gradle/                         → Gradle wrapper
```

## Key Endpoints

### Public (No Authentication)
- `GET /api/products` - List products
- `GET /api/products/{id}` - Get product details
- `GET /api/products/sku/{sku}` - Get product by SKU

### Protected (Requires Bearer Token)
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Place new order
- `GET /api/orders/{orderNumber}` - Get order details

## Configuration Files

| File | Purpose |
|------|---------|
| `build.gradle` | Gradle build configuration |
| `settings.gradle` | Gradle project settings |
| `application.yml` | Spring Boot configuration |
| `db/changelog/master.xml` | Database migration master file |
| `bruno/bruno.json` | API collection metadata |

## Environment Variable Reference

| Variable | Purpose | Source |
|----------|---------|--------|
| `DB_URL` | Oracle JDBC connection | Environment / Key Vault |
| `DB_USERNAME` | Database user | Environment / Key Vault |
| `DB_PASSWORD` | Database password | Environment / Key Vault |
| `AZURE_CIAM_ISSUER_URI` | JWT issuer URL | Environment / Key Vault |
| `AZURE_CIAM_JWK_SET_URI` | Public key endpoint | Environment / Key Vault |
| `AZURE_KEYVAULT_ENDPOINT` | Key Vault URL | Environment / Key Vault |

## Common Commands

```bash
# Build
./gradlew clean build

# Run
./gradlew bootRun

# Run tests only
./gradlew test

# View dependency tree
./gradlew dependencies

# Generate Liquibase changelog
./gradlew liquibaseGenerateChangeLog

# Check code
./gradlew check
```

## Next Steps

1. ✓ Build succeeds
2. → Run application and verify startup
3. → Test public endpoints with Bruno
4. → Get JWT token from Azure CIAM
5. → Test authenticated endpoints
6. → Seed sample data
7. → Deploy to Azure (App Service, Container Instances, AKS)

## Support Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Azure Entra ID Integration](https://learn.microsoft.com/en-us/entra/external-id/)
- [Liquibase Documentation](https://docs.liquibase.com/)
- [Oracle JDBC Documentation](https://docs.oracle.com/cd/E17952_01/

---

**Last Updated**: 2026-08-14
