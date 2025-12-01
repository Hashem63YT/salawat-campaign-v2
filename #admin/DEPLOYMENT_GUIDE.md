# دليل النشر على Vercel / Vercel Deployment Guide

## Overview / نظرة عامة

This guide will walk you through deploying your Salawat Campaign application to Vercel, a modern platform for hosting Next.js applications. Vercel provides automatic HTTPS, global CDN, and seamless integration with GitHub for continuous deployment.

سيقودك هذا الدليل خلال نشر تطبيق حملة الصلاة على النبي على Vercel، وهي منصة حديثة لاستضافة تطبيقات Next.js. يوفر Vercel HTTPS تلقائيًا وشبكة CDN عالمية وتكاملًا سلسًا مع GitHub للنشر المستمر.

---

## Prerequisites / المتطلبات

Before starting deployment, ensure you have completed:

قبل البدء في النشر، تأكد من إكمال:

- ✅ **Local development and testing completed**
  - Application runs successfully with `npm run dev`
  - Build completes without errors (`npm run build`)
  - All features tested and working locally

- ✅ **Supabase project set up and configured**
  - Followed `SUPABASE_SETUP_GUIDE.md` completely
  - Database tables created and configured
  - Real-time enabled for production
  - Have your Supabase credentials ready (URL and anon key)

- ✅ **PWA icons created and placed**
  - `icon-192x192.png` exists in `public/` directory
  - `icon-512x512.png` exists in `public/` directory
  - Reference `PWA_ICONS_GUIDE.md` if needed

- ✅ **GitHub account**
  - Code pushed to a GitHub repository
  - Repository is accessible and up to date

- ✅ **Vercel account** (free tier is sufficient)
  - Can sign up during deployment process
  - Free tier includes: 100 GB bandwidth/month, unlimited deployments, automatic HTTPS

- ✅ **All environment variables documented**
  - Know your `NEXT_PUBLIC_SUPABASE_URL`
  - Know your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Section 1: Prepare for Deployment / القسم 1: الاستعداد للنشر

### Step 1.1: Verify Local Build Works / الخطوة 1.1: التحقق من عمل البناء المحلي

Before deploying, ensure your application builds successfully:

قبل النشر، تأكد من أن التطبيق يتم بناؤه بنجاح:

1. **Stop development server** (if running):
   ```bash
   # Press Ctrl+C in terminal
   ```

2. **Build the application**:
   ```bash
   npm run build
   ```

3. **Verify build output**:
   - Should see: `✓ Compiled successfully`
   - No errors or warnings (minor warnings are acceptable)
   - Build completes in 1-3 minutes

4. **Test production build locally**:
   ```bash
   npm start
   ```
   - Open `http://localhost:3000`
   - Verify app loads correctly
   - Test all features (counters, form submission, real-time updates)

**Troubleshooting / حل المشاكل**:
- If build fails, check error messages and fix issues
- Ensure all dependencies are installed (`npm install`)
- Verify TypeScript compilation succeeds
- Check for missing environment variables

---

### Step 1.2: Ensure Environment Variables Are Documented / الخطوة 1.2: التأكد من توثيق متغيرات البيئة

Verify you have documented all required environment variables:

تأكد من أنك وثقت جميع متغيرات البيئة المطلوبة:

**Required Variables / المتغيرات المطلوبة**:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

**Where to find these / أين تجدها**:
- Refer to `SUPABASE_SETUP_GUIDE.md` Step 3 for instructions
- Supabase Dashboard → Settings → API

**Important / مهم**:
- These will be configured in Vercel dashboard during deployment
- Never commit these values to Git (they're in `.gitignore`)
- Keep them secure and private

---

### Step 1.3: Verify PWA Icons Exist / الخطوة 1.3: التحقق من وجود أيقونات PWA

Ensure PWA icons are in the correct location:

تأكد من أن أيقونات PWA في المكان الصحيح:

1. **Check `public/` directory**:
   ```bash
   # Verify files exist
   ls public/icon-192x192.png
   ls public/icon-512x512.png
   ```

2. **Verify file sizes**:
   - `icon-192x192.png` should be exactly 192x192 pixels
   - `icon-512x512.png` should be exactly 512x512 pixels

3. **Check manifest.json**:
   - Open `public/manifest.json`
   - Verify icons are referenced correctly
   - Icons should be in the `icons` array

**If icons are missing / إذا كانت الأيقونات مفقودة**:
- Refer to `PWA_ICONS_GUIDE.md` for creation instructions
- Create icons before deploying

---

### Step 1.4: Test PWA Functionality Locally / الخطوة 1.4: اختبار وظائف PWA محليًا

Test PWA features before deploying:

اختبر ميزات PWA قبل النشر:

1. **Build and start production server**:
   ```bash
   npm run build
   npm start
   ```

2. **Open Chrome DevTools**:
   - Navigate to `http://localhost:3000`
   - Press `F12` to open DevTools
   - Go to **Application** tab

3. **Verify PWA setup**:
   - ✅ Manifest loads without errors
   - ✅ Service worker registers successfully
   - ✅ Icons appear in manifest
   - ✅ No console errors

**Reference / مرجع**:
- See `PWA_TESTING_GUIDE.md` Section 1 for detailed testing steps

---

### Step 1.5: Commit and Push to GitHub / الخطوة 1.5: الالتزام والدفع إلى GitHub

Ensure all code is committed and pushed:

تأكد من أن جميع الكود ملتزم ومدفوع:

1. **Check Git status**:
   ```bash
   git status
   ```

2. **Add all changes**:
   ```bash
   git add .
   ```

3. **Commit changes**:
   ```bash
   git commit -m "Prepare for Vercel deployment"
   ```

4. **Push to GitHub**:
   ```bash
   git push origin main
   # or
   git push origin master
   ```

**Verify / التحقق**:
- Check GitHub repository online
- Ensure all files are pushed
- Verify `.env.local` is NOT committed (should be in `.gitignore`)

---

## Section 2: Create Vercel Account / القسم 2: إنشاء حساب Vercel

### Step 2.1: Sign Up for Vercel / الخطوة 2.1: التسجيل في Vercel

1. **Visit Vercel website**:
   - Go to [vercel.com](https://vercel.com)
   - Click **"Sign Up"** button

2. **Choose authentication method**:
   - **Recommended**: Sign up with **GitHub** (seamless integration)
   - Alternative: Sign up with email

3. **Complete registration**:
   - If using GitHub: Authorize Vercel to access your repositories
   - If using email: Verify your email address

4. **Welcome to Vercel**:
   - You'll be redirected to the Vercel dashboard
   - Free tier is automatically selected

**Free Tier Benefits / فوائد الطبقة المجانية**:
- ✅ 100 GB bandwidth per month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Preview deployments for pull requests
- ✅ Global CDN
- ✅ Serverless functions

---

## Section 3: Deploy to Vercel / القسم 3: النشر على Vercel

### Step 3.1: Import Project from GitHub / الخطوة 3.1: استيراد المشروع من GitHub

1. **In Vercel dashboard**:
   - Click **"Add New Project"** or **"Import Project"** button
   - You'll see a list of your GitHub repositories

2. **Select your repository**:
   - Find `salawat-campaign` (or your repository name)
   - Click **"Import"** button

3. **Authorize Vercel** (if needed):
   - If prompted, authorize Vercel to access your repository
   - Grant necessary permissions

**Troubleshooting / حل المشاكل**:
- If repository doesn't appear, check GitHub connection
- Ensure repository is public or you've granted Vercel access
- Refresh the page if repositories don't load

---

### Step 3.2: Configure Project Settings / الخطوة 3.2: تكوين إعدادات المشروع

Vercel will auto-detect Next.js, but verify these settings:

سيكتشف Vercel Next.js تلقائيًا، ولكن تحقق من هذه الإعدادات:

**Framework Preset / إعداد الإطار**:
- Should be: **Next.js** (auto-detected)
- If not, select it manually

**Root Directory / الدليل الجذر**:
- Leave as default: `./` (project root)
- Only change if your Next.js app is in a subdirectory

**Build Command / أمر البناء**:
- Should be: `next build` (auto-configured)
- Verify this is correct

**Output Directory / دليل الإخراج**:
- Should be: `.next` (auto-configured)
- This is the default Next.js output directory

**Install Command / أمر التثبيت**:
- Should be: `npm install` (auto-configured)
- Change if using yarn or pnpm

**Click "Continue" or "Next"** to proceed.

---

### Step 3.3: Configure Environment Variables / الخطوة 3.3: تكوين متغيرات البيئة

**This is a critical step! / هذه خطوة حرجة!**

1. **In the "Environment Variables" section**:
   - You'll see a form to add environment variables

2. **Add `NEXT_PUBLIC_SUPABASE_URL`**:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Your Supabase project URL (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Add"**

3. **Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`**:
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anon key (starts with `eyJ...`)
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Add"**

4. **Verify variables are added**:
   - Both variables should appear in the list
   - Check that names match exactly (case-sensitive)
   - Ensure values are correct (no extra spaces)

**Where to find these values / أين تجد هذه القيم**:
- Supabase Dashboard → Settings → API
- Copy **Project URL** for `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon/public key** for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Important Notes / ملاحظات مهمة**:
- ⚠️ Variable names are **case-sensitive**
- ⚠️ Don't include quotes around values
- ⚠️ Don't add extra spaces
- ⚠️ These variables will be available in your production app

---

### Step 3.4: Deploy / الخطوة 3.4: النشر

1. **Review settings**:
   - Verify framework is Next.js
   - Check environment variables are added
   - Ensure root directory is correct

2. **Click "Deploy" button**:
   - Deployment will start immediately
   - You'll see build logs in real-time

3. **Monitor build process**:
   - Build typically takes 2-5 minutes
   - Watch for any errors in build logs
   - Common steps:
     - Installing dependencies
     - Building Next.js application
     - Generating static pages
     - Optimizing assets

**Expected Build Output / الناتج المتوقع للبناء**:
```
✓ Installing dependencies
✓ Building application
✓ Generating static pages
✓ Deploying to edge network
```

**If build fails / إذا فشل البناء**:
- Check build logs for error messages
- Common issues:
  - Missing environment variables
  - TypeScript errors
  - Missing dependencies
  - Build configuration issues
- Fix issues and redeploy

---

## Section 4: Connect Supabase to Production / القسم 4: ربط Supabase بالإنتاج

### Step 4.1: Verify Supabase Project is Ready / الخطوة 4.1: التحقق من جاهزية مشروع Supabase

1. **Open Supabase Dashboard**:
   - Go to [supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Verify project status**:
   - ✅ Project is active (not paused)
   - ✅ Database is accessible
   - ✅ API is enabled

3. **Check project settings**:
   - Go to **Settings** → **API**
   - Verify your Project URL and keys are correct

---

### Step 4.2: Update Supabase Project Settings / الخطوة 4.2: تحديث إعدادات مشروع Supabase

1. **Add Vercel URL to allowed origins** (if required):
   - Go to **Settings** → **API**
   - Find **"Allowed Origins"** or **"CORS"** settings
   - Add your Vercel production URL (e.g., `https://your-app.vercel.app`)
   - Save changes

2. **Verify CORS settings**:
   - Supabase typically allows all origins by default
   - If you encounter CORS errors, add Vercel URL explicitly

**Note / ملاحظة**:
- Most Supabase projects work without additional CORS configuration
- Only configure if you encounter connection errors

---

### Step 4.3: Test Database Connection from Production / الخطوة 4.3: اختبار اتصال قاعدة البيانات من الإنتاج

1. **Get your Vercel deployment URL**:
   - After deployment completes, Vercel provides a URL
   - Format: `https://your-app-name.vercel.app`
   - Or custom domain if configured

2. **Open the production URL**:
   - Navigate to your deployed app
   - App should load normally

3. **Verify database connection**:
   - ✅ Counters should load from Supabase
   - ✅ Current count values are displayed
   - ✅ No "Error connecting to Supabase" messages

4. **Test incrementing counter**:
   - Submit a Salawat count through the form
   - ✅ Counter should increment
   - ✅ Success animation should play
   - ✅ Real-time update should occur

**If connection fails / إذا فشل الاتصال**:
- Verify environment variables in Vercel dashboard
- Check Supabase project is active
- Review browser console for errors
- See Troubleshooting section below

---

### Step 4.4: Enable Supabase Real-time for Production / الخطوة 4.4: تفعيل الوقت الفعلي لـ Supabase للإنتاج

Real-time should already be enabled, but verify:

يجب أن يكون الوقت الفعلي مفعلاً بالفعل، ولكن تحقق:

1. **In Supabase Dashboard**:
   - Go to **Database** → **Replication**
   - Find `salawat_counter` table
   - Verify toggle is **ON** (enabled)

2. **Test real-time updates**:
   - Open your production app in two different browsers/devices
   - Submit a count in one browser
   - ✅ Count should update in real-time in the other browser
   - ✅ No page refresh needed

**Reference / مرجع**:
- See `SUPABASE_SETUP_GUIDE.md` Step 5 (lines 212-224) for real-time setup details

---

## Section 5: Verify Deployment / القسم 5: التحقق من النشر

### Step 5.1: Access Production URL / الخطوة 5.1: الوصول إلى رابط الإنتاج

1. **Get your deployment URL**:
   - Vercel provides URL after successful deployment
   - Format: `https://your-app-name.vercel.app`
   - Or: `https://your-app-name-username.vercel.app`

2. **Open in browser**:
   - Navigate to the production URL
   - App should load with HTTPS (secure connection)

3. **Verify HTTPS**:
   - ✅ URL starts with `https://`
   - ✅ Browser shows secure lock icon
   - ✅ No security warnings

---

### Step 5.2: Verify All Features Work / الخطوة 5.2: التحقق من عمل جميع الميزات

Test each feature systematically:

اختبر كل ميزة بشكل منهجي:

**Page Loading / تحميل الصفحة**:
- ✅ Page loads correctly
- ✅ RTL layout is correct (text right-aligned)
- ✅ Arabic text displays properly
- ✅ Fonts load correctly (Amiri, Cairo)

**Counters Display / عرض العدادات**:
- ✅ Total count displays current value from Supabase
- ✅ Contribution count displays correctly
- ✅ Numbers format correctly in Arabic

**Form Submission / إرسال النموذج**:
- ✅ Form accepts input
- ✅ Validation works (positive numbers only)
- ✅ Submit button works
- ✅ Success animation plays
- ✅ Counter increments after submission

**Real-time Updates / التحديثات في الوقت الفعلي**:
- ✅ Open app in two browsers/devices
- ✅ Submit count in one browser
- ✅ Count updates in real-time in other browser
- ✅ No page refresh needed

**Visual Elements / العناصر المرئية**:
- ✅ Islamic green theme color (`#16a34a`) appears
- ✅ Animations work smoothly
- ✅ Responsive design works on mobile and desktop

---

### Step 5.3: Test PWA Installation on Mobile Devices / الخطوة 5.3: اختبار تثبيت PWA على الأجهزة المحمولة

**Important**: PWA requires HTTPS, which Vercel provides automatically.

**مهم**: يتطلب PWA HTTPS، والذي يوفر Vercel تلقائيًا.

#### Android Chrome Testing / اختبار Android Chrome

1. **Open Chrome on Android device**
2. **Navigate to production URL**
3. **Look for install prompt**:
   - Banner may appear: "Add to Home Screen"
   - Or: Menu (three dots) → "Add to Home Screen" or "Install app"
4. **Install the app**:
   - Tap "Add" or "Install"
   - App icon appears on home screen
5. **Test installed app**:
   - ✅ Opens in standalone mode (no browser UI)
   - ✅ All features work
   - ✅ Offline functionality works

#### iOS Safari Testing / اختبار iOS Safari

1. **Open Safari on iOS device**
2. **Navigate to production URL**
3. **Add to Home Screen**:
   - Tap Share button (square with arrow)
   - Scroll and tap "Add to Home Screen"
   - Tap "Add"
4. **Test installed app**:
   - ✅ Opens in standalone mode
   - ✅ All features work
   - ✅ Basic offline functionality works

**Reference / مرجع**:
- See `PWA_TESTING_GUIDE.md` Section 2 (lines 156-293) for detailed mobile testing instructions

---

### Step 5.4: Run Lighthouse Audit / الخطوة 5.4: تشغيل تدقيق Lighthouse

1. **Open Chrome DevTools** on production URL:
   - Press `F12` or right-click → "Inspect"
   - Go to **"Lighthouse"** tab

2. **Configure audit**:
   - Select **"Progressive Web App"** category
   - (Optional) Select Performance, Accessibility, Best Practices
   - Click **"Analyze page load"** or **"Generate report"**

3. **Review results**:
   - ✅ **PWA Score**: Aim for **90+** (excellent)
   - ✅ All critical checks should pass
   - ✅ No major issues reported

4. **Address any issues**:
   - Review failed checks
   - Fix issues if possible
   - Redeploy if changes are made

**Common PWA Checks / فحوصات PWA الشائعة**:
- ✅ Manifest is valid
- ✅ Icons are provided
- ✅ Service worker is registered
- ✅ Page works offline
- ✅ HTTPS is used
- ✅ Page is responsive

---

## Section 6: Configure Custom Domain (Optional) / القسم 6: تكوين نطاق مخصص (اختياري)

### Step 6.1: Add Custom Domain in Vercel / الخطوة 6.1: إضافة نطاق مخصص في Vercel

1. **In Vercel Dashboard**:
   - Go to your project
   - Click **"Settings"** tab
   - Click **"Domains"** in sidebar

2. **Add domain**:
   - Enter your domain name (e.g., `salawat-campaign.com`)
   - Click **"Add"**

3. **Configure DNS**:
   - Vercel provides DNS records to add
   - Add records to your domain registrar
   - Wait for DNS propagation (5 minutes to 48 hours)

4. **SSL Certificate**:
   - Vercel automatically provisions SSL certificate
   - HTTPS will be enabled automatically
   - Certificate renews automatically

**Note / ملاحظة**:
- Custom domain is optional
- Free tier supports custom domains
- Vercel provides free SSL certificates

---

## Section 7: Continuous Deployment / القسم 7: النشر المستمر

### How It Works / كيف يعمل

Vercel automatically deploys when you push to your Git repository:

ينشر Vercel تلقائيًا عند الدفع إلى مستودع Git الخاص بك:

**Automatic Deployments / النشر التلقائي**:
- ✅ **Push to `main` branch** → Production deployment
- ✅ **Push to other branches** → Preview deployment
- ✅ **Pull requests** → Preview deployment with unique URL

**Preview Deployments / النشر المعاينة**:
- Each preview gets a unique URL
- Test changes before merging to main
- Share preview URLs with team members

**Production Deployments / النشر الإنتاج**:
- Only `main` (or `master`) branch deploys to production
- Production URL remains stable
- Previous deployments are kept for rollback

---

### Step 7.1: Deploy Updates / الخطوة 7.1: نشر التحديثات

1. **Make changes locally**:
   - Edit code, add features, fix bugs
   - Test locally with `npm run dev`

2. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add new feature"
   git push origin main
   ```

3. **Vercel automatically deploys**:
   - Deployment starts automatically
   - You'll receive email notification (if configured)
   - Check Vercel dashboard for status

4. **Verify deployment**:
   - Wait for build to complete (2-5 minutes)
   - Check production URL for changes
   - Test new features

---

### Step 7.2: Rollback to Previous Deployment / الخطوة 7.2: التراجع إلى النشر السابق

If something goes wrong, you can rollback:

إذا حدث خطأ ما، يمكنك التراجع:

1. **In Vercel Dashboard**:
   - Go to your project
   - Click **"Deployments"** tab
   - See list of all deployments

2. **Find previous deployment**:
   - Click on the deployment you want to restore
   - Click **"..."** menu (three dots)
   - Click **"Promote to Production"**

3. **Verify rollback**:
   - Previous version is now live
   - Production URL serves the rolled-back version

---

## Section 8: Monitoring and Maintenance / القسم 8: المراقبة والصيانة

### Step 8.1: Access Deployment Logs / الخطوة 8.1: الوصول إلى سجلات النشر

1. **In Vercel Dashboard**:
   - Go to your project
   - Click **"Deployments"** tab
   - Click on any deployment

2. **View build logs**:
   - See complete build output
   - Check for warnings or errors
   - Review build time and size

3. **View function logs** (if using serverless functions):
   - Runtime logs for serverless functions
   - Error tracking
   - Performance metrics

---

### Step 8.2: Monitor Build Status / الخطوة 8.2: مراقبة حالة البناء

**Build Status Indicators / مؤشرات حالة البناء**:
- ✅ **Ready**: Deployment successful
- ⏳ **Building**: Currently building
- ❌ **Error**: Build failed (check logs)
- ⚠️ **Warning**: Build succeeded with warnings

**Set up notifications / إعداد الإشعارات**:
- Configure email notifications in Vercel settings
- Get notified of deployment status
- Receive alerts for build failures

---

### Step 8.3: Check Runtime Logs / الخطوة 8.3: فحص سجلات وقت التشغيل

1. **In Vercel Dashboard**:
   - Go to your project
   - Click **"Logs"** tab (if available)
   - View real-time logs

2. **Monitor for errors**:
   - Check for runtime errors
   - Monitor API calls
   - Track performance issues

**Note / ملاحظة**:
- Runtime logs may be limited on free tier
- Use browser DevTools Console for client-side debugging
- Check Supabase logs for database issues

---

### Step 8.4: Use Vercel Analytics (If Available) / الخطوة 8.4: استخدام Vercel Analytics (إن توفر)

1. **Enable Analytics** (if on paid plan):
   - Go to project settings
   - Enable Vercel Analytics
   - View traffic and performance data

2. **Monitor usage**:
   - Track page views
   - Monitor Core Web Vitals
   - Analyze user behavior

**Free Tier Note / ملاحظة الطبقة المجانية**:
- Analytics may not be available on free tier
- Use Google Analytics as alternative
- Monitor Supabase dashboard for database usage

---

## Section 9: Troubleshooting Common Deployment Issues / القسم 9: حل مشاكل النشر الشائعة

### Issue 1: Build Fails with "Missing environment variables" / المشكلة 1: فشل البناء مع "متغيرات البيئة مفقودة"

**Error / الخطأ**:
```
Error: Missing Supabase environment variables
```

**Solution / الحل**:
1. **Verify environment variables in Vercel**:
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Check that `NEXT_PUBLIC_SUPABASE_URL` is set
   - Check that `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set

2. **Check variable names**:
   - Variable names are case-sensitive
   - Must be exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - No extra spaces or typos

3. **Verify environment scope**:
   - Ensure variables are set for **Production** environment
   - Can also set for Preview and Development

4. **Redeploy after adding variables**:
   - After adding/updating variables, click **"Redeploy"**
   - Environment variables require redeployment to take effect

---

### Issue 2: App Loads but Shows "Error connecting to Supabase" / المشكلة 2: التطبيق يحمل ولكن يظهر "خطأ في الاتصال بـ Supabase"

**Symptoms / الأعراض**:
- App loads successfully
- Counters show 0 or error message
- Console shows Supabase connection errors

**Solution / الحل**:
1. **Verify Supabase credentials**:
   - Check `NEXT_PUBLIC_SUPABASE_URL` in Vercel dashboard
   - Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel dashboard
   - Ensure values match your Supabase dashboard

2. **Check Supabase project status**:
   - Go to Supabase Dashboard
   - Verify project is **active** (not paused)
   - Check project hasn't exceeded free tier limits

3. **Verify CORS settings**:
   - Go to Supabase Dashboard → Settings → API
   - Add Vercel URL to allowed origins if needed
   - Most projects work without additional CORS config

4. **Check browser console**:
   - Open DevTools → Console
   - Look for specific error messages
   - Check network tab for failed requests

5. **Test Supabase connection**:
   - Verify Supabase project is accessible
   - Test API endpoint directly
   - Check Supabase status page for outages

---

### Issue 3: PWA Features Don't Work in Production / المشكلة 3: ميزات PWA لا تعمل في الإنتاج

**Symptoms / الأعراض**:
- "Add to Home Screen" doesn't appear
- Service worker doesn't register
- Offline functionality doesn't work

**Solution / الحل**:
1. **Verify HTTPS is enabled**:
   - ✅ Vercel provides HTTPS automatically
   - ✅ URL should start with `https://`
   - ✅ Browser should show secure lock icon

2. **Check service worker generation**:
   - Open DevTools → Application → Service Workers
   - Verify service worker is registered
   - Check for registration errors in Console

3. **Verify manifest.json is accessible**:
   - Navigate to `https://your-app.vercel.app/manifest.json`
   - Should load without errors
   - Should be valid JSON

4. **Check PWA icons**:
   - Verify `icon-192x192.png` and `icon-512x512.png` exist
   - Check they're accessible at production URL
   - Verify manifest references icons correctly

5. **Clear browser cache**:
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Clear cache and cookies
   - Test in incognito/private mode

6. **Rebuild and redeploy**:
   - Ensure PWA is enabled in `next.config.js`
   - Run `npm run build` locally to verify
   - Push changes and redeploy

**Reference / مرجع**:
- See `PWA_TESTING_GUIDE.md` for detailed PWA troubleshooting

---

### Issue 4: Real-time Updates Don't Work / المشكلة 4: التحديثات في الوقت الفعلي لا تعمل

**Symptoms / الأعراض**:
- Counter doesn't update in real-time
- Need to refresh page to see changes
- WebSocket connection errors

**Solution / الحل**:
1. **Verify Supabase real-time is enabled**:
   - Go to Supabase Dashboard → Database → Replication
   - Find `salawat_counter` table
   - Toggle should be **ON** (enabled)

2. **Check WebSocket connections**:
   - Open DevTools → Network tab
   - Filter by "WS" (WebSocket)
   - Verify WebSocket connection is established
   - Check for connection errors

3. **Verify Supabase project settings**:
   - Check Supabase project is active
   - Verify real-time is enabled for your project
   - Check project hasn't exceeded limits

4. **Test in browser console**:
   - Check for real-time subscription errors
   - Verify Supabase client is initialized correctly
   - Test real-time subscription manually

5. **Check network/firewall**:
   - Some networks block WebSocket connections
   - Test on different network
   - Check if corporate firewall is blocking

**Reference / مرجع**:
- See `SUPABASE_SETUP_GUIDE.md` Step 5 for real-time setup

---

### Issue 5: Build Succeeds but App Shows 404 or Blank Page / المشكلة 5: البناء ينجح ولكن التطبيق يظهر 404 أو صفحة فارغة

**Symptoms / الأعراض**:
- Build completes successfully
- Production URL shows 404 error
- Or shows blank white page

**Solution / الحل**:
1. **Check build logs**:
   - Review Vercel build logs carefully
   - Look for warnings about missing pages
   - Check for routing configuration issues

2. **Verify `next.config.js` configuration**:
   - Check for syntax errors
   - Verify output mode is correct
   - Ensure PWA configuration is valid

3. **Check all required files are committed**:
   - Verify `app/` directory is in Git
   - Check `app/page.tsx` exists
   - Check `app/layout.tsx` exists
   - Ensure `public/` directory is committed

4. **Verify Vercel project settings**:
   - Check root directory is correct (should be `./`)
   - Verify framework is set to Next.js
   - Check build command is `next build`

5. **Test build locally**:
   - Run `npm run build` locally
   - Check for any errors or warnings
   - Test `npm start` to verify production build works

6. **Check browser console**:
   - Open DevTools → Console
   - Look for JavaScript errors
   - Check Network tab for failed resource loads

---

### Issue 6: Fonts or Styles Don't Load Correctly / المشكلة 6: الخطوط أو الأنماط لا تحمل بشكل صحيح

**Symptoms / الأعراض**:
- Arabic text doesn't display correctly
- Fonts appear as default system fonts
- Styles are missing or broken

**Solution / الحل**:
1. **Verify Google Fonts are accessible**:
   - Check `app/layout.tsx` has correct font imports
   - Verify Google Fonts URLs are correct
   - Test font URLs directly in browser

2. **Check Tailwind CSS build**:
   - Verify Tailwind CSS compiled successfully
   - Check build logs for Tailwind errors
   - Ensure `tailwind.config.ts` is correct

3. **Clear CDN cache**:
   - Vercel uses CDN for static assets
   - Go to Vercel Dashboard → Settings → General
   - Click "Clear Cache" or redeploy

4. **Hard refresh browser**:
   - Press Ctrl+Shift+R (Windows/Linux)
   - Press Cmd+Shift+R (Mac)
   - Clears browser cache

5. **Check CSS file loads**:
   - Open DevTools → Network tab
   - Filter by "CSS"
   - Verify CSS files load without 404 errors

6. **Verify RTL configuration**:
   - Check `app/layout.tsx` has `dir="rtl"` and `lang="ar"`
   - Verify `app/globals.css` has RTL styles
   - Test in browser DevTools

---

### Issue 7: Environment Variables Not Updating / المشكلة 7: متغيرات البيئة لا تتحدث

**Symptoms / الأعراض**:
- Changed environment variables in Vercel
- Changes don't appear in production app
- App still uses old values

**Solution / الحل**:
1. **Redeploy after changing variables**:
   - ⚠️ **Important**: Vercel requires redeployment for env var changes
   - Go to Vercel Dashboard → Deployments
   - Click **"Redeploy"** button on latest deployment
   - Or push a new commit to trigger deployment

2. **Verify variables are saved**:
   - Go to Settings → Environment Variables
   - Confirm variables are listed correctly
   - Check values are correct (no extra spaces)

3. **Check variable names**:
   - Ensure names match exactly (case-sensitive)
   - Verify `NEXT_PUBLIC_` prefix for client-side variables

4. **Wait for deployment to complete**:
   - Redeployment takes 2-5 minutes
   - Check deployment status in dashboard
   - Verify deployment completes successfully

5. **Clear browser cache**:
   - Hard refresh (Ctrl+Shift+R)
   - Or test in incognito mode
   - Old cached values may persist

---

## Section 10: Post-Deployment Checklist / القسم 10: قائمة التحقق بعد النشر

Use this comprehensive checklist to verify your deployment:

استخدم قائمة التحقق الشاملة هذه للتحقق من النشر:

### Application Functionality / وظائف التطبيق

- [ ] App loads successfully at production URL
- [ ] RTL layout works correctly (text right-aligned)
- [ ] Arabic text displays properly
- [ ] Fonts (Amiri, Cairo) load correctly
- [ ] Counters load from Supabase (show current values)
- [ ] Form submission works (can submit Salawat count)
- [ ] Success animation plays after submission
- [ ] Real-time updates work (test in two browsers)
- [ ] No console errors in production
- [ ] Performance is acceptable (< 3s load time)

### PWA Features / ميزات PWA

- [ ] PWA installs on Android Chrome
- [ ] PWA installs on iOS Safari
- [ ] Installed app opens in standalone mode
- [ ] App icon and name are correct on home screen
- [ ] Offline functionality works (test with airplane mode)
- [ ] Service worker registers successfully
- [ ] Manifest.json loads without errors
- [ ] Icons display correctly

### Infrastructure / البنية التحتية

- [ ] HTTPS is enabled (URL starts with `https://`)
- [ ] SSL certificate is valid (no security warnings)
- [ ] All environment variables are set in Vercel
- [ ] Supabase connection works from production
- [ ] Real-time is enabled in Supabase
- [ ] Vercel deployment shows "Ready" status
- [ ] Build logs show no critical errors

### Testing / الاختبار

- [ ] Lighthouse PWA score is 90+
- [ ] Lighthouse Performance score is acceptable
- [ ] Lighthouse Accessibility score is acceptable
- [ ] Tested on mobile devices (Android and iOS)
- [ ] Tested on desktop browsers (Chrome, Edge)
- [ ] Cross-browser compatibility verified

### Monitoring / المراقبة

- [ ] Vercel deployment logs are accessible
- [ ] Can monitor build status
- [ ] Email notifications configured (optional)
- [ ] Supabase dashboard shows activity
- [ ] No unusual errors in logs

---

## Section 11: Updating the Production App / القسم 11: تحديث تطبيق الإنتاج

### How to Deploy Updates / كيفية نشر التحديثات

1. **Make changes locally**:
   - Edit code, add features, fix bugs
   - Test thoroughly with `npm run dev`
   - Build locally to verify: `npm run build`

2. **Commit and push to GitHub**:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

3. **Vercel automatically deploys**:
   - Deployment starts automatically
   - Monitor in Vercel dashboard
   - Wait for build to complete (2-5 minutes)

4. **Verify updates are live**:
   - Check production URL
   - Test new features
   - Verify no regressions

---

### Testing Updates in Preview Deployments / اختبار التحديثات في النشر المعاينة

**Best Practice / أفضل ممارسة**:

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make changes and push**:
   ```bash
   git add .
   git commit -m "Add new feature"
   git push origin feature/new-feature
   ```

3. **Vercel creates preview deployment**:
   - Get unique preview URL
   - Test changes without affecting production
   - Share URL with team for review

4. **Merge to main when ready**:
   ```bash
   git checkout main
   git merge feature/new-feature
   git push origin main
   ```
   - Production deployment triggers automatically

---

### Monitoring Deployment Status / مراقبة حالة النشر

1. **Check Vercel Dashboard**:
   - Go to your project
   - Click "Deployments" tab
   - See all deployments with status

2. **Monitor build progress**:
   - Watch build logs in real-time
   - Check for errors or warnings
   - Verify build completes successfully

3. **Verify deployment**:
   - Click on deployment to see details
   - Check build time and size
   - Review any warnings

---

## Section 12: Vercel Free Tier Limits / القسم 12: حدود الطبقة المجانية من Vercel

### Free Tier Includes / الطبقة المجانية تشمل

- ✅ **100 GB bandwidth** per month
- ✅ **Unlimited deployments**
- ✅ **Automatic HTTPS** (SSL certificates)
- ✅ **Preview deployments** for pull requests
- ✅ **Global CDN** (content delivery network)
- ✅ **Serverless functions** (limited execution time)
- ✅ **Custom domains** support

### What Happens if Limits Are Exceeded / ما يحدث عند تجاوز الحدود

**Bandwidth Limit / حد النطاق الترددي**:
- If 100 GB/month is exceeded:
  - Vercel may pause deployments
  - You'll receive email notification
  - Upgrade to paid plan or wait for next month

**Monitoring Usage / مراقبة الاستخدام**:
- Check Vercel Dashboard → Settings → Usage
- Monitor bandwidth consumption
- Track function execution time

**Upgrading / الترقية**:
- Free tier is sufficient for most small projects
- Upgrade to Pro plan if you need:
  - More bandwidth
  - Team collaboration
  - Advanced analytics
  - Priority support

---

## Section 13: Next Steps / القسم 13: الخطوات التالية

### After Successful Deployment / بعد النشر الناجح

1. **Update Project README**:
   - Add production URL to `#admin/README.md`
   - Update deployment status
   - Document any custom configurations

2. **Share Production URL**:
   - Share with users
   - Post on social media
   - Add to project documentation

3. **Monitor Usage and Performance**:
   - Check Vercel analytics (if available)
   - Monitor Supabase usage
   - Track user engagement

4. **Plan Future Enhancements**:
   - Multi-campaign platform
   - Admin dashboard
   - Additional features based on user feedback

5. **Consider Custom Domain** (optional):
   - Add custom domain for branding
   - Configure DNS settings
   - Vercel provides free SSL

---

## Section 14: Additional Resources / القسم 14: موارد إضافية

### Official Documentation / الوثائق الرسمية

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Vercel CLI**: [vercel.com/docs/cli](https://vercel.com/docs/cli)
- **Supabase Production Checklist**: [supabase.com/docs/guides/platform/going-into-prod](https://supabase.com/docs/guides/platform/going-into-prod)

### Related Guides / أدلة ذات صلة

- **Supabase Setup**: See `SUPABASE_SETUP_GUIDE.md`
- **PWA Testing**: See `PWA_TESTING_GUIDE.md`
- **Installation**: See `INSTALLATION_GUIDE.md`
- **PWA Icons**: See `PWA_ICONS_GUIDE.md`

### Community Support / دعم المجتمع

- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Next.js Discussions**: [github.com/vercel/next.js/discussions](https://github.com/vercel/next.js/discussions)
- **Supabase Discord**: [discord.supabase.com](https://discord.supabase.com)

---

## Section 15: Summary / القسم 15: الملخص

### Congratulations! / تهانينا!

You have successfully deployed your Salawat Campaign application to Vercel! Your app is now live and accessible to users worldwide with automatic HTTPS, global CDN, and continuous deployment.

لقد نشرت بنجاح تطبيق حملة الصلاة على النبي على Vercel! تطبيقك الآن متاح للمستخدمين في جميع أنحاء العالم مع HTTPS تلقائي وشبكة CDN عالمية ونشر مستمر.

### Key Achievements / الإنجازات الرئيسية

- ✅ Application deployed to production
- ✅ HTTPS enabled automatically
- ✅ PWA features working
- ✅ Supabase connected and working
- ✅ Real-time updates functional
- ✅ Continuous deployment configured

### Important Reminders / تذكيرات مهمة

- 🔒 **Keep environment variables secure** - Never commit them to Git
- 📊 **Monitor usage** - Check Vercel and Supabase dashboards regularly
- 🧪 **Test thoroughly** - Verify all features work in production
- 🔄 **Update regularly** - Keep dependencies up to date
- 📱 **Test on mobile** - Ensure PWA works on real devices

### Ongoing Maintenance / الصيانة المستمرة

- Monitor deployment logs for errors
- Check Supabase usage and limits
- Update dependencies periodically
- Review and optimize performance
- Gather user feedback for improvements

### Final Notes / ملاحظات نهائية

Your application is now ready for users! Remember to:
- Test all features thoroughly
- Monitor performance and errors
- Keep documentation updated
- Plan for future enhancements

تطبيقك الآن جاهز للمستخدمين! تذكر أن:
- اختبر جميع الميزات بدقة
- راقب الأداء والأخطاء
- حافظ على تحديث الوثائق
- خطط للتحسينات المستقبلية

---

**Deployment Complete! / النشر مكتمل!**

May peace and blessings be upon Prophet Muhammad ﷺ

اللهم صل وسلم على نبينا محمد ﷺ

