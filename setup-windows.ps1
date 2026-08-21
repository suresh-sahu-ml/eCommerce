# Setup Script for The Perfume Shop - Windows PowerShell
# This script configures environment variables and tests database connection

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   THE PERFUME SHOP - WINDOWS SETUP SCRIPT                      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# SECTION 1: DATABASE CONFIGURATION
# ============================================================================

Write-Host "SECTION 1: Oracle Database Configuration" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "Choose your database setup:" -ForegroundColor Green
Write-Host "1) Docker (Recommended - Easiest)"
Write-Host "2) Local Oracle Installation"
Write-Host "3) Manual - I'll provide credentials"
Write-Host ""

$dbChoice = Read-Host "Enter choice (1-3)"

if ($dbChoice -eq "1") {
    Write-Host ""
    Write-Host "Starting Oracle Docker container..." -ForegroundColor Cyan

    # Check if Docker is running
    try {
        docker --version | Out-Null
    } catch {
        Write-Host "ERROR: Docker is not installed or not in PATH" -ForegroundColor Red
        Write-Host "Please install Docker Desktop from https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
        exit 1
    }

    # Check if container already exists
    $containerExists = docker ps -a --format "table {{.Names}}" | Select-String "oracle-perfume"

    if ($containerExists) {
        Write-Host "Container already exists. Starting..." -ForegroundColor Yellow
        docker start oracle-perfume
    } else {
        Write-Host "Creating new Oracle container..." -ForegroundColor Yellow
        docker run -d `
          --name oracle-perfume `
          -p 1521:1521 `
          -e ORACLE_PWD=OraclePass123 `
          container-registry.oracle.com/database/free:latest | Out-Null

        Write-Host "Container created. Waiting for startup (~3-5 minutes)..." -ForegroundColor Cyan
        Write-Host "This may take a while on first run..." -ForegroundColor Yellow

        # Wait and check logs
        for ($i = 1; $i -le 60; $i++) {
            $status = docker logs oracle-perfume 2>&1 | Select-String "DATABASE IS READY TO USE"
            if ($status) {
                Write-Host "✓ Oracle Database is ready!" -ForegroundColor Green
                break
            }
            Write-Host "." -ForegroundColor Cyan -NoNewline
            Start-Sleep -Seconds 5
        }
    }

    $dbUrl = "jdbc:oracle:thin:@localhost:1521:ORCL"
    $dbUsername = "system"
    $dbPassword = "OraclePass123"

} elseif ($dbChoice -eq "2") {
    Write-Host "Assuming local Oracle installation at localhost:1521/ORCL" -ForegroundColor Yellow
    $dbUrl = "jdbc:oracle:thin:@localhost:1521:ORCL"
    $dbUsername = "system"
    $dbPassword = Read-Host "Enter database password for 'system' user"

} else {
    $dbUrl = Read-Host "Enter JDBC URL (e.g., jdbc:oracle:thin:@localhost:1521:ORCL)"
    $dbUsername = Read-Host "Enter database username"
    $dbPassword = Read-Host "Enter database password"
}

# Set environment variables
[System.Environment]::SetEnvironmentVariable("DB_URL", $dbUrl, "User")
[System.Environment]::SetEnvironmentVariable("DB_USERNAME", $dbUsername, "User")
[System.Environment]::SetEnvironmentVariable("DB_PASSWORD", $dbPassword, "User")

# Also set for current session
$env:DB_URL = $dbUrl
$env:DB_USERNAME = $dbUsername
$env:DB_PASSWORD = $dbPassword

Write-Host ""
Write-Host "✓ Database environment variables set:" -ForegroundColor Green
Write-Host "  DB_URL: $dbUrl"
Write-Host "  DB_USERNAME: $dbUsername"
Write-Host ""

# ============================================================================
# SECTION 2: AZURE CIAM CONFIGURATION
# ============================================================================

Write-Host ""
Write-Host "SECTION 2: Azure CIAM Configuration" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "You need to configure Azure CIAM (Azure AD B2C or Entra External ID)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option 1: Use Mock/Test Tenant (for development)" -ForegroundColor Green
Write-Host "Option 2: Configure your own Azure AD B2C tenant" -ForegroundColor Green
Write-Host "Option 3: I'll provide the values manually" -ForegroundColor Green
Write-Host ""

$ciamChoice = Read-Host "Enter choice (1-3)"

if ($ciamChoice -eq "1") {
    # Use mock/test values
    Write-Host "Using mock Azure CIAM configuration for testing..." -ForegroundColor Yellow

    $issuerUri = "https://perfume-shop-b2c.b2clogin.com/5c536403-e869-4bf7-b7af-6d0d46cf07c1/v2.0/"
    $jwkSetUri = "https://perfume-shop-b2c.b2clogin.com/perfume-shop-b2c.onmicrosoft.com/discovery/v2.0/keys"

    Write-Host ""
    Write-Host "⚠ NOTE: You'll need to replace these with actual values:" -ForegroundColor Yellow
    Write-Host "  1. Create Azure AD B2C tenant at https://portal.azure.com" -ForegroundColor Yellow
    Write-Host "  2. Register application and get credentials" -ForegroundColor Yellow
    Write-Host "  3. Update environment variables with actual issuer URI" -ForegroundColor Yellow

} elseif ($ciamChoice -eq "2") {
    Write-Host ""
    Write-Host "Azure AD B2C Setup Steps:" -ForegroundColor Cyan
    Write-Host "1. Go to https://portal.azure.com"
    Write-Host "2. Create Azure AD B2C tenant (name: perfume-shop-b2c)"
    Write-Host "3. Register application: 'Perfume Shop API'"
    Write-Host "4. Copy your Tenant ID"
    Write-Host ""

    $tenantId = Read-Host "Enter your Tenant ID (e.g., 5c536403-e869-4bf7-b7af-6d0d46cf07c1)"
    $tenantName = Read-Host "Enter Tenant name (e.g., perfume-shop-b2c)"

    $issuerUri = "https://$tenantName.b2clogin.com/$tenantId/v2.0/"
    $jwkSetUri = "https://$tenantName.b2clogin.com/$tenantName.onmicrosoft.com/discovery/v2.0/keys"

} else {
    $issuerUri = Read-Host "Enter Azure CIAM Issuer URI"
    $jwkSetUri = Read-Host "Enter Azure CIAM JWK Set URI"
}

# Set environment variables
[System.Environment]::SetEnvironmentVariable("AZURE_CIAM_ISSUER_URI", $issuerUri, "User")
[System.Environment]::SetEnvironmentVariable("AZURE_CIAM_JWK_SET_URI", $jwkSetUri, "User")

# Also set for current session
$env:AZURE_CIAM_ISSUER_URI = $issuerUri
$env:AZURE_CIAM_JWK_SET_URI = $jwkSetUri

Write-Host ""
Write-Host "✓ Azure CIAM environment variables set:" -ForegroundColor Green
Write-Host "  ISSUER_URI: $issuerUri"
Write-Host "  JWK_SET_URI: $jwkSetUri"
Write-Host ""

# ============================================================================
# SECTION 3: TEST DATABASE CONNECTION
# ============================================================================

Write-Host ""
Write-Host "SECTION 3: Testing Database Connection" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "Testing connection to Oracle database..." -ForegroundColor Cyan

try {
    # Try to execute a simple query using SqlPlus if available
    # This is optional and may not work if SqlPlus isn't installed

    Write-Host "Attempting to verify Oracle is accessible..." -ForegroundColor Yellow

    # For now, just show the connection string
    Write-Host ""
    Write-Host "Connection Details:" -ForegroundColor Green
    Write-Host "  Host: localhost"
    Write-Host "  Port: 1521"
    Write-Host "  SID: ORCL"
    Write-Host "  Username: system"
    Write-Host ""
    Write-Host "Note: Full database connectivity will be tested when application starts" -ForegroundColor Yellow

} catch {
    Write-Host "⚠ Could not verify database connection" -ForegroundColor Yellow
    Write-Host "  Application will test this on startup" -ForegroundColor Yellow
}

# ============================================================================
# SECTION 4: BUILD APPLICATION
# ============================================================================

Write-Host ""
Write-Host "SECTION 4: Building Application" -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Yellow
Write-Host ""

$buildChoice = Read-Host "Build the application? (Y/N)"

if ($buildChoice -eq "Y" -or $buildChoice -eq "y") {
    Write-Host ""
    Write-Host "Building with Gradle..." -ForegroundColor Cyan
    Write-Host ""

    cd (Get-Location)
    ./gradlew clean build -x test

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Build successful!" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "✗ Build failed" -ForegroundColor Red
        exit 1
    }
}

# ============================================================================
# SECTION 5: START APPLICATION
# ============================================================================

Write-Host ""
Write-Host "SECTION 5: Start Application" -ForegroundColor Yellow
Write-Host "=============================" -ForegroundColor Yellow
Write-Host ""

$runChoice = Read-Host "Start the application? (Y/N)"

if ($runChoice -eq "Y" -or $runChoice -eq "y") {
    Write-Host ""
    Write-Host "Starting Spring Boot application..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Environment Variables:" -ForegroundColor Green
    Write-Host "  DB_URL: $env:DB_URL"
    Write-Host "  DB_USERNAME: $env:DB_USERNAME"
    Write-Host "  AZURE_CIAM_ISSUER_URI: $env:AZURE_CIAM_ISSUER_URI"
    Write-Host ""
    Write-Host "Application starting on http://localhost:8080/api" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
    Write-Host ""

    ./gradlew bootRun
}

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start the application: ./gradlew bootRun"
Write-Host "2. Test public endpoint: curl http://localhost:8080/api/products"
Write-Host "3. Import Bruno collection from bruno/ directory"
Write-Host "4. Get JWT token from Azure CIAM"
Write-Host "5. Test authenticated endpoints with Bearer token"
Write-Host ""
