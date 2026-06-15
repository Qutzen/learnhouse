import { env } from "@/lib/env";

export function constructUrl(key?: string) {
  if (!key?.trim()) return "/placeholder.jpg";

  return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.tigrisfiles.io/${key}`;
}
