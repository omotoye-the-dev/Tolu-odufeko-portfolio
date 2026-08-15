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
  readonly twitterUrl: string | null;
  readonly email: string;
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
