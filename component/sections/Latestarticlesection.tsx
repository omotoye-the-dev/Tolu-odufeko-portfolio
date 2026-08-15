import { getArticles } from "@/lib/data";
import Container from "@/component/UI/Container";
import ArticleCard from "@/component/UI/ArticleCard";
import Button from "@/component/UI/Button";

export async function Latestarticlesection() {
  const allArticles = await getArticles();
  const latestArticles = allArticles.slice(0, 2);

  return (
    <section className="w-full py-12 sm:py-16">
      <Container>
        <span className="font-content text-xs sm:text-sm font-semibold uppercase tracking-wider text-accent-strong">
          writing
        </span>
        <h2 className="pt-2 font-header text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-dark-one">
          Latest Articles
        </h2>

        <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {latestArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        <div className="pt-12 sm:pt-16 flex justify-start">
          <Button href="/articles" variant="outline">
            Browse All Articles
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default Latestarticlesection;
