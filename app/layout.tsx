import React from 'react';
import type { Metadata } from 'next';
import { Providers } from './providers';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

export const metadata: Metadata = {
  title: 'InkSmith Studios | Premium Tattoo Art',
  description: 'A premium tattoo studio web application featuring artist portfolios, appointment booking, and AI-powered tattoo concept generation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  fontFamily: {
                    serif: ['Cinzel', 'serif'],
                    sans: ['Inter', 'sans-serif'],
                  },
                  colors: {
                    ink: {
                      950: '#0a0a0a',
                      900: '#171717',
                      800: '#262626',
                      accent: '#D4AF37',
                    }
                  }
                }
              }
            }
          `
        }} />
        <style dangerouslySetInnerHTML={{
          __html: `
            body { background-color: #0a0a0a; color: #e5e5e5; }
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: #171717; }
            ::-webkit-scrollbar-thumb { background: #404040; border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: #525252; }
          `
        }} />
      </head>
      <body className="flex flex-col min-h-screen bg-ink-950 text-white font-sans selection:bg-ink-accent selection:text-white">
        <Providers>
          <Navbar />
          <ScrollToTop />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}