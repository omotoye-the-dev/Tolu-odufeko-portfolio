import Link from "next/link";
import AdminShell from "@/component/admin/AdminShell";
import EmptyState from "@/component/UI/EmptyState";
import AdminDeleteButton from "@/component/admin/AdminDeleteButton";
import { getNowItems } from "@/lib/data";
import { deleteNowItem } from "@/app/actions/now";

export default async function AdminNowPage() {
  const items = await getNowItems();

  return (
    <AdminShell>
      <div className="px-4 py-6 sm:px-8 sm:py-10 max-w-3xl w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-dark-one/10 pb-6 mb-6 sm:pb-8 sm:mb-8">
          <div>
            <span className="font-content text-xs font-semibold uppercase tracking-widest text-accent-strong">
              Content
            </span>
            <h1 className="mt-1 font-header text-3xl sm:text-4xl text-dark-one">Now</h1>
            <p className="mt-1 font-content text-xs sm:text-sm text-muted">
              {items.length} items · shown in order
            </p>
          </div>
          <Link
            href="/admin/now/new"
            className="font-content text-xs sm:text-sm font-bold bg-accent text-dark-one px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl hover:bg-accent-strong transition-colors text-center w-full sm:w-auto"
          >
            + Add Item
          </Link>
        </div>

        {/* List */}
        {items.length === 0 ? (
          <EmptyState
            icon="◉"
            title="No items yet"
            description="Share what you are currently building, reading, or focusing on."
            ctaLabel="Add your first item"
            ctaHref="/admin/now/new"
          />
        ) : (
          <div className="flex flex-col gap-3 sm:gap-4">
            {items.map((item, i) => (
              <div
                key={item.id ?? i}
                className="rounded-2xl border-2 border-dark-one/10 bg-white p-4 sm:p-5 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-content text-xs font-bold uppercase tracking-wider text-accent-strong">
                        {item.status}
                      </span>
                      <span className="font-content text-xs text-faint">
                        {item.date}
                      </span>
                    </div>
                    <p className="font-content text-sm font-semibold text-dark-one wrap-break-word">
                      {item.title}
                    </p>
                    <p className="font-content text-xs text-muted leading-relaxed wrap-break-word">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-dark-one/5 justify-end sm:justify-start shrink-0">
                    <Link
                      href={`/admin/now/${item.id}/edit`}
                      className="font-content text-xs font-semibold text-accent-strong hover:text-dark-one transition-colors px-2 py-1"
                    >
                      Edit →
                    </Link>
                    <AdminDeleteButton
                      itemId={item.id ?? ""}
                      itemTitle={item.title}
                      itemType="item"
                      onDelete={deleteNowItem}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
