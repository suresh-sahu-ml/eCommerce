# The Perfume Shop - Spring Boot 3.x Backend

A luxury e-commerce backend service built with Spring Boot 3.4.1, Java 21, and Gradle 8.5.

## Project Overview

This is a stateless, microservice-ready Spring Boot monolith organized by domain (package-by-feature) with comprehensive security, database management, and API testing capabilities.

### Technology Stack

- **Language**: Java 21
- **Framework**: Spring Boot 3.4.1
- **Build Tool**: Gradle 8.5 (Groovy DSL)
- **Database**: Oracle 19c/21c
- **Migrations**: Liquibase
- **Security**: Keycloak with OAuth2 JWT validation
- **Secrets Management**: Environment variables (can be extended to HashiCorp Vault)
- **API Testing**: Bruno

## Project Structure

```
perfume-shop/
├── src/main/java/com/perfumeshop/
│   ├── PerfumeShopApplication.java              # Main Spring Boot application
│   ├── auth/                                     # Authentication domain
│   │   ├── entity/User.java                    # User entity (CIAM Object ID as PK)
│   │   └── repository/UserRepository.java      # User JPA repository
│   ├── catalog/                                  # Product catalog domain
│   │   ├── entity/Product.java                 # Product entity
│   │   ├── entity/PerfumeNote.java             # Perfume note characteristics
│   │   ├── repository/ProductRepository.java   # Product JPA repository
│   │   ├── repository/PerfumeNoteRepository.java
│   │   ├── controller/ProductController.java   # Product REST API
│   │   └── dto/ProductResponse.java
│   ├── order/                                    # Order management domain
│   │   ├── entity/Cart.java                    # Shopping cart
│   │   ├── entity/CartItem.java
│   │   ├── entity/Order.java
│   │   ├── entity/OrderItem.java
│   │   ├── repository/CartRepository.java
│   │   ├── repository/OrderRepository.java
│   │   ├── controller/OrderController.java     # Order REST API
│   │   ├── dto/OrderResponse.java
│   │   └── dto/PlaceOrderRequest.java
│   ├── payment/                                  # Payment domain (placeholder)
│   └── common/
│       ├── config/SecurityConfig.java          # OAuth2 Resource Server config
│       ├── config/AzureCiamJwtDecoder.java    # JWT decoder for Azure CIAM
│       ├── audit/BaseEntity.java               # JPA audit base (created_date, last_modified_date)
│
├── src/main/resources/
│   ├── application.yml                          # Spring configuration (NO plaintext secrets)
│   └── db/changelog/
│       ├── master.xml                           # Liquibase master changelog
│       ├── 001_users_schema.xml
│       ├── 002_products_schema.xml
│       ├── 003_perfume_notes_schema.xml
│       ├── 004_product_notes_schema.xml
│       ├── 005_cart_schema.xml
│       ├── 006_cart_items_schema.xml
│       ├── 007_orders_schema.xml
│       └── 008_order_items_schema.xml
│
├── bruno/                                       # API testing collection
│   ├── bruno.json
│   ├── environments/local.bru                   # Local dev environment
│   └── requests/
│       ├── products/
│       │   ├── get_all_products.bru
│       │   └── get_product_by_id.bru
│       └── orders/
│           ├── place_order.bru
│           ├── get_user_orders.bru
│           └── get_order_by_number.bru
│
├── gradle/wrapper/gradle-wrapper.properties
├── build.gradle                                 # Gradle build configuration
├── settings.gradle                              # Gradle settings
├── gradlew                                      # Gradle wrapper (Unix/Linux)
└── gradlew.bat                                  # Gradle wrapper (Windows)
```

## Database Schema

### Sequences
- `user_seq` - User ID generator
- `perfume_note_seq` - Perfume note ID generator
- `product_seq` - Product ID generator
- `cart_seq` - Cart ID generator
- `cart_item_seq` - Cart item ID generator
- `order_seq` - Order ID generator
- `order_item_seq` - Order item ID generator

### Tables

**users** - User profiles linked to Azure CIAM
- `user_id` (PK, SEQUENCE)
- `ciam_object_id` (UNIQUE, NOT NULL) - Azure CIAM "sub" claim
- `email` (UNIQUE, NOT NULL)
- `first_name`, `last_name`, `phone_number`
- `is_active`
- `created_date`, `last_modified_date` (audit)

**products** - Perfume products
- `product_id` (PK, SEQUENCE)
- `sku` (UNIQUE, NOT NULL)
- `product_name`, `description`
- `price` (NUMBER 10,2)
- `stock_quantity`
- `brand`, `volume_ml`
- `is_active`
- `created_date`, `last_modified_date` (audit)

**perfume_notes** - Fragrance characteristics
- `note_id` (PK, SEQUENCE)
- `note_name` (UNIQUE)
- `description`

**product_notes** - Many-to-many: products ↔ perfume notes

**cart** - Shopping carts
- `cart_id` (PK, SEQUENCE)
- `user_id` (FK → users)

**cart_items** - Items in shopping carts
- `cart_item_id` (PK, SEQUENCE)
- `cart_id` (FK → cart)
- `product_id` (FK → products)
- `quantity`

**orders** - Customer orders
- `order_id` (PK, SEQUENCE)
- `order_number` (UNIQUE)
- `user_id` (FK → users)
- `total_amount` (NUMBER 10,2)
- `status` (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED, REFUNDED)
- `shipping_address`
- `created_date`, `last_modified_date` (audit)

**order_items** - Items in orders
- `order_item_id` (PK, SEQUENCE)
- `order_id` (FK → orders, CASCADE)
- `product_id` (FK → products)
- `quantity`
- `unit_price` (NUMBER 10,2)
- `line_total` (NUMBER 10,2)

## Security Architecture

### OAuth2 Resource Server Configuration
- **Issuer**: Keycloak OIDC Provider
- **Token Validation**: JWT with RS256 signature verification
- **Stateless**: No session storage, each request contains auth info
- **User Linking**: Keycloak User ID (JWT "sub" claim) uniquely identifies users

### Secret Management
All sensitive configurations are managed through:
- **Environment variables** for development
- **Docker secrets** or **HashiCorp Vault** for production
- Database connection credentials (URL, username, password)
- Keycloak issuer URI and JWK set URI

**No plaintext secrets in application.yml** - All values are injected from environment at startup.

### JWT Token Structure (Example from Keycloak)
```json
{
  "sub": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",  // Keycloak User ID (PK in users table)
  "email": "customer@perfumeshop.com",
  "email_verified": true,
  "name": "Customer Name",
  "given_name": "Customer",
  "family_name": "Name",
  "iat": 1724575707,
  "exp": 1724579307,
  "iss": "http://localhost:8180/realms/perfume-shop"
}
```

## REST API Endpoints

### Public Endpoints (No Auth Required)
- `GET /api/products` - List all products (paginated)
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/sku/{sku}` - Get product by SKU

### Authenticated Endpoints (Bearer Token Required)
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Place a new order
- `GET /api/orders/{orderNumber}` - Get specific order

## Configuration via Environment Variables

Set these environment variables for the application to connect properly:

```bash
# Database Configuration
DB_URL=jdbc:oracle:thin:@localhost:1521:ORCL
DB_USERNAME=system
DB_PASSWORD=OraclePass123

# Keycloak Configuration
KEYCLOAK_ISSUER_URI=http://localhost:8180/realms/perfume-shop
KEYCLOAK_JWK_SET_URI=http://localhost:8180/realms/perfume-shop/protocol/openid-connect/certs
```

### application.yml Configuration

The application.yml uses property placeholders for all secrets:
- `${DB_URL}` - Oracle JDBC connection string
- `${DB_USERNAME}` - Database user
- `${DB_PASSWORD}` - Database password
- `${KEYCLOAK_ISSUER_URI}` - Keycloak token issuer
- `${KEYCLOAK_JWK_SET_URI}` - Public key set for JWT validation

## Building and Running

### Build the Project
```bash
# Using the wrapper (recommended)
./gradlew clean build

# Or with system Gradle
gradle clean build
```

### Run the Application
```bash
# Using Gradle
./gradlew bootRun

# Or run the JAR directly
java -jar build/libs/perfume-shop-1.0.0.jar
```

### Default Port
- Server runs on `http://localhost:8080`
- Context path: `/api`
- Full base URL: `http://localhost:8080/api`

## API Testing with Bruno

Bruno API collection is pre-configured in the `bruno/` directory.

### Import Collection
1. Open Bruno
2. Import collection from `bruno/`
3. Select `local` environment
4. Set Bearer token in `environments/local.bru`

### Mock Bearer Token
A sample JWT token is included in `environments/local.bru`. Replace with an actual token from your Azure CIAM tenant:
```groovy
vars {
  base_url: http://localhost:8080/api
  bearer_token: <your-actual-jwt-token>
}
```

### Pre-configured Requests
- **Products**
  - Get all products (paginated)
  - Get product by ID
  
- **Orders** (Authenticated)
  - Place order
  - Get user's orders
  - Get order by number

## Liquibase Migrations

All database schema changes are versioned in Liquibase XML changelogs:

```bash
# Migrations run automatically on application startup
# Check logs for "liquibase.changeLogHistory" table creation and changeset execution
```

### Manual Migration Commands
```bash
# Generate Liquibase changelog from existing DB
./gradlew liquibaseGenerateChangeLog

# Validate current DB against changelogs
./gradlew liquibaseStatus
```

## Entity Relationships

```
User (1) ──────────────── (1) Cart
   │                          │
   │                          └─── (N) CartItem ──── (N) Product
   │
   └─────────────────────── (N) Order
                                  │
                                  └─── (N) OrderItem ──── (N) Product

Product (N) ──────────────────── (M) PerfumeNote
```

## Key Design Decisions

1. **No Password Storage**: Users are identified by Azure CIAM Object ID (sub claim)
2. **Stateless Authentication**: No session affinity required; scales horizontally
3. **BigDecimal for Money**: All prices and amounts use BigDecimal to avoid floating-point errors
4. **Audit Columns**: Every entity tracks creation and modification timestamps
5. **Lazy Loading**: Relationships use LAZY fetch to optimize query performance
6. **Sequences**: Oracle sequences for all ID generation (compatible with sharding)
7. **Feature-Organized Packages**: Code grouped by business domain, not technical layer
8. **Azure Key Vault Integration**: No plaintext secrets; all credentials injected at runtime

## Compliance & Security

- ✓ OAuth2 Resource Server with JWT validation
- ✓ Keycloak OIDC integration
- ✓ No plaintext secrets (all from environment variables)
- ✓ JPA Auditing (created_date, last_modified_date on all entities)
- ✓ Input validation (JSR-303 annotations)
- ✓ CSRF disabled (stateless JWT auth)
- ✓ SQL injection prevention (parameterized queries via JPA)
- ✓ Oracle dialect-specific optimizations
- ✓ Self-hosted authentication (full control)

## Next Steps

1. **Configure Azure CIAM**: Set up Azure AD B2C or Entra External ID tenant
2. **Create Azure Key Vault**: Store secrets and grant application access
3. **Set Up Oracle Database**: Create user, schemas, and sequences
4. **Deploy to Azure**: Use Azure App Service, Container Instances, or Kubernetes
5. **Add Payment Gateway**: Implement payment domain (placeholder exists)
6. **Add Tests**: Create integration tests using test containers

## Notes

- Spring Boot automatically validates the Spring context on startup
- Liquibase runs migration scripts before application starts
- JWT tokens are validated against Azure CIAM issuer
- All endpoints return JSON responses
- Error responses follow standard Spring Boot error format

---

**Project Created**: 2026-08-14  
**Spring Boot Version**: 3.4.1  
**Java Version**: 21  
**Gradle Version**: 8.5
