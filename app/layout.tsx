import type { Metadata } from 'next';
import './globals.css';
import '../styles/leaflet.css';

export const metadata: Metadata = {
  title: 'VasateySec - Emergency Monitoring Dashboard',
  description: 'Real-time emergency alert monitoring system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}
