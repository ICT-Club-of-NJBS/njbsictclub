import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/contexts/theme-context'
import CookieBanner from '@/components/CookieBanner'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://njbsictclubss.vercel.app'),
  title: 'ICT Club of NJBS | Tech Community',
  description:
    'Innovation, Creativity, and Technology Club - Join our community of tech enthusiasts',
  generator: 'ICT Club NJBS',
  icons: {
    icon: '/ictclubNJBS.jpg',
    shortcut: '/ictclubNJBS.jpg',
    apple: '/ictclubNJBS.jpg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
    >
      {/* NOTE: In Next.js App Router, do NOT manually add a <head> tag here. 
        Next.js manages the head automatically via the Metadata API and <Script /> components.
      */}
      <body
        className="font-sans antialiased bg-background text-foreground"
        suppressHydrationWarning
      >
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5849186110366340"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1ECTFX3T01"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1ECTFX3T01');
          `}
        </Script>

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}

          <CookieBanner />

          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}