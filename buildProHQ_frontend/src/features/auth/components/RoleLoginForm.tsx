"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Role } from "@/constants/roles";
import { AppIcon } from "@/components/common/AppIcon";
import { AppTextField } from "@/components/common/AppTextField";
import { useLoginController } from "@/features/auth/hooks/useLoginController";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";
import { AppButton } from "@/components/common/AppButton";
import { AppLogo } from "@/components/branding/AppLogo";

type LoginSwitcherLink = {
  href: string;
  text: string;
  label: string;
};

type RoleLoginTheme = {
  portalText: string;
  badgeLabel: string;
  badgeIcon: "manager" | "tradeUser" | "fieldUser";
  badgeBackground: string;
  badgeColor: string;
  inputBackground: string;
  inputFocusColor: string;
  submitBackground: string;
  submitHoverBackground: string;
  submitHoverShadow: string;
  emailPlaceholder: string;
  links: LoginSwitcherLink[];
};

type RoleLoginFormProps = {
  role: Role;
  theme: RoleLoginTheme;
};

export function RoleLoginForm({ role, theme }: RoleLoginFormProps) {
  const { control, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { email: "", password: "" },
  });
  const { login } = useLoginController(role);

  const onSubmit = handleSubmit(async (values) => {
    await login(values);
  });

  const inputSx = {
    marginBottom: "16px",
    "& .MuiInputBase-root": {
      backgroundColor: theme.inputBackground,
      fontSize: 14,
      fontFamily: "Inter, sans-serif",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
    },
    "& .MuiOutlinedInput-input": {
      padding: "12px 16px",
      lineHeight: 1.4,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.inputFocusColor,
      borderWidth: 2,
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.inputFocusColor,
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.inputFocusColor,
    },
    "& .MuiFormHelperText-root": {
      marginTop: "4px",
      marginLeft: 0,
      marginRight: 0,
      fontSize: 12,
    },
  } as const;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1C2333 0%, #2E3D5C 50%, #1C2333 100%)",
      }}
    >
      <Paper
        sx={{
          width: { xs: "calc(100% - 32px)", sm: 440 },
          maxWidth: 440,
          padding: "44px 48px",
          borderRadius: "20px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
          "@media (max-width: 600px)": {
            padding: "32px 22px",
            borderRadius: "16px",
          },
        }}
      >
        <Typography
          component="div"
          sx={{
            textAlign: "center",
            fontFamily: "Rajdhani, sans-serif",
            fontSize: 40,
            fontWeight: 700,
            marginBottom: "6px",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <AppLogo size={72} showWordmark={false} />
          </Box>
        </Typography>
        <Typography
          sx={{
            textAlign: "center",
            color: "#7B89A8",
            fontSize: 13,
            marginBottom: "30px",
          }}
        >
          {theme.portalText}
        </Typography>

        <Box sx={{ textAlign: "center", marginBottom: "20px" }}>
          <Box
            component="span"
            sx={{
              display: "inline-block",
              padding: "3px 12px",
              borderRadius: "20px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              background: theme.badgeBackground,
              color: theme.badgeColor,
            }}
          >
            <AppIcon name={theme.badgeIcon} size={13} sx={{ mr: 0.5 }} /> {theme.badgeLabel}
          </Box>
        </Box>

        <form onSubmit={onSubmit} noValidate>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: "#7B89A8",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              marginBottom: "6px",
            }}
          >
            Email Address
          </Typography>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <AppTextField
                {...field}
                type="email"
                placeholder={theme.emailPlaceholder}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={inputSx}
              />
            )}
          />

          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: "#7B89A8",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              marginBottom: "6px",
            }}
          >
            Password
          </Typography>
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <AppTextField
                {...field}
                type="password"
                placeholder="••••••••"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={inputSx}
              />
            )}
          />

          <AppButton
            type="submit"
            fullWidth
            variant="contained"
            disabled={formState.isSubmitting}
            sx={{
              marginTop: "4px",
              backgroundColor: theme.submitBackground,
              padding: "13px",
              borderRadius: "10px",
              fontFamily: "Rajdhani, sans-serif",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.5px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: theme.submitHoverBackground,
                transform: "translateY(-1px)",
                boxShadow: theme.submitHoverShadow,
              },
              "&.Mui-disabled": {
                color: "#fff",
                opacity: 0.72,
              },
            }}
          >
            {formState.isSubmitting ? "Logging in..." : "Login"}
          </AppButton>
        </form>

        <Stack
          direction="row"
          useFlexGap
          justifyContent="center"
          alignItems="center"
          sx={{
            marginTop: "18px",
            color: "#7B89A8",
            flexWrap: "wrap",
            rowGap: 0.5,
            columnGap: 1,
            fontSize: { xs: 12, sm: 13 },
            lineHeight: 1.4,
          }}
        >
          {theme.links.map((link, idx) => (
            <Box
              key={link.href}
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {idx > 0 ? (
                <Box
                  component="span"
                  sx={{
                    mx: 1,
                    color: "rgba(123,137,168,0.55)",
                    userSelect: "none",
                  }}
                  aria-hidden
                >
                  |
                </Box>
              ) : null}
              <span>
                <Box component="span" sx={{ color: "inherit" }}>
                  {link.label}
                </Box>{" "}
                <Link
                  href={link.href}
                  style={{
                    color: theme.submitBackground,
                    fontWeight: 700,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {link.text} <AppIcon name="arrowRight" size={13} />
                </Link>
              </span>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
