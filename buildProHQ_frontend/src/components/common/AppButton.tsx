import Button, { type ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { STYLE_TOKENS } from "@/constants/style-tokens";

export type AppButtonProps = ButtonProps;

export const AppButton = styled(Button)<ButtonProps>(({ variant, color, size }) => {
  const isSmall = size === "small";
  const basePaddingY = isSmall ? 6 : 9;
  const basePaddingX = isSmall ? 14 : 20;
  const baseFontSize = isSmall
    ? STYLE_TOKENS.typography.button.sizeSm
    : STYLE_TOKENS.typography.button.size;

  const base = {
    borderRadius: STYLE_TOKENS.radius.control,
    fontFamily: STYLE_TOKENS.typography.fontDisplay,
    fontWeight: STYLE_TOKENS.typography.button.weight,
    fontSize: baseFontSize,
    letterSpacing: STYLE_TOKENS.typography.button.letterSpacing,
    textTransform: "none" as const,
    paddingInline: basePaddingX,
    paddingBlock: basePaddingY,
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    border: "none",
    transition: "all 0.15s",
    boxShadow: "none",
  };

  if (variant === "outlined") {
    return {
      ...base,
      background: STYLE_TOKENS.colors.card,
      color: STYLE_TOKENS.colors.text,
      border: `1.5px solid ${STYLE_TOKENS.colors.border}`,
      ...(isSmall
        ? { fontSize: STYLE_TOKENS.typography.button.sizeSm, paddingInline: 14, paddingBlock: 6 }
        : { fontSize: 14, paddingInline: 18, paddingBlock: 9 }),
      "&:hover": {
        border: `1.5px solid ${STYLE_TOKENS.colors.orange}`,
        color: STYLE_TOKENS.colors.orange,
        background: STYLE_TOKENS.colors.card,
        boxShadow: "none",
      },
    };
  }

  if (color === "error") {
    return {
      ...base,
      background: "#FEE2E2",
      color: STYLE_TOKENS.colors.red,
      ...(isSmall
        ? { fontSize: STYLE_TOKENS.typography.button.sizeSm, paddingInline: 14, paddingBlock: 6 }
        : { fontSize: 14, paddingInline: 18, paddingBlock: 9 }),
      "&:hover": {
        background: STYLE_TOKENS.colors.red,
        color: "#fff",
        boxShadow: "none",
      },
    };
  }

  if (color === "secondary") {
    return {
      ...base,
      background: STYLE_TOKENS.colors.blue,
      color: "#fff",
      "&:hover": {
        background: STYLE_TOKENS.colors.blueDark,
        boxShadow: "none",
      },
    };
  }

  if (color === "success") {
    return {
      ...base,
      background: STYLE_TOKENS.colors.green,
      color: "#fff",
      ...(isSmall
        ? { fontSize: STYLE_TOKENS.typography.button.sizeSm, paddingInline: 14, paddingBlock: 6 }
        : {}),
      "&:hover": {
        background: STYLE_TOKENS.colors.greenDark,
        boxShadow: "none",
      },
    };
  }

  return {
    ...base,
    background: STYLE_TOKENS.colors.orange,
    color: "#fff",
    "&:hover": {
      background: STYLE_TOKENS.colors.orangeDark,
      boxShadow: "none",
    },
  };
});

