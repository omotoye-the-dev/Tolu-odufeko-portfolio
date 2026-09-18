import type { Metadata } from "next";
import ContactContent from "@/component/sections/ContactContent";
import { getSiteSettings } from "@/lib/data";
import { SITE_URL, generateContactSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Connect with Toluwanimi Odufeko for engineering consulting, hardware collaborations, speaking engagements, or NGO partnerships.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Get In Touch | Toluwanimi Odufeko",
    description:
      "Direct channel to reach Toluwanimi Odufeko for engineering projects, hardware advising, and social impact partnerships.",
    url: "/contact",
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
    title: "Get In Touch | Toluwanimi Odufeko",
    description:
      "Direct channel to reach Toluwanimi Odufeko for engineering projects, hardware advising, and social impact partnerships.",
    images: ["/images/tolu-odufeko.png"],
  },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const contactSchema = generateContactSchema(`${SITE_URL}/contact`, settings);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <ContactContent settings={settings} />
    </>
  );
}
