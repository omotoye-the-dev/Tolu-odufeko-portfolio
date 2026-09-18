import Link from "next/link";
import { getSiteSettings } from "@/lib/data";

const PUBLIC_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Articles", href: "/articles" },
  { label: "Gallery", href: "/gallery" },
  { label: "Now", href: "/now" },
  { label: "Contact", href: "/contact" },
] as const;

export async function Footer() {
  const settings = await getSiteSettings();

  const instagramLink = settings.instagramUrl ?? settings.twitterUrl;
  const dynamicSocials = [
    { label: "LinkedIn", href: settings.linkedinUrl },
    { label: "GitHub", href: settings.githubUrl },
    ...(instagramLink ? [{ label: "Instagram", href: instagramLink }] : []),
    ...(settings.email && !settings.email.includes("example.com")
      ? [{ label: "Email", href: `mailto:${settings.email}` }]
      : []),
  ];

  return (
    <footer className="mt-auto border-t border-muted/20 bg-footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10 lg:px-16 py-12">
        <h2 className="font-header text-xl sm:text-2xl md:text-3xl font-bold tracking-wide uppercase text-dark-one">
          Build with precision. Lead with purpose.
        </h2>

        {/* Public routes internal navigation */}
        <nav aria-label="Footer navigation" className="mt-8">
          <ul className="font-content flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-dark-one">
            {PUBLIC_NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent-strong"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-t border-dark-one/10 pt-6">
          <p className="font-content text-xs text-muted">
            &copy; {new Date().getFullYear()} Toluwanimi Odufeko. All rights reserved.
          </p>

          <nav aria-label="Social media links">
            <ul className="font-content flex flex-wrap gap-4 text-xs font-semibold text-dark-one">
              {dynamicSocials.map((s) => (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent-strong"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
