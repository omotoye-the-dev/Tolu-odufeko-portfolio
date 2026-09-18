import Link from "next/link";
import Container from "@/component/UI/Container";
import { getSiteSettings } from "@/lib/data";

function renderParagraphWithHighlights(text: string, index: number) {
  if (text.includes("Donate Drive")) {
    const parts = text.split("Donate Drive");
    return (
      <p key={index} className="font-content text-base sm:text-lg font-normal leading-relaxed text-muted">
        {parts[0]}
        <span className="font-bold text-dark-one underline decoration-accent decoration-2 underline-offset-4">
          Donate Drive
        </span>
        {parts.slice(1).join("Donate Drive")}
      </p>
    );
  }

  return (
    <p key={index} className="font-content text-base sm:text-lg font-normal leading-relaxed text-muted">
      {text}
    </p>
  );
}

export async function Biosection() {
  const settings = await getSiteSettings();
  const paragraphs = settings.bioParagraphs ?? [
    "I am an engineer in the oil and gas sector with a B.Eng. in Electrical and Electronics Engineering, driven by a passion for building systems, solving problems, and making complex ideas easier to understand.",
    "My interests sit at the intersection of engineering, reliable energy, technology, and people development. I founded Donate Drive to help children from underserved communities discover purpose and access opportunities that shape their future.",
    "At the core of everything I do is a simple desire: to build, to teach, to create, and to help people become better.",
  ];

  return (
    <section className="w-full py-10 sm:py-14">
      <Container className="flex items-center justify-center">
        <div className="w-full max-w-3xl rounded-2xl border border-dark-one/15 bg-white/80 p-6 sm:p-10 md:p-12 shadow-xs backdrop-blur-xs">
          {settings.bioEyebrow && (
            <span className="font-content text-xs sm:text-sm font-semibold uppercase tracking-wider text-accent-strong">
              {settings.bioEyebrow}
            </span>
          )}

          {settings.bioTitle && (
            <h2 className="pt-2 font-header text-2xl sm:text-3xl font-bold uppercase text-dark-one">
              {settings.bioTitle}
            </h2>
          )}

          <div className="pt-6 space-y-4 sm:space-y-5 text-left">
            {paragraphs.map((p, idx) => renderParagraphWithHighlights(p, idx))}
          </div>

          <div className="pt-6 sm:pt-8 flex items-center justify-between border-t border-dark-one/10 mt-6 sm:mt-8">
            <Link
              href="/about"
              className="font-content text-xs sm:text-sm font-semibold text-dark-one hover:text-accent-strong underline decoration-accent decoration-2 underline-offset-4 transition-colors"
            >
              Read Full Biography &rarr;
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Biosection;

