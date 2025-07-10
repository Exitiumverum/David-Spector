import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Dancing_Script } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });
const dancingScript = Dancing_Script({ 
  subsets: ["latin"],
  variable: "--font-dancing",
});

export const metadata: Metadata = {
  title: "ניהול תוכן - דוד ספקטור",
  description: "ניהול תוכן האתר",
  icons: {
    icon: "/images/Logos/logoPng.png",
  },
};

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="icon" href="/images/Logos/logoPng.png" type="image/png" />
      </head>
      <body className={`${inter.className} ${dancingScript.variable}`}>
        {children}
      </body>
    </html>
  );
} 