import { notFound } from "next/navigation";
import AdminShell from "@/component/admin/AdminShell";
import ArticleForm from "@/component/admin/ArticleForm";
import { getArticleBySlug } from "@/lib/data";
import { updateArticle } from "@/app/actions/articles";

interface EditArticlePageProps {
  readonly params: Promise<{ slug: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || !article.id) notFound();

  const articleId = article.id;

  async function handleUpdate(formData: FormData): Promise<void> {
    "use server";
    await updateArticle(articleId, formData);
  }

  return (
    <AdminShell>
      <div className="px-4 py-6 sm:px-8 sm:py-10 max-w-3xl w-full">
        <div className="border-b border-dark-one/10 pb-6 mb-6 sm:pb-8 sm:mb-8">
          <span className="font-content text-xs font-semibold uppercase tracking-widest text-accent-strong">
            Articles
          </span>
          <h1 className="mt-1 font-header text-3xl sm:text-4xl text-dark-one">Edit Article</h1>
          <p className="mt-1 font-content text-xs sm:text-sm text-muted wrap-break-word">
            {article.title}
          </p>
        </div>
        <ArticleForm
          article={article}
          action={handleUpdate}
          cancelHref="/admin/articles"
        />
      </div>
    </AdminShell>
  );
}
