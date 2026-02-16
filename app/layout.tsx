import React from 'react';
import type { Metadata } from 'next';
import { Providers } from './providers';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import './globals.css';

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
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet" />
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
