import type { Metadata } from "next";
import Container from "@/component/UI/Container";
import { getGalleryItems, getSiteSettings } from "@/lib/data";
import { GalleryContent } from "@/component/sections/GalleryContent";
import { SITE_URL, generateGallerySchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A visual journey through engineering field work, speaking engagements, community initiatives, and milestone moments by Toluwanimi Odufeko.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Gallery | Toluwanimi Odufeko",
    description:
      "A visual journey through engineering field work, speaking engagements, community initiatives, and milestone moments by Toluwanimi Odufeko.",
    url: "/gallery",
    images: [
      {
        url: "/images/tolu-odufeko.png",
        width: 1200,
        height: 630,
        alt: "Visual showcase of Toluwanimi Odufeko",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery | Toluwanimi Odufeko",
    description:
      "A visual journey through engineering field work, speaking engagements, community initiatives, and milestone moments.",
    images: ["/images/tolu-odufeko.png"],
  },
};

export default async function GalleryPage() {
  const [items, settings] = await Promise.all([
    getGalleryItems(),
    getSiteSettings(),
  ]);

  const gallerySchema = generateGallerySchema(
    `${SITE_URL}/gallery`,
    items.length,
    settings
  );

  const eyebrow = settings.galleryEyebrow ?? "Visual Moments";
  const title = settings.galleryTitle ?? "Gallery";
  const subtext =
    settings.gallerySubtext ??
    "A visual journey through engineering field work, speaking engagements, community initiatives, and milestone moments.";

  return (
    <div className="w-full py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />
      <Container>
        {/* Page Header */}
        <div className="border-b border-dark-one/15 pb-10 mb-10">
          <span className="font-content text-xs sm:text-sm font-semibold uppercase tracking-wider text-accent-strong">
            {eyebrow}
          </span>
          <h1 className="mt-2 font-header text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-dark-one">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl font-content text-base sm:text-lg text-muted">
            {subtext}
          </p>
        </div>

        {/* Gallery Content with Filter and Lightbox */}
        <GalleryContent items={items} />
      </Container>
    </div>
  );
}
