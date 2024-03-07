"use server";

import { revalidateTag } from "next/cache";

export async function refresh_categories() {
  revalidateTag("activity_categories");
}

export async function refresh_activities() {
  revalidateTag("activities");
}
