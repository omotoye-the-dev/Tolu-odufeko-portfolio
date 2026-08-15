import Container from "@/component/UI/Container";
import Button from "@/component/UI/Button";
import { services } from "@/lib/constants";

export function Howtohelp() {
  return (
    <section className="w-full py-12 sm:py-16">
      <Container>
        <span className="font-content text-xs sm:text-sm font-semibold uppercase tracking-wider text-accent-strong">
          work with me
        </span>
        <h2 className="pt-2 font-header text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-dark-one">
          How Can I Help You?
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="group flex flex-col justify-between gap-4 rounded-2xl border border-black/15 bg-white p-6 sm:p-8 transition-all duration-300 shadow-xs hover:border-accent hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <div className="font-header text-4xl sm:text-5xl font-bold text-accent">
                  0{i + 1}
                </div>
                <h3 className="font-header mt-3 text-xl sm:text-2xl font-bold text-dark-one group-hover:text-accent-strong transition-colors">
                  {s.title}
                </h3>
                <p className="font-content mt-3 text-sm leading-relaxed text-muted">
                  {s.description}
                </p>
              </div>
              <div className="pt-4">
                <Button href={s.href} variant="outline" className="w-full sm:w-auto">
                  {s.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Howtohelp;
