"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppPasswordField } from "@/components/common/AppPasswordField";
import { AppButton } from "@/components/common/AppButton";
import { AppLogo } from "@/components/branding/AppLogo";
import { appToast } from "@/utils/toast";
import { getApiErrorMessage } from "@/services/apiError";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/constants/routes";
import { passwordPolicySchema } from "@/schemas/passwordPolicy";

const PASSWORD_REQUIRED_MESSAGE = "Password is required";

const schema = z
  .object({
    password: z
      .string()
      .min(1, PASSWORD_REQUIRED_MESSAGE)
      .pipe(passwordPolicySchema),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required")
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof schema>;

export function SetPasswordClient() {
  const router = useRouter();
  const search = useSearchParams();
  const token = (search.get("token") ?? "").trim();

  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  const { control, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const disabled = useMemo(
    () => validating || !tokenValid || formState.isSubmitting,
    [formState.isSubmitting, tokenValid, validating],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!token) {
        setValidating(false);
        setTokenValid(false);
        return;
      }
      try {
        setValidating(true);
        await authService.validateInvite(token);
        if (!cancelled) setTokenValid(true);
      } catch (e) {
        if (!cancelled) {
          setTokenValid(false);
          appToast.error(getApiErrorMessage(e, "Invite link is invalid or expired"));
        }
      } finally {
        if (!cancelled) setValidating(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await authService.acceptInvite(token, values.password);
      appToast.success("Password set successfully. Please log in.");
      router.push(ROUTES.LOGIN_MANAGER);
    } catch (e) {
      appToast.error(getApiErrorMessage(e, "Failed to set password"));
    }
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1C2333 0%, #2E3D5C 50%, #1C2333 100%)",
        px: 2,
      }}
    >
      <Paper
        sx={{
          width: { xs: "100%", sm: 460 },
          maxWidth: 460,
          padding: "44px 48px",
          borderRadius: "20px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
          "@media (max-width: 600px)": {
            padding: "32px 22px",
            borderRadius: "16px",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <AppLogo size={72} showWordmark={false} />
        </Box>
        <Typography
          sx={{
            textAlign: "center",
            fontFamily: "Rajdhani, sans-serif",
            fontSize: 28,
            fontWeight: 700,
            color: "#1A2035",
            mb: 0.75,
          }}
        >
          Set your password
        </Typography>
        <Typography sx={{ textAlign: "center", color: "#7B89A8", fontSize: 13, mb: 3 }}>
          Choose a secure password to activate your account.
        </Typography>

        {validating ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={26} />
          </Box>
        ) : !tokenValid ? (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography sx={{ color: "#7B89A8", fontSize: 13, mb: 2 }}>
              This invite link is invalid or expired.
            </Typography>
            <AppButton
              variant="contained"
              onClick={() => router.push(ROUTES.LOGIN_MANAGER)}
              sx={{ backgroundColor: "#F5A623", "&:hover": { backgroundColor: "#E09010" } }}
            >
              Go to login
            </AppButton>
          </Box>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <Stack spacing={1.5}>
              <Controller
                control={control}
                name="password"
                render={({ field, fieldState }) => (
                  <AppPasswordField
                    {...field}
                    placeholder="New password"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <AppPasswordField
                    {...field}
                    placeholder="Confirm password"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              <AppButton
                type="submit"
                fullWidth
                variant="contained"
                disabled={disabled}
                sx={{
                  mt: 1,
                  backgroundColor: "#F5A623",
                  padding: "13px",
                  borderRadius: "10px",
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#E09010" },
                }}
              >
                {formState.isSubmitting ? "Saving..." : "Set password"}
              </AppButton>
            </Stack>
          </form>
        )}
      </Paper>
    </Box>
  );
}

