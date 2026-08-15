import type { Article, Project, SiteSettings } from "@/types";
import { services } from "@/lib/constants";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://toluodufeko.com";

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const NGO_ID = `${SITE_URL}/#donate-drive`;

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
 * Combines Toluwanimi's dual identity as an Electrical & Electronics Engineer and NGO Founder.
 */
export function generateRootSchema(settings?: SiteSettings): Record<string, unknown> {
  const linkedin = settings?.linkedinUrl || "https://linkedin.com";
  const github = settings?.githubUrl || "https://github.com";
  const twitter = settings?.twitterUrl || "https://x.com";
  const email = settings?.email ? `mailto:${settings.email}` : "mailto:hello@example.com";

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
        email: email,
        sameAs: [linkedin, github, twitter].filter(Boolean),
        alumniOf: {
          "@type": "EducationalOrganization",
          name: "B.Eng. in Electrical and Electronics Engineering",
        },
        knowsAbout: [
          "Electrical Engineering",
          "Power Generation & Distribution",
          "Embedded Systems",
          "Solar Microgrids",
          "Nonprofit Leadership",
          "Software Engineering",
          "Electronics Design",
        ],
        founder: {
          "@type": "NGO",
          "@id": NGO_ID,
          name: "Donate Drive",
          url: `${SITE_URL}/about`,
          description:
            "An organization committed to helping children from underserved communities discover purpose and access opportunities through education, mentorship, and outreach.",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Professional & Engineering Services",
          itemListElement: services.map((service, index) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.title,
              description: service.description,
              url: `${SITE_URL}${service.href}`,
            },
            position: index + 1,
          })),
        },
      },
    ],
  };

  validateSchema(rootGraph);
  return rootGraph;
}

/**
 * Generates TechArticle / BlogPosting Schema for article detail pages.
 */
export function generateArticleSchema(
  article: Article,
  canonicalUrl: string
): Record<string, unknown> {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${canonicalUrl}/#article`,
    headline: article.title,
    description: article.excerpt,
    url: canonicalUrl,
    image: article.image.startsWith("http")
      ? article.image
      : `${SITE_URL}${article.image}`,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@id": PERSON_ID,
      "@type": "Person",
      name: "Toluwanimi Odufeko",
      url: SITE_URL,
    },
    publisher: {
      "@id": PERSON_ID,
      "@type": "Person",
      name: "Toluwanimi Odufeko",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    keywords: (article.tags ?? []).join(", "),
    inLanguage: "en-US",
  };

  validateSchema(schema);
  return schema;
}

/**
 * Generates CreativeWork / SoftwareApplication Schema for project detail pages.
 */
export function generateProjectSchema(
  project: Project,
  canonicalUrl: string
): Record<string, unknown> {
  const isSoftware = project.categories.some((c) =>
    c.toLowerCase().includes("software")
  );

  const schema = {
    "@context": "https://schema.org",
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
      "@id": PERSON_ID,
      "@type": "Person",
      name: "Toluwanimi Odufeko",
      url: SITE_URL,
    },
    author: {
      "@id": PERSON_ID,
      "@type": "Person",
      name: "Toluwanimi Odufeko",
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

  validateSchema(schema);
  return schema;
}

/**
 * Generates BreadcrumbList Schema for hierarchical navigation.
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): Record<string, unknown> {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };

  validateSchema(schema);
  return schema;
}
