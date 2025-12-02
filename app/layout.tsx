import type { Metadata, Viewport } from 'next'
import { Amiri, Cairo } from 'next/font/google'
import './globals.css'

const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic', 'latin'],
  variable: '--font-arabic-display',
  display: 'swap',
})

const cairo = Cairo({
  weight: ['400', '500', '600', '700'],
  subsets: ['arabic', 'latin'],
  variable: '--font-arabic-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'حملة الصلاة على النبي ﷺ',
  description: 'تطبيق لتتبع الصلاة على النبي محمد ﷺ بشكل جماعي ومجهول',
  applicationName: 'حملة الصلاة على النبي ﷺ',
  icons: {
    icon: '/icon-192x192.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'حملة الصلاة',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'حملة الصلاة على النبي ﷺ',
    description: 'تطبيق لتتبع الصلاة على النبي محمد ﷺ بشكل جماعي ومجهول',
    type: 'website',
    locale: 'ar',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#16a34a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Favicon Links */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/icon-192x192.png" />
        <link rel="shortcut icon" type="image/png" href="/icon-192x192.png" />
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="حملة الصلاة" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
      </head>
      <body className={`${amiri.variable} ${cairo.variable} font-arabic-body`}>
        {children}
      </body>
    </html>
  )
}

