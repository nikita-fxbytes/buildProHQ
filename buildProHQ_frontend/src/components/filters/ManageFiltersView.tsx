"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { AppIcon } from "@/components/common/AppIcon";
import { ManageFiltersListSkeleton } from "@/components/common/skeletons/ManageFiltersListSkeleton";
import type { LookupItem } from "@/services/lookupsApi.service";
import { AppButton } from "@/components/common/AppButton";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { FormTextField } from "@/components/common/FormTextField";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useMemo, useState } from "react";
import type { ManageFilterCard } from "@/features/filters/hooks/useManageFiltersController";

export type ManageFiltersViewProps = {
  loading: boolean;
  saving: boolean;
  filters: ManageFilterCard[];
  levels: LookupItem[];
  trades: LookupItem[];
  categories: Array<{ id: string; name: string }>;
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  newCategoryName: string;
  setNewCategoryName: (v: string) => void;
  optionsCsv: string;
  setOptionsCsv: (v: string) => void;
  quickLevel: string;
  setQuickLevel: (v: string) => void;
  quickTrade: string;
  setQuickTrade: (v: string) => void;
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
  levels,
  trades,
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
  newCategoryName,
  setNewCategoryName,
  optionsCsv,
  setOptionsCsv,
  quickLevel,
  setQuickLevel,
  quickTrade,
  setQuickTrade,
  setSelectedForAddSubFilter,
  onSaveFilter,
  onDeleteCategory,
  onDeleteOption,
  onQuickAddLevel,
  onQuickAddTrade,
}: ManageFiltersViewProps) {
  const [confirm, setConfirm] = useState<null | { id: string; name: string }>(null);
  const deletingCategoryName = confirm?.name ?? "";
  const deleteMessage = useMemo(() => {
    if (!deletingCategoryName) return "";
    return `Delete filter category "${deletingCategoryName}" and all its sub-filters? This cannot be undone.`;
  }, [deletingCategoryName]);

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
                <Box key={filter.id} className="filter-manage-card" sx={filterCardSx}>
                  <Box className="filter-manage-head" sx={filterHeadSx}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 1 }}>
                      <Typography component="h3" sx={filterHeadTitleSx}>
                        <AppIcon name="folder" size={16} sx={{ mr: 0.5 }} />
                        {filter.name}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <AppButton
                          variant="contained"
                          size="small"
                          disabled={saving}
                          onClick={() => setSelectedForAddSubFilter(filter.id)}
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
                          onClick={() => setConfirm({ id: filter.id, name: filter.name })}
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
                      {filter.subs.length ? (
                        filter.subs.map((sub) => (
                          <Chip
                            key={sub.id}
                            label={
                              <Box sx={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                <span>{sub.name}</span>
                                <span style={{ fontSize: 10, fontWeight: 700, marginLeft: 2 }}>✕</span>
                              </Box>
                            }
                            onClick={() => onDeleteOption(sub.id)}
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
                <FormFieldLabel>Filter Category Name</FormFieldLabel>
                <Autocomplete<CategoryOpt, false, false, true>
                  freeSolo
                  options={categories}
                  value={categories.find((c) => c.id === selectedCategoryId) ?? null}
                  onChange={(_, opt) => {
                    if (typeof opt === "string") {
                      setSelectedCategoryId("");
                      setNewCategoryName(opt);
                      return;
                    }
                    setSelectedCategoryId(opt?.id ?? "");
                    setNewCategoryName(opt?.name ?? "");
                  }}
                  inputValue={newCategoryName}
                  onInputChange={(_, nextValue) => {
                    setNewCategoryName(nextValue);
                    // If user is typing, we treat it as "new" until they pick an option.
                    setSelectedCategoryId("");
                  }}
                  getOptionLabel={(o) => (typeof o === "string" ? o : o.name)}
                  isOptionEqualToValue={(a, b) => a.id === b.id}
                  disabled={saving}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="e.g. Zone, Floor, Area..."
                      size="small"
                    />
                  )}
                />
                <Typography sx={{ fontSize: 11, color: "#7B89A8", mt: 0.5 }}>
                  Or select an existing category to add sub-filters to it.
                </Typography>
              </Box>

              <Box>
                <FormFieldLabel>Sub-filters (comma separated)</FormFieldLabel>
                <FormTextField
                  value={optionsCsv}
                  onChange={(e) => setOptionsCsv(e.target.value)}
                  placeholder="e.g. North, South, East, West"
                  disabled={saving}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <AppButton
                  variant="contained"
                  onClick={onSaveFilter}
                  disabled={saving || loading}
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
                <Box sx={{ display: "flex", gap: 1 }}>
                  <FormTextField
                    value={quickLevel}
                    onChange={(e) => setQuickLevel(e.target.value)}
                    placeholder="New Level (e.g. L11)"
                    disabled={saving}
                    sx={{ flex: 1 }}
                  />
                  <AppButton
                    variant="contained"
                    onClick={onQuickAddLevel}
                    disabled={saving || !quickLevel.trim()}
                    sx={{
                      width: 120,
                      background: "#F5A623",
                      "&:hover": { background: "#E09010" },
                    }}
                  >
                    + Add Level
                  </AppButton>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <FormTextField
                    value={quickTrade}
                    onChange={(e) => setQuickTrade(e.target.value)}
                    placeholder="New Trade (e.g. Tiler)"
                    disabled={saving}
                    sx={{ flex: 1 }}
                  />
                  <AppButton
                    variant="contained"
                    onClick={onQuickAddTrade}
                    disabled={saving || !quickTrade.trim()}
                    sx={{
                      width: 120,
                      background: "#3BB0D8",
                      "&:hover": { background: "#2A9CC4" },
                    }}
                  >
                    + Add Trade
                  </AppButton>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>

      <ConfirmModal
        open={Boolean(confirm)}
        title="Delete Filter"
        message={deleteMessage}
        confirmLabel="Yes, Delete"
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

const filterChipSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  padding: "2px 10px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: 600,
  background: "#FFF3D4",
  color: "#E09010",
};
