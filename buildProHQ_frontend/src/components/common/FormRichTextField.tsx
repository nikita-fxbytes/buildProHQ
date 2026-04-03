"use client";

import { useEffect, type ReactNode } from "react";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { mergeSx } from "@/components/common/fieldStyles";
import { compactHelperText } from "@/components/common/formField.utils";
import { STYLE_TOKENS } from "@/constants/style-tokens";

export type FormRichTextFieldProps = {
  id?: string;
  name?: string;
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: ReactNode;
  placeholder?: string;
  required?: boolean;
  sx?: SxProps<Theme>;
};

export function FormRichTextField({
  id,
  name,
  value,
  onChange,
  onBlur,
  disabled = false,
  error = false,
  helperText,
  placeholder = "",
  // `required` primarily used by external labels; keep for future a11y/ARIA wiring.
  required: _required,
  sx,
}: FormRichTextFieldProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
        strike: false,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    editable: !disabled,
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        ...(name ? { "data-field": name } : {}),
      },
      handleDOMEvents: {
        blur: () => {
          onBlur?.();
          return false;
        },
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor) return;
    const cur = editor.getHTML();
    if (cur === value) return;
    editor.commands.setContent(value || "", { emitUpdate: false });
  }, [editor, value]);

  const helper = compactHelperText(helperText);

  return (
    <Box sx={mergeSx({ width: "100%" }, sx)}>
      <Box
        sx={{
          borderRadius: `${STYLE_TOKENS.radius.control}px`,
          borderWidth: 1.5,
          borderStyle: "solid",
          borderColor: error ? "error.main" : STYLE_TOKENS.colors.border,
          backgroundColor: STYLE_TOKENS.colors.card,
          transition: "border-color 0.15s ease",
          "&:hover": {
            borderColor: error ? "error.main" : STYLE_TOKENS.colors.orange,
          },
          "&:focus-within": {
            borderColor: error ? "error.main" : STYLE_TOKENS.colors.orange,
            boxShadow: error
              ? undefined
              : `0 0 0 3px ${alpha(STYLE_TOKENS.colors.orange, 0.2)}`,
          },
        }}
      >
        {editor ? (
          <Stack spacing={0}>
            <Stack
              direction="row"
              spacing={0}
              sx={{
                flexWrap: "wrap",
                gap: 0,
                px: 0.75,
                py: 0.5,
                borderBottom: `1px solid ${STYLE_TOKENS.colors.border}`,
                backgroundColor: alpha(STYLE_TOKENS.colors.border, 0.06),
              }}
            >
              <IconButton
                type="button"
                size="small"
                disabled={disabled}
                aria-label="Bold"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleBold().run()}
                color={editor.isActive("bold") ? "primary" : "default"}
                sx={{ borderRadius: 1 }}
              >
                <FormatBoldIcon fontSize="small" />
              </IconButton>
              <IconButton
                type="button"
                size="small"
                disabled={disabled}
                aria-label="Italic"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                color={editor.isActive("italic") ? "primary" : "default"}
                sx={{ borderRadius: 1 }}
              >
                <FormatItalicIcon fontSize="small" />
              </IconButton>
              <IconButton
                type="button"
                size="small"
                disabled={disabled}
                aria-label="Bullet list"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                color={editor.isActive("bulletList") ? "primary" : "default"}
                sx={{ borderRadius: 1 }}
              >
                <FormatListBulletedIcon fontSize="small" />
              </IconButton>
              <IconButton
                type="button"
                size="small"
                disabled={disabled}
                aria-label="Numbered list"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                color={editor.isActive("orderedList") ? "primary" : "default"}
                sx={{ borderRadius: 1 }}
              >
                <FormatListNumberedIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Box
              sx={{
                fontFamily: STYLE_TOKENS.typography.fontBody,
                fontSize: STYLE_TOKENS.typography.input.size,
                color: STYLE_TOKENS.colors.text,
                "& .ProseMirror": {
                  outline: "none",
                  minHeight: 120,
                  padding: "10px 14px",
                  "& p": {
                    margin: "0.35em 0",
                  },
                  "& p.is-empty::before": {
                    color: alpha(STYLE_TOKENS.colors.textMuted, 0.85),
                    content: "attr(data-placeholder)",
                    float: "left",
                    height: 0,
                    pointerEvents: "none",
                  },
                  "& ul, & ol": {
                    margin: "0.35em 0",
                    paddingLeft: "1.35rem",
                  },
                  "& li p": {
                    margin: "0.15em 0",
                  },
                },
              }}
            >
              <EditorContent editor={editor} />
            </Box>
          </Stack>
        ) : null}
      </Box>
      {helper ? (
        <FormHelperText error={error} sx={{ mx: 1.75, mt: 0.5 }}>
          {helper}
        </FormHelperText>
      ) : null}
    </Box>
  );
}
