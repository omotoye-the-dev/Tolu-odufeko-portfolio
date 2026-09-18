import Link from "next/link";
import AdminShell from "@/component/admin/AdminShell";
import SettingsForm from "@/component/admin/SettingsForm";
import { getSiteSettings } from "@/lib/data";
import { updateSiteSettings } from "@/app/actions/settings";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <AdminShell>
      <div className="px-4 py-6 sm:px-8 sm:py-10 max-w-4xl w-full">
        {/* Header */}
        <div className="border-b border-dark-one/10 pb-6 mb-6 sm:pb-8 sm:mb-8">
          <span className="font-content text-xs font-semibold uppercase tracking-widest text-accent-strong">
            Configuration
          </span>
          <h1 className="mt-1 font-header text-3xl sm:text-4xl text-dark-one">
            Site Settings &amp; Profile
          </h1>
          <p className="mt-1 font-content text-xs sm:text-sm text-muted">
            Manage your CV document, social links, and public contact information.
          </p>
        </div>

        {/* Banner linking to Site Details */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-accent/40 bg-accent/10 p-4">
          <div className="flex items-center gap-3">
            <span className="text-xl shrink-0" aria-hidden="true">✎</span>
            <div>
              <p className="font-content text-xs sm:text-sm font-semibold text-dark-one">
                Looking to edit website copy, headings, and eyebrows?
              </p>
              <p className="font-content text-xs text-muted">
                Customize titles, bios, and descriptions for all pages in Site Details.
              </p>
            </div>
          </div>
          <Link
            href="/admin/site-details"
            className="font-content rounded-xl bg-accent px-4 py-2 text-xs font-bold text-dark-one hover:bg-dark-one hover:text-white transition-colors self-start sm:self-center shrink-0"
          >
            Go to Site Details &rarr;
          </Link>
        </div>

        {/* Form */}
        <SettingsForm settings={settings} action={updateSiteSettings} />
      </div>
    </AdminShell>
  );
}
