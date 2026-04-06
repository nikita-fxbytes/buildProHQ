import type { UploadItem } from "@/components/common/FormUploadField";

export function revokeBlobUrls(items: UploadItem[]): void {
  items.forEach((p) => {
    if (p.url.startsWith("blob:")) URL.revokeObjectURL(p.url);
  });
}

