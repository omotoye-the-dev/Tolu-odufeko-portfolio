import Link from "next/link";
import AdminShell from "@/component/admin/AdminShell";
import { getProjects, getArticles, getNowItems } from "@/lib/data";

export default async function AdminDashboardPage() {
  const [projects, articles, nowItems] = await Promise.all([
    getProjects(),
    getArticles(),
    getNowItems(),
  ]);

  const stats = [
    {
      label: "Projects",
      count: projects.length,
      featured: projects.filter((p) => p.featured).length,
      href: "/admin/projects",
      cta: "+ New Project",
      ctaHref: "/admin/projects/new",
      icon: "◈",
    },
    {
      label: "Articles",
      count: articles.length,
      href: "/admin/articles",
      cta: "+ New Article",
      ctaHref: "/admin/articles/new",
      icon: "◇",
    },
    {
      label: "Now Items",
      count: nowItems.length,
      href: "/admin/now",
      cta: "+ Add Item",
      ctaHref: "/admin/now/new",
      icon: "◉",
    },
  ];

  return (
    <AdminShell>
      <div className="px-4 py-6 sm:px-8 sm:py-10 max-w-4xl w-full">
        {/* Page header */}
        <div className="border-b border-dark-one/10 pb-6 mb-8 sm:pb-8 sm:mb-10">
          <span className="font-content text-xs font-semibold uppercase tracking-widest text-accent-strong">
            Overview
          </span>
          <h1 className="mt-1 font-header text-3xl sm:text-4xl text-dark-one">Dashboard</h1>
          <p className="mt-1.5 font-content text-xs sm:text-sm text-muted">
            Manage your portfolio content from one place.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border-2 border-dark-one/10 bg-white p-5 sm:p-6 flex flex-col gap-3 sm:gap-4 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-content text-xs font-semibold uppercase tracking-wider text-muted">
                  {stat.label}
                </span>
                <span aria-hidden="true" className="text-xl text-accent-strong">
                  {stat.icon}
                </span>
              </div>

              <div>
                <p className="font-header text-4xl sm:text-5xl text-dark-one leading-none">
                  {stat.count}
                </p>
                {"featured" in stat && stat.featured !== undefined && (
                  <p className="mt-1 font-content text-xs text-muted">
                    {stat.featured} featured
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Link
                  href={stat.href}
                  className="font-content text-xs font-semibold text-accent-strong underline underline-offset-4 hover:text-dark-one transition-colors"
                >
                  View all →
                </Link>
                <Link
                  href={stat.ctaHref}
                  className="font-content text-xs font-semibold bg-accent text-dark-one px-3 py-1.5 rounded-lg hover:bg-accent-strong transition-colors"
                >
                  {stat.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Recent projects */}
        <div className="mt-10 sm:mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-header text-xl sm:text-2xl text-dark-one">
              Recent Projects
            </h2>
            <Link
              href="/admin/projects/new"
              className="font-content text-xs font-semibold bg-accent text-dark-one px-3.5 py-1.5 rounded-xl hover:bg-accent-strong transition-colors"
            >
              + New
            </Link>
          </div>
          <div className="border-t border-dark-one/10">
            <div className="divide-y divide-dark-one/10">
              {projects.slice(0, 5).map((project) => (
                <div
                  key={project.slug}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3.5 sm:py-4"
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-content text-sm font-semibold text-dark-one wrap-break-word">
                        {project.title}
                      </span>
                      {project.featured && (
                        <span className="bg-accent/30 text-dark-one text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0">
                          Featured
                        </span>
                      )}
                    </div>
                    <span className="font-content text-xs text-muted mt-0.5">
                      {project.date} · {project.categories.join(", ")}
                    </span>
                  </div>
                  <Link
                    href={`/admin/projects/${project.slug}/edit`}
                    className="font-content text-xs font-semibold text-accent-strong hover:text-dark-one transition-colors self-start sm:self-center shrink-0"
                  >
                    Edit →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent articles */}
        <div className="mt-8 sm:mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-header text-xl sm:text-2xl text-dark-one">
              Recent Articles
            </h2>
            <Link
              href="/admin/articles/new"
              className="font-content text-xs font-semibold bg-accent text-dark-one px-3.5 py-1.5 rounded-xl hover:bg-accent-strong transition-colors"
            >
              + New
            </Link>
          </div>
          <div className="border-t border-dark-one/10">
            <div className="divide-y divide-dark-one/10">
              {articles.slice(0, 5).map((article) => (
                <div
                  key={article.slug}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3.5 sm:py-4"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-content text-sm font-semibold text-dark-one wrap-break-word">
                      {article.title}
                    </span>
                    <span className="font-content text-xs text-muted mt-0.5">
                      {article.date} · {article.readTime}
                    </span>
                  </div>
                  <Link
                    href={`/admin/articles/${article.slug}/edit`}
                    className="font-content text-xs font-semibold text-accent-strong hover:text-dark-one transition-colors self-start sm:self-center shrink-0"
                  >
                    Edit →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
