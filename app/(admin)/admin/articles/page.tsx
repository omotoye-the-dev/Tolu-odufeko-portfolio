import Link from "next/link";
import AdminShell from "@/component/admin/AdminShell";
import EmptyState from "@/component/UI/EmptyState";
import AdminDeleteButton from "@/component/admin/AdminDeleteButton";
import { getArticles } from "@/lib/data";
import { deleteArticle } from "@/app/actions/articles";

export default async function AdminArticlesPage() {
  const articles = await getArticles();

  return (
    <AdminShell>
      <div className="px-4 py-6 sm:px-8 sm:py-10 max-w-5xl w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-dark-one/10 pb-6 mb-6 sm:pb-8 sm:mb-8">
          <div>
            <span className="font-content text-xs font-semibold uppercase tracking-widest text-accent-strong">
              Content
            </span>
            <h1 className="mt-1 font-header text-3xl sm:text-4xl text-dark-one">
              Articles
            </h1>
            <p className="mt-1 font-content text-xs sm:text-sm text-muted">
              {articles.length} published
            </p>
          </div>
          <Link
            href="/admin/articles/new"
            className="font-content text-xs sm:text-sm font-bold bg-accent text-dark-one px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl hover:bg-accent-strong transition-colors text-center w-full sm:w-auto"
          >
            + New Article
          </Link>
        </div>

        {/* List */}
        {articles.length === 0 ? (
          <EmptyState
            icon="◇"
            title="No articles yet"
            description="Write your first technical article or reflection to publish it on your site."
            ctaLabel="Write your first article"
            ctaHref="/admin/articles/new"
          />
        ) : (
          <div className="border-t border-dark-one/10">
            <div className="divide-y divide-dark-one/10">
              {articles.map((article) => (
                <div
                  key={article.slug}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 sm:py-5"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-content text-sm font-semibold text-dark-one wrap-break-word">
                      {article.title}
                    </span>
                    <span className="font-content text-xs text-muted">
                      {article.date} · {article.readTime} ·{" "}
                      <span className="text-faint">{article.slug}</span>
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-content text-[10px] border border-dark-one/15 rounded px-1.5 py-0.5 text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-dark-one/5 justify-end sm:justify-start shrink-0">
                    <Link
                      href={`/articles/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-content text-xs text-muted hover:text-dark-one transition-colors px-2 py-1"
                      aria-label={`View ${article.title} on public site`}
                    >
                      View ↗
                    </Link>
                    <Link
                      href={`/admin/articles/${article.slug}/edit`}
                      className="font-content text-xs font-semibold text-accent-strong hover:text-dark-one transition-colors px-2 py-1"
                    >
                      Edit →
                    </Link>
                    <AdminDeleteButton
                      itemId={article.id ?? ""}
                      itemTitle={article.title}
                      itemType="article"
                      onDelete={deleteArticle}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
