import type { Metadata } from "next";
import Container from "@/component/UI/Container";
import { getNowItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "Now",
  description:
    "A public log of what Toluwanimi Odufeko is currently focused on, building, and learning.",
  alternates: {
    canonical: "/now",
  },
  openGraph: {
    title: "What I'm Doing Now | Toluwanimi Odufeko",
    description:
      "A real-time snapshot of current engineering projects, NGO initiatives, and focus areas.",
    url: "/now",
  },
};

export default async function NowPage() {
  const nowItems = await getNowItems();

  const latestDate = nowItems.reduce<Date | null>((latest, item) => {
    const ts = item.updatedAt || item.createdAt;
    if (!ts) return latest;
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return latest;
    if (!latest || d > latest) return d;
    return latest;
  }, null);

  const lastUpdatedDisplay = latestDate
    ? latestDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

  return (
    <div className="w-full py-12 sm:py-16">
      <Container>
        {/* Header */}
        <div className="border-b border-dark-one/15 pb-10">
          <span className="font-content text-xs sm:text-sm font-semibold uppercase tracking-wider text-accent-strong">
            Focus &amp; Priorities
          </span>
          <h1 className="mt-2 font-header text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-dark-one">
            What I&apos;m Doing Now
          </h1>
          <p className="mt-4 max-w-xl font-content text-base sm:text-lg text-muted">
            A running snapshot of where my attention actually is. Last updated{" "}
            <span className="font-semibold text-dark-one">{lastUpdatedDisplay}</span>.
          </p>
        </div>

        {/* Timeline Items List */}
        <ul className="mt-6 divide-y divide-dark-one/15">
          {nowItems.map((item, index) => (
            <li
              key={item.id ?? `${item.title}-${index}`}
              className="group grid grid-cols-1 gap-3 py-8 sm:grid-cols-[200px_1fr] sm:gap-6 transition-colors hover:bg-white/40 px-3 sm:px-4 rounded-xl"
            >
              <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2">
                <span className="font-content text-xs sm:text-sm font-medium text-muted">
                  {item.date}
                </span>
                <span className="font-content w-fit rounded-md border border-accent bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-dark-one">
                  {item.status}
                </span>
              </div>

              <div>
                <h2 className="font-header text-xl sm:text-2xl font-bold text-dark-one group-hover:text-accent-strong transition-colors">
                  {item.title}
                </h2>
                <p className="font-content mt-2 text-base leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
