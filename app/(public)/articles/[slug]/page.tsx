import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/component/UI/Container";
import ArticleCard from "@/component/UI/ArticleCard";
import { getArticles, getArticleBySlug } from "@/lib/data";

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
      title: "Article Not Found | Toluwanimi Odufeko",
    };
  }

  return {
    title: `${article.title} | Toluwanimi Odufeko`,
    description: article.excerpt,
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

          <div className="font-content mt-4 flex items-center gap-3 text-xs sm:text-sm text-muted">
            <span>{article.date}</span>
            <span className="text-faint" aria-hidden="true">
              •
            </span>
            <span>{article.readTime}</span>
          </div>

          {/* Article Prose */}
          <div className="mt-10 space-y-6 font-content text-base sm:text-lg leading-relaxed text-muted">
            {article.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
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
