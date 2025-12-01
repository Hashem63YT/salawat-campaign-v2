# حملة الصلاة على النبي ﷺ
# Prophet Muhammad ﷺ Salawat Campaign

## Description / الوصف

تطبيق ويب لتتبع عدد الصلوات على النبي محمد ﷺ بشكل جماعي ومجهول. يساهم المستخدمون في زيادة العداد الإجمالي دون الحاجة إلى تسجيل الدخول أو الكشف عن هويتهم.

A web application for tracking collective anonymous Salawat (blessings) on Prophet Muhammad ﷺ. Users contribute to the total counter without needing to log in or reveal their identity.

## Features / المميزات

- ✅ Real-time counter tracking / تتبع العداد في الوقت الفعلي
- ✅ Anonymous contributions / مساهمات مجهولة
- ✅ Contributor name tracking / تتبع أسماء المساهمين
- ✅ PWA support (installable on mobile devices) / دعم PWA (قابل للتثبيت على الأجهزة المحمولة)
- ✅ Fully Arabic interface with RTL support / واجهة عربية كاملة مع دعم RTL
- ✅ Responsive design for all devices / تصميم متجاوب لجميع الأجهزة
- ✅ Islamic-themed elegant design / تصميم أنيق بموضوع إسلامي
- ✅ Luxurious success animations / رسوم متحركة فاخرة للنجاح
- ✅ Optimistic UI updates / تحديثات واجهة المستخدم التفاؤلية

## Tech Stack / التقنيات المستخدمة

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Supabase** for database and real-time updates
- **Framer Motion** for smooth animations
- **Vercel** for deployment

## Production Deployment / النشر الإنتاجي

### Live Application / التطبيق المباشر

**Production URL / رابط الإنتاج**: [حملة الصلاة على النبي ﷺ](https://your-actual-domain.vercel.app)

**Deployment Status / حالة النشر**: ✅ Deployed / تم النشر

**Hosting / الاستضافة**: Vercel (Free Tier)

**Database / قاعدة البيانات**: Supabase (Free Tier)

### Deployment Information / معلومات النشر

**Status / الحالة**: ✅ Deployed and Operational / تم النشر وهو يعمل

The application is fully deployed to Vercel with automated Git-based deployments. Setup guides have been removed as they are no longer needed post-deployment.

التطبيق منشور بالكامل على Vercel مع نشر تلقائي قائم على Git. تم إزالة أدلة الإعداد لأنها لم تعد مطلوبة بعد النشر.

## Getting Started / البدء

> **Note**: These instructions are for local development. For production deployment, see the [Deployment Information](#deployment-information--معلومات-النشر) section below.

### Prerequisites / المتطلبات

- Node.js 18.17 or higher
- npm, yarn, or pnpm
- Git (optional)

### Installation / التثبيت

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables (see Environment Variables section)

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build / البناء

```bash
npm run build
npm start
```

### Lint / فحص الكود

```bash
npm run lint
```

## Environment Variables / متغيرات البيئة

The following environment variables are required:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Setup Instructions / تعليمات الإعداد

1. **Create `.env.local` file / إنشاء ملف `.env.local`**:
   - Create a new file named `.env.local` in the project root directory
   - انشئ ملف جديد باسم `.env.local` في المجلد الرئيسي للمشروع

2. **Get your Supabase credentials / احصل على بيانات اعتماد Supabase**:
   - Go to your Supabase project dashboard: https://app.supabase.com
   - Navigate to: **Project Settings** > **API**
   - Copy the **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - Copy the **anon public** key (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - اذهب إلى لوحة تحكم مشروع Supabase: https://app.supabase.com
   - انتقل إلى: **Project Settings** > **API**
   - انسخ **Project URL** (هذا هو `NEXT_PUBLIC_SUPABASE_URL`)
   - انسخ مفتاح **anon public** (هذا هو `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

3. **Add to `.env.local` / أضف إلى `.env.local`**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   Replace the values with your actual Supabase credentials.
   استبدل القيم ببيانات اعتماد Supabase الفعلية.

4. **Restart the development server / أعد تشغيل خادم التطوير**:
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again
   - أوقف الخادم الحالي (Ctrl+C)
   - شغّل `npm run dev` مرة أخرى

**Note / ملاحظة**: The `.env.local` file is gitignored and will not be committed to the repository. This keeps your credentials secure.
ملف `.env.local` محمي من Git ولن يتم إضافته إلى المستودع. هذا يحافظ على أمان بيانات اعتمادك.

For detailed database reset instructions, see [DATABASE_RESET_GUIDE.md](./DATABASE_RESET_GUIDE.md).

## Project Structure / هيكل المشروع

```
├── #admin/          # Documentation and guides
│   ├── DATABASE_RESET_GUIDE.md
│   ├── PRODUCTION_TESTING_REPORT.md
│   ├── FUTURE_ROADMAP.md
│   └── README.md (this file)
├── app/             # Next.js App Router pages and layouts
│   ├── page.tsx     # Main campaign page
│   ├── layout.tsx   # Root layout with RTL/PWA config
│   └── globals.css  # Global styles and Islamic theme
├── lib/             # Utility functions and configurations
│   └── supabase.ts  # Supabase client and database operations
├── public/          # Static assets (icons, manifest, etc.)
│   ├── manifest.json
│   ├── icon-192x192.png
│   └── icon-512x512.png
├── next.config.js   # Next.js and PWA configuration
├── tailwind.config.ts # Tailwind CSS with Islamic theme
├── vercel.json      # Vercel deployment configuration
└── package.json     # Dependencies and scripts
```

## Testing & Quality Assurance / الاختبار وضمان الجودة

### Production Testing / اختبار الإنتاج

A comprehensive testing report template is available in [PRODUCTION_TESTING_REPORT.md](./PRODUCTION_TESTING_REPORT.md). Use this document to verify all features work correctly in production.

### Testing Checklist / قائمة الاختبار

- [ ] Core features (counters, real-time updates, form submission)
- [ ] Cross-browser compatibility (Edge, Chrome, Safari, Firefox)
- [ ] Cross-device compatibility (Desktop, Tablet, Mobile)
- [ ] PWA installation (Android, iOS, Desktop)
- [ ] Offline functionality
- [ ] Performance (Lighthouse scores 90+)
- [ ] Supabase integration (database, real-time, RPC)
- [ ] Security (HTTPS, no exposed secrets)

## Future Enhancements / التحسينات المستقبلية

A detailed roadmap for future phases is available in [FUTURE_ROADMAP.md](./FUTURE_ROADMAP.md).

### Planned Phases / المراحل المخططة

- **Phase 2**: Multi-campaign platform / منصة متعددة الحملات
- **Phase 3**: Admin dashboard / لوحة تحكم الإدارة
- **Phase 4**: Quran reading campaigns / حملات قراءة القرآن
- **Phase 5**: Enhanced analytics / تحليلات محسّنة
- **Phase 6**: Social sharing features / ميزات المشاركة الاجتماعية

For detailed timelines, features, and technical specifications, see [FUTURE_ROADMAP.md](./FUTURE_ROADMAP.md).

## Documentation / التوثيق

### Available Guides / الأدلة المتاحة

- [Database Reset Guide](./DATABASE_RESET_GUIDE.md) - Instructions for resetting test data in Supabase / تعليمات إعادة تعيين بيانات الاختبار في Supabase
- [Production Testing Report](./PRODUCTION_TESTING_REPORT.md) - Post-deployment testing / اختبار ما بعد النشر
- [Future Roadmap](./FUTURE_ROADMAP.md) - Planned enhancements / التحسينات المخططة

> **Note / ملاحظة**: Setup and migration files have been removed to keep the project clean and maintainable. The application is fully deployed and operational. / تم إزالة ملفات الإعداد والهجرة للحفاظ على المشروع نظيفاً وقابلاً للصيانة. التطبيق منشور بالكامل ويعمل.

### 🔧 Maintenance / الصيانة

For ongoing maintenance operations:

للعمليات الصيانة المستمرة:

- **Database Operations / عمليات قاعدة البيانات**: See [DATABASE_RESET_GUIDE.md](./DATABASE_RESET_GUIDE.md) for resetting test data
  - **⚠️ Important / مهم**: Database reset is a **manual operation**. To clear fake or test data, you must open Supabase, go to the SQL Editor, and run the commands from [DATABASE_RESET_GUIDE.md](./DATABASE_RESET_GUIDE.md). Consider performing this step before sharing the production URL widely so the counters start from zero as desired.
  - **⚠️ مهم**: إعادة تعيين قاعدة البيانات هي **عملية يدوية**. لمسح بيانات الاختبار أو الوهمية، يجب عليك فتح Supabase، والانتقال إلى محرر SQL، وتشغيل الأوامر من [DATABASE_RESET_GUIDE.md](./DATABASE_RESET_GUIDE.md). فكر في تنفيذ هذه الخطوة قبل مشاركة رابط الإنتاج على نطاق واسع حتى تبدأ العدادات من الصفر كما هو مطلوب.
- **Schema Reference / مرجع المخطط**: All schema types are documented in `lib/supabase.ts`
- **Testing / الاختبار**: See [PRODUCTION_TESTING_REPORT.md](./PRODUCTION_TESTING_REPORT.md) for testing procedures
- **Future Features / الميزات المستقبلية**: See [FUTURE_ROADMAP.md](./FUTURE_ROADMAP.md) for planned enhancements

- **عمليات قاعدة البيانات**: راجع [DATABASE_RESET_GUIDE.md](./DATABASE_RESET_GUIDE.md) لإعادة تعيين بيانات الاختبار
  - **⚠️ مهم**: إعادة تعيين قاعدة البيانات هي **عملية يدوية**. لمسح بيانات الاختبار أو الوهمية، يجب عليك فتح Supabase، والانتقال إلى محرر SQL، وتشغيل الأوامر من [DATABASE_RESET_GUIDE.md](./DATABASE_RESET_GUIDE.md). فكر في تنفيذ هذه الخطوة قبل مشاركة رابط الإنتاج على نطاق واسع حتى تبدأ العدادات من الصفر كما هو مطلوب.
- **مرجع المخطط**: جميع أنواع المخطط موثقة في `lib/supabase.ts`
- **الاختبار**: راجع [PRODUCTION_TESTING_REPORT.md](./PRODUCTION_TESTING_REPORT.md) لإجراءات الاختبار
- **الميزات المستقبلية**: راجع [FUTURE_ROADMAP.md](./FUTURE_ROADMAP.md) للتحسينات المخططة

## Contributing / المساهمة

This project is deployed and operational. Contributions, bug reports, and feature suggestions are welcome.

هذا المشروع منشور ويعمل. المساهمات وتقارير الأخطاء واقتراحات الميزات مرحب بها.

### How to Contribute / كيفية المساهمة

1. Report bugs or suggest features by creating an issue
2. Fork the repository and create a feature branch
3. Follow the code style and conventions in existing files (see `app/page.tsx` and `lib/supabase.ts` for examples)
4. Test your changes thoroughly (see [PRODUCTION_TESTING_REPORT.md](./PRODUCTION_TESTING_REPORT.md))
5. Submit a pull request with a clear description

## License / الترخيص

MIT License

## Contact / الاتصال

For questions, support, or feedback:

- Check the documentation guides in the [#admin](./) directory
- Review the [PRODUCTION_TESTING_REPORT.md](./PRODUCTION_TESTING_REPORT.md) for troubleshooting
- Refer to the [DATABASE_RESET_GUIDE.md](./DATABASE_RESET_GUIDE.md) for database operations

## Acknowledgments / الشكر والتقدير

- Built with Next.js, React, and TypeScript
- Styled with Tailwind CSS and custom Islamic theme
- Database and real-time updates powered by Supabase
- Animations by Framer Motion
- Hosted on Vercel
- Arabic fonts: Amiri and Cairo from Google Fonts

---

**May peace and blessings be upon Prophet Muhammad ﷺ**
