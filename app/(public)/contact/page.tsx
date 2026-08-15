import type { Metadata } from "next";
import ContactContent from "@/component/sections/ContactContent";
import { getSiteSettings } from "@/lib/data";

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
  },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return <ContactContent settings={settings} />;
}
