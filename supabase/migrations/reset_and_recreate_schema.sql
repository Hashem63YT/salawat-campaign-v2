-- ============================================================================
-- Supabase Database Complete Reset and Recreation Script
-- سكريبت إعادة تعيين وإعادة إنشاء قاعدة البيانات الكاملة
-- ============================================================================
--
-- PURPOSE / الهدف:
-- This script drops all existing tables, functions, and policies, then recreates
-- them with the correct architecture where:
-- - App code (lib/salawatStore.ts) handles contribution inserts (with optional names)
-- - RPC function ONLY updates campaign totals atomically (no inserts)
-- - RLS policies allow anonymous read access to campaign stats and anonymous insert access to contributions
-- - Direct client-side UPDATEs on salawat_campaign are blocked; updates only via RPC function
--
-- ⚠️ WARNING / تحذير:
-- This will DELETE ALL existing data in salawat_campaign and contributions tables!
-- سيتم حذف جميع البيانات الموجودة في جداول salawat_campaign و contributions!
--
-- EXECUTION / التنفيذ:
-- 1. Open Supabase Dashboard → SQL Editor
-- 2. Copy entire contents of this file
-- 3. Paste into SQL Editor
-- 4. Click "Run" (or Ctrl+Enter)
-- 5. Wait for "Success" message (2-5 seconds)
--
-- ============================================================================

-- ============================================================================
-- STEP 1: DROP ALL EXISTING OBJECTS
-- الخطوة 1: حذف جميع الكائنات الموجودة
-- ============================================================================

-- Drop tables (CASCADE removes dependent objects like policies)
DROP TABLE IF EXISTS contributions CASCADE;
DROP TABLE IF EXISTS salawat_campaign CASCADE;

-- Drop function with specific signature (CASCADE removes any dependencies)
-- Note: Must specify argument type to avoid "function name is not unique" error
DROP FUNCTION IF EXISTS increment_salawat_stats(bigint) CASCADE;

-- Drop any other versions of the function that might exist (different signatures)
-- This handles edge cases where function was created with different argument types
DO $$
DECLARE
  func_record RECORD;
BEGIN
  FOR func_record IN 
    SELECT oid::regprocedure AS func_name
    FROM pg_proc
    WHERE proname = 'increment_salawat_stats'
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  LOOP
    EXECUTE 'DROP FUNCTION IF EXISTS ' || func_record.func_name || ' CASCADE';
  END LOOP;
END $$;

-- ============================================================================
-- STEP 2: RECREATE TABLES
-- الخطوة 2: إعادة إنشاء الجداول
-- ============================================================================

-- Create salawat_campaign table (global counters)
CREATE TABLE salawat_campaign (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_count BIGINT DEFAULT 0 CHECK (total_count >= 0),
  contribution_count BIGINT DEFAULT 0 CHECK (contribution_count >= 0),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create contributions table (individual submissions)
CREATE TABLE contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,  -- Nullable for anonymous submissions
  amount BIGINT NOT NULL CHECK (amount > 0),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- STEP 3: INSERT INITIAL CAMPAIGN ROW
-- الخطوة 3: إدراج صف الحملة الأولي
-- ============================================================================

-- Ensure a single global counter row exists
INSERT INTO salawat_campaign (total_count, contribution_count) VALUES (0, 0);

-- ============================================================================
-- STEP 4: ENABLE ROW LEVEL SECURITY (RLS)
-- الخطوة 4: تفعيل أمان مستوى الصف (RLS)
-- ============================================================================

ALTER TABLE salawat_campaign ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 5: CREATE RLS POLICIES
-- الخطوة 5: إنشاء سياسات RLS
-- ============================================================================

-- Allow public read access to campaign stats
CREATE POLICY "Public read campaign" ON salawat_campaign
  FOR SELECT
  USING (true);

-- NOTE: No UPDATE policy for salawat_campaign
-- Direct client-side UPDATEs are blocked by RLS.
-- Updates are only allowed via the increment_salawat_stats RPC function,
-- which uses SECURITY DEFINER to bypass RLS and perform updates with elevated privileges.

-- Allow public read access to contributions
CREATE POLICY "Public read contributions" ON contributions
  FOR SELECT
  USING (true);

-- Allow public insert access to contributions (for app code)
CREATE POLICY "Public insert contributions" ON contributions
  FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- STEP 6: CREATE FIXED RPC FUNCTION
-- الخطوة 6: إنشاء دالة RPC المصححة
-- ============================================================================
--
-- KEY FIX / الإصلاح الرئيسي:
-- This function ONLY updates campaign totals atomically.
-- It does NOT insert into contributions table.
-- App code in lib/salawatStore.ts handles contribution inserts separately.
--
-- هذا الدالة تقوم فقط بتحديث إجماليات الحملة بشكل ذري.
-- لا تقوم بإدراج في جدول contributions.
-- كود التطبيق في lib/salawatStore.ts يتعامل مع إدراج المساهمات بشكل منفصل.
--

CREATE OR REPLACE FUNCTION public.increment_salawat_stats(increment_amount bigint)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
DECLARE
  campaign_id uuid;
BEGIN
  -- Get the campaign row ID (should always exist after initial insert)
  campaign_id := (SELECT id FROM public.salawat_campaign LIMIT 1);

  -- Update campaign totals atomically (NO contribution insert here!)
  UPDATE public.salawat_campaign
  SET total_count = total_count + increment_amount,
      contribution_count = contribution_count + 1,
      updated_at = now()
  WHERE id = campaign_id;

  -- Return updated stats
  RETURN (
    SELECT json_build_object(
      'total_count', total_count,
      'contribution_count', contribution_count
    )
    FROM public.salawat_campaign
    WHERE id = campaign_id
  );
END;
$$;

-- ============================================================================
-- STEP 7: VERIFICATION QUERIES (Optional - uncomment to run)
-- الخطوة 7: استعلامات التحقق (اختياري - قم بإلغاء التعليق للتشغيل)
-- ============================================================================

-- Verify tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('salawat_campaign', 'contributions');

-- Verify initial campaign row
-- SELECT * FROM salawat_campaign;

-- Verify contributions table is empty
-- SELECT COUNT(*) FROM contributions;

-- Verify function exists
-- SELECT proname FROM pg_proc WHERE proname = 'increment_salawat_stats';

-- Verify policies exist
-- SELECT schemaname, tablename, policyname FROM pg_policies 
-- WHERE tablename IN ('salawat_campaign', 'contributions');

-- ============================================================================
-- END OF SCRIPT
-- نهاية السكريبت
-- ============================================================================

