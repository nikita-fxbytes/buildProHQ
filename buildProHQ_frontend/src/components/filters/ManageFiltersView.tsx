"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
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
import type {
  ManageFilterCard,
  ManageFilterFieldErrors,
} from "@/features/filters/hooks/useManageFiltersController";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import type { MyProjectItem } from "@/services/projectsApi.service";

export type ManageFiltersViewProps = {
  loading: boolean;
  saving: boolean;
  filters: ManageFilterCard[];
  projects: MyProjectItem[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  categories: Array<{ id: string; name: string }>;
  selectedFilterCategoryId: string;
  setSelectedFilterCategoryId: (id: string) => void;
  filterCategoryNameInput: string;
  setFilterCategoryNameInput: (v: string) => void;
  subFiltersCommaSeparatedInput: string;
  setSubFiltersCommaSeparatedInput: (v: string) => void;
  setSelectedForAddSubFilter: (categoryId: string) => void;
  onSaveFilter: () => void;
  onDeleteCategory: (id: string) => void;
  onDeleteOption: (id: string) => void;
  filterFieldErrors: ManageFilterFieldErrors;
};

type CategoryOpt = { id: string; name: string };

export function ManageFiltersView({
  loading,
  saving,
  filters,
  projects,
  selectedProjectId,
  setSelectedProjectId,
  categories,
  selectedFilterCategoryId,
  setSelectedFilterCategoryId,
  filterCategoryNameInput,
  setFilterCategoryNameInput,
  subFiltersCommaSeparatedInput,
  setSubFiltersCommaSeparatedInput,
  setSelectedForAddSubFilter,
  onSaveFilter,
  onDeleteCategory,
  onDeleteOption,
  filterFieldErrors,
}: ManageFiltersViewProps) {
  const [confirmCategory, setConfirmCategory] = useState<null | { id: string; name: string }>(null);
  const [confirmSubFilter, setConfirmSubFilter] = useState<null | { id: string; label: string }>(null);

  const deleteCategoryMessage =
    confirmCategory?.name != null && confirmCategory.name !== ""
      ? MESSAGES.filter.deleteConfirmMessageTemplate.replace("{{name}}", confirmCategory.name)
      : "";

  const deleteSubFilterMessage =
    confirmSubFilter?.label != null && confirmSubFilter.label !== ""
      ? MESSAGES.filter.subFilterDeleteConfirmMessageTemplate.replace("{{label}}", confirmSubFilter.label)
      : "";

  return (
    <Stack spacing={2}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: 300 }}>
          <FormFieldLabel>Project</FormFieldLabel>
          <Autocomplete<CategoryOpt, false, false, false>
            options={projects.map((p) => ({ id: p.id, name: p.name }))}
            value={
              projects.find((p) => p.id === selectedProjectId)
                ? { id: selectedProjectId, name: projects.find((p) => p.id === selectedProjectId)?.name ?? "" }
                : null
            }
            onChange={(_, opt) => setSelectedProjectId(opt?.id ?? "")}
            getOptionLabel={(o) => o.name}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            disabled={saving || loading}
            renderInput={(params) => (
              <TextField {...params} size="small" placeholder="Select project..." />
            )}
          />
          <Typography sx={{ fontSize: 12, color: STYLE_TOKENS.colors.textMuted }}>
            Filters shown here are for the selected project (plus Global).
          </Typography>
        </Box>
      </Box>

      <Box className="two-col" sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: "20px" }}>
        <Box>
          <Paper elevation={0} sx={listCardSx}>
            <Typography sx={sectionTitleSx} component="h2">
              <AppIcon name="folder" size={18} /> Current Filters
            </Typography>

            <Box id="filter-list-view" sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {loading ? (
                <ManageFiltersListSkeleton cards={3} />
              ) : filters.length === 0 ? (
                <Box sx={{ fontSize: 13, color: STYLE_TOKENS.colors.textMuted, padding: "10px 2px" }}>
                  No filter data.
                </Box>
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
                              background: STYLE_TOKENS.colors.orange,
                              "&:hover": { background: STYLE_TOKENS.colors.orangeDark },
                            }}
                          >
                            + Add Sub-filter
                          </AppButton>
                          <AppButton
                            variant="contained"
                            size="small"
                            disabled={saving}
                            onClick={() =>
                              setConfirmCategory({
                                id: filter.filterCategoryId,
                                name: filter.filterCategoryName,
                              })
                            }
                            sx={{
                              padding: "6px 14px",
                              fontSize: "13px",
                              background: "#FEE2E2",
                              color: STYLE_TOKENS.colors.red,
                              "&:hover": { background: STYLE_TOKENS.colors.red, color: STYLE_TOKENS.colors.white },
                            }}
                          >
                            <AppIcon name="delete" size={16} sx={{ color: "inherit" }} />
                            Delete
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
                              onClick={() =>
                                setConfirmSubFilter({ id: sub.filterOptionId, label: sub.label })
                                }
                              disabled={saving}
                              size="small"
                              sx={{
                                height: "20px",
                                borderRadius: "20px",
                                fontSize: "11px",
                                fontWeight: 600,
                              background: STYLE_TOKENS.colors.orangeLight,
                              color: STYLE_TOKENS.colors.orangeDark,
                                "& .MuiChip-label": { paddingInline: "10px" },
                                cursor: "pointer",
                              }}
                            />
                          ))
                        ) : (
                        <Box sx={{ fontSize: 12, color: STYLE_TOKENS.colors.textMuted }}>
                          No sub-filters in this category yet.
                        </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Paper>
        </Box>

        <Box>
          <Paper elevation={0} sx={formCardSx}>
            <Typography sx={sectionTitleSx} component="h2">
              <AppIcon name="add" size={18} /> Add / update filter
            </Typography>

            <Stack spacing={1.5}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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
                      error={Boolean(filterFieldErrors.category)}
                      helperText={
                        filterFieldErrors.category ??
                        "Pick an existing category from the list or type a new name (at least 2 characters). Use + Add Sub-filter on a card to pre-fill this form."
                      }
                      inputProps={{ ...params.inputProps, id: "filterCategoryName" }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <FormFieldLabel htmlFor="subFiltersCommaSeparated">Sub-filters (comma-separated)</FormFieldLabel>
                <FormTextField
                  id="subFiltersCommaSeparated"
                  name="subFiltersCommaSeparated"
                  value={subFiltersCommaSeparatedInput}
                  onChange={(e) => setSubFiltersCommaSeparatedInput(e.target.value)}
                  placeholder="e.g. North, South, East, West"
                  disabled={saving}
                  error={Boolean(filterFieldErrors.subFilters)}
                  helperText={
                    filterFieldErrors.subFilters ??
                    "Duplicate names in this box are ignored. Names already in the category (same letters, any case) are not created again."
                  }
                />
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <AppButton
                  variant="contained"
                  onClick={onSaveFilter}
                  disabled={
                    saving ||
                    loading ||
                    (!selectedFilterCategoryId.trim() && !filterCategoryNameInput.trim())
                  }
                  sx={{
                    background: STYLE_TOKENS.colors.orange,
                    "&:hover": { background: STYLE_TOKENS.colors.orangeDark },
                  }}
                >
                  Save
                </AppButton>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Box>

      <ConfirmModal
        open={Boolean(confirmCategory)}
        title={MESSAGES.filter.deleteConfirmTitle}
        message={deleteCategoryMessage}
        confirmLabel={MESSAGES.filter.deleteConfirmLabel}
        confirmColor="error"
        onClose={() => setConfirmCategory(null)}
        onConfirm={() => {
          const id = confirmCategory?.id;
          setConfirmCategory(null);
          if (id) onDeleteCategory(id);
        }}
      />

      <ConfirmModal
        open={Boolean(confirmSubFilter)}
        title={MESSAGES.filter.subFilterDeleteConfirmTitle}
        message={deleteSubFilterMessage}
        confirmLabel={MESSAGES.filter.subFilterDeleteConfirmLabel}
        confirmColor="error"
        onClose={() => setConfirmSubFilter(null)}
        onConfirm={() => {
          const id = confirmSubFilter?.id;
          setConfirmSubFilter(null);
          if (id) onDeleteOption(id);
        }}
      />
    </Stack>
  );
}

const sectionTitleSx = {
  fontFamily: STYLE_TOKENS.typography.fontDisplay,
  fontSize: STYLE_TOKENS.typography.size.section,
  fontWeight: 700,
  color: STYLE_TOKENS.colors.text,
  marginBottom: "14px",
  paddingBottom: "10px",
  borderBottom: `2px solid ${STYLE_TOKENS.colors.border}`,
  display: "flex",
  alignItems: "center",
  gap: 1,
};

const formCardSx = {
  background: STYLE_TOKENS.colors.card,
  borderRadius: `${STYLE_TOKENS.radius.card}px`,
  boxShadow: STYLE_TOKENS.shadow.card,
  padding: "28px 32px",
  position: "relative",
};

const listCardSx = {
  background: STYLE_TOKENS.colors.card,
  borderRadius: `${STYLE_TOKENS.radius.card}px`,
  boxShadow: STYLE_TOKENS.shadow.card,
  padding: "28px 32px",
  position: "relative",
};

const filterCardSx = {
  background: STYLE_TOKENS.colors.card,
  borderRadius: `${STYLE_TOKENS.radius.card}px`,
  boxShadow: STYLE_TOKENS.shadow.card,
  overflow: "hidden",
};

const filterHeadSx = {
  background: STYLE_TOKENS.colors.sidebarBg,
  padding: "14px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const filterHeadTitleSx = {
  fontFamily: STYLE_TOKENS.typography.fontDisplay,
  fontSize: STYLE_TOKENS.typography.size.section,
  fontWeight: 700,
  color: STYLE_TOKENS.colors.white,
};

const filterRowSx = {
  display: "flex",
  alignItems: "center",
  padding: "12px 20px",
  borderBottom: `1px solid ${STYLE_TOKENS.colors.border}`,
  gap: "10px",
};
