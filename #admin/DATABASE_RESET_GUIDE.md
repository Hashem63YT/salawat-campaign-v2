# 🗄️ دليل إعادة تعيين قاعدة البيانات / Database Reset Guide

## Purpose / الهدف

This guide helps you reset test/fake data from the Supabase database. Use this when you need to clear all contributions and reset counters to zero.

يساعدك هذا الدليل على إعادة تعيين بيانات الاختبار/الوهمية من قاعدة بيانات Supabase. استخدمه عندما تحتاج إلى مسح جميع المساهمات وإعادة تعيين العدادات إلى الصفر.

---

## ⚠️ Prerequisites / المتطلبات

Before proceeding, ensure you have:

قبل المتابعة، تأكد من أن لديك:

- ✅ Access to Supabase dashboard / الوصول إلى لوحة تحكم Supabase
- ✅ Project URL and credentials / رابط المشروع وبيانات الاعتماد
- ✅ Understanding that this operation is **irreversible** / فهم أن هذه العملية **لا يمكن التراجع عنها**

**Warning / تحذير**: This will permanently delete all contribution data and reset counters. Make sure to backup any important data before proceeding.

**تحذير**: سيؤدي هذا إلى حذف جميع بيانات المساهمات بشكل دائم وإعادة تعيين العدادات. تأكد من عمل نسخة احتياطية من أي بيانات مهمة قبل المتابعة.

---

## Method 1: SQL Editor (Recommended) / الطريقة 1: محرر SQL (موصى به)

### Step 1: Navigate to SQL Editor / الخطوة 1: الانتقال إلى محرر SQL

1. Open your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New query** to create a new SQL query

1. افتح لوحة تحكم مشروع Supabase
2. انقر على **SQL Editor** في الشريط الجانبي الأيسر
3. انقر على **New query** لإنشاء استعلام SQL جديد

### Step 2: Execute Reset Commands / الخطوة 2: تنفيذ أوامر إعادة التعيين

Copy and paste the following SQL commands into the SQL Editor:

انسخ والصق أوامر SQL التالية في محرر SQL:

```sql
-- Reset main counter table
-- إعادة تعيين جدول العداد الرئيسي
UPDATE salawat_counter 
SET total_count = 0, 
    contribution_count = 0, 
    updated_at = NOW() 
WHERE id = 1;

-- Delete all contribution records (if salawat_contributions table exists)
-- حذف جميع سجلات المساهمات (إذا كان جدول المساهمات موجوداً)
DELETE FROM salawat_contributions;
```

### Step 3: Run the Query / الخطوة 3: تشغيل الاستعلام

1. Click the **Run** button (or press `Ctrl+Enter` / `Cmd+Enter`)
2. Wait for the confirmation message
3. You should see "Success. No rows returned" or similar confirmation

1. انقر على زر **Run** (أو اضغط `Ctrl+Enter` / `Cmd+Enter`)
2. انتظر رسالة التأكيد
3. يجب أن ترى "Success. No rows returned" أو رسالة تأكيد مشابهة

### Explanation / الشرح

- **First command** (`UPDATE salawat_counter`): Resets the main counter values to zero while preserving the record structure
- **Second command** (`DELETE FROM salawat_contributions`): Removes all individual contribution records from the salawat_contributions table (if it exists)

- **الأمر الأول** (`UPDATE salawat_counter`): يعيد تعيين قيم العداد الرئيسية إلى الصفر مع الحفاظ على بنية السجل
- **الأمر الثاني** (`DELETE FROM salawat_contributions`): يزيل جميع سجلات المساهمات الفردية من جدول المساهمات (إذا كان موجوداً)

---

## Method 2: Table Editor (Alternative) / الطريقة 2: محرر الجداول (بديل)

If you prefer a visual interface, you can use the Table Editor:

إذا كنت تفضل واجهة مرئية، يمكنك استخدام محرر الجداول:

### Step 1: Navigate to Table Editor / الخطوة 1: الانتقال إلى محرر الجداول

1. Open your Supabase project dashboard
2. Click on **Table Editor** in the left sidebar
3. Select the `salawat_counter` table

1. افتح لوحة تحكم مشروع Supabase
2. انقر على **Table Editor** في الشريط الجانبي الأيسر
3. اختر جدول `salawat_counter`

### Step 2: Edit the Counter Row / الخطوة 2: تعديل صف العداد

1. Find the row with `id = 1`
2. Click on the row to edit it
3. Change `total_count` to `0`
4. Change `contribution_count` to `0`
5. Click **Save** or press `Enter`

1. ابحث عن الصف الذي يحتوي على `id = 1`
2. انقر على الصف لتعديله
3. غيّر `total_count` إلى `0`
4. غيّر `contribution_count` إلى `0`
5. انقر على **Save** أو اضغط `Enter`

### Step 3: Delete Contributions (if applicable) / الخطوة 3: حذف المساهمات (إن وجدت)

1. Navigate to the `salawat_contributions` table (if it exists)
2. Select all rows (use checkbox or `Ctrl+A` / `Cmd+A`)
3. Click **Delete** button
4. Confirm the deletion

1. انتقل إلى جدول `salawat_contributions` (إذا كان موجوداً)
2. حدد جميع الصفوف (استخدم مربع الاختيار أو `Ctrl+A` / `Cmd+A`)
3. انقر على زر **Delete**
4. أكد الحذف

---

## ✅ Verification Steps / خطوات التحقق

After resetting the database, verify the changes:

بعد إعادة تعيين قاعدة البيانات، تحقق من التغييرات:

1. **Check the Web App / تحقق من تطبيق الويب**:
   - Open your deployed application
   - The counters should display `0` for both total count and contribution count
   - افتح تطبيقك المنشور
   - يجب أن تعرض العدادات `0` لكل من العدد الإجمالي وعدد المساهمات

2. **Test New Submission / اختبار إرسال جديد**:
   - Submit a new contribution through the form
   - Verify that counters increment correctly
   - أرسل مساهمة جديدة من خلال النموذج
   - تحقق من أن العدادات تزيد بشكل صحيح

3. **Check Supabase Dashboard / تحقق من لوحة تحكم Supabase**:
   - Return to Table Editor
   - Verify `salawat_counter` shows `total_count = 0` and `contribution_count = 0`
   - ارجع إلى محرر الجداول
   - تحقق من أن `salawat_counter` يعرض `total_count = 0` و `contribution_count = 0`

---

## 🔧 Troubleshooting / استكشاف الأخطاء

### "Table not found" Error / خطأ "الجدول غير موجود"

**Problem / المشكلة**: SQL command fails with "relation does not exist"

**Solution / الحل**: 
- Verify the table name matches your schema exactly (check `lib/supabase.ts` for TypeScript types)
- Ensure you're connected to the correct database/project
- تحقق من أن اسم الجدول يطابق مخططك تماماً (تحقق من `lib/supabase.ts` للأنواع TypeScript)
- تأكد من أنك متصل بقاعدة البيانات/المشروع الصحيح

### Permission Errors / أخطاء الصلاحيات

**Problem / المشكلة**: "permission denied" or RLS (Row Level Security) errors

**Solution / الحل**:
- Check your Supabase project's RLS policies
- Ensure you're using the service role key (not the anon key) for admin operations
- Temporarily disable RLS if needed (not recommended for production)
- تحقق من سياسات RLS (Row Level Security) لمشروع Supabase
- تأكد من أنك تستخدم مفتاح دور الخدمة (وليس مفتاح anon) للعمليات الإدارية
- قم بتعطيل RLS مؤقتاً إذا لزم الأمر (غير موصى به للإنتاج)

### App Still Shows Old Data / التطبيق لا يزال يعرض البيانات القديمة

**Problem / المشكلة**: Counters still display previous values after reset

**Solution / الحل**:
- Clear your browser cache or use incognito/private mode
- Wait a few seconds for real-time sync to update
- Check browser console for any errors
- Hard refresh the page (`Ctrl+Shift+R` / `Cmd+Shift+R`)
- امسح ذاكرة التخزين المؤقت للمتصفح أو استخدم وضع التصفح الخاص
- انتظر بضع ثوانٍ لتحديث المزامنة في الوقت الفعلي
- تحقق من وحدة تحكم المتصفح لأي أخطاء
- قم بتحديث الصفحة بقوة (`Ctrl+Shift+R` / `Cmd+Shift+R`)

---

## 🛡️ Safety Notes / ملاحظات الأمان

- **Always Backup / دائماً احتفظ بنسخة احتياطية**: Before performing a reset, export your data if you might need it later
- **Irreversible Operation / عملية لا يمكن التراجع عنها**: Once deleted, contribution records cannot be recovered
- **Test vs Production / الاختبار مقابل الإنتاج**: Consider using separate test and production databases to avoid accidental data loss
- **Service Role Key / مفتاح دور الخدمة**: Use service role key only for admin operations, never expose it in client-side code

- **دائماً احتفظ بنسخة احتياطية**: قبل إجراء إعادة التعيين، قم بتصدير بياناتك إذا كنت قد تحتاجها لاحقاً
- **عملية لا يمكن التراجع عنها**: بمجرد الحذف، لا يمكن استرداد سجلات المساهمات
- **الاختبار مقابل الإنتاج**: فكر في استخدام قواعد بيانات منفصلة للاختبار والإنتاج لتجنب فقدان البيانات العرضي
- **مفتاح دور الخدمة**: استخدم مفتاح دور الخدمة فقط للعمليات الإدارية، ولا تعرضه أبداً في كود العميل

---

## 📚 Related Documentation / التوثيق ذو الصلة

- **Schema Reference / مرجع المخطط**: See `lib/supabase.ts` for TypeScript type definitions
- **Production Testing / اختبار الإنتاج**: See `PRODUCTION_TESTING_REPORT.md` for testing procedures
- **Project README / ملف README للمشروع**: See `README.md` for general project information

- **مرجع المخطط**: راجع `lib/supabase.ts` لتعريفات أنواع TypeScript
- **اختبار الإنتاج**: راجع `PRODUCTION_TESTING_REPORT.md` لإجراءات الاختبار
- **ملف README للمشروع**: راجع `README.md` لمعلومات المشروع العامة

---

**May peace and blessings be upon Prophet Muhammad ﷺ**

