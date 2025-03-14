import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
  title: {
    template: '%s - AI Partner',
    default: 'AI Partner',
  },
  description: 'AI Partner for ANYDC 2025',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <Script
        src='https://unpkg.com/media-recorder-js/mediaRecorder.js'
        strategy='afterInteractive'
      />

      <body cz-shortcut-listen='true'>{children}</body>
    </html>
  );
}
