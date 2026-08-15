"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const NowItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  status: z.string().min(1, "Status is required"),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export async function createNowItem(formData: FormData): Promise<void> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = NowItemSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(", "));
  }

  const supabase = await createClient();
  const { error } = await supabase.from("now_items").insert({
    title: parsed.data.title,
    description: parsed.data.description,
    date: parsed.data.date,
    status: parsed.data.status,
    sort_order: parsed.data.sortOrder,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/now");
  revalidatePath("/");
  revalidatePath("/admin/now");
}

export async function updateNowItem(
  id: string,
  formData: FormData
): Promise<void> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = NowItemSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(", "));
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("now_items")
    .update({
      title: parsed.data.title,
      description: parsed.data.description,
      date: parsed.data.date,
      status: parsed.data.status,
      sort_order: parsed.data.sortOrder,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/now");
  revalidatePath("/");
  revalidatePath("/admin/now");
}

export async function deleteNowItem(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("now_items").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/now");
  revalidatePath("/");
  revalidatePath("/admin/now");
}
