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
  title: "PostBox",
  description: "Test Your API",
  keywords: ["PostBox", "Test Your API", "API", "Post", "Get", "Put", "Delete", "Postman", "Insomnia", "API Testing", "API Client", "API Tool", "API Tester", "API Client", "API Tool"],
  openGraph: {
    title: 'PostBox',
    description: 'Test Your API',
    url: 'https://postbox-pantho.vercel.app/'
  }
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
        <Providers>
          <Topbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}