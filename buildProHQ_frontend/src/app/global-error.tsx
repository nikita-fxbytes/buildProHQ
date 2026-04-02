"use client";

import { useEffect } from "react";
import { MESSAGES } from "@/constants/messages";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global error boundary triggered", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Inter, sans-serif" }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: 16,
            textAlign: "center",
          }}
        >
          <h1 style={{ margin: 0 }}>{MESSAGES.common.pageCrashed}</h1>
          <p style={{ margin: 0, color: "#64748b" }}>{MESSAGES.common.serverError}</p>
          <button
            type="button"
            onClick={reset}
            style={{
              border: "none",
              borderRadius: 8,
              padding: "10px 16px",
              background: "#1f2937",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </main>
      </body>
    </html>
  );
}
