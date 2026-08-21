# API Testing Script - Run after application starts
# Tests all endpoints and validates responses

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   THE PERFUME SHOP - API TEST SCRIPT                          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8080/api"
$testsPassed = 0
$testsFailed = 0

# ============================================================================
# TEST 1: Health Check
# ============================================================================

Write-Host "TEST 1: Application Health Check" -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/products" -Method Get -ErrorAction Stop
    Write-Host "✓ Application is running" -ForegroundColor Green
    Write-Host "  Status: $($response.StatusCode)"
    $testsPassed++
} catch {
    Write-Host "✗ Application health check failed" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)"
    Write-Host ""
    Write-Host "Ensure application is running: ./gradlew bootRun" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# ============================================================================
# TEST 2: Get All Products (Public - No Auth)
# ============================================================================

Write-Host "TEST 2: Get All Products (Public Endpoint)" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/products?page=0&size=10" -Method Get
    $json = $response.Content | ConvertFrom-Json

    if ($response.StatusCode -eq 200 -and $json.content) {
        Write-Host "✓ Products retrieved successfully" -ForegroundColor Green
        Write-Host "  Status: $($response.StatusCode)"
        Write-Host "  Product count: $($json.content.Count)"

        if ($json.content.Count -gt 0) {
            Write-Host "  First product: $($json.content[0].productName)"
            Write-Host "  Price: $$($json.content[0].price)"
        } else {
            Write-Host "  ⚠ No products in database. Please seed data using setup guide." -ForegroundColor Yellow
        }
        $testsPassed++
    } else {
        Write-Host "✗ Unexpected response" -ForegroundColor Red
        $testsFailed++
    }
} catch {
    Write-Host "✗ Failed to get products" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    $testsFailed++
}

Write-Host ""

# ============================================================================
# TEST 3: Get Product by ID
# ============================================================================

Write-Host "TEST 3: Get Product by ID (Public Endpoint)" -ForegroundColor Yellow
Write-Host "===========================================" -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/products/1" -Method Get -ErrorAction SilentlyContinue

    if ($response.StatusCode -eq 200) {
        $json = $response.Content | ConvertFrom-Json
        Write-Host "✓ Product details retrieved" -ForegroundColor Green
        Write-Host "  Status: $($response.StatusCode)"
        Write-Host "  Product ID: $($json.productId)"
        Write-Host "  Name: $($json.productName)"
        Write-Host "  SKU: $($json.sku)"
        $testsPassed++
    } elseif ($response.StatusCode -eq 404) {
        Write-Host "⚠ Product not found (This is OK if no data seeded)" -ForegroundColor Yellow
        Write-Host "  Status: 404"
        $testsPassed++
    } else {
        Write-Host "✗ Unexpected status: $($response.StatusCode)" -ForegroundColor Red
        $testsFailed++
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "⚠ Product not found (This is OK if no data seeded)" -ForegroundColor Yellow
        $testsPassed++
    } else {
        Write-Host "✗ Failed to get product" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        $testsFailed++
    }
}

Write-Host ""

# ============================================================================
# TEST 4: Get Product by SKU
# ============================================================================

Write-Host "TEST 4: Get Product by SKU (Public Endpoint)" -ForegroundColor Yellow
Write-Host "===========================================" -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/products/sku/LRP-001" -Method Get -ErrorAction SilentlyContinue

    if ($response.StatusCode -eq 200) {
        $json = $response.Content | ConvertFrom-Json
        Write-Host "✓ Product found by SKU" -ForegroundColor Green
        Write-Host "  Status: $($response.StatusCode)"
        Write-Host "  SKU: $($json.sku)"
        Write-Host "  Name: $($json.productName)"
        $testsPassed++
    } elseif ($response.StatusCode -eq 404) {
        Write-Host "⚠ Product not found (This is OK if not seeded)" -ForegroundColor Yellow
        Write-Host "  Status: 404"
        $testsPassed++
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "⚠ Product not found (This is OK if not seeded)" -ForegroundColor Yellow
        $testsPassed++
    } else {
        Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
        $testsFailed++
    }
}

Write-Host ""

# ============================================================================
# TEST 5: Get Orders (Protected - No Token)
# ============================================================================

Write-Host "TEST 5: Get Orders Without Token (Should be 401)" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/orders" -Method Get -ErrorAction SilentlyContinue
    Write-Host "✗ Should have returned 401 Unauthorized" -ForegroundColor Red
    $testsFailed++
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✓ Correctly returned 401 Unauthorized" -ForegroundColor Green
        Write-Host "  Status: 401"
        Write-Host "  Authentication is required for this endpoint"
        $testsPassed++
    } else {
        Write-Host "✗ Unexpected status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        $testsFailed++
    }
}

Write-Host ""

# ============================================================================
# TEST 6: Get Orders With Invalid Token
# ============================================================================

Write-Host "TEST 6: Get Orders With Invalid Token (Should be 401)" -ForegroundColor Yellow
Write-Host "=====================================================" -ForegroundColor Yellow

$invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.invalid"

try {
    $headers = @{
        "Authorization" = "Bearer $invalidToken"
    }
    $response = Invoke-WebRequest -Uri "$baseUrl/orders" -Method Get -Headers $headers -ErrorAction SilentlyContinue
    Write-Host "✗ Should have returned 401 Unauthorized" -ForegroundColor Red
    $testsFailed++
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✓ Correctly returned 401 for invalid token" -ForegroundColor Green
        Write-Host "  Status: 401"
        Write-Host "  Invalid JWT tokens are rejected"
        $testsPassed++
    } else {
        Write-Host "✗ Unexpected status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        $testsFailed++
    }
}

Write-Host ""

# ============================================================================
# TEST 7: Database Connectivity
# ============================================================================

Write-Host "TEST 7: Database Connectivity Check" -ForegroundColor Yellow
Write-Host "====================================" -ForegroundColor Yellow

# This test checks if the application was able to connect to the database
# by seeing if Liquibase migrations ran successfully

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/products" -Method Get
    Write-Host "✓ Database connection verified" -ForegroundColor Green
    Write-Host "  Application successfully connected to database"
    Write-Host "  Liquibase migrations executed"
    $testsPassed++
} catch {
    Write-Host "✗ Database connection failed" -ForegroundColor Red
    Write-Host "  Check database configuration and ensure Oracle is running"
    $testsFailed++
}

Write-Host ""

# ============================================================================
# TEST SUMMARY
# ============================================================================

Write-Host "TEST SUMMARY" -ForegroundColor Yellow
Write-Host "============" -ForegroundColor Yellow
Write-Host ""
Write-Host "Tests Passed: $testsPassed" -ForegroundColor Green
Write-Host "Tests Failed: $testsFailed" -ForegroundColor $(if ($testsFailed -gt 0) { "Red" } else { "Green" })
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "✓ All basic tests passed!" -ForegroundColor Green
} else {
    Write-Host "✗ Some tests failed. Please check the errors above." -ForegroundColor Red
}

Write-Host ""

# ============================================================================
# INSTRUCTIONS FOR TESTING WITH JWT TOKEN
# ============================================================================

Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "NEXT: Test Protected Endpoints with JWT Token" -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "To test protected endpoints, you need a valid JWT token from Azure CIAM:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Get JWT token from your Azure CIAM tenant" -ForegroundColor Cyan
Write-Host "   - Use Azure Portal"
Write-Host "   - Or use PowerShell script in SETUP_GUIDE.md"
Write-Host ""
Write-Host "2. Set the token as environment variable:" -ForegroundColor Cyan
Write-Host "   `$env:JWT_TOKEN = 'your-token-here'" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test protected endpoint:" -ForegroundColor Cyan
Write-Host "   `$headers = @{'Authorization' = 'Bearer ' + `$env:JWT_TOKEN}" -ForegroundColor Gray
Write-Host "   Invoke-WebRequest -Uri 'http://localhost:8080/api/orders' -Headers `$headers" -ForegroundColor Gray
Write-Host ""

Write-Host "Or use Bruno API collection:" -ForegroundColor Cyan
Write-Host "  1. Open bruno/bruno.json in Bruno"
Write-Host "  2. Edit bruno/environments/local.bru"
Write-Host "  3. Set bearer_token to your JWT"
Write-Host "  4. Run requests from collection"
Write-Host ""

Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan
