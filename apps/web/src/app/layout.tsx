import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin", "vietnamese"],
  variable: "--font-nunito",
  display: "swap"
});

export const metadata: Metadata = {
  title: "LEnglish",
  description: "TOEIC vocabulary learning app foundation"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${nunito.variable} min-h-screen bg-slate-950 font-sans text-slate-50 antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
