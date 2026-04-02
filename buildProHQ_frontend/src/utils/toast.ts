import { toast, type ToastOptions } from "react-toastify";

const baseOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 3200,
};

export const appToast = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, { ...baseOptions, ...options }),
  error: (message: string, options?: ToastOptions) =>
    toast.error(message, { ...baseOptions, ...options }),
  info: (message: string, options?: ToastOptions) =>
    toast.info(message, { ...baseOptions, ...options }),
};

