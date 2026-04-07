"use client";

import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FormTextField, type FormTextFieldProps } from "@/components/common/FormTextField";

export type AppPasswordFieldProps = Omit<FormTextFieldProps, "type">;

export function AppPasswordField(props: AppPasswordFieldProps) {
  const [show, setShow] = useState(false);
  const hasValue = String(props.value ?? "").length > 0;

  return (
    <FormTextField
      {...props}
      type={show ? "text" : "password"}
      InputProps={{
        ...(props.InputProps ?? {}),
        endAdornment: hasValue ? (
          <InputAdornment position="end">
            <IconButton
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => setShow((v) => !v)}
              edge="end"
              size="small"
            >
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
}

