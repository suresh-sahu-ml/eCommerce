-- Add discount fields to products table
ALTER TABLE products ADD COLUMN discount_type VARCHAR(20);
ALTER TABLE products ADD COLUMN discount_value DECIMAL(10, 2);
ALTER TABLE products ADD COLUMN is_discount_active CHAR(1) DEFAULT '0';

-- Update null values to false
UPDATE products SET is_discount_active = '0' WHERE is_discount_active IS NULL;

-- Add comments
COMMENT ON COLUMN products.discount_type IS 'Discount type: FIXED or PERCENTAGE';
COMMENT ON COLUMN products.discount_value IS 'Discount value - amount in rupees for FIXED, percentage for PERCENTAGE';
COMMENT ON COLUMN products.is_discount_active IS 'Whether the discount is currently active';
