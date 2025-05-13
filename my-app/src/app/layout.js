// src/app/layout.js
import "./globals.css";
import { SessionProvider } from "next-auth/react"; // Import SessionProvider from next-auth
import { Toaster } from 'react-hot-toast'; // Import Toaster
export const metadata = {
  title: 'Auspicioussoft - AI-Powered Software Development',
  description: 'Innovative software and mobile app solutions tailored to your needs',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Wrap the entire app with SessionProvider to provide session context */}
        <SessionProvider>
          <Toaster position="top-right" /> {/* Add Toaster for notifications */}
          {children} {/* Render child components (pages) */}
        </SessionProvider>
      </body>
    </html>
  );
}
