import { getArticles, getSiteSettings } from "@/lib/data";
import Container from "@/component/UI/Container";
import ArticleCard from "@/component/UI/ArticleCard";
import Button from "@/component/UI/Button";

export async function Latestarticlesection() {
  const [allArticles, settings] = await Promise.all([
    getArticles(),
    getSiteSettings(),
  ]);
  const latestArticles = allArticles.slice(0, 3);

  return (
    <section className="w-full py-12 sm:py-16">
      <Container>
        <span className="font-content text-xs sm:text-sm font-semibold uppercase tracking-wider text-accent-strong">
          {settings.articlesEyebrow ?? "writing"}
        </span>
        <h2 className="pt-2 font-header text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-dark-one">
          {settings.articlesTitle ?? "Latest Articles"}
        </h2>
        {settings.articlesSubtext && (
          <p className="pt-2 font-content text-sm sm:text-base text-muted max-w-2xl">
            {settings.articlesSubtext}
          </p>
        )}

        <div className="pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
          {latestArticles.map((article) => (
            <ArticleCard className="shadow-md" key={article.slug} article={article} />
          ))}
        </div>

        <div className="pt-10 sm:pt-12 flex justify-start">
          <Button href="/articles" variant="outline">
            Browse All Articles
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default Latestarticlesection;

