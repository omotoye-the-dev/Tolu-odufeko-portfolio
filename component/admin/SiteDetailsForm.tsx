"use client";

import { useState, useTransition } from "react";
import { clsx } from "clsx";
import Button from "@/component/UI/Button";
import { toast } from "@/hooks/useToast";
import type { SiteSettings } from "@/lib/data";

export interface SiteDetailsFormProps {
  readonly settings: SiteSettings;
  readonly action: (formData: FormData) => Promise<void>;
}

type TabType =
  | "home"
  | "about"
  | "projects"
  | "articles"
  | "now"
  | "contact"
  | "gallery";

interface TabItem {
  readonly id: TabType;
  readonly label: string;
  readonly icon: string;
}

const TABS: readonly TabItem[] = [
  { id: "home", label: "Home Page", icon: "🏠" },
  { id: "about", label: "About Page", icon: "👤" },
  { id: "projects", label: "Projects Page", icon: "◈" },
  { id: "articles", label: "Articles Page", icon: "◇" },
  { id: "now", label: "Now Page", icon: "◉" },
  { id: "contact", label: "Contact Page", icon: "✉" },
  { id: "gallery", label: "Gallery Page", icon: "🖼" },
] as const;

export function SiteDetailsForm({ settings, action }: SiteDetailsFormProps) {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);

    startTransition(async () => {
      try {
        await action(formData);
        toast.success("Site Details Saved!", {
          description: "All website titles, eyebrows, and content have been updated across your portfolio.",
        });
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(errorMsg);
        toast.error("Unable to Save Details", {
          description: errorMsg,
        });
      }
    });
  }

  const textareaClass =
    "font-content w-full rounded-xl border-2 border-dark-one/15 bg-light px-4 py-3 text-sm text-dark-one placeholder:text-faint transition-colors focus:border-accent focus:outline-none min-h-[120px] resize-y";
  const inputClass =
    "font-content w-full rounded-xl border-2 border-dark-one/15 bg-light px-4 py-3 text-sm text-dark-one placeholder:text-faint transition-colors focus:border-accent focus:outline-none";
  const labelClass =
    "font-content text-xs font-semibold uppercase tracking-wider text-dark-one/70";
  const hintClass = "font-content text-xs text-faint mt-1";

  const bioParagraphsText = Array.isArray(settings.bioParagraphs)
    ? settings.bioParagraphs.join("\n\n")
    : (settings.bioParagraphs ?? "");

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {/* ─── Navigation Tabs ─── */}
      <div className="flex flex-wrap gap-2 border-b border-dark-one/10 pb-4 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "flex items-center gap-2 rounded-xl px-4 py-2.5 font-content text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer",
                isActive
                  ? "bg-accent text-dark-one shadow-2xs font-bold"
                  : "bg-white text-muted hover:text-dark-one hover:bg-black/5 border border-dark-one/10"
              )}
            >
              <span aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: HOME PAGE ─── */}
      <div className={clsx("flex flex-col gap-6", activeTab !== "home" && "hidden")}>
        {/* Hero Section */}
        <div className="rounded-2xl border-2 border-dark-one/10 bg-white p-4 sm:p-8 flex flex-col gap-5 shadow-xs">
          <div>
            <span className="font-content text-[11px] font-bold uppercase tracking-wider text-accent-strong">
              Home Page
            </span>
            <h2 className="font-header text-lg sm:text-xl text-dark-one mt-1">
              Hero Section
            </h2>
            <p className="font-content text-xs sm:text-sm text-muted mt-1">
              Customize the introduction tagline, main name title, and primary description on the home page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="heroEyebrow" className={labelClass}>
                Hero Eyebrow / Tagline
              </label>
              <input
                id="heroEyebrow"
                name="heroEyebrow"
                type="text"
                defaultValue={settings.heroEyebrow ?? "Engineer · Builder · Voice for impact"}
                placeholder="Engineer · Builder · Voice for impact"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="heroTitle" className={labelClass}>
                Hero Main Heading
              </label>
              <input
                id="heroTitle"
                name="heroTitle"
                type="text"
                defaultValue={settings.heroTitle ?? "Toluwanimi Odufeko"}
                placeholder="Toluwanimi Odufeko"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="heroSubtext" className={labelClass}>
              Hero Subtext Description
            </label>
            <textarea
              id="heroSubtext"
              name="heroSubtext"
              rows={3}
              defaultValue={
                settings.heroSubtext ??
                "Bridging technical excellence with personal development and purposeful work. Engineering, energy, and helping people become better versions of themselves."
              }
              placeholder="Enter hero intro subtext…"
              className={textareaClass}
            />
          </div>
        </div>

        {/* Bio Section */}
        <div className="rounded-2xl border-2 border-dark-one/10 bg-white p-4 sm:p-8 flex flex-col gap-5 shadow-xs">
          <div>
            <span className="font-content text-[11px] font-bold uppercase tracking-wider text-accent-strong">
              Home Page
            </span>
            <h2 className="font-header text-lg sm:text-xl text-dark-one mt-1">
              Bio Section (Home Preview)
            </h2>
            <p className="font-content text-xs sm:text-sm text-muted mt-1">
              Edit the story and biography block on the home page. Separate paragraphs with a blank line.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="bioEyebrow" className={labelClass}>
                Bio Eyebrow
              </label>
              <input
                id="bioEyebrow"
                name="bioEyebrow"
                type="text"
                defaultValue={settings.bioEyebrow ?? "About Me"}
                placeholder="About Me"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="bioTitle" className={labelClass}>
                Bio Section Heading
              </label>
              <input
                id="bioTitle"
                name="bioTitle"
                type="text"
                defaultValue={settings.bioTitle ?? "Building Systems, Solving Problems & Empowering Lives"}
                placeholder="Building Systems, Solving Problems & Empowering Lives"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="bioParagraphs" className={labelClass}>
              Bio Paragraphs (Blank line between each paragraph)
            </label>
            <textarea
              id="bioParagraphs"
              name="bioParagraphs"
              rows={5}
              defaultValue={bioParagraphsText}
              placeholder="Paragraph 1&#10;&#10;Paragraph 2"
              className={textareaClass}
            />
          </div>
        </div>

        {/* Featured Projects Section on Home */}
        <div className="rounded-2xl border-2 border-dark-one/10 bg-white p-4 sm:p-8 flex flex-col gap-5 shadow-xs">
          <div>
            <span className="font-content text-[11px] font-bold uppercase tracking-wider text-accent-strong">
              Home Page
            </span>
            <h2 className="font-header text-lg sm:text-xl text-dark-one mt-1">
              Featured Projects Section
            </h2>
            <p className="font-content text-xs sm:text-sm text-muted mt-1">
              Configure the heading and subtext for the featured projects showcase on the home page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="projectsEyebrow" className={labelClass}>
                Featured Projects Eyebrow Tag
              </label>
              <input
                id="projectsEyebrow"
                name="projectsEyebrow"
                type="text"
                defaultValue={settings.projectsEyebrow ?? "selected work"}
                placeholder="selected work"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="projectsTitle" className={labelClass}>
                Featured Projects Heading
              </label>
              <input
                id="projectsTitle"
                name="projectsTitle"
                type="text"
                defaultValue={settings.projectsTitle ?? "Featured Projects"}
                placeholder="Featured Projects"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="projectsSubtext" className={labelClass}>
              Featured Projects Subtext
            </label>
            <input
              id="projectsSubtext"
              name="projectsSubtext"
              type="text"
              defaultValue={
                settings.projectsSubtext ??
                "Hardware and software built for the field — filter by discipline."
              }
              placeholder="Hardware and software built for the field — filter by discipline."
              className={inputClass}
            />
          </div>
        </div>

        {/* Latest Articles Section on Home */}
        <div className="rounded-2xl border-2 border-dark-one/10 bg-white p-4 sm:p-8 flex flex-col gap-5 shadow-xs">
          <div>
            <span className="font-content text-[11px] font-bold uppercase tracking-wider text-accent-strong">
              Home Page
            </span>
            <h2 className="font-header text-lg sm:text-xl text-dark-one mt-1">
              Latest Articles Section
            </h2>
            <p className="font-content text-xs sm:text-sm text-muted mt-1">
              Configure the heading and subtext for the recent articles row on the home page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="articlesEyebrow" className={labelClass}>
                Latest Articles Eyebrow Tag
              </label>
              <input
                id="articlesEyebrow"
                name="articlesEyebrow"
                type="text"
                defaultValue={settings.articlesEyebrow ?? "writing"}
                placeholder="writing"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="articlesTitle" className={labelClass}>
                Latest Articles Heading
              </label>
              <input
                id="articlesTitle"
                name="articlesTitle"
                type="text"
                defaultValue={settings.articlesTitle ?? "Latest Articles"}
                placeholder="Latest Articles"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="articlesSubtext" className={labelClass}>
              Latest Articles Subtext
            </label>
            <input
              id="articlesSubtext"
              name="articlesSubtext"
              type="text"
              defaultValue={
                settings.articlesSubtext ??
                "Notes on engineering, building an NGO, and staying useful."
              }
              placeholder="Notes on engineering, building an NGO, and staying useful."
              className={inputClass}
            />
          </div>
        </div>

        {/* Services / How Can I Help You */}
        <div className="rounded-2xl border-2 border-dark-one/10 bg-white p-4 sm:p-8 flex flex-col gap-5 shadow-xs">
          <div>
            <span className="font-content text-[11px] font-bold uppercase tracking-wider text-accent-strong">
              Home Page
            </span>
            <h2 className="font-header text-lg sm:text-xl text-dark-one mt-1">
              Services / Collaboration Section
            </h2>
            <p className="font-content text-xs sm:text-sm text-muted mt-1">
              Configure the heading and subtext for the &quot;How Can I Help You?&quot; section.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="servicesEyebrow" className={labelClass}>
                Services Eyebrow Tag
              </label>
              <input
                id="servicesEyebrow"
                name="servicesEyebrow"
                type="text"
                defaultValue={settings.servicesEyebrow ?? "work with me"}
                placeholder="work with me"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="servicesTitle" className={labelClass}>
                Services Heading
              </label>
              <input
                id="servicesTitle"
                name="servicesTitle"
                type="text"
                defaultValue={settings.servicesTitle ?? "How Can I Help You?"}
                placeholder="How Can I Help You?"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="servicesSubtext" className={labelClass}>
              Services Subtext
            </label>
            <input
              id="servicesSubtext"
              name="servicesSubtext"
              type="text"
              defaultValue={
                settings.servicesSubtext ??
                "Ways we can collaborate, build, or create meaningful impact together."
              }
              placeholder="Ways we can collaborate, build, or create meaningful impact together."
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* ─── TAB 2: ABOUT PAGE ─── */}
      <div className={clsx("flex flex-col gap-6", activeTab !== "about" && "hidden")}>
        {/* About Hero Header */}
        <div className="rounded-2xl border-2 border-dark-one/10 bg-white p-4 sm:p-8 flex flex-col gap-5 shadow-xs">
          <div>
            <span className="font-content text-[11px] font-bold uppercase tracking-wider text-accent-strong">
              About Page (/about)
            </span>
            <h2 className="font-header text-lg sm:text-xl text-dark-one mt-1">
              About Hero Header
            </h2>
            <p className="font-content text-xs sm:text-sm text-muted mt-1">
              The main header and description at the top of the /about page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="aboutEyebrow" className={labelClass}>
                About Eyebrow Tag
              </label>
              <input
                id="aboutEyebrow"
                name="aboutEyebrow"
                type="text"
                defaultValue={settings.aboutEyebrow ?? "Biography"}
                placeholder="Biography"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="aboutTitle" className={labelClass}>
                About Page Title
              </label>
              <input
                id="aboutTitle"
                name="aboutTitle"
                type="text"
                defaultValue={settings.aboutTitle ?? "About Me"}
                placeholder="About Me"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="aboutSubtext" className={labelClass}>
              About Subtext Description
            </label>
            <textarea
              id="aboutSubtext"
              name="aboutSubtext"
              rows={3}
              defaultValue={
                settings.aboutSubtext ??
                "Engineer, builder, and voice for impact — working at the intersection of engineering, reliable energy, technology, and people development."
              }
              placeholder="Enter about intro subtext…"
              className={textareaClass}
            />
          </div>
        </div>

        {/* Donate Drive Section on About */}
        <div className="rounded-2xl border-2 border-dark-one/10 bg-white p-4 sm:p-8 flex flex-col gap-5 shadow-xs">
          <div>
            <span className="font-content text-[11px] font-bold uppercase tracking-wider text-accent-strong">
              About Page (/about)
            </span>
            <h2 className="font-header text-lg sm:text-xl text-dark-one mt-1">
              Donate Drive Section
            </h2>
            <p className="font-content text-xs sm:text-sm text-muted mt-1">
              Customize the NGO / social impact showcase section headings on the /about page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="aboutDonateEyebrow" className={labelClass}>
                Donate Drive Eyebrow
              </label>
              <input
                id="aboutDonateEyebrow"
                name="aboutDonateEyebrow"
                type="text"
                defaultValue={settings.aboutDonateEyebrow ?? "Donate Drive"}
                placeholder="Donate Drive"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="aboutDonateTitle" className={labelClass}>
                Donate Drive Title
              </label>
              <input
                id="aboutDonateTitle"
                name="aboutDonateTitle"
                type="text"
                defaultValue={settings.aboutDonateTitle ?? "What I'm Building"}
                placeholder="What I'm Building"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="aboutDonateSubtext" className={labelClass}>
              Donate Drive Narrative Text
            </label>
            <textarea
              id="aboutDonateSubtext"
              name="aboutDonateSubtext"
              rows={4}
              defaultValue={
                settings.aboutDonateSubtext ??
                "Donate Drive is committed to helping children from underserved communities discover purpose and gain access to opportunities that can shape their future. Over the past five years, we have empowered children through education, mentorship, scholarships, skills development, and community outreach."
              }
              placeholder="Enter Donate Drive description…"
              className={textareaClass}
            />
          </div>
        </div>

        {/* Skills & Capabilities on About */}
        <div className="rounded-2xl border-2 border-dark-one/10 bg-white p-4 sm:p-8 flex flex-col gap-5 shadow-xs">
          <div>
            <span className="font-content text-[11px] font-bold uppercase tracking-wider text-accent-strong">
              About Page (/about)
            </span>
            <h2 className="font-header text-lg sm:text-xl text-dark-one mt-1">
              Capabilities &amp; Skills Section
            </h2>
            <p className="font-content text-xs sm:text-sm text-muted mt-1">
              Headings for the skills cloud displayed at the bottom of the /about page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="aboutSkillsEyebrow" className={labelClass}>
                Skills Eyebrow Tag
              </label>
              <input
                id="aboutSkillsEyebrow"
                name="aboutSkillsEyebrow"
                type="text"
                defaultValue={settings.aboutSkillsEyebrow ?? "Capabilities"}
                placeholder="Capabilities"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="aboutSkillsTitle" className={labelClass}>
                Skills Heading Title
              </label>
              <input
                id="aboutSkillsTitle"
                name="aboutSkillsTitle"
                type="text"
                defaultValue={settings.aboutSkillsTitle ?? "Skills & Expertise"}
                placeholder="Skills & Expertise"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── TAB 3: PROJECTS PAGE ─── */}
      <div className={clsx("flex flex-col gap-6", activeTab !== "projects" && "hidden")}>
        <div className="rounded-2xl border-2 border-dark-one/10 bg-white p-4 sm:p-8 flex flex-col gap-5 shadow-xs">
          <div>
            <span className="font-content text-[11px] font-bold uppercase tracking-wider text-accent-strong">
              Projects Page (/projects)
            </span>
            <h2 className="font-header text-lg sm:text-xl text-dark-one mt-1">
              Main Projects Header
            </h2>
            <p className="font-content text-xs sm:text-sm text-muted mt-1">
              Controls the title banner at the top of the full projects catalog page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="projectsPageEyebrow" className={labelClass}>
                Projects Page Eyebrow
              </label>
              <input
                id="projectsPageEyebrow"
                name="projectsPageEyebrow"
                type="text"
                defaultValue={settings.projectsPageEyebrow ?? "Portfolio"}
                placeholder="Portfolio"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="projectsPageTitle" className={labelClass}>
                Projects Page Title
              </label>
              <input
                id="projectsPageTitle"
                name="projectsPageTitle"
                type="text"
                defaultValue={settings.projectsPageTitle ?? "Projects"}
                placeholder="Projects"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="projectsPageSubtext" className={labelClass}>
              Projects Page Subtext
            </label>
            <input
              id="projectsPageSubtext"
              name="projectsPageSubtext"
              type="text"
              defaultValue={
                settings.projectsPageSubtext ??
                "Hardware and software built for the field — filter by discipline."
              }
              placeholder="Hardware and software built for the field — filter by discipline."
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* ─── TAB 4: ARTICLES PAGE ─── */}
      <div className={clsx("flex flex-col gap-6", activeTab !== "articles" && "hidden")}>
        <div className="rounded-2xl border-2 border-dark-one/10 bg-white p-4 sm:p-8 flex flex-col gap-5 shadow-xs">
          <div>
            <span className="font-content text-[11px] font-bold uppercase tracking-wider text-accent-strong">
              Articles Page (/articles)
            </span>
            <h2 className="font-header text-lg sm:text-xl text-dark-one mt-1">
              Main Articles Header
            </h2>
            <p className="font-content text-xs sm:text-sm text-muted mt-1">
              Controls the title banner at the top of the full articles and essays catalog page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="articlesPageEyebrow" className={labelClass}>
                Articles Page Eyebrow
              </label>
              <input
                id="articlesPageEyebrow"
                name="articlesPageEyebrow"
                type="text"
                defaultValue={settings.articlesPageEyebrow ?? "Writing & Notes"}
                placeholder="Writing & Notes"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="articlesPageTitle" className={labelClass}>
                Articles Page Title
              </label>
              <input
                id="articlesPageTitle"
                name="articlesPageTitle"
                type="text"
                defaultValue={settings.articlesPageTitle ?? "Articles"}
                placeholder="Articles"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="articlesPageSubtext" className={labelClass}>
              Articles Page Subtext
            </label>
            <input
              id="articlesPageSubtext"
              name="articlesPageSubtext"
              type="text"
              defaultValue={
                settings.articlesPageSubtext ??
                "Technical reflections, engineering analysis, solar microgrids, NGO leadership lessons, and essays."
              }
              placeholder="Technical reflections, engineering analysis, solar microgrids, NGO leadership lessons, and essays."
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* ─── TAB 5: NOW PAGE ─── */}
      <div className={clsx("flex flex-col gap-6", activeTab !== "now" && "hidden")}>
        <div className="rounded-2xl border-2 border-dark-one/10 bg-white p-4 sm:p-8 flex flex-col gap-5 shadow-xs">
          <div>
            <span className="font-content text-[11px] font-bold uppercase tracking-wider text-accent-strong">
              Now Page (/now)
            </span>
            <h2 className="font-header text-lg sm:text-xl text-dark-one mt-1">
              Now Page Header
            </h2>
            <p className="font-content text-xs sm:text-sm text-muted mt-1">
              Controls the title banner at the top of the /now live activity log.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nowEyebrow" className={labelClass}>
                Now Eyebrow Tag
              </label>
              <input
                id="nowEyebrow"
                name="nowEyebrow"
                type="text"
                defaultValue={settings.nowEyebrow ?? "Focus & Priorities"}
                placeholder="Focus & Priorities"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="nowTitle" className={labelClass}>
                Now Page Title
              </label>
              <input
                id="nowTitle"
                name="nowTitle"
                type="text"
                defaultValue={settings.nowTitle ?? "What I'm Doing Now"}
                placeholder="What I'm Doing Now"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="nowSubtext" className={labelClass}>
              Now Page Subtext
            </label>
            <input
              id="nowSubtext"
              name="nowSubtext"
              type="text"
              defaultValue={
                settings.nowSubtext ??
                "A running snapshot of where my attention actually is."
              }
              placeholder="A running snapshot of where my attention actually is."
              className={inputClass}
            />
            <p className={hintClass}>The dynamic last updated month and year is appended automatically.</p>
          </div>
        </div>
      </div>

      {/* ─── TAB 6: CONTACT PAGE ─── */}
      <div className={clsx("flex flex-col gap-6", activeTab !== "contact" && "hidden")}>
        <div className="rounded-2xl border-2 border-dark-one/10 bg-white p-4 sm:p-8 flex flex-col gap-5 shadow-xs">
          <div>
            <span className="font-content text-[11px] font-bold uppercase tracking-wider text-accent-strong">
              Contact Page (/contact)
            </span>
            <h2 className="font-header text-lg sm:text-xl text-dark-one mt-1">
              Contact Header &amp; Subtext
            </h2>
            <p className="font-content text-xs sm:text-sm text-muted mt-1">
              Controls the title banner and invitation message on the /contact page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contactEyebrow" className={labelClass}>
                Contact Eyebrow Tag
              </label>
              <input
                id="contactEyebrow"
                name="contactEyebrow"
                type="text"
                defaultValue={settings.contactEyebrow ?? "Reach Out"}
                placeholder="Reach Out"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contactTitle" className={labelClass}>
                Contact Page Title
              </label>
              <input
                id="contactTitle"
                name="contactTitle"
                type="text"
                defaultValue={settings.contactTitle ?? "Get In Touch"}
                placeholder="Get In Touch"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="contactSubtext" className={labelClass}>
              Contact Subtext Description
            </label>
            <textarea
              id="contactSubtext"
              name="contactSubtext"
              rows={3}
              defaultValue={
                settings.contactSubtext ??
                "Whether it’s a hardware problem worth solving, a collaboration, or supporting Donate Drive — I read every message. Tell me what you’re working on and I’ll get back to you."
              }
              placeholder="Enter contact intro message…"
              className={textareaClass}
            />
          </div>
        </div>
      </div>

      {/* ── Tab: Gallery Page ── */}
      <div
        id="tabpanel-gallery"
        role="tabpanel"
        aria-labelledby="tab-gallery"
        className={activeTab === "gallery" ? "flex flex-col gap-6" : "hidden"}
      >
        <div className="flex flex-col gap-6 rounded-2xl border border-dark-one/10 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="font-header text-xl font-bold text-dark-one">
              Gallery Page Header & Copy
            </h2>
            <p className="mt-1 font-content text-sm text-muted">
              Customize the title, eyebrow, and introductory description for the public gallery showcase at /gallery.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="galleryEyebrow" className={labelClass}>
                Gallery Eyebrow Badge
              </label>
              <input
                id="galleryEyebrow"
                name="galleryEyebrow"
                type="text"
                defaultValue={settings.galleryEyebrow ?? "Visual Moments"}
                placeholder="Visual Moments"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="galleryTitle" className={labelClass}>
                Gallery Page Heading
              </label>
              <input
                id="galleryTitle"
                name="galleryTitle"
                type="text"
                defaultValue={settings.galleryTitle ?? "Gallery"}
                placeholder="Gallery"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="gallerySubtext" className={labelClass}>
              Gallery Description / Subtext
            </label>
            <textarea
              id="gallerySubtext"
              name="gallerySubtext"
              rows={3}
              defaultValue={
                settings.gallerySubtext ??
                "A visual journey through engineering field work, speaking engagements, community initiatives, and milestone moments."
              }
              placeholder="Enter gallery description…"
              className={textareaClass}
            />
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <p
          role="alert"
          className="font-content text-sm text-red-600 border border-red-200 bg-red-50 rounded-xl px-4 py-3"
        >
          {error}
        </p>
      )}

      {/* Sticky Bottom Save Action Bar */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between gap-4 rounded-2xl border-2 border-dark-one/15 bg-white/95 p-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="font-content text-xs font-semibold text-muted">
            All text changes apply across your portfolio immediately on save.
          </span>
        </div>
        <Button
          type="submit"
          loading={isPending}
          disabled={isPending}
          variant="primary"
          className="px-8 shadow-xs"
        >
          {isPending ? "Saving Changes…" : "Save Site Details"}
        </Button>
      </div>
    </form>
  );
}

export default SiteDetailsForm;
