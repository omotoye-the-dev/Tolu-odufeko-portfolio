import type { Article, Project, SiteSettings } from "@/types";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://toluwanimiodufeko.com";

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Validates that essential Schema.org properties exist to avoid Google Search Console warnings.
 */
export function validateSchema(schema: Record<string, unknown>): boolean {
  const hasContext = Boolean(schema["@context"]);
  const hasTypeOrGraph = Boolean(
    schema["@type"] ||
      (Array.isArray(schema["@graph"]) &&
        schema["@graph"].length > 0 &&
        schema["@graph"].every(
          (item) => typeof item === "object" && item !== null && "@type" in item
        ))
  );

  if (!hasContext || !hasTypeOrGraph) {
    console.warn("[SEO Schema] Missing valid @context, @type, or @graph:", schema);
    return false;
  }
  return true;
}

/**
 * Generates Root WebSite & Person Schema.
 * Canonical Person and WebSite entity graph.
 */
export function generateRootSchema(settings?: SiteSettings): Record<string, unknown> {
  const verifiedSameAs = [
    settings?.linkedinUrl,
    settings?.githubUrl,
    settings?.instagramUrl ?? settings?.twitterUrl,
  ].filter(
    (url): url is string =>
      Boolean(
        url &&
          url.trim().length > 0 &&
          !url.includes("example.com") &&
          url !== "https://linkedin.com" &&
          url !== "https://github.com" &&
          url !== "https://x.com" &&
          url !== "https://instagram.com"
      )
  );

  const email =
    settings?.email &&
    settings.email.trim().length > 0 &&
    !settings.email.includes("example.com")
      ? `mailto:${settings.email}`
      : undefined;

  const rootGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: "Toluwanimi Odufeko",
        description:
          "Portfolio of Toluwanimi Odufeko — Electrical engineer, software builder, and founder of Donate Drive.",
        inLanguage: "en-US",
        publisher: {
          "@id": PERSON_ID,
        },
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: "Toluwanimi Odufeko",
        url: SITE_URL,
        image: `${SITE_URL}/images/tolu-odufeko.png`,
        jobTitle: [
          "Electrical and Electronics Engineer",
          "Founder & Executive Director",
          "Software Builder",
        ],
        description:
          "Engineer in the energy and oil & gas sector with a B.Eng. in Electrical and Electronics Engineering, founder of Donate Drive, and builder of hardware and software systems for impact.",
        ...(email ? { email } : {}),
        ...(verifiedSameAs.length > 0 ? { sameAs: verifiedSameAs } : {}),
        knowsAbout: [
          "Electrical Engineering",
          "Power Generation & Distribution",
          "Embedded Systems",
          "Solar Microgrids",
          "Nonprofit Leadership",
          "Software Engineering",
          "Electronics Design",
        ],
      },
    ],
  };

  validateSchema(rootGraph);
  return rootGraph;
}

/**
 * Generates BlogPosting Schema for article detail pages.
 */
export function generateArticleSchema(
  article: Article,
  canonicalUrl: string,
  includeContext = true
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    ...(includeContext ? { "@context": "https://schema.org" } : {}),
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}/#article`,
    headline: article.title,
    description: article.excerpt,
    url: canonicalUrl,
    image: article.image.startsWith("http")
      ? article.image
      : `${SITE_URL}${article.image}`,
    datePublished: article.date,
    author: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Toluwanimi Odufeko",
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Toluwanimi Odufeko",
      url: `${SITE_URL}/about`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    keywords: (article.tags ?? []).join(", "),
    inLanguage: "en-US",
  };

  if (includeContext) {
    validateSchema(schema);
  }
  return schema;
}

/**
 * Generates CreativeWork / SoftwareApplication Schema for project detail pages.
 */
export function generateProjectSchema(
  project: Project,
  canonicalUrl: string,
  includeContext = true
): Record<string, unknown> {
  const isSoftware = project.categories.some((c) =>
    c.toLowerCase().includes("software")
  );

  const schema: Record<string, unknown> = {
    ...(includeContext ? { "@context": "https://schema.org" } : {}),
    "@type": isSoftware ? "SoftwareApplication" : "CreativeWork",
    "@id": `${canonicalUrl}/#project`,
    name: project.title,
    headline: project.title,
    description: project.excerpt,
    url: canonicalUrl,
    image: project.image.startsWith("http")
      ? project.image
      : `${SITE_URL}${project.image}`,
    dateCreated: project.date,
    datePublished: project.date,
    creator: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Toluwanimi Odufeko",
      url: `${SITE_URL}/about`,
    },
    author: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Toluwanimi Odufeko",
      url: `${SITE_URL}/about`,
    },
    keywords: [
      ...(project.categories ?? []),
      ...(project.techStack ?? []),
    ].join(", "),
    ...(project.link
      ? {
          sameAs: project.link,
          ...(isSoftware ? { downloadUrl: project.link } : {}),
        }
      : {}),
    inLanguage: "en-US",
  };

  if (includeContext) {
    validateSchema(schema);
  }
  return schema;
}

/**
 * Generates BreadcrumbList Schema for hierarchical navigation.
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
  includeContext = true
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    ...(includeContext ? { "@context": "https://schema.org" } : {}),
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };

  if (includeContext) {
    validateSchema(schema);
  }
  return schema;
}

/**
 * Generates ProfilePage Schema for the /about page.
 */
export function generateAboutSchema(
  canonicalUrl: string,
  settings?: SiteSettings
): Record<string, unknown> {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${canonicalUrl}/#profilepage`,
    url: canonicalUrl,
    name: settings?.aboutTitle ?? "About Toluwanimi Odufeko",
    description:
      settings?.aboutSubtext ??
      "Engineer, builder, and founder of Donate Drive working across engineering, energy, and youth mentorship.",
    mainEntity: {
      "@id": PERSON_ID,
    },
    inLanguage: "en-US",
  };

  validateSchema(schema);
  return schema;
}

/**
 * Generates ContactPage Schema with clear interaction channel.
 */
export function generateContactSchema(
  canonicalUrl: string,
  settings?: SiteSettings
): Record<string, unknown> {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${canonicalUrl}/#contact`,
    url: canonicalUrl,
    name: settings?.contactTitle ?? "Contact Toluwanimi Odufeko",
    description:
      settings?.contactSubtext ??
      "Get in touch for engineering consulting, hardware collaborations, speaking, or NGO partnerships.",
    mainEntity: {
      "@id": PERSON_ID,
    },
    inLanguage: "en-US",
  };

  validateSchema(schema);
  return schema;
}

/**
 * Generates ImageGallery / CollectionPage Schema for the gallery showcase.
 */
export function generateGallerySchema(
  canonicalUrl: string,
  itemsCount: number,
  settings?: SiteSettings
): Record<string, unknown> {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonicalUrl}/#gallery`,
    url: canonicalUrl,
    name: settings?.galleryTitle ?? "Gallery | Toluwanimi Odufeko",
    description:
      settings?.gallerySubtext ??
      "A visual journey through engineering field work, speaking engagements, and milestone moments.",
    about: {
      "@id": PERSON_ID,
    },
    numberOfItems: itemsCount,
    inLanguage: "en-US",
  };

  validateSchema(schema);
  return schema;
}

