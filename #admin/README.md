# حملة الصلاة على النبي ﷺ
# Prophet Muhammad ﷺ Salawat Campaign

## Description / الوصف

تطبيق ويب لتتبع عدد الصلوات على النبي محمد ﷺ بشكل جماعي ومجهول. يساهم المستخدمون في زيادة العداد الإجمالي دون الحاجة إلى تسجيل الدخول أو الكشف عن هويتهم.

A web application for tracking collective anonymous Salawat (blessings) on Prophet Muhammad ﷺ. Users contribute to the total counter without needing to log in or reveal their identity.

## Features / المميزات

- ✅ Real-time counter tracking / تتبع العداد في الوقت الفعلي
- ✅ Anonymous contributions / مساهمات مجهولة
- ✅ PWA support (installable on mobile devices) / دعم PWA (قابل للتثبيت على الأجهزة المحمولة)
- ✅ Fully Arabic interface with RTL support / واجهة عربية كاملة مع دعم RTL
- ✅ Responsive design for all devices / تصميم متجاوب لجميع الأجهزة
- ✅ Islamic-themed elegant design / تصميم أنيق بموضوع إسلامي

## Tech Stack / التقنيات المستخدمة

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Supabase** for database and real-time updates
- **Framer Motion** for smooth animations
- **Vercel** for deployment

## Getting Started / البدء

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

See `INSTALLATION_GUIDE.md` for detailed setup instructions.

## Project Structure / هيكل المشروع

```
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable React components
├── lib/             # Utility functions and configurations
├── public/          # Static assets (icons, images, etc.)
└── ...config files  # Configuration files
```

## Future Enhancements / التحسينات المستقبلية

- Multi-campaign platform / منصة متعددة الحملات
- Quran reading campaigns / حملات قراءة القرآن
- Admin dashboard / لوحة تحكم الإدارة

## License / الترخيص

MIT License

## Contact / الاتصال

For questions or support, please refer to the project documentation.

---

**May peace and blessings be upon Prophet Muhammad ﷺ**
