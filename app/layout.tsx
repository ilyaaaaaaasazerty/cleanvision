import type { Metadata } from 'next';
import './globals.css';
import WhatsAppButton from '@/components/WhatsAppButton';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'CleanVision — Luxury Cleaning Services',
  description:
    'Experience immaculate spaces crafted with precision. Premium residential and commercial cleaning services tailored for those who demand perfection.',
  keywords: ['luxury cleaning', 'professional cleaning', 'premium cleaning service'],
  openGraph: {
    title: 'CleanVision — Where Spaces Become Art',
    description: 'Luxury cleaning services that transform your environment.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-obsidian text-alabaster antialiased">
        <Navbar />
        <main>{children}</main>
        <WhatsAppButton phoneNumber="+213555000000" />
      </body>
    </html>
  );
}
