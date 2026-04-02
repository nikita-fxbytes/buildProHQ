import Chip, { type ChipProps } from "@mui/material/Chip";
import { STYLE_TOKENS } from "@/constants/style-tokens";

type Tone = "orange" | "blue";

export type FilterChipProps = Omit<ChipProps, "color"> & {
  selected?: boolean;
  tone?: Tone;
};

export function FilterChip({ selected = false, tone = "orange", sx, ...rest }: FilterChipProps) {
  const accent = tone === "blue" ? STYLE_TOKENS.colors.blue : STYLE_TOKENS.colors.orange;
  return (
    <Chip
      clickable
      {...rest}
      sx={{
        padding: "0 2px",
        borderRadius: "20px",
        border: `1.5px solid ${selected ? accent : STYLE_TOKENS.colors.border}`,
        fontSize: 12,
        fontWeight: 600,
        background: selected ? accent : "#fff",
        color: selected ? "#fff" : STYLE_TOKENS.colors.textMuted,
        "&:hover": selected
          ? { background: accent, color: "#fff" }
          : { borderColor: accent, color: accent, background: "#fff" },
        ...(sx || {}),
      }}
    />
  );
}

