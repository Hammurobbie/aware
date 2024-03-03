"use server";

import { revalidateTag } from "next/cache";

export default async function refresh_categories() {
  revalidateTag("activity_categories");
}
