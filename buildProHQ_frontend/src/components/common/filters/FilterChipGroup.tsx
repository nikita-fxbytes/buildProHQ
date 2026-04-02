import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FilterChip } from "@/components/common/FilterChip";
import { FILTER_TOKENS } from "@/styles/filter-tokens";

export type FilterChipGroupProps = {
  label: string;
  options: Array<string | { value: string; label: string }>;
  selected: string[];
  onToggle: (value: string) => void;
  tone?: "orange" | "blue";
};

export function FilterChipGroup({
  label,
  options,
  selected,
  onToggle,
  tone = "orange",
}: FilterChipGroupProps) {
  const normalized = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt,
  );
  return (
    <Box>
      <Typography
        sx={{
          fontSize: FILTER_TOKENS.groupLabel.fontSize,
          fontWeight: FILTER_TOKENS.groupLabel.fontWeight,
          color: FILTER_TOKENS.groupLabel.color,
          textTransform: FILTER_TOKENS.groupLabel.textTransform,
          letterSpacing: FILTER_TOKENS.groupLabel.letterSpacing,
          mb: 1,
        }}
      >
        {label}
      </Typography>
      <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {normalized.map(({ value, label: optionLabel }) => (
          <FilterChip
            key={value}
            label={optionLabel}
            selected={selected.includes(value)}
            onClick={() => onToggle(value)}
            tone={tone}
          />
        ))}
      </Box>
    </Box>
  );
}
