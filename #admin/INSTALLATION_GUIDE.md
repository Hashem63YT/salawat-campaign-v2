# دليل التثبيت / Installation Guide

## Prerequisites / المتطلبات

### Node.js
- **Version Required**: Node.js 18.17 or higher
- **How to Install**:
  - **Windows**: Download from [nodejs.org](https://nodejs.org/) and run the installer
  - **macOS**: Download from [nodejs.org](https://nodejs.org/) or use Homebrew: `brew install node`
  - **Linux**: Use your distribution's package manager or download from [nodejs.org](https://nodejs.org/)
  
- **Verify Installation**:
  ```bash
  node --version
  npm --version
  ```
  Both commands should return version numbers (e.g., v18.17.0 and 9.6.7)

### Package Manager
Choose one of the following:
- **npm** (comes with Node.js)
- **yarn**: Install with `npm install -g yarn`
- **pnpm**: Install with `npm install -g pnpm`

### Git (Optional)
- Download from [git-scm.com](https://git-scm.com/)
- Required only if cloning from a Git repository

### Code Editor
- **Recommended**: Visual Studio Code
- **Recommended Extensions**:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

---

## Step-by-Step Installation / خطوات التثبيت خطوة بخطوة

### Step 1: Install Node.js / الخطوة 1: تثبيت Node.js

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the setup wizard
4. Restart your terminal/command prompt
5. Verify installation:
   ```bash
   node --version
   npm --version
   ```

**Troubleshooting / حل المشاكل**:
- If `node` command is not found, add Node.js to your system PATH
- On Windows, restart your computer after installation
- On Linux, you may need to use `sudo` for global installations

---

### Step 2: Clone or Download Project / الخطوة 2: استنساخ أو تحميل المشروع

#### Option A: Using Git / الخيار أ: استخدام Git
```bash
git clone <repository-url>
cd salawat-campaign
```

#### Option B: Download ZIP / الخيار ب: تحميل ZIP
1. Download the project as a ZIP file
2. Extract it to your desired location
3. Open terminal/command prompt in the extracted folder

---

### Step 3: Install Dependencies / الخطوة 3: تثبيت التبعيات

Navigate to the project directory and run:

```bash
npm install
```

**Or with yarn**:
```bash
yarn install
```

**Or with pnpm**:
```bash
pnpm install
```

**What this does / ما يفعله هذا الأمر**:
- Reads `package.json` to identify required packages
- Downloads and installs all dependencies to `node_modules/` folder
- Creates `package-lock.json` (or `yarn.lock` / `pnpm-lock.yaml`) for version locking

**Expected Output / الناتج المتوقع**:
- Progress bars showing package downloads
- Completion message
- Duration: 1-5 minutes depending on internet speed

**Common Errors / الأخطاء الشائعة**:
- **Network timeout**: Check internet connection, try again
- **Permission denied**: On Linux/macOS, avoid using `sudo` with npm. Fix permissions instead
- **Module not found**: Delete `node_modules` and `package-lock.json`, then run `npm install` again

---

### Step 4: Environment Variables Setup / الخطوة 4: إعداد متغيرات البيئة

**Note**: This step requires Supabase configuration. Please refer to `SUPABASE_SETUP_GUIDE.md` (to be created) for detailed instructions.

**Required Environment Variables / متغيرات البيئة المطلوبة**:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

**Create `.env.local` file** in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Important**: Do not commit `.env.local` to Git. It's already in `.gitignore`.

---

### Step 5: Run Development Server / الخطوة 5: تشغيل خادم التطوير

Run the following command:

```bash
npm run dev
```

**Or with yarn**:
```bash
yarn dev
```

**Or with pnpm**:
```bash
pnpm dev
```

**Expected Output / الناتج المتوقع**:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in X.XXs
```

**Access the Application / الوصول إلى التطبيق**:
- Open your browser
- Navigate to: `http://localhost:3000`
- You should see the placeholder page with Arabic text

**Stop the Server / إيقاف الخادم**:
- Press `Ctrl + C` in the terminal
- Or close the terminal window

---

### Step 6: Verify Installation / الخطوة 6: التحقق من التثبيت

1. **Browser Check / فحص المتصفح**:
   - Open `http://localhost:3000`
   - You should see: "حملة الصلاة على النبي ﷺ"
   - Text should be in Arabic with RTL layout

2. **Console Check / فحص وحدة التحكم**:
   - Open browser Developer Tools (F12)
   - Check Console tab for errors
   - Should see no errors (only Next.js info messages)

3. **Visual Check / الفحص البصري**:
   - Text should be right-aligned (RTL)
   - Fonts should load correctly (Arabic fonts)
   - Page should be responsive (try resizing window)

---

## Common Issues and Solutions / المشاكل الشائعة والحلول

### Port 3000 Already in Use / المنفذ 3000 مستخدم بالفعل

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution / الحل**:
1. Find and close the process using port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:3000 | xargs kill -9
   ```
2. Or use a different port:
   ```bash
   npm run dev -- -p 3001
   ```

---

### Module Not Found Errors / أخطاء وحدة غير موجودة

**Error**: `Cannot find module 'xxx'` or `Module not found`

**Solution / الحل**:
1. Delete `node_modules` folder
2. Delete `package-lock.json` (or `yarn.lock` / `pnpm-lock.yaml`)
3. Run `npm install` again
4. If problem persists, check `package.json` for correct package names

---

### TypeScript Errors / أخطاء TypeScript

**Error**: Type errors in terminal or IDE

**Solution / الحل**:
1. Ensure TypeScript is installed: `npm list typescript`
2. Restart your IDE/editor
3. Run `npm run build` to see detailed error messages
4. Check `tsconfig.json` is properly configured

---

### Font Loading Issues / مشاكل تحميل الخطوط

**Issue**: Arabic fonts not displaying correctly

**Solution / الحل**:
1. Check internet connection (fonts load from Google Fonts)
2. Verify `app/layout.tsx` has correct font imports
3. Check browser console for font loading errors
4. Clear browser cache and reload

---

### RTL Layout Not Working / تخطيط RTL لا يعمل

**Issue**: Text is left-aligned instead of right-aligned

**Solution / الحل**:
1. Verify `app/layout.tsx` has `dir="rtl"` in `<html>` tag
2. Check `app/globals.css` for RTL-specific styles
3. Ensure Tailwind CSS is properly configured
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

---

## Next Steps / الخطوات التالية

1. **Complete Supabase Setup**:
   - Follow `SUPABASE_SETUP_GUIDE.md` (to be created)
   - Configure your database
   - Set up environment variables

2. **Start Development**:
   - Review project structure
   - Read `README.md` for project overview
   - Check component files as they're added

3. **Additional Resources**:
   - Next.js Documentation: [nextjs.org/docs](https://nextjs.org/docs)
   - Tailwind CSS Documentation: [tailwindcss.com/docs](https://tailwindcss.com/docs)
   - Supabase Documentation: [supabase.com/docs](https://supabase.com/docs)

---

## Arabic Translation / الترجمة العربية

### ملاحظات مهمة / Important Notes

- تأكد من تثبيت Node.js 18.17 أو أحدث
- استخدم مدير حزم واحد فقط (npm أو yarn أو pnpm)
- لا تنس إعداد متغيرات البيئة قبل تشغيل التطبيق
- في حالة وجود مشاكل، ابدأ بحذف `node_modules` وإعادة التثبيت

### الدعم / Support

إذا واجهت مشاكل غير مذكورة هنا:
1. تحقق من سجلات الأخطاء في وحدة التحكم
2. راجع وثائق Next.js الرسمية
3. تأكد من أن جميع المتطلبات مثبتة بشكل صحيح

---

**Happy Coding! / برمجة سعيدة!**

