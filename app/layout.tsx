import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JetBrains_Mono, Madimi_One } from "next/font/google";
import ToastContainer from "@/component/UI/Toast";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-content",
  display: "swap",
});

const madimiOne = Madimi_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-header",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Toluwanimi Odufeko | Engineer, Builder, Voice for Impact",
  description:
    "Portfolio of Toluwanimi Odufeko — Electrical engineer, software builder, and founder of Donate Drive.",
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`bg-light h-full antialiased ${jetbrainsMono.variable} ${madimiOne.variable}`}
    >
      <body
        className="min-h-full font-content text-dark-one"
        suppressHydrationWarning
      >
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
