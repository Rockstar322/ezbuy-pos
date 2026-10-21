-- ==============================================================================
-- EZBUY - SMART POS, INVENTARIO, CRM Y FACTURACIÓN ELECTRÓNICA MODULAR (PERÚ)
-- Script de Base de Datos para Supabase (PostgreSQL 15+)
-- Moneda: Soles (PEN - S/)
-- ==============================================================================

-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. TABLA: CONFIGURACIÓN DE FACTURACIÓN Y DATOS DE LA EMPRESA
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.billing_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider VARCHAR(50) NOT NULL DEFAULT 'mock_sunat', -- 'mock_sunat', 'nubefact', 'factiliza', 'custom_rest'
    api_url TEXT,
    api_token TEXT,
    ruc VARCHAR(11) NOT NULL DEFAULT '20609876543',
    business_name TEXT NOT NULL DEFAULT 'BODEGA & MINIMARKET EZBUY S.A.C.',
    commercial_name TEXT DEFAULT 'EZBUY MINIMARKET',
    address TEXT DEFAULT 'Av. Las Gardenias 450, Surco, Lima',
    phone VARCHAR(20) DEFAULT '+51 987 654 321',
    email TEXT DEFAULT 'ventas@ezbuy.pe',
    default_printer VARCHAR(10) DEFAULT '58mm', -- '58mm', '80mm'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. TABLA: PRODUCTOS E INVENTARIO
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Abarrotes',
    barcode VARCHAR(100) UNIQUE NOT NULL,
    cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    sale_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    stock INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER NOT NULL DEFAULT 5,
    unit VARCHAR(20) NOT NULL DEFAULT 'NIU', -- 'NIU' (Unidad), 'KGM' (Kilos), 'LT' (Litros)
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de alta velocidad para escáner y catálogo
CREATE INDEX IF NOT EXISTS idx_products_barcode ON public.products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products USING gin(to_tsvector('spanish', name));
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

-- ------------------------------------------------------------------------------
-- 3. TABLA: CLIENTES (CRM)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doc_type VARCHAR(10) NOT NULL DEFAULT 'DNI', -- 'DNI', 'RUC', 'CE', 'PASAPORTE', 'VARIOS'
    doc_number VARCHAR(20) NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone VARCHAR(20),
    address TEXT,
    total_spent NUMERIC(12, 2) DEFAULT 0.00,
    orders_count INTEGER DEFAULT 0,
    last_visit TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_doc ON public.customers(doc_number);
CREATE INDEX IF NOT EXISTS idx_customers_name ON public.customers USING gin(to_tsvector('spanish', full_name));

-- ------------------------------------------------------------------------------
-- 4. TABLA: VENTAS (SALES / HEADERS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    series_correlative VARCHAR(30) NOT NULL UNIQUE, -- Ej: 'B001-000421', 'F001-000105', 'T001-000998'
    doc_type VARCHAR(20) NOT NULL DEFAULT 'ticket', -- 'ticket', 'boleta', 'factura'
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_doc VARCHAR(20),
    customer_email TEXT,
    payment_method VARCHAR(30) NOT NULL DEFAULT 'efectivo', -- 'efectivo', 'yape', 'plin', 'tarjeta'
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    igv NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- 18% SUNAT
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    cash_tendered NUMERIC(10, 2) DEFAULT 0.00, -- Monto pagado
    change_returned NUMERIC(10, 2) DEFAULT 0.00, -- Vuelto
    billing_status VARCHAR(30) NOT NULL DEFAULT 'local_mock', -- 'local_mock', 'sunat_accepted', 'pending_sync', 'rejected'
    sunat_hash TEXT,
    qr_code_data TEXT,
    pdf_url TEXT,
    sync_status VARCHAR(20) DEFAULT 'synced', -- 'synced', 'pending_sync'
    day_of_week VARCHAR(15), -- 'Lunes', 'Martes', etc. para auditoría rápida
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_created_at ON public.sales(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON public.sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_correlative ON public.sales(series_correlative);
CREATE INDEX IF NOT EXISTS idx_sales_day_of_week ON public.sales(day_of_week);

-- ------------------------------------------------------------------------------
-- 5. TABLA: DETALLE DE VENTA (SALE ITEMS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    barcode VARCHAR(100),
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON public.sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON public.sale_items(product_id);

-- ------------------------------------------------------------------------------
-- 6. TABLA: MOVIMIENTOS DE STOCK (KARDEX / AUDITORÍA)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    movement_type VARCHAR(20) NOT NULL, -- 'in_purchase', 'out_sale', 'adjustment', 'initial'
    quantity INTEGER NOT NULL,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    reference_id UUID, -- Sale ID si fue por venta
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON public.stock_movements(product_id);

-- ------------------------------------------------------------------------------
-- 7. TRIGGER: DESCUENTO AUTOMÁTICO DE STOCK TRAS VENTA
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_sale_stock_deduction()
RETURNS TRIGGER AS $$
DECLARE
    curr_stock INTEGER;
BEGIN
    IF NEW.product_id IS NOT NULL THEN
        SELECT stock INTO curr_stock FROM public.products WHERE id = NEW.product_id FOR UPDATE;
        
        IF curr_stock IS NOT NULL THEN
            UPDATE public.products 
            SET stock = GREATEST(0, stock - NEW.quantity::INTEGER),
                updated_at = NOW()
            WHERE id = NEW.product_id;

            INSERT INTO public.stock_movements (
                product_id,
                movement_type,
                quantity,
                previous_stock,
                new_stock,
                reference_id,
                reason
            ) VALUES (
                NEW.product_id,
                'out_sale',
                NEW.quantity::INTEGER,
                curr_stock,
                GREATEST(0, curr_stock - NEW.quantity::INTEGER),
                NEW.sale_id,
                'Venta en POS registrada'
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sale_stock_deduction ON public.sale_items;
CREATE TRIGGER trg_sale_stock_deduction
AFTER INSERT ON public.sale_items
FOR EACH ROW
EXECUTE FUNCTION public.handle_sale_stock_deduction();

-- ------------------------------------------------------------------------------
-- 8. TRIGGER: ACTUALIZACIÓN DE TOTALES EN CRM CLIENTES
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_customer_crm_update()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.customer_id IS NOT NULL THEN
        UPDATE public.customers
        SET total_spent = total_spent + NEW.total,
            orders_count = orders_count + 1,
            last_visit = NEW.created_at,
            updated_at = NOW()
        WHERE id = NEW.customer_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_customer_crm_update ON public.sales;
CREATE TRIGGER trg_customer_crm_update
AFTER INSERT ON public.sales
FOR EACH ROW
EXECUTE FUNCTION public.handle_customer_crm_update();

-- ------------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.billing_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas para uso en terminales de caja (Anónimo / Autenticado)
CREATE POLICY "Permitir lectura completa de productos" ON public.products FOR SELECT USING (true);
CREATE POLICY "Permitir gestión de productos" ON public.products FOR ALL USING (true);

CREATE POLICY "Permitir lectura de clientes" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Permitir gestión de clientes" ON public.customers FOR ALL USING (true);

CREATE POLICY "Permitir lectura de ventas" ON public.sales FOR SELECT USING (true);
CREATE POLICY "Permitir inserción de ventas" ON public.sales FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualización de ventas" ON public.sales FOR UPDATE USING (true);

CREATE POLICY "Permitir lectura de items de venta" ON public.sale_items FOR SELECT USING (true);
CREATE POLICY "Permitir inserción de items" ON public.sale_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir lectura de kardex" ON public.stock_movements FOR SELECT USING (true);
CREATE POLICY "Permitir inserción de movimientos" ON public.stock_movements FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir configuración de facturación" ON public.billing_configs FOR ALL USING (true);

-- ------------------------------------------------------------------------------
-- 10. DATOS SEMILLA INICIALES (SEED DATA PERÚ EN POSTGRESQL)
-- ------------------------------------------------------------------------------
INSERT INTO public.billing_configs (provider, ruc, business_name, address)
VALUES ('mock_sunat', '20609876543', 'BODEGA & MINIMARKET EZBUY S.A.C.', 'Av. Las Gardenias 450, Surco, Lima')
ON CONFLICT DO NOTHING;

INSERT INTO public.products (name, category, barcode, cost_price, sale_price, stock, min_stock, unit) VALUES
('Conserva de Atún Primor en Aceite 140g', 'Abarrotes', '7750100001234', 3.80, 5.00, 4, 10, 'NIU'),
('Cerveza Pilsen Callao 355ml Lata', 'Licores y Bebidas', '7750200005678', 4.50, 6.00, 18, 12, 'NIU'),
('Galleta Soda San Jorge Paquete Familiar', 'Snacks y Galletas', '7750300009012', 0.90, 1.50, 32, 15, 'NIU'),
('Arroz Costeño Extra 1kg', 'Abarrotes', '7750400003456', 3.90, 4.80, 25, 10, 'KGM'),
('Aceite Vegetal Primor Clásico 1L', 'Abarrotes', '7750500007890', 7.80, 9.50, 8, 10, 'NIU'),
('Leche Evaporada Gloria Azul 400g', 'Lácteos', '7750600001122', 3.40, 4.20, 2, 8, 'NIU'),
('Gaseosa Inca Kola Sabor Original 500ml', 'Licores y Bebidas', '7750700003344', 2.50, 3.50, 15, 10, 'NIU'),
('Detergente en Polvo Bolívar Floral 1kg', 'Limpieza', '7750800005566', 6.20, 7.80, 0, 5, 'KGM'),
('Fideos Don Vittorio Spaghetti 500g', 'Abarrotes', '7750900007788', 2.30, 3.20, 12, 10, 'NIU'),
('Agua Mineral San Luis Sin Gas 625ml', 'Licores y Bebidas', '7751000009900', 1.40, 2.20, 20, 12, 'NIU')
ON CONFLICT (barcode) DO NOTHING;

INSERT INTO public.customers (doc_type, doc_number, full_name, email, phone, address, total_spent, orders_count, last_visit) VALUES
('DNI', '45892134', 'Juan Carlos Pérez Gómez', 'juan.perez@gmail.com', '987654321', 'Av. Los Próceres 452, Surco', 342.50, 14, NOW() - INTERVAL '4 days'),
('DNI', '09874512', 'María Elena Condori Quispe', 'maria.condori@hotmail.com', '991234567', 'Jr. Las Begonias 128, Lince', 189.00, 8, NOW() - INTERVAL '1 day'),
('RUC', '20601234567', 'Inversiones & Multiservicios San Martín S.A.C.', 'contabilidad@sanmartin.pe', '945678123', 'Av. Javier Prado Este 2450, San Borja', 890.00, 6, NOW() - INTERVAL '2 days'),
('DNI', '71239845', 'Rosa Luz Mendoza Bravo', 'rosita.mendoza@yahoo.com', '963852741', 'Calle Grau 312, Miraflores', 115.00, 5, NOW() - INTERVAL '3 days'),
('DNI', '42315678', 'Carlos Alberto Quispe Huamán', 'carlos.quispe@gmail.com', '912349876', 'Av. Colonial 890, Callao', 245.80, 11, NOW() - INTERVAL '5 days')
ON CONFLICT (doc_number) DO NOTHING;
