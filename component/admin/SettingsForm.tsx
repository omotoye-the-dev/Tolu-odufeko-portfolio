"use client";

import { useState, useTransition } from "react";
import Button from "@/component/UI/Button";
import ImageUpload from "@/component/admin/ImageUpload";
import { toast } from "@/hooks/useToast";
import type { SiteSettings } from "@/lib/data";

export interface SettingsFormProps {
  readonly settings: SiteSettings;
  readonly action: (formData: FormData) => Promise<void>;
}

export function SettingsForm({ settings, action }: SettingsFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);

    startTransition(async () => {
      try {
        await action(formData);
        toast.success("Settings Saved!", {
          description: "Your CV and social links have been updated across your portfolio.",
        });
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(errorMsg);
        toast.error("Unable to Save Settings", {
          description: errorMsg,
        });
      }
    });
  }

  const inputClass =
    "font-content w-full rounded-xl border-2 border-dark-one/15 bg-light px-4 py-3 text-sm text-dark-one placeholder:text-faint transition-colors focus:border-accent focus:outline-none";
  const labelClass =
    "font-content text-xs font-semibold uppercase tracking-wider text-dark-one/70";
  const hintClass = "font-content text-xs text-faint mt-1";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {/* ─── CV / Resume Upload Section ─── */}
      <div className="rounded-2xl border-2 border-dark-one/10 bg-white p-4 sm:p-8 flex flex-col gap-5 shadow-xs">
        <div>
          <span className="font-content text-[11px] font-bold uppercase tracking-wider text-accent-strong">
            Profile Document
          </span>
          <h2 className="font-header text-lg sm:text-xl text-dark-one mt-1">
            Curriculum Vitae (CV)
          </h2>
          <p className="font-content text-xs sm:text-sm text-muted mt-1">
            Upload your latest resume or CV. When you upload a new one, the previous file is automatically replaced in storage upon saving.
          </p>
        </div>

        <ImageUpload
          defaultValue={settings.cvUrl ?? ""}
          name="cvUrl"
          folder="docs"
          label="CV / Resume Document"
          accept=".pdf,.doc,.docx,application/pdf"
          hint="PDF, DOC, or DOCX document (max 10MB)"
        />

        {settings.cvUrl && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-dark-one/10 bg-light p-3.5 sm:p-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl shrink-0" aria-hidden="true">
                📄
              </span>
              <div className="min-w-0">
                <p className="font-content text-xs font-semibold text-dark-one">
                  Active CV File
                </p>
                <p className="font-content text-[11px] text-muted truncate max-w-xs sm:max-w-md">
                  {settings.cvUrl}
                </p>
              </div>
            </div>
            <a
              href={settings.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-content text-xs font-semibold text-accent-strong hover:text-dark-one underline underline-offset-2 transition-colors self-start sm:self-center shrink-0"
            >
              Preview ↗
            </a>
          </div>
        )}
      </div>

      {/* ─── Social & Contact Links Section ─── */}
      <div className="rounded-2xl border-2 border-dark-one/10 bg-white p-4 sm:p-8 flex flex-col gap-5 shadow-xs">
        <div>
          <span className="font-content text-[11px] font-bold uppercase tracking-wider text-accent-strong">
            Online Presence
          </span>
          <h2 className="font-header text-lg sm:text-xl text-dark-one mt-1">
            Social &amp; Contact Links
          </h2>
          <p className="font-content text-xs sm:text-sm text-muted mt-1">
            Manage the profile links displayed across your hero, footer, and contact pages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* GitHub */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="githubUrl" className={labelClass}>
              GitHub Profile *
            </label>
            <input
              id="githubUrl"
              name="githubUrl"
              type="url"
              required
              defaultValue={settings.githubUrl}
              placeholder="https://github.com/yourusername"
              className={inputClass}
            />
          </div>

          {/* LinkedIn */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="linkedinUrl" className={labelClass}>
              LinkedIn Profile *
            </label>
            <input
              id="linkedinUrl"
              name="linkedinUrl"
              type="url"
              required
              defaultValue={settings.linkedinUrl}
              placeholder="https://linkedin.com/in/yourusername"
              className={inputClass}
            />
          </div>

          {/* Instagram */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="instagramUrl" className={labelClass}>
              Instagram Profile
            </label>
            <input
              id="instagramUrl"
              name="instagramUrl"
              type="url"
              defaultValue={settings.instagramUrl ?? settings.twitterUrl ?? ""}
              placeholder="https://instagram.com/yourusername"
              className={inputClass}
            />
          </div>

          {/* Contact Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className={labelClass}>
              Public Contact Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={settings.email ?? ""}
              placeholder="contact@yourdomain.com"
              className={inputClass}
            />
            <p className={hintClass}>Used for contact links and mailto triggers</p>
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

      {/* Action Button */}
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          loading={isPending}
          disabled={isPending}
          variant="primary"
          className="w-full sm:w-auto px-8"
        >
          {isPending ? "Saving Changes…" : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}

export default SettingsForm;
