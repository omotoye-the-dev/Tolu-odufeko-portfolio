// Central TypeScript type definitions and interfaces for the portfolio

export interface Project {
  readonly id?: string;
  readonly slug: string;
  readonly title: string;
  readonly categories: readonly string[];
  readonly excerpt: string;
  readonly image: string;
  readonly images?: readonly string[];
  readonly date: string;
  readonly techStack: readonly string[];
  readonly featured?: boolean;
  readonly link?: string;
  readonly body: readonly string[];
}

export interface Article {
  readonly id?: string;
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly image: string;
  readonly images?: readonly string[];
  readonly date: string;
  readonly readTime: string;
  readonly tags: readonly string[];
  readonly link?: string;
  readonly body: readonly string[];
}

export interface NowItem {
  readonly id?: string;
  readonly title: string;
  readonly description: string;
  readonly date: string;
  readonly status: string;
  readonly sortOrder?: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface SiteSettings {
  readonly id: string;
  readonly cvUrl: string | null;
  readonly githubUrl: string;
  readonly linkedinUrl: string;
  readonly instagramUrl: string | null;
  readonly twitterUrl?: string | null;
  readonly email: string | null;
  // Dynamic Section Content - Home
  readonly heroEyebrow?: string;
  readonly heroTitle?: string;
  readonly heroSubtext?: string;
  readonly bioEyebrow?: string;
  readonly bioTitle?: string;
  readonly bioParagraphs?: readonly string[];
  readonly projectsEyebrow?: string;
  readonly projectsTitle?: string;
  readonly projectsSubtext?: string;
  readonly articlesEyebrow?: string;
  readonly articlesTitle?: string;
  readonly articlesSubtext?: string;
  readonly servicesEyebrow?: string;
  readonly servicesTitle?: string;
  readonly servicesSubtext?: string;
  // About Page
  readonly aboutEyebrow?: string;
  readonly aboutTitle?: string;
  readonly aboutSubtext?: string;
  readonly aboutDonateEyebrow?: string;
  readonly aboutDonateTitle?: string;
  readonly aboutDonateSubtext?: string;
  readonly aboutSkillsEyebrow?: string;
  readonly aboutSkillsTitle?: string;
  // Projects Page
  readonly projectsPageEyebrow?: string;
  readonly projectsPageTitle?: string;
  readonly projectsPageSubtext?: string;
  // Articles Page
  readonly articlesPageEyebrow?: string;
  readonly articlesPageTitle?: string;
  readonly articlesPageSubtext?: string;
  // Now Page
  readonly nowEyebrow?: string;
  readonly nowTitle?: string;
  readonly nowSubtext?: string;
  // Contact Page
  readonly contactEyebrow?: string;
  readonly contactTitle?: string;
  readonly contactSubtext?: string;
  // Gallery Page
  readonly galleryEyebrow?: string;
  readonly galleryTitle?: string;
  readonly gallerySubtext?: string;
}

export interface GalleryItem {
  readonly id?: string;
  readonly title: string;
  readonly caption?: string;
  readonly imageUrl: string;
  readonly category: string;
  readonly eventDate?: string;
  readonly sortOrder?: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface SocialLink {
  readonly label: string;
  readonly href: string;
}

export interface ServiceItem {
  readonly title: string;
  readonly description: string;
  readonly cta: string;
  readonly href: string;
}
