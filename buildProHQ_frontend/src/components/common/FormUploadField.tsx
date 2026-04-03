"use client";

import {
  useId,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import { MESSAGES } from "@/constants/messages";
import { AppIcon } from "@/components/common/AppIcon";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { ImageLightbox } from "@/components/common/ImageLightbox";
import { validateBeforePhotos } from "@/schemas/field-add-task.schema";

/** Same extension/MIME idea as validateBeforePhotos — must run before empty-MIME files are dropped. */
const IMAGE_EXT = /\.(jpe?g|png|webp|heic|heif)$/i;

function fileLooksLikeAllowedImage(file: File, accept: string[] | undefined): boolean {
  if (accept?.length) {
    const okType = accept.some((t) => file.type === t);
    const okExt = accept.some((t) => {
      if (!t.startsWith(".")) return false;
      return file.name.toLowerCase().endsWith(t.toLowerCase());
    });
    return okType || okExt;
  }
  if (file.type && /^image\//i.test(file.type)) return true;
  return IMAGE_EXT.test(file.name);
}

const DEFAULT_FILE_ACCEPT =
  "image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif";

export type UploadItemStatus = "new" | "uploaded" | "toDelete";

export type UploadItem = {
  id: string;
  file?: File;
  url: string;
  status: UploadItemStatus;
};

export type FormUploadFieldMode = "single" | "multiple";

export type FormUploadFieldProps = {
  mode: FormUploadFieldMode;
  value: UploadItem[];
  onChange: (items: UploadItem[]) => void;
  accept?: string[];
  maxFiles?: number;
  maxSizeBytes?: number;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  sx?: SxProps<Theme>;
};

export function FormUploadField({
  mode,
  value,
  onChange,
  accept,
  maxFiles,
  maxSizeBytes,
  disabled,
  error,
  helperText,
  sx,
}: FormUploadFieldProps) {
  const inputId = useId();
  const [dragOver, setDragOver] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const effectiveMaxFiles = useMemo(() => {
    if (mode === "single") return 1;
    return maxFiles && maxFiles > 0 ? maxFiles : undefined;
  }, [mode, maxFiles]);

  const handleFiles = (files: FileList | File[]) => {
    if (disabled) return;
    const arr = Array.from(files);
    if (!arr.length) return;

    const existing = [...value];

    const images = arr.filter((file) => fileLooksLikeAllowedImage(file, accept));

    if (!images.length) {
      setClientError(MESSAGES.validation.photoInvalidType);
      return;
    }

    if (mode === "single") {
      const file = images[0];
      const nextId = `${file.name}-${file.size}-${file.lastModified}-${Math.random()
        .toString(36)
        .slice(2)}`;
      const next: UploadItem = {
        id: nextId,
        file,
        url: URL.createObjectURL(file),
        status: "new",
      };
      const bytes = maxSizeBytes ?? 10 * 1024 * 1024;
      const err = validateBeforePhotos([file], bytes);
      if (err) {
        setClientError(err);
        return;
      }
      setClientError(null);
      value.forEach((item) => {
        if (item.url.startsWith("blob:")) URL.revokeObjectURL(item.url);
      });
      onChange([next]);
      return;
    }

    const additions: UploadItem[] = [];
    for (const file of images) {
      if (effectiveMaxFiles && existing.length + additions.length >= effectiveMaxFiles) break;
      additions.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        file,
        url: URL.createObjectURL(file),
        status: "new",
      });
    }
    const nextItems = [...existing, ...additions];
    const filesForValidation = nextItems
      .filter((i) => i.status !== "toDelete" && i.file)
      .map((i) => i.file as File);
    const bytes = maxSizeBytes ?? 10 * 1024 * 1024;
    const err = validateBeforePhotos(filesForValidation, bytes);
    if (err) {
      additions.forEach((a) => {
        if (a.url.startsWith("blob:")) URL.revokeObjectURL(a.url);
      });
      setClientError(err);
      return;
    }
    setClientError(null);
    onChange(nextItems);
  };

  const handleRemove = (id: string) => {
    if (disabled) return;
    setClientError(null);
    const next = value
      .map((item) => {
        if (item.id !== id) return item;
        if (item.status === "uploaded") {
          return { ...item, status: "toDelete" as const };
        }
        if (item.url.startsWith("blob:")) URL.revokeObjectURL(item.url);
        return null;
      })
      .filter((x): x is UploadItem => x !== null);
    onChange(next);
  };

  const visibleItems = value.filter((item) => item.status !== "toDelete");

  const multiple = mode === "multiple";

  /** Matches buildprohq_v5.html `.photo-upload-area` / hover / `.drag-over` */
  const dropzoneSx = {
    boxSizing: "border-box" as const,
    width: "100%",
    display: "block",
    border: "2px dashed #E4E8F0",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center" as const,
    cursor: disabled ? ("not-allowed" as const) : ("pointer" as const),
    transition: "all 0.2s",
    background: "#FAFBFF",
    marginTop: "8px",
    position: "relative" as const,
    fontFamily: '"Inter", sans-serif',
    ...(dragOver && !disabled
      ? {
          borderColor: "#F5A623",
          background: "#FFF3D4",
        }
      : {}),
    ...(!disabled && !dragOver
      ? {
          "&:hover": {
            borderColor: "#F5A623",
            background: "#FFFBF2",
          },
        }
      : {}),
  };

  return (
    <Box
      sx={{
        width: "100%",
        fontFamily: '"Inter", sans-serif',
        ...sx,
      }}
    >
      <Box
        component={disabled ? "div" : "label"}
        id={`${inputId}-dropzone`}
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onKeyDown={(e: KeyboardEvent) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(e: DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          if (disabled) return;
          setDragOver(true);
        }}
        onDragLeave={(e: DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(false);
        }}
        onDrop={(e: DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(false);
          if (disabled) return;
          if (e.dataTransfer.files?.length) {
            handleFiles(e.dataTransfer.files);
          }
        }}
        sx={dropzoneSx}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept && accept.length ? accept.join(",") : DEFAULT_FILE_ACCEPT}
          multiple={multiple}
          disabled={disabled}
          tabIndex={-1}
          style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", border: 0, whiteSpace: "nowrap" }}
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <Box
          sx={{
            fontSize: "28px",
            lineHeight: 1,
            marginBottom: "6px",
          }}
          aria-hidden
        >
          📸
        </Box>
        <Typography
          component="div"
          sx={{
            m: 0,
            fontSize: "13px",
            color: "#7B89A8",
            fontWeight: 500,
            fontFamily: '"Inter", sans-serif',
          }}
        >
          {MESSAGES.taskForm.photoUploadHint}
        </Typography>
        <Typography
          component="div"
          sx={{
            m: 0,
            mt: "3px",
            fontSize: "11px",
            color: "#7B89A8",
            fontFamily: '"Inter", sans-serif',
          }}
        >
          {MESSAGES.taskForm.photoUploadTypes}
        </Typography>
      </Box>

      {visibleItems.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginTop: "10px",
            width: "100%",
          }}
        >
          {visibleItems.map((item) => (
            <Box
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                const t = e.target as HTMLElement;
                if (t.closest("button")) return;
                setLightboxSrc(item.url);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setLightboxSrc(item.url);
                }
              }}
              sx={{
                position: "relative",
                width: 72,
                height: 72,
                borderRadius: "8px",
                overflow: "hidden",
                border: "2px solid #E4E8F0",
                flexShrink: 0,
                cursor: "pointer",
              }}
            >
              <Box
                component="img"
                src={item.url}
                alt=""
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              />
              <Box
                component="button"
                type="button"
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  setPendingRemoveId(item.id);
                }}
                aria-label={MESSAGES.taskForm.removePhotoButton}
                className="photo-remove"
                sx={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  zIndex: 2,
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 18,
                  height: 18,
                  fontSize: 10,
                  cursor: disabled ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  pointerEvents: "auto",
                  p: 0,
                }}
              >
                ✕
              </Box>
              <Box
                className="photo-label-tag"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1,
                  background: "rgba(0,0,0,0.55)",
                  color: "#fff",
                  fontSize: "8px",
                  fontWeight: 700,
                  textAlign: "center",
                  p: "2px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  pointerEvents: "none",
                }}
              >
                {MESSAGES.taskForm.photoThumbLabel}
              </Box>
            </Box>
          ))}
        </Box>
      ) : null}

      {clientError || helperText ? (
        <Typography
          component="div"
          sx={{
            mt: 0.5,
            fontSize: "12px",
            fontFamily: '"Inter", sans-serif',
            color: error || clientError ? "error.main" : "#7B89A8",
          }}
        >
          {clientError ?? helperText}
        </Typography>
      ) : null}

      <ConfirmModal
        open={pendingRemoveId !== null}
        title={MESSAGES.taskForm.removePhotoConfirmTitle}
        message={MESSAGES.taskForm.removePhotoConfirmMessage}
        confirmLabel={MESSAGES.taskForm.removePhotoConfirmLabel}
        confirmColor="error"
        icon={<AppIcon name="delete" size={28} />}
        onClose={() => setPendingRemoveId(null)}
        onConfirm={() => {
          const idToRemove = pendingRemoveId;
          setPendingRemoveId(null);
          if (!idToRemove) return;
          const item = value.find((i) => i.id === idToRemove);
          if (item && lightboxSrc === item.url) setLightboxSrc(null);
          handleRemove(idToRemove);
        }}
      />

      <ImageLightbox open={!!lightboxSrc} src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </Box>
  );
}

