import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JetBrains_Mono, Madimi_One } from "next/font/google";
import ToastContainer from "@/component/UI/Toast";
import { getSiteSettings } from "@/lib/data";
import { SITE_URL, generateRootSchema } from "@/lib/seo";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Toluwanimi Odufeko | Engineer, Builder, Voice for Impact",
    template: "%s | Toluwanimi Odufeko",
  },
  description:
    "Portfolio of Toluwanimi Odufeko — Electrical engineer, software builder, and founder of Donate Drive. Building systems, solving energy challenges, and driving community impact.",
  keywords: [
    "Toluwanimi Odufeko",
    "Electrical Engineer",
    "Donate Drive",
    "Solar Microgrid",
    "Hardware Engineer",
    "Software Builder",
    "Energy Access",
    "Embedded Systems",
    "Engineering Consulting",
  ],
  authors: [{ name: "Toluwanimi Odufeko", url: SITE_URL }],
  creator: "Toluwanimi Odufeko",
  publisher: "Toluwanimi Odufeko",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Toluwanimi Odufeko",
    title: "Toluwanimi Odufeko | Engineer, Builder, Voice for Impact",
    description:
      "Electrical engineer, software builder, and founder of Donate Drive. Working at the intersection of engineering, reliable energy, and social impact.",
    images: [
      {
        url: "/images/tolu-odufeko.png",
        width: 1200,
        height: 630,
        alt: "Portrait of Toluwanimi Odufeko",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Toluwanimi Odufeko | Engineer, Builder, Voice for Impact",
    description:
      "Electrical engineer, software builder, and founder of Donate Drive.",
    images: ["/images/tolu-odufeko.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const settings = await getSiteSettings();
  const rootSchema = generateRootSchema(settings);

  return (
    <html
      lang="en"
      className={`bg-light h-full antialiased ${jetbrainsMono.variable} ${madimiOne.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootSchema) }}
        />
      </head>
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

