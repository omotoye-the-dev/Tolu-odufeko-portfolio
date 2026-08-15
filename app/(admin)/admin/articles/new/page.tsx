import AdminShell from "@/component/admin/AdminShell";
import ArticleForm from "@/component/admin/ArticleForm";
import { createArticle } from "@/app/actions/articles";

export default function NewArticlePage() {
  return (
    <AdminShell>
      <div className="px-4 py-6 sm:px-8 sm:py-10 max-w-3xl w-full">
        <div className="border-b border-dark-one/10 pb-6 mb-6 sm:pb-8 sm:mb-8">
          <span className="font-content text-xs font-semibold uppercase tracking-widest text-accent-strong">
            Articles
          </span>
          <h1 className="mt-1 font-header text-3xl sm:text-4xl text-dark-one">New Article</h1>
          <p className="mt-1 font-content text-xs sm:text-sm text-muted">
            Fill in the details to publish a new article.
          </p>
        </div>
        <ArticleForm action={createArticle} cancelHref="/admin/articles" />
      </div>
    </AdminShell>
  );
}
