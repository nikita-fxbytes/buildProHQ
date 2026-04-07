"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

async function loadImage(src: string): Promise<HTMLImageElement> {
  return await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

async function cropToSquareBlob(
  imageUrl: string,
  zoom: number,
  panXNorm: number,
  panYNorm: number,
  outSize = 512,
): Promise<Blob> {
  const img = await loadImage(imageUrl);
  const canvas = document.createElement("canvas");
  canvas.width = outSize;
  canvas.height = outSize;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  // Match the preview: object-fit: cover + translate(panPx) + scale(zoom)
  // We model the "cover" scale into the crop mapping so saved output matches what user sees.
  const previewSize = 220;
  const baseCoverScale = Math.max(previewSize / img.naturalWidth, previewSize / img.naturalHeight);
  const scale = baseCoverScale * zoom;

  // At this scale, the preview square corresponds to this many source pixels.
  const cropSide = previewSize / scale;

  // Centered crop origin in source coords, then offset by pan (normalized) within allowed range.
  const maxPanSourceX = Math.max(0, (img.naturalWidth - cropSide) / 2);
  const maxPanSourceY = Math.max(0, (img.naturalHeight - cropSide) / 2);

  const sx = clamp(
    (img.naturalWidth - cropSide) / 2 - panXNorm * maxPanSourceX,
    0,
    img.naturalWidth - cropSide,
  );
  const sy = clamp(
    (img.naturalHeight - cropSide) / 2 - panYNorm * maxPanSourceY,
    0,
    img.naturalHeight - cropSide,
  );

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, sx, sy, cropSide, cropSide, 0, 0, outSize, outSize);

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Failed to crop image"))), "image/jpeg", 0.92);
  });
  return blob;
}

export type AvatarCropDialogProps = {
  open: boolean;
  file: File | null;
  onClose: () => void;
  onCropped: (file: File) => void;
};

export function AvatarCropDialog({ open, file, onClose, onCropped }: AvatarCropDialogProps) {
  const [zoom, setZoom] = useState(1.2);
  // pan in pixels inside the preview circle
  const [panPx, setPanPx] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragRef = useRef<{
    startX: number;
    startY: number;
    panX: number;
    panY: number;
    dragging: boolean;
  } | null>(null);
  const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  const PREVIEW_SIZE = 220;

  const maxPanPx = useMemo(() => {
    // As zoom increases, allow more panning. This keeps panning + crop math consistent.
    // When zoom=1, no panning should be possible.
    const m = ((zoom - 1) * PREVIEW_SIZE) / 2;
    return Math.max(0, m);
  }, [zoom]);

  const panNorm = useMemo(() => {
    if (maxPanPx <= 0) return { x: 0, y: 0 };
    return {
      x: clamp(panPx.x / maxPanPx, -1, 1),
      y: clamp(panPx.y / maxPanPx, -1, 1),
    };
  }, [maxPanPx, panPx.x, panPx.y]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  useEffect(() => {
    if (open) {
      setZoom(1.2);
      setPanPx({ x: 0, y: 0 });
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Crop photo</DialogTitle>
      <DialogContent>
        {!objectUrl ? null : (
          <Stack spacing={2}>
            <Box
              sx={{
                width: "100%",
                display: "grid",
                placeItems: "center",
                paddingTop: 1,
              }}
            >
              <Box
                sx={{
                  width: PREVIEW_SIZE,
                  height: PREVIEW_SIZE,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "1.5px solid #E4E8F0",
                  background: "#fff",
                  position: "relative",
                  touchAction: "none",
                  cursor: "grab",
                }}
                onPointerDown={(e) => {
                  (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
                  dragRef.current = {
                    startX: e.clientX,
                    startY: e.clientY,
                    panX: panPx.x,
                    panY: panPx.y,
                    dragging: true,
                  };
                }}
                onPointerMove={(e) => {
                  const d = dragRef.current;
                  if (!d?.dragging) return;
                  const dx = e.clientX - d.startX;
                  const dy = e.clientY - d.startY;
                  const nx = clamp(d.panX + dx, -maxPanPx, maxPanPx);
                  const ny = clamp(d.panY + dy, -maxPanPx, maxPanPx);
                  setPanPx({ x: nx, y: ny });
                }}
                onPointerUp={() => {
                  if (dragRef.current) dragRef.current.dragging = false;
                }}
              >
                <Box
                  component="img"
                  src={objectUrl}
                  alt="Crop preview"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `translate(${panPx.x}px, ${panPx.y}px) scale(${zoom})`,
                    transformOrigin: "center",
                  }}
                />
              </Box>
            </Box>

            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#7B89A8", textTransform: "uppercase", letterSpacing: "0.7px" }}>
                Zoom
              </Typography>
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.05}
                onChange={(_, v) => setZoom(Number(v))}
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ paddingInline: 2, paddingBottom: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderColor: "#E4E8F0", color: "#1A2035" }}>
          Cancel
        </Button>
        <Button
          onClick={async () => {
            if (!objectUrl || !file) return;
            const blob = await cropToSquareBlob(objectUrl, zoom, panNorm.x, panNorm.y, 512);
            const cropped = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
              type: "image/jpeg",
            });
            onCropped(cropped);
          }}
          variant="contained"
          sx={{ background: "#F5A623", "&:hover": { background: "#E09010" } }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

