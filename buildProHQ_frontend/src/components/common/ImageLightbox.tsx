import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import { MESSAGES } from "@/constants/messages";

type ImageLightboxProps = {
  open: boolean;
  src: string | null;
  onClose: () => void;
  alt?: string;
};

export function ImageLightbox({ open, src, onClose, alt }: ImageLightboxProps) {
  return (
    <Modal
      open={open && !!src}
      onClose={onClose}
      aria-label={MESSAGES.taskForm.lightboxImageAlt}
      closeAfterTransition
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(0,0,0,0.9)",
        zIndex: 10000,
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          outline: "none",
        }}
      >
        <IconButton
          type="button"
          onClick={onClose}
          aria-label={MESSAGES.taskForm.lightboxClose}
          sx={{
            position: "fixed",
            top: 20,
            right: 24,
            color: "#fff",
            fontSize: 32,
            zIndex: 10001,
          }}
        >
          ✕
        </IconButton>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element -- controlled lightbox preview
          <img
            src={src}
            alt={alt ?? MESSAGES.taskForm.lightboxImageAlt}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              borderRadius: 8,
              boxShadow: "0 0 60px rgba(0,0,0,0.8)",
              display: "block",
            }}
          />
        ) : null}
      </Box>
    </Modal>
  );
}

