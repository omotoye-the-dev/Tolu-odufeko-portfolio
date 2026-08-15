import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/component/UI/Container";
import Button from "@/component/UI/Button";
import { skills } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Toluwanimi Odufeko — Electrical engineer in the energy sector, software builder, and founder of Donate Drive empowering children across underserved communities.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Toluwanimi Odufeko | Engineer, Builder, Voice for Impact",
    description:
      "Electrical engineer in energy & oil/gas, software builder, and founder of Donate Drive. Discover his story, engineering focus, and community initiatives.",
    url: "/about",
  },
};

const NGO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop&auto=format",
    alt: "Community members receiving supplies and support",
  },
  {
    src: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&h=400&fit=crop&auto=format",
    alt: "Children in a classroom learning together",
  },
  {
    src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop&auto=format",
    alt: "Students actively collaborating on educational projects",
  },
] as const;

const IMPACT_STATS = [
  { value: "2,500+", label: "Children empowered" },
  { value: "10+", label: "States reached" },
  { value: "5 yrs", label: "Of impact" },
] as const;

export default function AboutPage() {
  return (
    <div className="w-full py-12 sm:py-16">
      <Container>
        {/* Header Hero */}
        <section className="grid grid-cols-1 items-center gap-10 border-b border-dark-one/15 pb-12 sm:pb-16 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <span className="font-content text-xs sm:text-sm font-semibold uppercase tracking-wider text-accent-strong">
              Biography
            </span>
            <h1 className="mt-2 font-header text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-dark-one">
              About Me
            </h1>
            <p className="mt-6 max-w-xl font-content text-base sm:text-lg leading-relaxed text-muted">
              Engineer, builder, and voice for impact — working at the
              intersection of engineering, reliable energy, technology, and people
              development.
            </p>
          </div>

          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border-2 border-accent shadow-lg">
            <Image
              src="/images/tolu-odufeko.png"
              alt="Portrait of Toluwanimi Odufeko"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </section>

        {/* Bio Narrative */}
        <section className="mt-12 sm:mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6 font-content text-base sm:text-lg leading-relaxed text-muted">
            <p>
              I am an engineer in the oil and gas sector with a B.Eng. in
              Electrical and Electronics Engineering, driven by a passion for
              building systems, solving problems, and making complex ideas easier
              to understand.
            </p>
            <p>
              My professional interests sit at the intersection of engineering,
              reliable energy, technology, and people development. I am
              particularly passionate about reliable and accessible power
              generation and distribution, and I enjoy exploring how engineering
              and technology can be applied to solve real-world problems.
            </p>
            <p>
              Beyond engineering, I am a creative and technical enthusiast with a
              strong interest in technical design, graphics, writing, and
              communication. I enjoy learning, teaching, and sharing knowledge,
              especially because I believe that people make better decisions when
              they have clarity. I have a natural inclination to help people
              understand difficult concepts, overcome confusion, and become
              better versions of themselves.
            </p>
            <p>
              I am also passionate about people and social impact. I founded{" "}
              <strong className="font-semibold text-dark-one underline decoration-accent decoration-2 underline-offset-4">
                Donate Drive
              </strong>
              , an organization committed to helping children from underserved
              communities discover purpose and gain access to opportunities that
              can shape their future. Over the past five years, we have empowered
              2,500+ children across 10+ states through education, mentorship,
              scholarships, skills development, and community outreach.
            </p>
            <p>
              Outside my professional and social-impact work, I enjoy public
              speaking and hosting events, and I am an enthusiastic MC. I also
              love music and play the piano. At the core of everything I do is a
              simple desire: to build, to teach, to create, and to help people
              become better.
            </p>
          </div>

          {/* Side Media */}
          <aside className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {NGO_IMAGES.slice(0, 2).map((img) => (
              <div
                key={img.src}
                className="relative aspect-4/3 sm:aspect-square lg:aspect-4/3 w-full overflow-hidden rounded-2xl border border-black/15 bg-neutral-200 shadow-xs"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 320px"
                  className="object-cover"
                />
              </div>
            ))}
          </aside>
        </section>

        {/* Donate Drive Section */}
        <section className="mt-16 sm:mt-24 rounded-2xl border border-accent/40 border-l-4 border-l-accent bg-white/70 p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="mb-6">
            <span className="font-content text-xs font-semibold uppercase tracking-[0.2em] text-accent-strong">
              Donate Drive
            </span>
            <h2 className="mt-2 font-header text-2xl sm:text-3xl md:text-4xl font-bold text-dark-one">
              What I&apos;m Building
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <p className="font-content text-base sm:text-lg leading-relaxed text-muted">
              Donate Drive is committed to helping children from underserved
              communities discover purpose and gain access to opportunities that
              can shape their future. Over the past five years, we have empowered
              children through education, mentorship, scholarships, skills
              development, and community outreach.
            </p>

            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              {IMPACT_STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col justify-center">
                  <div className="font-header text-2xl sm:text-3xl lg:text-4xl font-bold text-accent-strong">
                    {stat.value}
                  </div>
                  <div className="font-content mt-1 text-xs text-muted">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NGO Gallery Grid */}
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {NGO_IMAGES.map((img) => (
              <div
                key={img.src}
                className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-black/15 bg-neutral-200"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-10">
            <Button href="/contact" variant="primary">
              Support Donate Drive
            </Button>
          </div>
        </section>

        {/* Skills & Expertise */}
        <section className="mt-16 sm:mt-24">
          <div className="mb-6">
            <span className="font-content text-xs font-semibold uppercase tracking-[0.2em] text-accent-strong">
              Capabilities
            </span>
            <h2 className="mt-2 font-header text-2xl sm:text-3xl md:text-4xl font-bold text-dark-one">
              Skills &amp; Expertise
            </h2>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="font-content rounded-full border border-dark-one/20 bg-white/80 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-dark-one transition-all duration-200 hover:border-accent hover:bg-accent/15 hover:text-dark-one shadow-2xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
