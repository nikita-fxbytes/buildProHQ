import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { STYLE_TOKENS } from "@/constants/style-tokens";

export type PaginationBarProps = {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
  managerMode?: boolean;
};

export function PaginationBar({ page, pageSize, total, onChange, managerMode = false }: PaginationBarProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), pages);
  const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, total);
  const buttonColor = managerMode ? STYLE_TOKENS.colors.blue : STYLE_TOKENS.colors.orange;

  const pageNumbers = (() => {
    const out: number[] = [];
    const from = Math.max(1, safePage - 2);
    const to = Math.min(pages, safePage + 2);
    for (let i = from; i <= to; i += 1) out.push(i);
    return out;
  })();

  return (
    <Box
      className="pagination-bar"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px",
        borderTop: `1px solid ${STYLE_TOKENS.colors.border}`,
        backgroundColor: "#FAFBFC",
        borderRadius: `0 0 ${STYLE_TOKENS.radius.card}px ${STYLE_TOKENS.radius.card}px`,
      }}
    >
      <Typography sx={{ fontSize: STYLE_TOKENS.typography.size.bodySm, color: STYLE_TOKENS.colors.textMuted }}>
        Showing {start}-{end} of {total}
      </Typography>
      <Box sx={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => onChange(safePage - 1)}
          style={pagButtonStyle({ active: false, accent: buttonColor })}
        >
          ‹ Prev
        </button>
        {pageNumbers[0] && pageNumbers[0] > 1 ? (
          <>
            <button type="button" onClick={() => onChange(1)} style={pagButtonStyle({ active: false, accent: buttonColor })}>
              1
            </button>
            {pageNumbers[0] > 2 ? <span style={{ padding: "0 4px", color: STYLE_TOKENS.colors.textMuted }}>…</span> : null}
          </>
        ) : null}
        {pageNumbers.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            style={pagButtonStyle({ active: num === safePage, accent: buttonColor })}
          >
            {num}
          </button>
        ))}
        {pageNumbers[pageNumbers.length - 1] && pageNumbers[pageNumbers.length - 1] < pages ? (
          <>
            {pageNumbers[pageNumbers.length - 1] < pages - 1 ? (
              <span style={{ padding: "0 4px", color: STYLE_TOKENS.colors.textMuted }}>…</span>
            ) : null}
            <button type="button" onClick={() => onChange(pages)} style={pagButtonStyle({ active: false, accent: buttonColor })}>
              {pages}
            </button>
          </>
        ) : null}
        <button
          type="button"
          disabled={safePage >= pages}
          onClick={() => onChange(safePage + 1)}
          style={pagButtonStyle({ active: false, accent: buttonColor })}
        >
          Next ›
        </button>
      </Box>
    </Box>
  );
}

const pagButtonStyle = ({ active, accent }: { active: boolean; accent: string }): React.CSSProperties => ({
  appearance: "none",
  WebkitAppearance: "none",
  padding: "6px 12px",
  border: `1px solid ${active ? accent : STYLE_TOKENS.colors.border}`,
  borderRadius: STYLE_TOKENS.radius.small,
  background: active ? accent : STYLE_TOKENS.colors.white,
  fontSize: STYLE_TOKENS.typography.size.bodySm,
  fontFamily: STYLE_TOKENS.typography.fontBody,
  cursor: "pointer",
  color: active ? STYLE_TOKENS.colors.white : STYLE_TOKENS.colors.text,
  fontWeight: active ? 700 : 500,
  lineHeight: 1.2,
});

