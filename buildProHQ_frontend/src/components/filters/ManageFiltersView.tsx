"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { AppIcon } from "@/components/common/AppIcon";
import { ManageFiltersListSkeleton } from "@/components/common/skeletons/ManageFiltersListSkeleton";
import { MESSAGES } from "@/constants/messages";
import { AppButton } from "@/components/common/AppButton";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { FormTextField } from "@/components/common/FormTextField";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useState } from "react";
import type { ManageFilterCard } from "@/features/filters/hooks/useManageFiltersController";

export type ManageFiltersViewProps = {
  loading: boolean;
  saving: boolean;
  filters: ManageFilterCard[];
  categories: Array<{ id: string; name: string }>;
  selectedFilterCategoryId: string;
  setSelectedFilterCategoryId: (id: string) => void;
  filterCategoryNameInput: string;
  setFilterCategoryNameInput: (v: string) => void;
  subFiltersCommaSeparatedInput: string;
  setSubFiltersCommaSeparatedInput: (v: string) => void;
  quickLevelNameInput: string;
  setQuickLevelNameInput: (v: string) => void;
  quickTradeNameInput: string;
  setQuickTradeNameInput: (v: string) => void;
  setSelectedForAddSubFilter: (categoryId: string) => void;
  onSaveFilter: () => void;
  onDeleteCategory: (id: string) => void;
  onDeleteOption: (id: string) => void;
  onQuickAddLevel: () => void;
  onQuickAddTrade: () => void;
};

type CategoryOpt = { id: string; name: string };

export function ManageFiltersView({
  loading,
  saving,
  filters,
  categories,
  selectedFilterCategoryId,
  setSelectedFilterCategoryId,
  filterCategoryNameInput,
  setFilterCategoryNameInput,
  subFiltersCommaSeparatedInput,
  setSubFiltersCommaSeparatedInput,
  quickLevelNameInput,
  setQuickLevelNameInput,
  quickTradeNameInput,
  setQuickTradeNameInput,
  setSelectedForAddSubFilter,
  onSaveFilter,
  onDeleteCategory,
  onDeleteOption,
  onQuickAddLevel,
  onQuickAddTrade,
}: ManageFiltersViewProps) {
  const [confirm, setConfirm] = useState<null | { id: string; name: string }>(null);
  const deleteMessage =
    confirm?.name != null && confirm.name !== ""
      ? MESSAGES.filter.deleteConfirmMessageTemplate.replace("{{name}}", confirm.name)
      : "";

  return (
    <Stack spacing={2}>
      <Box className="two-col" sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: "20px" }}>
        <Box>
          <Box className="section-title" sx={sectionTitleSx}>
            <AppIcon name="folder" size={16} /> 📂 Current Filters
          </Box>
          <Box id="filter-list-view" sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {loading ? (
              <ManageFiltersListSkeleton cards={3} />
            ) : filters.length === 0 ? (
              <Box sx={{ fontSize: 13, color: "#7B89A8", padding: "10px 2px" }}>No filter data.</Box>
            ) : (
              filters.map((filter) => (
                <Box key={filter.filterCategoryId} className="filter-manage-card" sx={filterCardSx}>
                  <Box className="filter-manage-head" sx={filterHeadSx}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 1 }}>
                      <Typography component="h3" sx={filterHeadTitleSx}>
                        <AppIcon name="folder" size={16} sx={{ mr: 0.5 }} />
                        {filter.filterCategoryName}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <AppButton
                          variant="contained"
                          size="small"
                          disabled={saving}
                          onClick={() => setSelectedForAddSubFilter(filter.filterCategoryId)}
                          sx={{
                            padding: "6px 14px",
                            fontSize: "13px",
                            background: "#F5A623",
                            "&:hover": { background: "#E09010" },
                          }}
                        >
                          + Add Sub-filter
                        </AppButton>
                        <AppButton
                          variant="contained"
                          size="small"
                          disabled={saving}
                          onClick={() =>
                            setConfirm({ id: filter.filterCategoryId, name: filter.filterCategoryName })
                          }
                          sx={{
                            padding: "6px 14px",
                            fontSize: "13px",
                            background: "#FEE2E2",
                            color: "#EF4444",
                            "&:hover": { background: "#EF4444", color: "#fff" },
                          }}
                        >
                          🗑 Delete
                        </AppButton>
                      </Box>
                    </Box>
                  </Box>
                  <Box className="filter-item-row" sx={filterRowSx}>
                    <Box className="filter-sub-chips" sx={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {filter.subFilters.length ? (
                        filter.subFilters.map((sub) => (
                          <Chip
                            key={sub.filterOptionId}
                            label={
                              <Box sx={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                <span>{sub.label}</span>
                                <span style={{ fontSize: 10, fontWeight: 700, marginLeft: 2 }}>✕</span>
                              </Box>
                            }
                            onClick={() => onDeleteOption(sub.filterOptionId)}
                            disabled={saving}
                            size="small"
                            sx={{
                              height: "20px",
                              borderRadius: "20px",
                              fontSize: "11px",
                              fontWeight: 600,
                              background: "#FFF3D4",
                              color: "#E09010",
                              "& .MuiChip-label": { paddingInline: "10px" },
                              cursor: "pointer",
                            }}
                          />
                        ))
                      ) : (
                        <Box sx={{ fontSize: 12, color: "#7B89A8" }}>No options in this category.</Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Box>

        <Box>
          <Box className="section-title" sx={sectionTitleSx}>
            <AppIcon name="add" size={16} /> ➕ Add New Filter
          </Box>
          <Box sx={formCardSx}>
            <Stack spacing={1.5}>
              <Box>
                <FormFieldLabel htmlFor="filterCategoryName">Filter category name</FormFieldLabel>
                <Autocomplete<CategoryOpt, false, false, true>
                  freeSolo
                  options={categories}
                  value={categories.find((c) => c.id === selectedFilterCategoryId) ?? null}
                  onChange={(_, opt) => {
                    if (typeof opt === "string") {
                      setSelectedFilterCategoryId("");
                      setFilterCategoryNameInput(opt);
                      return;
                    }
                    setSelectedFilterCategoryId(opt?.id ?? "");
                    setFilterCategoryNameInput(opt?.name ?? "");
                  }}
                  inputValue={filterCategoryNameInput}
                  onInputChange={(_, nextValue) => {
                    setFilterCategoryNameInput(nextValue);
                    // If user is typing, we treat it as "new" until they pick an option.
                    setSelectedFilterCategoryId("");
                  }}
                  getOptionLabel={(o) => (typeof o === "string" ? o : o.name)}
                  isOptionEqualToValue={(a, b) => a.id === b.id}
                  disabled={saving}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="filterCategoryName"
                      placeholder="e.g. Zone, Floor, Area..."
                      size="small"
                      inputProps={{ ...params.inputProps, id: "filterCategoryName" }}
                    />
                  )}
                />
                <Typography sx={{ fontSize: 11, color: "#7B89A8", mt: 0.5 }}>
                  Or select an existing category to add sub-filters to it.
                </Typography>
              </Box>

              <Box>
                <FormFieldLabel htmlFor="subFiltersCommaSeparated">Sub-filters (comma-separated)</FormFieldLabel>
                <FormTextField
                  id="subFiltersCommaSeparated"
                  name="subFiltersCommaSeparated"
                  value={subFiltersCommaSeparatedInput}
                  onChange={(e) => setSubFiltersCommaSeparatedInput(e.target.value)}
                  placeholder="e.g. North, South, East, West"
                  disabled={saving}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <AppButton
                  variant="contained"
                  onClick={onSaveFilter}
                  disabled={
                    saving ||
                    loading ||
                    (!selectedCategoryId.trim() && !filterCategoryNameInput.trim())
                  }
                  sx={{ background: "#F5A623", "&:hover": { background: "#E09010" } }}
                >
                  Save Filter
                </AppButton>
              </Box>
            </Stack>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Box className="section-title" sx={sectionTitleSx}>
              <AppIcon name="quick" size={16} /> ⚡ Quick Add
            </Box>
            <Box sx={formCardSx}>
              <Stack spacing={1.5}>
                <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                  <FormFieldLabel htmlFor="quickLevelName">Quick add level</FormFieldLabel>
                  <Box sx={{ display: "flex", gap: 1 }}>
                  <FormTextField
                    id="quickLevelName"
                    name="quickLevelName"
                    value={quickLevelNameInput}
                    onChange={(e) => setQuickLevelNameInput(e.target.value)}
                    placeholder="New Level (e.g. L11)"
                    disabled={saving}
                    sx={{ flex: 1 }}
                  />
                  <AppButton
                    variant="contained"
                    onClick={onQuickAddLevel}
                    disabled={saving || !quickLevelNameInput.trim()}
                    sx={{
                      width: 120,
                      background: "#F5A623",
                      "&:hover": { background: "#E09010" },
                    }}
                  >
                    + Add Level
                  </AppButton>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                  <FormFieldLabel htmlFor="quickTradeName">Quick add trade</FormFieldLabel>
                  <Box sx={{ display: "flex", gap: 1 }}>
                  <FormTextField
                    id="quickTradeName"
                    name="quickTradeName"
                    value={quickTradeNameInput}
                    onChange={(e) => setQuickTradeNameInput(e.target.value)}
                    placeholder="New Trade (e.g. Tiler)"
                    disabled={saving}
                    sx={{ flex: 1 }}
                  />
                  <AppButton
                    variant="contained"
                    onClick={onQuickAddTrade}
                    disabled={saving || !quickTradeNameInput.trim()}
                    sx={{
                      width: 120,
                      background: "#3BB0D8",
                      "&:hover": { background: "#2A9CC4" },
                    }}
                  >
                    + Add Trade
                  </AppButton>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>

      <ConfirmModal
        open={Boolean(confirm)}
        title={MESSAGES.filter.deleteConfirmTitle}
        message={deleteMessage}
        confirmLabel={MESSAGES.filter.deleteConfirmLabel}
        confirmColor="error"
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          const id = confirm?.id;
          setConfirm(null);
          if (id) onDeleteCategory(id);
        }}
      />
    </Stack>
  );
}

const sectionTitleSx = {
  fontFamily: "Rajdhani, sans-serif",
  fontSize: "16px",
  fontWeight: 700,
  color: "#1A2035",
  marginBottom: "14px",
  paddingBottom: "10px",
  borderBottom: "2px solid #E4E8F0",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const formCardSx = {
  background: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
  padding: "28px 32px",
};

const filterCardSx = {
  background: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
  overflow: "hidden",
};

const filterHeadSx = {
  background: "#1C2333",
  padding: "14px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const filterHeadTitleSx = {
  fontFamily: "Rajdhani, sans-serif",
  fontSize: "16px",
  fontWeight: 700,
  color: "#ffffff",
};

const filterRowSx = {
  display: "flex",
  alignItems: "center",
  padding: "12px 20px",
  borderBottom: "1px solid #E4E8F0",
  gap: "10px",
};
