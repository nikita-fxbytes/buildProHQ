import { PaginationBar } from "@/components/common/PaginationBar";

export type AppTablePaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
  managerMode?: boolean;
};

export function AppTablePagination({
  page,
  pageSize,
  total,
  onChange,
  managerMode,
}: AppTablePaginationProps) {
  /** Aligns with API meta: hide when total ≤ limit (e.g. limit 10 and total 10 → one page, no chrome). */
  if (pageSize <= 0 || total <= pageSize) {
    return null;
  }

  return (
    <PaginationBar
      page={page}
      pageSize={pageSize}
      total={total}
      onChange={onChange}
      managerMode={managerMode}
    />
  );
}
