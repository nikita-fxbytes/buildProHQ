"use client";

import { useState } from "react";

export type TableSortDirection = "asc" | "desc";

export function useTableSort<TSortKey extends string>(initialKey?: TSortKey) {
  const [sortKey, setSortKey] = useState<TSortKey | null>(initialKey ?? null);
  const [sortDirection, setSortDirection] = useState<TableSortDirection>("asc");

  const toggleSort = (key: TSortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  };

  return {
    sortKey,
    sortDirection,
    toggleSort,
    setSortKey,
    setSortDirection,
  };
}
