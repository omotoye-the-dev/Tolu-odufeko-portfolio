import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";
import type { Article } from "@/lib/data";

export interface ArticleRowProps {
  readonly article: Article;
  readonly className?: string;
}

export function ArticleRow({ article, className }: ArticleRowProps) {
  const articleHref = article.link ?? `/articles/${article.slug}`;
  const isExternal =
    articleHref.startsWith("http://") || articleHref.startsWith("https://");

  const rowContent = (
    <article className="grid grid-cols-1 gap-6 sm:grid-cols-[220px_minmax(0,1fr)] md:grid-cols-[280px_minmax(0,1fr)] items-center w-full min-w-0">
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-faint/10 border border-black/10 shrink-0">
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, 280px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col justify-center gap-2 min-w-0 w-full overflow-hidden">
        <div className="font-content flex items-center gap-3 text-xs text-muted">
          <span>{article.date}</span>
          <span className="text-faint" aria-hidden="true">
            •
          </span>
          <span>{article.readTime}</span>
        </div>

        <h3 className="font-header text-xl sm:text-2xl font-bold leading-snug text-dark-one transition-colors group-hover:text-accent-strong wrap-break-word">
          {article.title}
        </h3>

        <p className="font-content text-sm leading-relaxed text-muted wrap-break-word whitespace-normal">
          {article.excerpt}
        </p>

        <div className="mt-1">
          <span className="font-content inline-flex items-center gap-1.5 text-sm font-semibold text-dark-one underline decoration-accent decoration-2 underline-offset-4 transition-all duration-200 group-hover:gap-2.5 group-hover:decoration-accent-strong">
            Read More <span aria-hidden="true">&rarr;</span>
          </span>
        </div>
      </div>
    </article>
  );

  const containerClasses = clsx(
    "group block border-b border-black/15 py-6 sm:py-8 transition-all duration-200 hover:border-l-4 hover:border-l-accent hover:pl-3 sm:hover:pl-4 w-full min-w-0 overflow-hidden",
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
        {rowContent}
      </a>
    );
  }

  return (
    <Link href={articleHref} className={containerClasses}>
      {rowContent}
    </Link>
  );
}

export default ArticleRow;
