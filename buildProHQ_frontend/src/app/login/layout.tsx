import { GuestRoute } from "@/components/auth/GuestRoute";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <GuestRoute>{children}</GuestRoute>;
}
