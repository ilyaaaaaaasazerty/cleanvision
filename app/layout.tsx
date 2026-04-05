import type { Metadata } from 'next';
import './globals.css';
import WhatsAppButton from '@/components/WhatsAppButton';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Amin Crystal Clean — Luxury Cleaning Services',
  description:
    'The pinnacle of professional cleaning in Algiers. Bespoke solutions for residential and commercial spaces.',
  keywords: ['luxury cleaning', 'professional cleaning', 'premium cleaning service'],
  openGraph: {
    title: 'Amin Crystal Clean — Where Spaces Become Art',
    description: 'Breathtaking clarity. Absolute precision.',
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
