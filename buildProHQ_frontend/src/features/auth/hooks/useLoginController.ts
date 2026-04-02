import type { Role } from "@/constants/roles";
import { useAuth } from "@/contexts/AuthContext";
import type { LoginFormValues } from "@/schemas/auth.schema";

export function useLoginController(role: Role) {
  const { login: authLogin } = useAuth();

  const login = async (values: LoginFormValues) => {
    return authLogin(role, values.email, values.password);
  };

  return {
    login,
  };
}

