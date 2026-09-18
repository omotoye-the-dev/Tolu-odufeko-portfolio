import Image from "next/image";
import Container from "@/component/UI/Container";
import Button from "@/component/UI/Button";
import { getSiteSettings } from "@/lib/data";

export async function Herosection() {
  const settings = await getSiteSettings();

  return (
    <section className="w-full">
      <Container className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 py-12 sm:py-16 lg:py-20">
        {/* Text content */}
        <div className="flex flex-col justify-center text-left w-full lg:max-w-2xl">
          <span className="font-content font-semibold text-accent-strong uppercase tracking-wider text-xs sm:text-sm">
            {settings.heroEyebrow ?? "Engineer · Builder · Voice for impact"}
          </span>
          <h1 className="pt-4 sm:pt-6 font-header text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-dark-one">
            {settings.heroTitle ?? "Toluwanimi Odufeko"}
          </h1>
          <p className="pt-6 sm:pt-8 text-base sm:text-lg md:text-xl text-muted font-content font-normal leading-relaxed">
            {settings.heroSubtext ??
              "Bridging technical excellence with personal development and purposeful work. Engineering, energy, and helping people become better versions of themselves."}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-8 sm:pt-10">
            <Button variant="primary" href="/projects">
              Explore my work
            </Button>
            {settings.cvUrl ? (
              <Button
                variant="outline"
                href={settings.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download CV ↓
              </Button>
            ) : (
              <Button variant="outline" href="/contact">
                Let&apos;s Connect
              </Button>
            )}
          </div>
        </div>

        {/* Hero image */}
        <div className="w-full max-w-80 sm:max-w-100 lg:max-w-115 shrink-0">
          <div className="relative aspect-square w-full rounded-2xl border-r-4 border-b-4 border-accent overflow-hidden shadow-xl transition-transform duration-300 hover:-translate-x-1 hover:-translate-y-1">
            <Image
              src="/images/tolu-odufeko.png"
              alt="Portrait of Toluwanimi Odufeko"
              fill
              priority
              sizes="(max-width: 640px) 320px, (max-width: 1024px) 400px, 460px"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Herosection;
