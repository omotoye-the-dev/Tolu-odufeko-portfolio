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

        {/* Form */}
        <SettingsForm settings={settings} action={updateSiteSettings} />
      </div>
    </AdminShell>
  );
}
