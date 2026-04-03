"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AppButton } from "@/components/common/AppButton";
import { ManageFiltersListSkeleton } from "@/components/common/skeletons/ManageFiltersListSkeleton";
import { AppIcon } from "@/components/common/AppIcon";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import type { FilterCategory } from "@/types/domain";

type Props = {
  filters: FilterCategory[];
  loading: boolean;
  nameInput: string;
  setNameInput: (value: string) => void;
  subsInput: string;
  setSubsInput: (value: string) => void;
  quickLevelInput: string;
  setQuickLevelInput: (value: string) => void;
  quickTradeInput: string;
  setQuickTradeInput: (value: string) => void;
  addFilter: () => void;
  quickAddLevel: () => void;
  quickAddTrade: () => void;
  addSubFilter: (name: string) => void;
  confirmDeleteFilter: (name: string) => void;
  confirmDeleteSubFilter: (name: string, sub: string) => void;
  deleteDialog: {
    open: boolean;
    title: string;
    message: string;
  };
  closeDeleteConfirm: () => void;
  executeDelete: () => void;
};

export function ManageFiltersView(props: Props) {
  return (
    <>
      <Box className="two-col" sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <Box>
          <Box className="section-title" sx={sectionTitleSx}>
            <AppIcon name="folder" size={16} /> Current Filters
          </Box>
          <Box id="filter-list-view" sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {props.loading ? (
              <ManageFiltersListSkeleton cards={3} />
            ) : props.filters.length === 0 ? (
              <Box sx={{ fontSize: 13, color: "#7B89A8", padding: "10px 2px" }}>No filters yet.</Box>
            ) : (
              props.filters.map((filter) => (
                <Box key={filter.name} className="filter-manage-card" sx={filterCardSx}>
                  <Box className="filter-manage-head" sx={filterHeadSx}>
                    <Typography component="h3" sx={filterHeadTitleSx}>
                      <AppIcon name="folder" size={16} sx={{ mr: 0.5 }} />
                      {filter.name}
                    </Typography>
                    <Box sx={{ display: "flex", gap: "6px" }}>
                      <AppButton
                        type="button"
                        size="small"
                        variant="contained"
                        onClick={() => props.addSubFilter(filter.name)}
                        sx={miniPrimaryBtnSx}
                      >
                        <AppIcon name="add" size={13} /> Add Sub-filter
                      </AppButton>
                      <AppButton
                        type="button"
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => props.confirmDeleteFilter(filter.name)}
                        sx={miniDangerBtnSx}
                      >
                        <AppIcon name="delete" size={13} /> Delete
                      </AppButton>
                    </Box>
                  </Box>
                  <Box className="filter-item-row" sx={filterRowSx}>
                    <Box className="filter-sub-chips" sx={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {filter.subs.length ? (
                        filter.subs.map((sub) => (
                          <Box
                            key={`${filter.name}-${sub}`}
                            className="filter-sub-chip"
                            sx={filterChipSx}
                          >
                            {sub}
                            <Box
                              component="span"
                              title="Remove sub-filter"
                              onClick={() => props.confirmDeleteSubFilter(filter.name, sub)}
                              sx={{
                                cursor: "pointer",
                                fontSize: "10px",
                                color: "#E09010",
                                fontWeight: 700,
                                marginLeft: "2px",
                              }}
                            >
                              <AppIcon name="close" size={10} />
                            </Box>
                          </Box>
                        ))
                      ) : (
                        <Box sx={{ fontSize: 12, color: "#7B89A8" }}>No sub-filters yet.</Box>
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
            <AppIcon name="add" size={16} /> Add New Filter
          </Box>
          <Box className="form-card" sx={formCardSx}>
            <Box className="form-grid single" sx={{ display: "grid", gridTemplateColumns: "1fr", gap: "14px" }}>
              <Box className="form-group" sx={formGroupSx}>
                <label className="form-label" style={formLabelStyle}>
                  Filter Category Name
                </label>
                <input
                  id="new-filter-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Zone, Floor, Area..."
                  value={props.nameInput}
                  onChange={(event) => props.setNameInput(event.target.value)}
                  style={formInputStyle}
                />
                <Box sx={{ fontSize: 11, color: "#7B89A8", marginTop: "4px" }}>
                  Or select an existing category to add sub-filters to it.
                </Box>
              </Box>
              <Box className="form-group" sx={formGroupSx}>
                <label className="form-label" style={formLabelStyle}>
                  Sub-filters (comma separated)
                </label>
                <input
                  id="new-filter-subs"
                  type="text"
                  className="form-input"
                  placeholder="e.g. North, South, East, West"
                  value={props.subsInput}
                  onChange={(event) => props.setSubsInput(event.target.value)}
                  style={formInputStyle}
                />
              </Box>
            </Box>
            <Box className="form-actions" sx={{ display: "flex", gap: "10px", marginTop: "22px" }}>
              <AppButton type="button" variant="contained" onClick={props.addFilter} sx={primaryBtnSx}>
                Save Filter
              </AppButton>
            </Box>
          </Box>

          <Box sx={{ marginTop: "20px" }}>
            <Box className="section-title" sx={sectionTitleSx}>
              <AppIcon name="quick" size={16} /> Quick Add
            </Box>
            <Box className="form-card" sx={formCardSx}>
              <Box sx={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                <input
                  id="quick-level"
                  type="text"
                  className="form-input"
                  placeholder="New Level (e.g. L11)"
                  value={props.quickLevelInput}
                  onChange={(event) => props.setQuickLevelInput(event.target.value)}
                  style={{ ...formInputStyle, margin: 0 }}
                />
                <AppButton
                  type="button"
                  size="small"
                  variant="contained"
                  onClick={props.quickAddLevel}
                  sx={miniPrimaryBtnSx}
                >
                  <AppIcon name="add" size={13} /> Add Level
                </AppButton>
              </Box>
              <Box sx={{ display: "flex", gap: "10px" }}>
                <input
                  id="quick-trade"
                  type="text"
                  className="form-input"
                  placeholder="New Trade (e.g. Tiler)"
                  value={props.quickTradeInput}
                  onChange={(event) => props.setQuickTradeInput(event.target.value)}
                  style={{ ...formInputStyle, margin: 0 }}
                />
                <AppButton
                  type="button"
                  size="small"
                  variant="contained"
                  onClick={props.quickAddTrade}
                  sx={miniBlueBtnSx}
                >
                  <AppIcon name="add" size={13} /> Add Trade
                </AppButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <ConfirmModal
        open={props.deleteDialog.open}
        title={props.deleteDialog.title}
        message={props.deleteDialog.message}
        confirmLabel="Yes, Delete"
        confirmColor="error"
        onClose={props.closeDeleteConfirm}
        onConfirm={props.executeDelete}
      />
    </>
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

const formGroupSx = { display: "flex", flexDirection: "column", gap: "6px" };

const formLabelStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 700,
  color: "#7B89A8",
  textTransform: "uppercase",
  letterSpacing: "0.7px",
};

const formInputStyle: React.CSSProperties = {
  width: "100%",
  border: "1.5px solid #E4E8F0",
  borderRadius: "8px",
  fontSize: "14px",
  color: "#1A2035",
  padding: "10px 12px",
  outline: "none",
  fontFamily: "Inter, sans-serif",
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

const primaryBtnSx = {
  background: "#F5A623",
  "&:hover": { background: "#E09010", boxShadow: "0 4px 14px rgba(245,166,35,0.35)" },
};

const miniPrimaryBtnSx = {
  background: "#F5A623",
  padding: "6px 12px",
  fontSize: "12px",
  "&:hover": { background: "#E09010", boxShadow: "0 4px 14px rgba(245,166,35,0.35)" },
};

const miniBlueBtnSx = {
  background: "#3BB0D8",
  padding: "6px 12px",
  fontSize: "12px",
  "&:hover": { background: "#2A9CC4" },
};

const miniDangerBtnSx = {
  background: "#FEE2E2",
  color: "#EF4444",
  padding: "6px 12px",
  fontSize: "12px",
  boxShadow: "none",
  "&:hover": { background: "#EF4444", color: "#ffffff", boxShadow: "none" },
};

