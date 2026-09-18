import type { Metadata } from "next";
import Biosection from "@/component/sections/Biosection";
import Featuredsection from "@/component/sections/Featuredsection";
import Herosection from "@/component/sections/Herosection";
import Howtohelp from "@/component/sections/Howtohelp";
import Latestarticlesection from "@/component/sections/Latestarticlesection";

export const metadata: Metadata = {
  title: {
    absolute:
      "Toluwanimi Odufeko | Electrical Engineer, Energy Systems & Social Impact",
  },
  description:
    "Official portfolio of Toluwanimi Odufeko — Electrical engineer, software builder, and founder of Donate Drive. Specializing in power systems, solar microgrids, and community leadership.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Toluwanimi Odufeko | Electrical Engineer, Energy Systems & Social Impact",
    description:
      "Official portfolio of Toluwanimi Odufeko — Electrical engineer, software builder, and founder of Donate Drive.",
    url: "/",
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
    title: "Toluwanimi Odufeko | Electrical Engineer, Energy Systems & Social Impact",
    description:
      "Official portfolio of Toluwanimi Odufeko — Electrical engineer, software builder, and founder of Donate Drive.",
    images: ["/images/tolu-odufeko.png"],
  },
};

export default function Home() {
  return (
    <>
      <Herosection />
      <Biosection />
      <Featuredsection />
      <Latestarticlesection />
      <Howtohelp />
    </>
  );
}

