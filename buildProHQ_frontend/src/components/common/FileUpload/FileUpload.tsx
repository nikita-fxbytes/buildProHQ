"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FormUploadField, type FormUploadFieldProps } from "@/components/common/FormUploadField";
import { MESSAGES } from "@/constants/messages";
import { STYLE_TOKENS } from "@/constants/style-tokens";

export type FileUploadProps = FormUploadFieldProps & {
  /** Section heading (e.g. before photos). */
  label?: string;
};

/**
 * Centered file upload shell wrapping the shared FormUploadField (upload, preview, remove).
 * Used by task create/edit and any other flows that need consistent attachment UX.
 */
export function FileUpload({ label, sx, ...rest }: FileUploadProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        ...sx,
      }}
    >
      {label ? (
        <Typography
          sx={{
            alignSelf: "flex-start",
            fontSize: 12,
            fontWeight: 800,
            color: STYLE_TOKENS.colors.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            mb: 1,
          }}
        >
          {label}
        </Typography>
      ) : null}
      <Box sx={{ width: "100%", maxWidth: 520, mx: "auto" }}>
        <Typography
          sx={{
            fontSize: 12,
            color: STYLE_TOKENS.colors.textMuted,
            textAlign: "center",
            mb: 1,
          }}
        >
          {MESSAGES.taskForm.photoUploadHint}
        </Typography>
        <FormUploadField {...rest} />
      </Box>
    </Box>
  );
}

export type { UploadItem } from "@/components/common/FormUploadField";
