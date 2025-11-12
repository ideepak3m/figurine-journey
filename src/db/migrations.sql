-- Migration: Create e-commerce tables for Figurine Journey
-- Run this in your Supabase SQL Editor

-- =====================================================
-- Table: orders
-- Stores main order information
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    
    -- Customer Information
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    
    -- Shipping Information
    shipping_address TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    is_gta BOOLEAN NOT NULL DEFAULT false,
    
    -- Payment Information
    subtotal NUMERIC(10, 2) NOT NULL,
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed, refunded
    payment_intent_id TEXT, -- Stripe payment intent ID
    
    -- Order Status
    order_status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, in_production, shipped, completed, cancelled
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- =====================================================
-- Table: custom_orders
-- Stores custom order details with AI conversation data
-- (Created BEFORE order_items because it's referenced there)
-- =====================================================
CREATE TABLE IF NOT EXISTS custom_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- n8n Integration
    n8n_session_id TEXT, -- Reference to n8n conversation session
    
    -- Customer Requirements
    customer_notes TEXT,
    photo_urls TEXT[] NOT NULL DEFAULT '{}', -- Array of Supabase Storage URLs
    estimated_price NUMERIC(10, 2) NOT NULL,
    requirements_summary TEXT, -- Summary from AI conversation
    
    -- Status Tracking
    status TEXT NOT NULL DEFAULT 'pending', -- pending, in_review, approved, in_production, completed
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_custom_orders_n8n_session_id ON custom_orders(n8n_session_id);
CREATE INDEX IF NOT EXISTS idx_custom_orders_status ON custom_orders(status);
CREATE INDEX IF NOT EXISTS idx_custom_orders_created_at ON custom_orders(created_at DESC);

-- =====================================================
-- Table: order_items
-- Stores individual items in each order
-- (Created AFTER custom_orders because it references it)
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Product Reference (for standard products)
    asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    
    -- Custom Order Reference (for custom orders)
    custom_order_id UUID REFERENCES custom_orders(id) ON DELETE SET NULL,
    
    -- Item Details (snapshot at time of order)
    item_type TEXT NOT NULL, -- 'standard' or 'custom'
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_asset_id ON order_items(asset_id);
CREATE INDEX IF NOT EXISTS idx_order_items_custom_order_id ON order_items(custom_order_id);

-- =====================================================
-- Function: Auto-update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating updated_at
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_orders_updated_at
    BEFORE UPDATE ON custom_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Function: Generate order number
-- =====================================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_order_number TEXT;
    counter INTEGER := 0;
BEGIN
    LOOP
        new_order_number := 'FJ' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        
        -- Check if order number exists
        IF NOT EXISTS (SELECT 1 FROM orders WHERE order_number = new_order_number) THEN
            EXIT;
        END IF;
        
        counter := counter + 1;
        IF counter > 100 THEN
            RAISE EXCEPTION 'Could not generate unique order number after 100 attempts';
        END IF;
    END LOOP;
    
    RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Enable Row Level Security (RLS)
-- =====================================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_orders ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies (Adjust based on your auth requirements)
-- =====================================================

-- For now, allow all operations (you can restrict later with auth)
CREATE POLICY "Allow all operations on orders" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all operations on order_items" ON order_items FOR ALL USING (true);
CREATE POLICY "Allow all operations on custom_orders" ON custom_orders FOR ALL USING (true);

-- =====================================================
-- Sample Data (Optional - for testing)
-- =====================================================

-- Uncomment to insert sample data
-- INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, shipping_address, postal_code, is_gta, subtotal, shipping_fee, total, payment_status, order_status)
-- VALUES 
--     (generate_order_number(), 'John Doe', 'john@example.com', '416-555-0100', '123 Main St, Toronto, ON', 'M5V 3A8', true, 89.99, 0.00, 89.99, 'paid', 'confirmed');

-- =====================================================
-- Grants (if needed for service role)
-- =====================================================
-- GRANT ALL ON orders TO service_role;
-- GRANT ALL ON order_items TO service_role;
-- GRANT ALL ON custom_orders TO service_role;

-- =====================================================
-- Storage Bucket for Custom Order Photos
-- =====================================================
-- Run this separately in Storage section or via SQL:
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('custom-order-photos', 'custom-order-photos', false);

-- Storage policy for uploading photos
-- CREATE POLICY "Allow public uploads to custom-order-photos"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'custom-order-photos');

-- CREATE POLICY "Allow public reads from custom-order-photos"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'custom-order-photos');
