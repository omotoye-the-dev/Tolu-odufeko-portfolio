import type { Metadata } from "next";
import Biosection from "@/component/sections/Biosection";
import Featuredsection from "@/component/sections/Featuredsection";
import Herosection from "@/component/sections/Herosection";
import Howtohelp from "@/component/sections/Howtohelp";
import Latestarticlesection from "@/component/sections/Latestarticlesection";

export const metadata: Metadata = {
  title: "Toluwanimi Odufeko | Engineer, Builder, Voice for Impact",
  description:
    "Official portfolio of Toluwanimi Odufeko — Electrical engineer, software builder, and founder of Donate Drive.",
  alternates: {
    canonical: "/",
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

