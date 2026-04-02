import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

export type PageToolbarProps = {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export function PageToolbar({ children, sx }: PageToolbarProps) {
  return (
    <Box
      className="toolbar"
      sx={{
        display: "flex",
        gap: "10px",
        marginBottom: "16px",
        alignItems: "center",
        flexWrap: "wrap",
        ...(sx || {}),
      }}
    >
      {children}
    </Box>
  );
}
