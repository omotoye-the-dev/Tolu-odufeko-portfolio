import { notFound } from "next/navigation";
import AdminShell from "@/component/admin/AdminShell";
import NowItemForm from "@/component/admin/NowItemForm";
import { getNowItems } from "@/lib/data";
import { updateNowItem } from "@/app/actions/now";

interface EditNowItemPageProps {
  readonly params: Promise<{ id: string }>;
}

export default async function EditNowItemPage({ params }: EditNowItemPageProps) {
  const { id } = await params;
  const allItems = await getNowItems();
  const item = allItems.find((i) => i.id === id);

  if (!item) notFound();

  async function handleUpdate(formData: FormData): Promise<void> {
    "use server";
    await updateNowItem(id, formData);
  }

  return (
    <AdminShell>
      <div className="px-4 py-6 sm:px-8 sm:py-10 max-w-2xl w-full">
        <div className="border-b border-dark-one/10 pb-6 mb-6 sm:pb-8 sm:mb-8">
          <span className="font-content text-xs font-semibold uppercase tracking-widest text-accent-strong">
            Now
          </span>
          <h1 className="mt-1 font-header text-3xl sm:text-4xl text-dark-one">Edit Item</h1>
          <p className="mt-1 font-content text-xs sm:text-sm text-muted wrap-break-word">
            {item.title}
          </p>
        </div>
        <NowItemForm item={item} action={handleUpdate} cancelHref="/admin/now" />
      </div>
    </AdminShell>
  );
}
