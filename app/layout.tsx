import Providers from "@/context/providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "@/styles/app.css";
import { Topbar } from "@/components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Postbox | API Testing Client for Developers",
  description: "A professional, minimalist, and keyboard-driven API testing client. Import curl, manage collections, and test endpoints without the bloat. The modern alternative to Postman and Insomnia.",
  keywords: ["Postbox", "API Client", "API Testing Tool", "Postman Alternative", "Insomnia Alternative", "HTTP Client", "CORS-free API test", "Software Development Tool"],
  authors: [{ name: "Pantho Haque", url: "https://panthohaque.vercel.app" }],
  creator: "Pantho Haque",
  publisher: "Pantho Haque",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://postbox-pantho.vercel.app'),
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Postbox | API Testing Client for Developers',
    description: 'Minimalist, keyboard-driven API testing client for modern developers.',
    url: 'https://postbox-pantho.vercel.app/',
    siteName: 'Postbox',
    images: [
      {
        url: '/assets/images/logo.png', // Ideally a PNG/JPG for better social sharing, but using logo for now
        width: 1200,
        height: 630,
        alt: 'Postbox Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Postbox | API Testing Client for Developers',
    description: 'Minimalist, keyboard-driven API testing client for modern developers.',
    creator: '@xxxxx', // Assuming this is the handle
    images: ['/assets/images/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Postbox',
  operatingSystem: 'Web',
  applicationCategory: 'DeveloperApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Person',
    name: 'Pantho Haque',
    url: 'https://panthohaque.vercel.app',
  },
  description: 'A professional, minimalist, and keyboard-driven API testing client. The modern alternative to Postman and Insomnia.',
  screenshot: 'https://postbox-pantho.vercel.app/assets/images/logo.svg',
  softwareVersion: '1.0.0',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen h-screen`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <Topbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}