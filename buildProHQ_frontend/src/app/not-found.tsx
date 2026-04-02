import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Page not found</h1>
      <p style={{ color: "#64748b", marginBottom: 20, maxWidth: 420 }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href={ROUTES.HOME} style={{ color: "#F5A623", fontWeight: 600, textDecoration: "none" }}>
        Return home
      </Link>
    </main>
  );
}
