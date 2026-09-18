"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import Container from "@/component/UI/Container";
import ArticleRow from "@/component/UI/ArticleRow";
import EmptyState from "@/component/UI/EmptyState";
import type { Article } from "@/lib/data";

const PAGE_SIZE = 10;

interface ArticlesContentProps {
  readonly articles: Article[];
  readonly eyebrow?: string;
  readonly title?: string;
  readonly subtext?: string;
}

export function ArticlesContent({
  articles,
  eyebrow = "Writing & Thoughts",
  title = "Articles",
  subtext = "Notes on engineering, building an NGO, and staying useful.",
}: ArticlesContentProps) {
  const ALL_TAGS = Array.from(new Set(articles.flatMap((a) => a.tags)));

  const [query, setQuery] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredArticles = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    return [...articles]
      .sort((a, b) => b.date.localeCompare(a.date))
      .filter((article) => {
        const matchesTag = !selectedTag || article.tags.includes(selectedTag);
        const matchesQuery =
          !cleanQuery ||
          article.title.toLowerCase().includes(cleanQuery) ||
          article.excerpt.toLowerCase().includes(cleanQuery) ||
          article.body.some((p) => p.toLowerCase().includes(cleanQuery));

        return matchesTag && matchesQuery;
      });
  }, [articles, query, selectedTag]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredArticles.length / PAGE_SIZE)
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const shownArticles = filteredArticles.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE
  );

  const handleQueryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleTagClick = (tag: string | null): void => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  const handleClearSearch = (): void => {
    setQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="w-full py-12 sm:py-16">
      <Container>
        {/* Header */}
        <div className="border-b border-dark-one/15 pb-10">
          <span className="font-content text-xs sm:text-sm font-semibold uppercase tracking-wider text-accent-strong">
            {eyebrow}
          </span>
          <h1 className="mt-2 font-header text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-dark-one">
            {title}
          </h1>
          <p className="mt-4 max-w-xl font-content text-base sm:text-lg text-muted">
            {subtext}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-8 relative max-w-xl">
          <label htmlFor="article-search" className="sr-only">
            Search articles
          </label>
          <input
            id="article-search"
            type="search"
            value={query}
            onChange={handleQueryChange}
            className="w-full rounded-xl border-2 border-dark-one/20 bg-white px-4 py-3 font-content text-sm text-dark-one shadow-xs transition-colors placeholder:text-muted/60 focus:border-accent focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 font-content text-xs text-muted hover:text-dark-one"
            >
              Clear
            </button>
          )}
        </div>

        {/* Tag Filters */}
        <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3" role="tablist" aria-label="Article tag filters">
          <button
            type="button"
            role="tab"
            aria-selected={selectedTag === null}
            onClick={() => handleTagClick(null)}
            className={clsx(
              "font-content text-xs sm:text-sm font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors cursor-pointer",
              selectedTag === null
                ? "bg-accent text-dark-one font-bold"
                : "text-muted hover:text-dark-one bg-white/60 border border-black/10"
            )}
          >
            All
          </button>
          {ALL_TAGS.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleTagClick(tag)}
                className={clsx(
                  "font-content text-xs sm:text-sm font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors cursor-pointer",
                  isSelected
                    ? "bg-accent text-dark-one font-bold"
                    : "text-muted hover:text-dark-one bg-white/60 border border-black/10"
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Article Rows List */}
        <div className="mt-8 divide-y divide-black/10 w-full min-w-0">
          {shownArticles.length === 0 ? (
            <EmptyState
              icon="◇"
              title="No articles found"
              description="No articles match your current search query or filter tags."
              ctaLabel="Reset filters"
              onCta={() => {
                setQuery("");
                setSelectedTag(null);
                setCurrentPage(1);
              }}
            />
          ) : (
            shownArticles.map((article) => (
              <ArticleRow key={article.slug} article={article} />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-12 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                aria-current={pageNum === safeCurrentPage ? "page" : undefined}
                onClick={() => setCurrentPage(pageNum)}
                className={clsx(
                  "font-content flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition-colors cursor-pointer",
                  pageNum === safeCurrentPage
                    ? "border-accent bg-accent text-dark-one font-bold shadow-xs"
                    : "border-dark-one/15 bg-white text-dark-one hover:border-accent"
                )}
              >
                {pageNum}
              </button>
            ))}
          </nav>
        )}
      </Container>
    </div>
  );
}

export default ArticlesContent;
