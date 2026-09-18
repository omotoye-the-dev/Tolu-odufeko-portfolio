import type { Metadata } from "next";
import AdminShell from "@/component/admin/AdminShell";
import SiteDetailsForm from "@/component/admin/SiteDetailsForm";
import { getSiteSettings } from "@/lib/data";
import { updateSiteSettings } from "@/app/actions/settings";

export const metadata: Metadata = {
  title: "Site Details | Admin",
  description: "Edit website titles, eyebrows, bios, and copy across all pages.",
};

export default async function AdminSiteDetailsPage() {
  const settings = await getSiteSettings();

  return (
    <AdminShell>
      <div className="px-4 py-6 sm:px-8 sm:py-10 max-w-4xl w-full">
        {/* Header */}
        <div className="border-b border-dark-one/10 pb-6 mb-6 sm:pb-8 sm:mb-8">
          <span className="font-content text-xs font-semibold uppercase tracking-widest text-accent-strong">
            Content Management
          </span>
          <h1 className="mt-1 font-header text-3xl sm:text-4xl text-dark-one">
            Site Details &amp; Copy
          </h1>
          <p className="mt-1 font-content text-xs sm:text-sm text-muted">
            Edit the titles, eyebrows, descriptions, and section texts across all pages of your website.
          </p>
        </div>

        {/* Form */}
        <SiteDetailsForm settings={settings} action={updateSiteSettings} />
      </div>
    </AdminShell>
  );
}
