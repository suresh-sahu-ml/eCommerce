# Oracle 21c Free Edition Setup Guide

Using **Oracle 21c Free Edition** container for local development.

## Quick Start (1 Command)

```bash
docker run -d \
  --name oracle-perfume \
  -p 1521:1521 \
  -e ORACLE_PWD=OraclePass123 \
  container-registry.oracle.com/database/free:latest
```

Wait 2-3 minutes, then check:
```bash
docker logs -f oracle-perfume

# When you see: "DATABASE IS READY TO USE!"
```

## Why Oracle 21c Free Edition?

✅ **No License Cost** - Completely free  
✅ **No Login Required** - Public image, no authentication needed  
✅ **Faster Setup** - 2-3 min startup (vs 5+ min for standard)  
✅ **Perfect for Dev** - All features you need for development  
✅ **Easy Docker** - One simple docker run command  
✅ **Production Ready** - Same code runs on enterprise editions  

## Container Details

| Property | Value |
|----------|-------|
| **Image** | `container-registry.oracle.com/database/free:latest` |
| **Port** | 1521 (default Oracle port) |
| **Container Name** | `oracle-perfume` |
| **Admin User** | `system` |
| **Admin Password** | `OraclePass123` (you set this) |
| **SID** | `FREE` (default for free edition) |
| **Database Name** | `FREEPDB1` |
| **Startup Time** | 2-3 minutes |

## Connection Details

```
Host: localhost
Port: 1521
SID: FREE (or FREEPDB1)
Username: system
Password: OraclePass123
```

### JDBC Connection String

```
jdbc:oracle:thin:@localhost:1521/FREEPDB1
```

Or using SID:
```
jdbc:oracle:thin:@localhost:1521:FREE
```

## Full Setup Steps

### Step 1: Pull Image (First Time Only)

```bash
docker pull container-registry.oracle.com/database/free:latest
```

### Step 2: Start Container

```bash
docker run -d \
  --name oracle-perfume \
  -p 1521:1521 \
  -e ORACLE_PWD=OraclePass123 \
  container-registry.oracle.com/database/free:latest
```

### Step 3: Wait for Startup

```bash
# Check logs (Ctrl+C to exit)
docker logs -f oracle-perfume

# Wait for this message:
# "DATABASE IS READY TO USE!"
```

### Step 4: Verify Connection

#### Using sqlplus (if installed)

```bash
sqlplus system/OraclePass123@localhost:1521/FREEPDB1

# Or using SID:
sqlplus system/OraclePass123@localhost:1521:FREE

# If connected, you'll see SQL> prompt
# Type: SELECT VERSION FROM V$INSTANCE;
# Type: EXIT
```

#### Using DBeaver (GUI)

1. Download DBeaver: https://dbeaver.io/download/
2. Create new connection:
   - **Database Type:** Oracle
   - **Host:** localhost
   - **Port:** 1521
   - **Database/SID:** FREEPDB1 (or FREE)
   - **Username:** system
   - **Password:** OraclePass123
3. Test connection → Click "Finish"

#### Using curl (Just verify port)

```bash
curl -v telnet://localhost:1521
# Should connect (then close)
```

## Application Configuration

Update `application.yml`:

```yaml
spring:
  jpa:
    database-platform: org.hibernate.dialect.Oracle21cDialect
  datasource:
    url: jdbc:oracle:thin:@localhost:1521/FREEPDB1
    username: system
    password: OraclePass123
    driver-class-name: oracle.jdbc.OracleDriver
```

Or use environment variables:

```powershell
$env:DB_URL = "jdbc:oracle:thin:@localhost:1521/FREEPDB1"
$env:DB_USERNAME = "system"
$env:DB_PASSWORD = "OraclePass123"
```

## Common Commands

| Task | Command |
|------|---------|
| **View logs** | `docker logs -f oracle-perfume` |
| **Stop container** | `docker stop oracle-perfume` |
| **Start container** | `docker start oracle-perfume` |
| **Remove container** | `docker rm oracle-perfume` |
| **Get container IP** | `docker inspect oracle-perfume \| grep IPAddress` |
| **Connect with sqlplus** | `sqlplus system/OraclePass123@localhost:1521/FREEPDB1` |
| **View resource usage** | `docker stats oracle-perfume` |

## Troubleshooting

### Container Won't Start

```bash
# Check error logs
docker logs oracle-perfume

# If port 1521 already in use
netstat -ano | findstr 1521  # Windows
lsof -i :1521                # Mac/Linux

# Kill process on port 1521
taskkill /PID <PID> /F       # Windows
kill -9 <PID>                # Mac/Linux
```

### Connection Refused

```bash
# Verify container is running
docker ps | grep oracle-perfume

# If not running, start it
docker start oracle-perfume

# Wait 2-3 minutes for full startup
docker logs oracle-perfume
```

### Wrong SID/Database Name

**Oracle 21c Free Edition uses:**
- **SID:** `FREE`
- **Pluggable Database (PDB):** `FREEPDB1`

Use one of these in connection string:
```
jdbc:oracle:thin:@localhost:1521:FREE
jdbc:oracle:thin:@localhost:1521/FREEPDB1
```

### Out of Memory

If getting OOM errors:

```bash
# Stop and remove
docker stop oracle-perfume
docker rm oracle-perfume

# Run with memory limit
docker run -d \
  --name oracle-perfume \
  -p 1521:1521 \
  -m 2g \
  -e ORACLE_PWD=OraclePass123 \
  container-registry.oracle.com/database/free:latest
```

## Features in Free Edition

✅ Full SQL and PL/SQL support  
✅ All data types  
✅ JSON support  
✅ XML support  
✅ Partitioning  
✅ Compression  
✅ Encryption  
✅ Backup & Recovery  
✅ Data Guard (read-only)  

## Limitations (Free Edition)

❌ Max 2 GB data (SGA + PGA memory combined)  
❌ Single user (system) - all other users have read-only after 1 hour  
❌ No RAC (Real Application Clusters)  
❌ No Advanced Security options  
❌ Non-production use only (per license)  

**For this project, these limitations don't matter!**

## Seed Sample Data

After connecting:

```sql
-- Insert user
INSERT INTO users (user_id, ciam_object_id, email, first_name, last_name, is_active, created_date)
VALUES (user_seq.NEXTVAL, 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6', 'test@perfumeshop.com', 'Test', 'User', 1, SYSDATE);

-- Insert products
INSERT INTO products (product_id, product_name, sku, price, stock_quantity, is_active, created_date)
VALUES (product_seq.NEXTVAL, 'Luxury Rose Perfume', 'LRP-001', 189.99, 50, 1, SYSDATE);

INSERT INTO products (product_id, product_name, sku, price, stock_quantity, is_active, created_date)
VALUES (product_seq.NEXTVAL, 'Sandalwood Elegance', 'SWE-001', 149.99, 100, 1, SYSDATE);

COMMIT;
```

## Production Deployment

For production, use:
- **Standalone Oracle 21c Enterprise Edition** (licensed)
- **Oracle Autonomous Database** (cloud-managed)
- **Amazon RDS for Oracle** (AWS)
- **Azure Oracle Database** (Azure)

## Quick Reference

```bash
# One-liner setup & start
docker run -d --name oracle-perfume -p 1521:1521 -e ORACLE_PWD=OraclePass123 container-registry.oracle.com/database/free:latest && echo "Waiting..." && sleep 120 && docker logs oracle-perfume | grep "DATABASE IS READY"

# Full connection string for app.yml
jdbc:oracle:thin:@localhost:1521/FREEPDB1

# Environment variables
export DB_URL="jdbc:oracle:thin:@localhost:1521/FREEPDB1"
export DB_USERNAME="system"
export DB_PASSWORD="OraclePass123"

# Test connection
sqlplus system/OraclePass123@localhost:1521/FREEPDB1
```

## Next Steps

1. ✓ Start container with Docker command above
2. ✓ Wait 2-3 minutes
3. ✓ Verify with `docker logs oracle-perfume`
4. → Set environment variables
5. → Start Perfume Shop application
6. → Run tests

## Resources

- **Oracle 21c Free Docker:** https://www.oracle.com/database/technologies/appdev/docker/
- **Oracle 21c Docs:** https://docs.oracle.com/en/database/oracle/oracle-database/21/
- **Oracle JDBC:** https://docs.oracle.com/cd/E11882_01/java.112/e16548/

---

**Questions?** See `SETUP_GUIDE.md` for full setup walkthrough.
