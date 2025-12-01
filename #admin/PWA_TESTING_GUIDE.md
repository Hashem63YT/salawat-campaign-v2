# دليل اختبار PWA / PWA Testing Guide

## Overview / نظرة عامة

This guide provides comprehensive testing instructions for verifying that your Progressive Web App (PWA) is properly configured and functioning correctly. Follow these steps to ensure your PWA works across different browsers and devices.

يوفر هذا الدليل تعليمات اختبار شاملة للتحقق من أن تطبيق الويب التدريجي (PWA) الخاص بك مُعد بشكل صحيح ويعمل بشكل صحيح. اتبع هذه الخطوات للتأكد من أن PWA الخاص بك يعمل عبر متصفحات وأجهزة مختلفة.

---

## Section 1: Local Testing (Development) / القسم 1: الاختبار المحلي (التطوير)

### 1.1 Build the App / بناء التطبيق

PWA features are **disabled in development mode** (as configured in `next.config.js`). You must build and run the production version to test PWA functionality.

ميزات PWA **معطلة في وضع التطوير** (كما هو موضح في `next.config.js`). يجب عليك بناء وتشغيل إصدار الإنتاج لاختبار وظائف PWA.

**Steps / الخطوات**:

1. **Stop the development server** (if running):
   ```bash
   # Press Ctrl+C in the terminal
   ```

2. **Build the application**:
   ```bash
   npm run build
   ```

3. **Start the production server**:
   ```bash
   npm start
   ```

4. **Open in browser**:
   - Navigate to `http://localhost:3000`
   - The app should load normally

**Expected Output / الناتج المتوقع**:
- Build completes without errors
- Production server starts on port 3000
- App loads successfully
- Service worker files are generated in `public/` directory

### 1.2 Edge DevTools Testing / اختبار Edge DevTools

#### Step 1: Open DevTools / الخطوة 1: فتح DevTools

1. Open Microsoft Edge browser
2. Navigate to your app (`http://localhost:3000`)
3. Press `F12` or right-click > "Inspect"
4. DevTools panel opens

#### Step 2: Check Manifest / الخطوة 2: فحص Manifest

1. Click on **"Application"** tab in DevTools
2. Expand **"Manifest"** in the left sidebar
3. Verify the following:

   **Manifest Details / تفاصيل Manifest**:
   - ✅ **Name**: "حملة الصلاة على النبي ﷺ"
   - ✅ **Short name**: "حملة الصلاة"
   - ✅ **Start URL**: "/"
   - ✅ **Display**: "standalone"
   - ✅ **Theme color**: "#16a34a" (Islamic green)
   - ✅ **Background color**: "#ffffff" (white)
   - ✅ **Orientation**: "portrait-primary"

   **Icons / الأيقونات**:
   - ✅ `icon-192x192.png` appears in the list
   - ✅ `icon-512x512.png` appears in the list
   - ✅ Icons show correct sizes (192x192, 512x512)
   - ✅ No "missing icon" errors

   **Issues / المشاكل**:
   - Check for any red error messages
   - Verify all icons load without 404 errors
   - Ensure manifest is valid JSON

**Note**: Edge DevTools interface is similar to Chrome DevTools, so the steps are identical.

#### Step 3: Check Service Workers / الخطوة 3: فحص Service Workers

1. In DevTools, click **"Application"** tab
2. Expand **"Service Workers"** in the left sidebar
3. Verify the following:

   **Service Worker Status / حالة Service Worker**:
   - ✅ Service worker is **registered**
   - ✅ Service worker is **activated** (green status)
   - ✅ Service worker file: `sw.js` or `sw.js?xxx`
   - ✅ Status shows "activated and is running"

   **Service Worker Details / تفاصيل Service Worker**:
   - Click on the service worker to see details
   - Check "Update on reload" if you want to test updates
   - Verify "skipWaiting" is enabled (from `next.config.js`)

   **Troubleshooting / حل المشاكل**:
   - If service worker doesn't appear, ensure you're running production build (`npm run build` then `npm start`)
   - Check Console tab for service worker registration errors
   - Verify `@ducanh2912/next-pwa` is installed
   - Edge DevTools shows service workers in the same location as Chrome

#### Step 4: Test Offline Mode / الخطوة 4: اختبار وضع عدم الاتصال

1. In DevTools, click **"Network"** tab
2. Check the **"Offline"** checkbox (top toolbar)
3. **Reload the page** (F5 or Ctrl+R)
4. Verify the following:

   **Offline Behavior / سلوك عدم الاتصال**:
   - ✅ Page still loads (from cache)
   - ✅ Static assets (CSS, JS, images) load from cache
   - ✅ App functionality works (UI is interactive)
   - ✅ No "You are offline" errors (unless intentional)

   **Cache Verification / التحقق من التخزين المؤقت**:
   - Go to **"Application"** tab > **"Cache Storage"**
   - Verify caches are created:
     - `google-fonts-cache`
     - `static-image-assets`
     - `static-js-css-assets`
     - `apis`
     - `supabase-cache`
     - `pages`

5. **Uncheck "Offline"** to restore network connection

#### Step 5: Run Lighthouse PWA Audit / الخطوة 5: تشغيل تدقيق Lighthouse PWA

1. In DevTools, click **"Lighthouse"** tab
2. Select **"Progressive Web App"** category
3. (Optional) Select other categories if desired
4. Click **"Analyze page load"** or **"Generate report"**
5. Wait for the audit to complete

   **PWA Score / نقاط PWA**:
   - ✅ Aim for **90+ score** (excellent)
   - ✅ **80-89**: Good (minor improvements needed)
   - ⚠️ **Below 80**: Review failed checks

   **Common Checks / الفحوصات الشائعة**:
   - ✅ Manifest is valid
   - ✅ Icons are provided
   - ✅ Service worker is registered
   - ✅ Page works offline
   - ✅ Page is responsive
   - ✅ HTTPS is used (required for production)

   **Fixing Issues / إصلاح المشاكل**:
   - Review failed checks in the Lighthouse report
   - Click on each failed check for detailed information
   - Follow the recommendations to fix issues

---

## Section 2: Mobile Device Testing / القسم 2: اختبار الجهاز المحمول

### 2.1 Prerequisites / المتطلبات الأساسية

**Important**: PWAs require **HTTPS** to work properly on mobile devices. Local development (`http://localhost`) works, but for real device testing, you need HTTPS.

**مهم**: تتطلب PWAs **HTTPS** للعمل بشكل صحيح على الأجهزة المحمولة. يعمل التطوير المحلي (`http://localhost`)، ولكن لاختبار الجهاز الفعلي، تحتاج إلى HTTPS.

**Options for HTTPS / خيارات HTTPS**:

1. **Deploy to Vercel** (recommended):
   - Push code to GitHub
   - Connect repository to Vercel
   - Automatic HTTPS deployment
   - Free tier available

2. **Use ngrok** (for local testing):
   ```bash
   npx ngrok http 3000
   ```
   - Provides HTTPS tunnel to localhost
   - Free tier available
   - Good for quick testing

3. **Use localtunnel** (alternative):
   ```bash
   npx localtunnel --port 3000
   ```
   - Similar to ngrok
   - Free and open source

### 2.2 Android Testing (Edge) / اختبار Android (Edge)

#### Step 1: Access the App / الخطوة 1: الوصول إلى التطبيق

1. **Deploy to HTTPS** (Vercel, ngrok, or localtunnel)
2. **Open Microsoft Edge** on your Android device
3. **Navigate to your app URL**
4. The app should load normally

#### Step 2: Install the App / الخطوة 2: تثبيت التطبيق

1. **Look for install prompt**:
   - Edge may show a banner: "Add to Home Screen" or "Install app"
   - Or tap the **menu** (three dots) > **"Add to Home Screen"** or **"Install app"**

2. **Tap "Add" or "Install"**:
   - A dialog appears showing app name and icon
   - Verify icon and name are correct
   - Tap **"Add"** or **"Install"**

3. **Verify installation**:
   - App icon appears on home screen
   - Icon should match your `icon-192x192.png` or `icon-512x512.png`
   - Name should be "حملة الصلاة" (short_name from manifest)

#### Step 3: Test Standalone Mode / الخطوة 3: اختبار وضع Standalone

1. **Open the installed app** (tap icon on home screen)
2. **Verify standalone mode**:
   - ✅ No browser address bar
   - ✅ No browser navigation buttons
   - ✅ App runs in full-screen mode
   - ✅ Status bar shows theme color (`#16a34a` green)

3. **Test app functionality**:
   - ✅ All features work normally
   - ✅ Navigation works
   - ✅ RTL layout is correct
   - ✅ Arabic text displays properly

#### Step 4: Test Offline Functionality / الخطوة 4: اختبار وظائف عدم الاتصال

1. **Open the installed app**
2. **Enable Airplane Mode** (or disable Wi-Fi/mobile data)
3. **Verify offline behavior**:
   - ✅ App still opens
   - ✅ Cached pages load
   - ✅ UI is interactive
   - ✅ Previously loaded content is accessible

4. **Disable Airplane Mode** to restore connection
5. **Verify online behavior**:
   - ✅ New content loads
   - ✅ Real-time updates work (Supabase)
   - ✅ Service worker updates cache

### 2.3 iOS Testing (Safari/Edge) / اختبار iOS (Safari/Edge)

**Note**: On iOS, you can use either Safari or Microsoft Edge. Edge on iOS uses WebKit (same as Safari) but provides a different interface.

#### Step 1: Access the App / الخطوة 1: الوصول إلى التطبيق

1. **Deploy to HTTPS** (required for iOS)
2. **Open Safari** on your iOS device
3. **Navigate to your app URL**
4. The app should load normally

#### Step 2: Add to Home Screen / الخطوة 2: إضافة إلى الشاشة الرئيسية

1. **Tap the Share button** (square with arrow icon)
2. **Scroll down** and tap **"Add to Home Screen"**
3. **Customize if needed**:
   - Edit the name (defaults to short_name from manifest)
   - Verify icon preview
4. **Tap "Add"** in top right corner

#### Step 3: Test Standalone Mode / الخطوة 3: اختبار وضع Standalone

1. **Open the installed app** (tap icon on home screen)
2. **Verify standalone mode**:
   - ✅ No Safari browser UI
   - ✅ App runs in full-screen mode
   - ✅ Status bar appears (can be customized)
   - ✅ No back/forward buttons

3. **Test app functionality**:
   - ✅ All features work normally
   - ✅ RTL layout is correct
   - ✅ Arabic text displays properly
   - ✅ Touch interactions work

#### Step 4: Test Offline Functionality / الخطوة 4: اختبار وظائف عدم الاتصال

1. **Open the installed app**
2. **Enable Airplane Mode** (Settings > Airplane Mode)
3. **Verify offline behavior**:
   - ✅ App still opens
   - ✅ Cached content loads
   - ✅ Basic functionality works

4. **Disable Airplane Mode** to restore connection
5. **Verify online behavior**:
   - ✅ New content loads
   - ✅ Real-time updates work

**Note**: iOS Safari/Edge has limited service worker support compared to Android Edge. Some offline features may be more limited.

**ملاحظة**: Safari/Edge على iOS لديه دعم محدود لـ service worker مقارنة بـ Edge على Android. قد تكون بعض ميزات عدم الاتصال محدودة أكثر.

---

## Section 3: Verification Checklist / القسم 3: قائمة التحقق

Use this comprehensive checklist to verify all PWA functionality:

استخدم قائمة التحقق الشاملة هذه للتحقق من جميع وظائف PWA:

### Manifest Configuration / إعداد Manifest

- [ ] `manifest.json` loads without errors
- [ ] All required fields are present (name, short_name, icons, etc.)
- [ ] Theme color matches Islamic green (`#16a34a`)
- [ ] Display mode is "standalone"
- [ ] Icons array includes 192x192 and 512x512 icons
- [ ] Categories are specified
- [ ] Scope is set to "/"

### Icons / الأيقونات

- [ ] `icon-192x192.png` exists in `public/` directory
- [ ] `icon-512x512.png` exists in `public/` directory
- [ ] Icons load without 404 errors
- [ ] Icons appear in Edge DevTools > Application > Manifest
- [ ] Icons display correctly on home screen after installation
- [ ] Icons maintain quality on different Android icon shapes

### Service Worker / Service Worker

- [ ] Service worker registers successfully
- [ ] Service worker activates immediately (skipWaiting enabled)
- [ ] Service worker file (`sw.js`) is generated in `public/` directory
- [ ] No console errors about service worker registration
- [ ] Service worker appears in Edge DevTools > Application > Service Workers

### Offline Functionality / وظائف عدم الاتصال

- [ ] App works offline (cached pages load)
- [ ] Static assets (CSS, JS, images) load from cache when offline
- [ ] API routes have offline fallback (NetworkFirst strategy)
- [ ] Supabase requests have offline fallback
- [ ] Navigation works offline (cached routes)

### Installation / التثبيت

- [ ] "Add to Home Screen" prompt appears on Android Edge
- [ ] "Add to Home Screen" option appears in iOS Safari/Edge share menu
- [ ] App installs successfully on home screen
- [ ] Installed app opens in standalone mode (no browser UI)
- [ ] App icon and name are correct on home screen

### Visual and Theming / المرئيات والمظهر

- [ ] Theme color (`#16a34a`) appears in browser UI (Android Edge)
- [ ] Status bar style is correct (iOS)
- [ ] RTL layout works correctly in installed app
- [ ] Arabic text displays properly
- [ ] Fonts (Amiri, Cairo) load correctly

### Functionality / الوظائف

- [ ] All app features work in installed app
- [ ] Real-time Supabase updates work when online
- [ ] Navigation works correctly
- [ ] Forms and interactions work
- [ ] Performance is acceptable

### Cross-Browser Testing / الاختبار عبر المتصفحات

- [ ] Works on Edge (Android)
- [ ] Works on Safari (iOS)
- [ ] Works on Edge (Desktop) - Primary testing browser
- [ ] Works on Chrome (Desktop) - Secondary testing
- [ ] (Optional) Works on Firefox (limited PWA support)

### Lighthouse Audit / تدقيق Lighthouse

- [ ] PWA score is 90+ (excellent)
- [ ] All critical checks pass
- [ ] No major issues reported
- [ ] Performance score is acceptable
- [ ] Accessibility score is acceptable

---

## Section 4: Troubleshooting Common Issues / القسم 4: حل المشاكل الشائعة

### Issue 1: "Add to Home Screen" Doesn't Appear / المشكلة 1: لا يظهر "إضافة إلى الشاشة الرئيسية"

**Symptoms / الأعراض**:
- No install prompt appears on mobile
- "Add to Home Screen" option is missing from menu

**Solutions / الحلول**:

1. **Verify HTTPS**:
   - PWAs require HTTPS (except localhost)
   - Deploy to Vercel or use ngrok/localtunnel
   - Check URL starts with `https://`

2. **Check Manifest**:
   - Verify `manifest.json` is valid JSON
   - Check manifest loads without errors (Edge DevTools > Application > Manifest)
   - Ensure all required fields are present

3. **Verify Service Worker**:
   - Service worker must be registered
   - Check Edge DevTools > Application > Service Workers
   - Ensure no registration errors in Console

4. **Check Installation Criteria**:
   - User must visit site at least once
   - Site must be served over HTTPS
   - Manifest must be valid
   - Service worker must be registered
   - Icons must be provided

5. **Clear Browser Data**:
   - Clear cache and cookies
   - Try in incognito/private mode
   - Revisit the site

### Issue 2: Icons Don't Display Correctly / المشكلة 2: لا تظهر الأيقونات بشكل صحيح

**Symptoms / الأعراض**:
- Icons show as broken images
- Default browser icon appears instead
- Icons don't match design

**Solutions / الحلول**:

1. **Verify File Existence**:
   - Check `icon-192x192.png` exists in `public/` directory
   - Check `icon-512x512.png` exists in `public/` directory
   - Verify file names match exactly (case-sensitive)

2. **Check File Sizes**:
   - `icon-192x192.png` should be exactly 192x192 pixels
   - `icon-512x512.png` should be exactly 512x512 pixels
   - Use image editor to verify dimensions

3. **Verify Manifest References**:
   - Open `public/manifest.json`
   - Check icon paths start with `/` (e.g., `/icon-192x192.png`)
   - Ensure paths match actual file locations

4. **Clear Browser Cache**:
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Clear cache in browser settings
   - Test in incognito/private mode

5. **Check Console Errors**:
   - Open DevTools > Console
   - Look for 404 errors for icon files
   - Fix any path mismatches

### Issue 3: App Doesn't Work Offline / المشكلة 3: التطبيق لا يعمل بدون اتصال

**Symptoms / الأعراض**:
- App shows "You are offline" error
- Pages don't load when offline
- Static assets fail to load

**Solutions / الحلول**:

1. **Verify Service Worker**:
   - Check service worker is registered and activated
   - Edge DevTools > Application > Service Workers
   - Ensure no errors in Console

2. **Check Caching Strategies**:
   - Review `next.config.js` runtimeCaching configuration
   - Verify caching strategies are appropriate
   - Check cache names match in Edge DevTools > Application > Cache Storage

3. **Test Cache Population**:
   - Visit pages while online
   - Check Edge DevTools > Application > Cache Storage
   - Verify caches are being created and populated

4. **Verify Build Configuration**:
   - Ensure PWA is not disabled (check `next.config.js`)
   - Verify `@ducanh2912/next-pwa` is installed
   - Rebuild the app (`npm run build`)

5. **Check Network Requests**:
   - DevTools > Network tab
   - Verify requests are being cached
   - Check "Size" column shows "(from disk cache)" when offline

### Issue 4: Service Worker Not Registering / المشكلة 4: Service Worker لا يسجل

**Symptoms / الأعراض**:
- No service worker appears in DevTools
- Console shows registration errors
- PWA features don't work

**Solutions / الحلول**:

1. **Verify Production Build**:
   - PWA is disabled in development mode (per `next.config.js`)
   - Run `npm run build` then `npm start`
   - Don't use `npm run dev` for PWA testing

2. **Check Package Installation**:
   - Verify `@ducanh2912/next-pwa` is in `package.json`
   - Run `npm install` to ensure package is installed
   - Check `node_modules/@ducanh2912/next-pwa` exists

3. **Review Configuration**:
   - Check `next.config.js` for PWA configuration
   - Verify `withPWA()` wraps the config
   - Ensure no syntax errors

4. **Check Console Errors**:
   - Open DevTools > Console
   - Look for service worker registration errors
   - Fix any configuration issues

5. **Verify File Generation**:
   - After build, check `public/` directory
   - Look for `sw.js` or `sw.js?xxx` file
   - If missing, check build logs for errors

### Issue 5: Theme Color Not Appearing / المشكلة 5: لون المظهر لا يظهر

**Symptoms / الأعراض**:
- Browser UI doesn't show green theme color
- Status bar doesn't match theme

**Solutions / الحلول**:

1. **Verify Manifest**:
   - Check `public/manifest.json` has `"theme_color": "#16a34a"`
   - Ensure value matches exactly (including `#`)

2. **Check Layout Metadata**:
   - Verify `app/layout.tsx` has `themeColor: '#16a34a'` in viewport
   - Check metadata includes theme color

3. **Clear Cache**:
   - Clear browser cache
   - Hard refresh (Ctrl+Shift+R)
   - Reinstall app (remove and re-add to home screen)

4. **Platform-Specific**:
   - **Android Edge**: Theme color appears in browser UI
   - **iOS Safari/Edge**: Limited theme color support (status bar only)

### Issue 6: RTL Layout Issues in Installed App / المشكلة 6: مشاكل تخطيط RTL في التطبيق المثبت

**Symptoms / الأعراض**:
- RTL layout doesn't work correctly in installed app
- Text alignment is wrong
- Navigation is reversed

**Solutions / الحلول**:

1. **Verify HTML Attributes**:
   - Check `app/layout.tsx` has `dir="rtl"` and `lang="ar"` on `<html>` tag
   - Ensure these are set correctly

2. **Check CSS**:
   - Verify RTL-specific CSS is loaded
   - Check Tailwind RTL configuration
   - Test in browser before installing

3. **Test in Browser First**:
   - Verify RTL works in browser
   - Fix any issues before testing installed app
   - Reinstall app after fixes

---

## Section 5: Production Testing (After Vercel Deployment) / القسم 5: اختبار الإنتاج (بعد النشر على Vercel)

### 5.1 Pre-Deployment Checklist / قائمة التحقق قبل النشر

Before deploying to production, ensure:

قبل النشر إلى الإنتاج، تأكد من:

- [ ] All environment variables are set in Vercel dashboard
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is configured
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is configured
- [ ] Icons are created and in `public/` directory
- [ ] Manifest is properly configured
- [ ] Service worker builds without errors locally

### 5.2 Post-Deployment Testing / اختبار ما بعد النشر

1. **Verify Deployment**:
   - Check Vercel deployment logs for errors
   - Ensure build completes successfully
   - Verify all files are deployed

2. **Test on Real Devices**:
   - Use actual mobile devices (not just emulators)
   - Test on both Android and iOS
   - Test on different screen sizes

3. **Cross-Browser Testing**:
   - Edge (Android and Desktop) - Primary
   - Safari (iOS)
   - Chrome (Desktop) - Secondary
   - Firefox (limited support)

4. **Monitor Service Worker Updates**:
   - Deploy updates and verify service worker updates
   - Test that new versions activate correctly
   - Verify users get latest version

5. **Performance Monitoring**:
   - Use Vercel Analytics (if enabled)
   - Monitor Core Web Vitals
   - Check Lighthouse scores in production

### 5.3 Production Verification / التحقق من الإنتاج

- [ ] App loads quickly (< 3 seconds)
- [ ] Service worker registers on first visit
- [ ] "Add to Home Screen" prompt appears
- [ ] App installs successfully
- [ ] Offline functionality works
- [ ] Real-time features work (Supabase)
- [ ] No console errors in production
- [ ] Lighthouse PWA score is 90+

---

## Additional Resources / موارد إضافية

- **PWA Documentation**: [web.dev/progressive-web-apps/](https://web.dev/progressive-web-apps/)
- **Service Worker API**: [MDN Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- **next-pwa Documentation**: [GitHub - @ducanh2912/next-pwa](https://github.com/DuCanhGH/next-pwa)
- **Lighthouse PWA Audit**: [web.dev/lighthouse-pwa/](https://web.dev/lighthouse-pwa/)
- **PWA Checklist**: [web.dev/pwa-checklist/](https://web.dev/pwa-checklist/)

---

## Summary / الملخص

Thorough testing is essential to ensure your PWA works correctly across all platforms and devices. Follow this guide systematically, use the verification checklist, and address any issues before production deployment.

الاختبار الشامل ضروري للتأكد من أن PWA الخاص بك يعمل بشكل صحيح عبر جميع المنصات والأجهزة. اتبع هذا الدليل بشكل منهجي، واستخدم قائمة التحقق، وعالج أي مشاكل قبل نشر الإنتاج.

**Testing Complete! / الاختبار مكتمل!**

Your PWA should now be fully tested and ready for production use. If you encounter any issues not covered in this guide, refer to the troubleshooting section or consult the additional resources.

يجب أن يكون PWA الخاص بك الآن مختبرًا بالكامل وجاهزًا للاستخدام في الإنتاج. إذا واجهت أي مشاكل غير مذكورة في هذا الدليل، راجع قسم حل المشاكل أو استشر الموارد الإضافية.

