import AdminShell from "@/component/admin/AdminShell";
import NowItemForm from "@/component/admin/NowItemForm";
import { createNowItem } from "@/app/actions/now";

export default function NewNowItemPage() {
  return (
    <AdminShell>
      <div className="px-4 py-6 sm:px-8 sm:py-10 max-w-2xl w-full">
        <div className="border-b border-dark-one/10 pb-6 mb-6 sm:pb-8 sm:mb-8">
          <span className="font-content text-xs font-semibold uppercase tracking-widest text-accent-strong">
            Now
          </span>
          <h1 className="mt-1 font-header text-3xl sm:text-4xl text-dark-one">Add Item</h1>
          <p className="mt-1 font-content text-xs sm:text-sm text-muted">
            Share what you&apos;re working on right now.
          </p>
        </div>
        <NowItemForm action={createNowItem} cancelHref="/admin/now" />
      </div>
    </AdminShell>
  );
}
