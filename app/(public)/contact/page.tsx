import type { Metadata } from "next";
import ContactContent from "@/component/sections/ContactContent";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact | Toluwanimi Odufeko",
  description:
    "Get in touch for engineering consulting, hardware collaborations, speaking engagements, or supporting Donate Drive.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return <ContactContent settings={settings} />;
}
