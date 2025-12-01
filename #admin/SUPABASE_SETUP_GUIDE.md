# دليل إعداد Supabase / Supabase Setup Guide

## Overview / نظرة عامة

This guide will walk you through setting up Supabase for the Salawat Campaign application. Supabase provides the database and real-time functionality needed for tracking collective Salawat counts.

سيقودك هذا الدليل خلال إعداد Supabase لتطبيق حملة الصلاة على النبي. يوفر Supabase قاعدة البيانات والوظائف في الوقت الفعلي اللازمة لتتبع عدد الصلوات الجماعية.

---

## Prerequisites / المتطلبات

Before starting, ensure you have:
قبل البدء، تأكد من أن لديك:

- A valid email address for creating a Supabase account
- Basic understanding of databases (helpful but not required)
- Completed Step 3 of `INSTALLATION_GUIDE.md` (installed dependencies)

---

## Step 1: Create Supabase Account / الخطوة 1: إنشاء حساب Supabase

### 1.1 Visit Supabase Website

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign Up"** button
3. You can sign up with:
   - GitHub account (recommended)
   - Google account
   - Email address

### 1.2 Verify Your Email

- If you signed up with email, check your inbox for verification email
- Click the verification link
- You'll be redirected to the Supabase dashboard

**Troubleshooting / حل المشاكل**:
- Check spam/junk folder if email doesn't arrive
- Wait a few minutes and try resending verification email
- Use a different email provider if issues persist

---

## Step 2: Create a New Project / الخطوة 2: إنشاء مشروع جديد

### 2.1 Create Project

1. In the Supabase dashboard, click **"New Project"** button
2. Fill in the project details:

   **Project Name / اسم المشروع**:
   - Enter: `salawat-campaign` (or any name you prefer)
   - This is for your reference only

   **Database Password / كلمة مرور قاعدة البيانات**:
   - Create a strong password (minimum 12 characters)
   - **IMPORTANT**: Save this password securely! You'll need it later
   - Use a password manager to store it

   **Region / المنطقة**:
   - Choose the region closest to your users
   - For Middle East: Select a nearby region (e.g., `West US (N. California)` or `Southeast Asia (Singapore)`)
   - This affects latency and data residency

   **Pricing Plan / خطة التسعير**:
   - Free tier is sufficient for development and small projects
   - Includes: 500 MB database, 1 GB file storage, 2 GB bandwidth

### 2.2 Wait for Project Setup

- Project creation takes 1-2 minutes
- You'll see a progress indicator
- Don't close the browser tab during setup

**What happens during setup / ما يحدث أثناء الإعداد**:
- Database is provisioned
- API endpoints are created
- Authentication is configured
- Storage buckets are initialized

---

## Step 3: Get Your Project Credentials / الخطوة 3: الحصول على بيانات اعتماد المشروع

### 3.1 Navigate to Project Settings

1. Once your project is ready, click on your project name in the dashboard
2. Click on the **Settings** icon (gear icon) in the left sidebar
3. Click on **"API"** in the settings menu

### 3.2 Copy Your Credentials

You'll see two important values:

**Project URL / رابط المشروع**:
- Located under **"Project URL"** section
- Format: `https://xxxxxxxxxxxxx.supabase.co`
- Click the copy icon to copy it

**Anon/Public Key / المفتاح العام**:
- Located under **"Project API keys"** section
- Find the **"anon"** or **"public"** key
- This is safe to use in client-side code
- Click the copy icon to copy it

**⚠️ Important Security Notes / ملاحظات أمنية مهمة**:
- The **anon key** is safe to expose in client-side code (it's public)
- The **service_role key** should NEVER be exposed in client-side code
- Only use the anon key in your `.env.local` file

---

## Step 4: Set Up Database Tables / الخطوة 4: إعداد جداول قاعدة البيانات

### 4.1 Access SQL Editor

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"** button

### 4.2 Create the Salawat Counter Table

Copy and paste the following SQL code into the SQL Editor:

```sql
-- Create table for tracking Salawat count
CREATE TABLE IF NOT EXISTS salawat_counter (
  id BIGSERIAL PRIMARY KEY,
  total_count BIGINT NOT NULL DEFAULT 0,
  contribution_count BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial counter value
INSERT INTO salawat_counter (id, total_count, contribution_count) 
VALUES (1, 0, 0) 
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE salawat_counter ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read the counter
CREATE POLICY "Allow public read access" 
ON salawat_counter 
FOR SELECT 
USING (true);

-- Create policy to allow anyone to increment the counter
CREATE POLICY "Allow public increment" 
ON salawat_counter 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Create a function to increment the counter
CREATE OR REPLACE FUNCTION increment_salawat(amount BIGINT)
RETURNS JSON AS $$
DECLARE
  new_total_count BIGINT;
  new_contribution_count BIGINT;
BEGIN
  -- Validate that amount is positive
  IF amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be a positive integer';
  END IF;
  
  UPDATE salawat_counter 
  SET 
    total_count = total_count + amount,
    contribution_count = contribution_count + 1,
    updated_at = NOW()
  WHERE id = 1
  RETURNING total_count, contribution_count INTO new_total_count, new_contribution_count;
  
  RETURN json_build_object(
    'total_count', new_total_count,
    'contribution_count', new_contribution_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION increment_salawat(BIGINT) TO anon, authenticated;
```

### 4.3 Execute the SQL

1. Click the **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
2. You should see: **"Success. No rows returned"**
3. If you see errors, check:
   - SQL syntax is correct (no typos)
   - You're connected to the correct project
   - You have proper permissions

### 4.4 Verify Table Creation

1. Click **"Table Editor"** in the left sidebar
2. You should see `salawat_counter` table
3. Click on it to view the table
4. You should see one row with `id = 1`, `total_count = 0`, and `contribution_count = 0`

**What this setup does / ما يفعله هذا الإعداد**:
- Creates a table to store the total Salawat count and contribution count
- Sets up Row Level Security (RLS) for security
- Allows public read access (anyone can see the counts)
- Allows public increment (anyone can add to the count)
- Creates a function to safely increment the counter with a custom amount

---

## Step 5: Enable Real-time / الخطوة 5: تفعيل الوقت الفعلي

### 5.1 Enable Realtime for the Table

1. Go to **"Database"** → **"Replication"** in the left sidebar
2. Find `salawat_counter` table in the list
3. Toggle the switch to **ON** for `salawat_counter`
4. This enables real-time updates for the counter

**What this enables / ما يفعله هذا**:
- Your application will receive instant updates when the counter changes
- Multiple users will see the count update in real-time
- No need to refresh the page to see new counts

---

## Step 6: Configure Environment Variables / الخطوة 6: إعداد متغيرات البيئة

### 6.1 Create `.env.local` File

1. In your project root directory, create a file named `.env.local`
2. If the file already exists, open it in your code editor

### 6.2 Add Your Supabase Credentials

Add the following lines to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Replace the placeholders / استبدل العناصر النائبة**:
- Replace `your_project_url_here` with your Project URL from Step 3.2
- Replace `your_anon_key_here` with your anon key from Step 3.2

**Example / مثال**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODU2Nzg5MCwiZXhwIjoxOTU0MTQzODkwfQ.example
```

### 6.3 Verify File Location

Your `.env.local` file should be in the project root:
```
salawat-campaign/
├── .env.local          ← Should be here
├── app/
├── components/
├── lib/
├── package.json
└── ...
```

### 6.4 Important Notes

- ✅ The `.env.local` file is already in `.gitignore` (won't be committed to Git)
- ✅ Never share your credentials publicly
- ✅ Restart your development server after changing `.env.local`
- ✅ Use `NEXT_PUBLIC_` prefix for variables that need to be accessible in the browser

---

## Step 7: Create Supabase Client / الخطوة 7: إنشاء عميل Supabase

### 7.1 Create Client File

Create a new file: `lib/supabase.ts`

### 7.2 Add Client Code

Add the following code to `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**What this does / ما يفعله هذا**:
- Creates a Supabase client instance
- Uses environment variables for configuration
- Exports the client for use throughout your application
- Throws an error if environment variables are missing

---

## Step 8: Test Your Connection / الخطوة 8: اختبار الاتصال

### 8.1 Restart Development Server

1. Stop your development server (if running) with `Ctrl+C`
2. Start it again:
   ```bash
   npm run dev
   ```

### 8.2 Check for Errors

- Check the terminal for any error messages
- If you see "Missing Supabase environment variables", verify your `.env.local` file
- If you see connection errors, verify your credentials

### 8.3 Test Database Connection (Optional)

You can create a simple test file to verify the connection:

Create `test-supabase.ts` in the project root (temporary file):

```typescript
import { supabase } from './lib/supabase'

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('salawat_counter')
      .select('total_count, contribution_count')
      .single()
    
    if (error) {
      console.error('Error:', error)
    } else {
      console.log('✅ Connection successful!')
      console.log('Total count:', data?.total_count)
      console.log('Contribution count:', data?.contribution_count)
    }
  } catch (err) {
    console.error('Connection failed:', err)
  }
}

testConnection()
```

Run it with:
```bash
npx tsx test-supabase.ts
```

**Expected Output / الناتج المتوقع**:
```
✅ Connection successful!
Current count: 0
```

After testing, delete `test-supabase.ts` file.

---

## Step 9: Verify Real-time Setup / الخطوة 9: التحقق من إعداد الوقت الفعلي

### 9.1 Test Real-time Subscription

In your application code, you can test real-time updates:

```typescript
// Example: Subscribe to counter changes
const channel = supabase
  .channel('salawat-counter')
  .on('postgres_changes', 
    { 
      event: 'UPDATE', 
      schema: 'public', 
      table: 'salawat_counter' 
    }, 
    (payload) => {
      console.log('Counter updated!', payload.new)
    }
  )
  .subscribe()
```

This will be implemented in your main application components.

---

## Common Issues and Solutions / المشاكل الشائعة والحلول

### Issue 1: "Missing Supabase environment variables" Error

**Error**: `Error: Missing Supabase environment variables`

**Solution / الحل**:
1. Verify `.env.local` file exists in project root
2. Check that variable names are exactly:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Ensure no extra spaces or quotes around values
4. Restart your development server

---

### Issue 2: "Invalid API key" Error

**Error**: `Invalid API key` or `401 Unauthorized`

**Solution / الحل**:
1. Verify you copied the **anon key**, not the service_role key
2. Check for extra spaces when copying
3. Ensure the key starts with `eyJ...`
4. Go back to Supabase dashboard and copy the key again

---

### Issue 3: "Table does not exist" Error

**Error**: `relation "salawat_counter" does not exist`

**Solution / الحل**:
1. Go to Supabase dashboard → SQL Editor
2. Re-run the SQL script from Step 4.2
3. Verify table exists in Table Editor
4. Check you're connected to the correct project

---

### Issue 3.1: "Table already exists with old schema" Error

**Error**: Table exists but has old `count` field instead of `total_count` and `contribution_count`

**Solution / الحل**:
If you already created the table with the old schema, run this migration script in SQL Editor:

```sql
-- Migrate existing table to new schema
ALTER TABLE salawat_counter 
  RENAME COLUMN count TO total_count;

ALTER TABLE salawat_counter 
  ADD COLUMN IF NOT EXISTS contribution_count BIGINT NOT NULL DEFAULT 0;

-- Update existing row to have contribution_count = 0 (or set to 1 if count was > 0)
UPDATE salawat_counter 
SET contribution_count = CASE WHEN total_count > 0 THEN 1 ELSE 0 END
WHERE id = 1;

-- Drop old function and create new one
DROP FUNCTION IF EXISTS increment_salawat();

CREATE OR REPLACE FUNCTION increment_salawat(amount BIGINT)
RETURNS JSON AS $$
DECLARE
  new_total_count BIGINT;
  new_contribution_count BIGINT;
BEGIN
  -- Validate that amount is positive
  IF amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be a positive integer';
  END IF;
  
  UPDATE salawat_counter 
  SET 
    total_count = total_count + amount,
    contribution_count = contribution_count + 1,
    updated_at = NOW()
  WHERE id = 1
  RETURNING total_count, contribution_count INTO new_total_count, new_contribution_count;
  
  RETURN json_build_object(
    'total_count', new_total_count,
    'contribution_count', new_contribution_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION increment_salawat(BIGINT) TO anon, authenticated;
```

---

### Issue 4: Real-time Not Working

**Issue**: Counter updates don't appear in real-time

**Solution / الحل**:
1. Go to Database → Replication in Supabase dashboard
2. Verify `salawat_counter` table has Realtime enabled (toggle ON)
3. Check browser console for WebSocket connection errors
4. Verify your network allows WebSocket connections

---

### Issue 5: "Row Level Security" Policy Error

**Error**: `new row violates row-level security policy`

**Solution / الحل**:
1. Go to SQL Editor in Supabase dashboard
2. Re-run the policy creation SQL from Step 4.2:
   ```sql
   CREATE POLICY "Allow public read access" 
   ON salawat_counter 
   FOR SELECT 
   USING (true);

   CREATE POLICY "Allow public increment" 
   ON salawat_counter 
   FOR UPDATE 
   USING (true)
   WITH CHECK (true);
   ```

---

## Security Best Practices / أفضل الممارسات الأمنية

### ✅ Do's / ما يجب فعله

- ✅ Use the **anon key** in client-side code (it's designed for this)
- ✅ Keep your `.env.local` file private (never commit it)
- ✅ Use Row Level Security (RLS) policies to control access
- ✅ Regularly update your Supabase dependencies
- ✅ Monitor your Supabase dashboard for unusual activity

### ❌ Don'ts / ما لا يجب فعله

- ❌ Never expose the **service_role key** in client-side code
- ❌ Don't commit `.env.local` to Git (it's in `.gitignore`)
- ❌ Don't share your Supabase credentials publicly
- ❌ Don't disable RLS without understanding the security implications
- ❌ Don't use the same credentials for development and production

---

## Next Steps / الخطوات التالية

1. **Continue with Installation**:
   - Return to `INSTALLATION_GUIDE.md`
   - Complete Step 5: Run Development Server
   - Your Supabase setup is now complete!

2. **Explore Supabase Dashboard**:
   - Familiarize yourself with the Supabase interface
   - Check out the Table Editor to view your data
   - Explore the API documentation in the dashboard

3. **Monitor Usage**:
   - Check your project settings for usage statistics
   - Monitor database size and API calls
   - Free tier includes generous limits for development

---

## Additional Resources / موارد إضافية

- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Supabase JavaScript Client**: [supabase.com/docs/reference/javascript](https://supabase.com/docs/reference/javascript)
- **Row Level Security Guide**: [supabase.com/docs/guides/auth/row-level-security](https://supabase.com/docs/guides/auth/row-level-security)
- **Real-time Subscriptions**: [supabase.com/docs/guides/realtime](https://supabase.com/docs/guides/realtime)

---

## Arabic Translation / الترجمة العربية

### ملاحظات مهمة / Important Notes

- تأكد من حفظ كلمة مرور قاعدة البيانات في مكان آمن
- استخدم المفتاح العام (anon key) فقط في الكود الخاص بالعميل
- لا تشارك بيانات اعتماد Supabase مع أي شخص
- راجع إعدادات الأمان بانتظام

### الدعم / Support

إذا واجهت مشاكل غير مذكورة هنا:
1. راجع وثائق Supabase الرسمية
2. تحقق من سجلات الأخطاء في وحدة التحكم
3. تأكد من أن جميع الخطوات تم تنفيذها بشكل صحيح
4. تحقق من لوحة تحكم Supabase للحصول على معلومات إضافية

---

## Summary Checklist / قائمة التحقق الملخصة

Use this checklist to ensure you've completed all steps:

استخدم هذه القائمة للتحقق من إكمال جميع الخطوات:

- [ ] Created Supabase account
- [ ] Created new project
- [ ] Saved database password securely
- [ ] Copied Project URL
- [ ] Copied anon/public key
- [ ] Created `salawat_counter` table
- [ ] Set up Row Level Security policies
- [ ] Enabled Realtime for the table
- [ ] Created `.env.local` file
- [ ] Added environment variables
- [ ] Created `lib/supabase.ts` file
- [ ] Tested database connection
- [ ] Verified no errors in development server

---

**Setup Complete! / الإعداد مكتمل!**

You're now ready to use Supabase with your Salawat Campaign application. Return to `INSTALLATION_GUIDE.md` to continue with the installation process.

أنت الآن جاهز لاستخدام Supabase مع تطبيق حملة الصلاة على النبي. ارجع إلى `INSTALLATION_GUIDE.md` لمتابعة عملية التثبيت.

