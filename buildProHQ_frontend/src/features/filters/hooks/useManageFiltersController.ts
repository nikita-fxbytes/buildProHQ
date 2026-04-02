"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MESSAGES } from "@/constants/messages";
import { filterService } from "@/services/filter.service";
import type { FilterCategory } from "@/types/domain";
import { appToast } from "@/utils/toast";

type DeleteTarget =
  | { type: "filter"; name: string }
  | { type: "sub"; name: string; sub: string }
  | null;

export function useManageFiltersController() {
  const [filters, setFilters] = useState<FilterCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [nameInput, setNameInput] = useState("");
  const [subsInput, setSubsInput] = useState("");
  const [quickLevelInput, setQuickLevelInput] = useState("");
  const [quickTradeInput, setQuickTradeInput] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await filterService.getFilters();
      setFilters(rows);
    } catch {
      appToast.error(MESSAGES.common.somethingWrong);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const addFilter = async () => {
    const name = nameInput.trim();
    if (!name) {
      appToast.error("Enter a filter name!");
      return;
    }
    const subs = subsInput
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    try {
      await filterService.addFilter(name, subs);
      setNameInput("");
      setSubsInput("");
      appToast.success(MESSAGES.filter.added);
      await load();
    } catch {
      appToast.error(MESSAGES.common.saveFailed);
    }
  };

  const quickAddLevel = async () => {
    const value = quickLevelInput.trim();
    if (!value) return;
    try {
      await filterService.addLevel(value);
      setQuickLevelInput("");
      appToast.success(MESSAGES.filter.added);
      await load();
    } catch {
      appToast.error(MESSAGES.common.saveFailed);
    }
  };

  const quickAddTrade = async () => {
    const value = quickTradeInput.trim();
    if (!value) return;
    try {
      await filterService.addTrade(value);
      setQuickTradeInput("");
      appToast.success(MESSAGES.filter.added);
      await load();
    } catch {
      appToast.error(MESSAGES.common.saveFailed);
    }
  };

  const addSubFilter = async (name: string) => {
    const value = window.prompt(`Add sub-filter to "${name}":`)?.trim();
    if (!value) return;
    try {
      await filterService.addSubFilter(name, value);
      appToast.success(`"${value}" added to ${name}!`);
      await load();
    } catch {
      appToast.error(MESSAGES.common.saveFailed);
    }
  };

  const confirmDeleteFilter = (name: string) => setDeleteTarget({ type: "filter", name });
  const confirmDeleteSubFilter = (name: string, sub: string) =>
    setDeleteTarget({ type: "sub", name, sub });

  const closeDeleteConfirm = () => setDeleteTarget(null);

  const executeDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "filter") {
        await filterService.deleteFilter(deleteTarget.name);
      } else {
        await filterService.deleteSubFilter(deleteTarget.name, deleteTarget.sub);
      }
      setDeleteTarget(null);
      appToast.success(MESSAGES.filter.deleted);
      await load();
    } catch {
      appToast.error(MESSAGES.common.saveFailed);
    }
  };

  const deleteDialog = useMemo(() => {
    if (!deleteTarget) {
      return {
        open: false,
        title: "",
        message: "",
      };
    }
    if (deleteTarget.type === "filter") {
      return {
        open: true,
        title: "Delete Filter",
        message: `Delete filter category "${deleteTarget.name}" and all its sub-filters? This cannot be undone.`,
      };
    }
    return {
      open: true,
      title: "Remove Sub-filter",
      message: `Remove "${deleteTarget.sub}" from "${deleteTarget.name}"?`,
    };
  }, [deleteTarget]);

  return {
    filters,
    loading,
    nameInput,
    setNameInput,
    subsInput,
    setSubsInput,
    quickLevelInput,
    setQuickLevelInput,
    quickTradeInput,
    setQuickTradeInput,
    addFilter,
    quickAddLevel,
    quickAddTrade,
    addSubFilter,
    confirmDeleteFilter,
    confirmDeleteSubFilter,
    deleteDialog,
    closeDeleteConfirm,
    executeDelete,
  };
}

