import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";
import type { Article } from "@/lib/data";

export interface ArticleCardProps {
  readonly article: Article;
  readonly className?: string;
}

export function ArticleCard({ article, className }: ArticleCardProps) {
  const articleHref = article.link ?? `/articles/${article.slug}`;
  const isExternal =
    articleHref.startsWith("http://") || articleHref.startsWith("https://");

  const cardContent = (
    <article className="flex h-full flex-col min-w-0 w-full">
      <div className="relative aspect-16/10 w-full overflow-hidden bg-faint/10 shrink-0">
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6 min-w-0 overflow-hidden">
        <div className="font-content flex items-center gap-2 text-xs text-muted">
          <span>{article.date}</span>
          {article.readTime && (
            <>
              <span className="text-faint" aria-hidden="true">
                •
              </span>
              <span>{article.readTime}</span>
            </>
          )}
        </div>

        <h3 className="font-header text-dark-one group-hover:text-accent-strong text-xl sm:text-2xl font-bold leading-snug transition-colors wrap-break-word">
          {article.title}
        </h3>

        <p className="font-content flex-1 text-sm leading-relaxed text-muted wrap-break-word whitespace-normal">
          {article.excerpt}
        </p>

        <div className="pt-3">
          <span className="font-content text-dark-one inline-flex items-center gap-1.5 text-sm font-semibold underline decoration-accent decoration-2 underline-offset-4 transition-all duration-200 group-hover:gap-2.5 group-hover:decoration-accent-strong">
            Read More <span aria-hidden="true">&rarr;</span>
          </span>
        </div>
      </div>
    </article>
  );

  const containerClasses = clsx(
    "group flex flex-col overflow-hidden rounded-2xl border border-black/15 bg-light transition-all duration-300 hover:border-accent hover:-translate-y-1 hover:shadow-lg min-w-0 w-full",
    className
  );

  if (isExternal) {
    return (
      <a
        href={articleHref}
        target="_blank"
        rel="noopener noreferrer"
        className={containerClasses}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={articleHref} className={containerClasses}>
      {cardContent}
    </Link>
  );
}

export default ArticleCard;
