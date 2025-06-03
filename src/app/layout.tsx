import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Dancing_Script } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ContactModalWrapper from "@/components/ContactModalWrapper";

const inter = Inter({ subsets: ["latin"] });
const dancingScript = Dancing_Script({ 
  subsets: ["latin"],
  variable: "--font-dancing",
});

export const metadata: Metadata = {
  title: "דוד ספקטור - אדריכלות ועיצוב פנים",
  description: "דוד ספקטור - אדריכל ועיצוב פנים מקצועי עם ניסיון של מעל 5 שנים",
  icons: {
    icon: "/images/Logos/logoPng.png",
  },
};

export default function RootLayout({
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
        <Navigation />
        {children}
        <ContactModalWrapper />
      </body>
    </html>
  );
}
