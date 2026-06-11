import { env } from "@/lib/env";

export function useConstructUrl(key?: string): string | undefined {
  if (!key?.trim()) return undefined;

  return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.tigrisfiles.io/${key}`;
}
