import Box from "@mui/material/Box";
import { TOOLBAR_TOKENS } from "@/styles/toolbar-tokens";

export type PageSizeSelectProps = {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
};

export function PageSizeSelect({ value, onChange, options = [10, 20, 50] }: PageSizeSelectProps) {
  return (
    <Box
      className="pag-size"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        fontSize: TOOLBAR_TOKENS.pageSize.fontSize,
        color: TOOLBAR_TOKENS.pageSize.color,
      }}
    >
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          borderRadius: 6,
          border: "1px solid #E4E8F0",
          padding: "4px 8px",
          fontSize: 13,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </Box>
  );
}
