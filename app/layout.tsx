import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { FirebaseProvider } from '@/components/FirebaseProvider';
import ErrorBoundary from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'EdTech Admission Funnel AI System',
  description: 'AI-powered student lead qualification, scoring, and conversion system.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ErrorBoundary>
          <FirebaseProvider>
            {children}
          </FirebaseProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
