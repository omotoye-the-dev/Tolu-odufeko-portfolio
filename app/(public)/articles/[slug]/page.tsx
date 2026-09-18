import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/component/UI/Container";
import ArticleCard from "@/component/UI/ArticleCard";
import { getArticles, getArticleBySlug } from "@/lib/data";
import {
  SITE_URL,
  generateArticleSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo";

interface PageProps {
  readonly params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = `/articles/${article.slug}`;
  const ogImage = article.image || "/images/tolu-odufeko.png";

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
      modifiedTime: article.date,
      authors: ["Toluwanimi Odufeko"],
      tags: [...article.tags],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [ogImage],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const [article, allArticles] = await Promise.all([
    getArticleBySlug(slug),
    getArticles(),
  ]);

  if (!article) {
    notFound();
  }

  const canonicalUrl = `${SITE_URL}/articles/${article.slug}`;
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      generateArticleSchema(article, canonicalUrl, false),
      generateBreadcrumbSchema(
        [
          { name: "Home", url: "/" },
          { name: "Articles", url: "/articles" },
          { name: article.title, url: `/articles/${article.slug}` },
        ],
        false
      ),
    ],
  };

  const sortedArticles = [...allArticles].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
  const index = sortedArticles.findIndex((a) => a.slug === slug);

  const prevArticle = index < sortedArticles.length - 1 ? sortedArticles[index + 1] : null;
  const nextArticle = index > 0 ? sortedArticles[index - 1] : null;

  const relatedArticles = allArticles
    .filter(
      (a) =>
        a.slug !== article.slug &&
        a.tags.some((t) => article.tags.includes(t))
    )
    .slice(0, 3);

  return (
    <article className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      {/* Featured Banner Image */}
      <div className="relative aspect-video sm:aspect-21/9 max-h-120 w-full overflow-hidden bg-neutral-200 border-b border-dark-one/15">
        <Image
          src={article.image}
          alt={article.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Container className="py-10 sm:py-14">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumbs" className="mb-6 font-content text-xs text-muted">
          <Link href="/articles" className="hover:text-accent-strong hover:underline">
            Articles
          </Link>
          <span className="mx-2 text-faint" aria-hidden="true">
            /
          </span>
          <span className="text-dark-one font-medium">{article.title}</span>
        </nav>

        <div className="mx-auto max-w-3xl">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="font-content text-xs font-bold uppercase tracking-wider text-accent-strong"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mt-4 font-header text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-dark-one">
            {article.title}
          </h1>

          <div className="font-content mt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted">
            <span>
              By{" "}
              <Link
                href="/about"
                className="font-semibold text-dark-one hover:text-accent-strong underline decoration-accent decoration-2 underline-offset-4 transition-colors"
              >
                Toluwanimi Odufeko
              </Link>
            </span>
            <span className="text-faint" aria-hidden="true">
              •
            </span>
            <span>{article.date}</span>
            <span className="text-faint" aria-hidden="true">
              •
            </span>
            <span>{article.readTime}</span>
          </div>

          {/* Article Prose */}
          <div className="mt-10 space-y-6 font-content text-base sm:text-lg leading-relaxed text-muted">
            {article.body.map((paragraph, i) => (
              <p key={`${article.slug}-p-${i}`}>{paragraph}</p>
            ))}
          </div>

          {/* Author Attribution Card */}
          <div className="mt-12 rounded-2xl border border-dark-one/15 bg-white/70 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-xs">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-accent">
              <Image
                src="/images/tolu-odufeko.png"
                alt="Portrait of Toluwanimi Odufeko"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <span className="font-content text-xs font-semibold uppercase tracking-wider text-accent-strong">
                Written by
              </span>
              <h2 className="font-header text-lg sm:text-xl font-bold text-dark-one">
                Toluwanimi Odufeko
              </h2>
              <p className="font-content mt-1 text-sm leading-relaxed text-muted">
                Electrical and electronics engineer in energy and power systems, software builder, and founder of Donate Drive.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-semibold">
                <Link
                  href="/about"
                  className="font-content text-dark-one hover:text-accent-strong underline decoration-accent decoration-2 underline-offset-4 transition-colors"
                >
                  About the Author &rarr;
                </Link>
                <Link
                  href="/articles"
                  className="font-content text-dark-one hover:text-accent-strong underline decoration-accent decoration-2 underline-offset-4 transition-colors"
                >
                  Browse All Articles &rarr;
                </Link>
                <Link
                  href="/contact"
                  className="font-content text-dark-one hover:text-accent-strong underline decoration-accent decoration-2 underline-offset-4 transition-colors"
                >
                  Get in Touch &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Article Gallery / Visuals */}
          {article.images && article.images.length > 0 && (
            <div className="mt-12 border-t border-dark-one/15 pt-8">
              <h2 className="font-header text-xl sm:text-2xl font-bold text-dark-one mb-6">
                Visuals &amp; References
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {article.images.map((imgUrl, i) => (
                  <div
                    key={`${imgUrl}-${i}`}
                    className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-dark-one/15 bg-neutral-100 shadow-xs"
                  >
                    <Image
                      src={imgUrl}
                      alt={`${article.title} visual ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Previous / Next Article Navigation */}
          <div className="mt-16 flex flex-col sm:flex-row justify-between gap-6 border-t border-dark-one/15 pt-8">
            {prevArticle ? (
              <Link
                href={`/articles/${prevArticle.slug}`}
                className="group flex-1 text-muted transition-colors hover:text-dark-one"
              >
                <span className="font-content block text-xs text-faint group-hover:text-accent-strong">
                  &larr; Previous Article
                </span>
                <span className="font-header mt-1 block text-base sm:text-lg font-bold text-dark-one group-hover:text-accent-strong">
                  {prevArticle.title}
                </span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {nextArticle && (
              <Link
                href={`/articles/${nextArticle.slug}`}
                className="group flex-1 text-left sm:text-right text-muted transition-colors hover:text-dark-one"
              >
                <span className="font-content block text-xs text-faint group-hover:text-accent-strong">
                  Next Article &rarr;
                </span>
                <span className="font-header mt-1 block text-base sm:text-lg font-bold text-dark-one group-hover:text-accent-strong">
                  {nextArticle.title}
                </span>
              </Link>
            )}
          </div>

          {/* Back to all articles link */}
          <div className="mt-8 pt-6 border-t border-dark-one/10 text-center">
            <Link
              href="/articles"
              className="font-content text-xs sm:text-sm font-semibold text-dark-one hover:text-accent-strong underline decoration-accent decoration-2 underline-offset-4 transition-colors"
            >
              &larr; Back to all articles
            </Link>
          </div>
        </div>
      </Container>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="border-t border-dark-one/15 bg-white/40 py-12 sm:py-16">
          <Container>
            <h2 className="font-header mb-8 text-2xl sm:text-3xl font-bold text-dark-one">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}
