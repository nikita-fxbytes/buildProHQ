"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppIcon } from "@/components/common/AppIcon";
import { ManageFiltersListSkeleton } from "@/components/common/skeletons/ManageFiltersListSkeleton";
import type { LookupItem } from "@/services/lookupsApi.service";
import type { FilterCategory } from "@/types/domain";

export type ManageFiltersViewProps = {
  loading: boolean;
  filters: FilterCategory[];
  levels: LookupItem[];
  trades: LookupItem[];
};

export function ManageFiltersView({ loading, filters, levels, trades }: ManageFiltersViewProps) {
  return (
    <Stack spacing={2}>
      <Alert severity="info" sx={{ borderRadius: 2 }}>
        Filter categories, options, levels, and trades are managed in the database. This page is
        read-only and reflects live lookup data from the API.
      </Alert>

      <Box className="two-col" sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: "20px" }}>
        <Box>
          <Box className="section-title" sx={sectionTitleSx}>
            <AppIcon name="folder" size={16} /> Filter categories & options
          </Box>
          <Box id="filter-list-view" sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {loading ? (
              <ManageFiltersListSkeleton cards={3} />
            ) : filters.length === 0 ? (
              <Box sx={{ fontSize: 13, color: "#7B89A8", padding: "10px 2px" }}>No filter data.</Box>
            ) : (
              filters.map((filter) => (
                <Box key={filter.name} className="filter-manage-card" sx={filterCardSx}>
                  <Box className="filter-manage-head" sx={filterHeadSx}>
                    <Typography component="h3" sx={filterHeadTitleSx}>
                      <AppIcon name="folder" size={16} sx={{ mr: 0.5 }} />
                      {filter.name}
                    </Typography>
                  </Box>
                  <Box className="filter-item-row" sx={filterRowSx}>
                    <Box className="filter-sub-chips" sx={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {filter.subs.length ? (
                        filter.subs.map((sub) => (
                          <Box key={`${filter.name}-${sub}`} className="filter-sub-chip" sx={filterChipSx}>
                            {sub}
                          </Box>
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
            <AppIcon name="quick" size={16} /> Levels & trades
          </Box>
          <Stack spacing={2}>
            <Box sx={formCardSx}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#7B89A8", mb: 1 }}>
                Levels
              </Typography>
              {loading ? (
                <Typography sx={{ fontSize: 13, color: "#7B89A8" }}>Loading…</Typography>
              ) : (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {levels.map((l) => (
                    <Box key={l.id} sx={filterChipSx}>
                      {l.name}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            <Box sx={formCardSx}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#7B89A8", mb: 1 }}>
                Trades
              </Typography>
              {loading ? (
                <Typography sx={{ fontSize: 13, color: "#7B89A8" }}>Loading…</Typography>
              ) : (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {trades.map((t) => (
                    <Box key={t.id} sx={{ ...filterChipSx, background: "#E0F2FE", color: "#0369A1" }}>
                      {t.name}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Stack>
        </Box>
      </Box>
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
  padding: "20px 24px",
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
