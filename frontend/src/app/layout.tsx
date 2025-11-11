import { AuthProvider } from '@/context/auth/AuthContext';
import '@/styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Metadata } from 'next';
import { Forum, Montserrat } from 'next/font/google';

const forum = Forum({
  variable: '--font-Forum',
  subsets: ['latin'],
  weight: '400',
});

const montserrat = Montserrat({
  variable: '--font-Montserrat',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "InkBid",
  description: "An Auction Style Marketplace for Creative Content",
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${forum.variable} ${montserrat.variable} antialiased`}>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <AuthProvider>{children}</AuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
