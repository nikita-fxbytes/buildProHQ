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
