export type SafeListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function safeListMeta(meta: unknown, defaults?: Partial<SafeListMeta>): SafeListMeta {
  const m = (meta ?? {}) as Partial<SafeListMeta>;
  const page = typeof m.page === "number" && m.page > 0 ? m.page : defaults?.page ?? 1;
  const limit = typeof m.limit === "number" && m.limit > 0 ? m.limit : defaults?.limit ?? 10;
  const total = typeof m.total === "number" && m.total >= 0 ? m.total : defaults?.total ?? 0;
  const totalPages =
    typeof m.totalPages === "number" && m.totalPages > 0
      ? m.totalPages
      : defaults?.totalPages ?? Math.max(1, Math.ceil(total / limit));
  return { page, limit, total, totalPages };
}

