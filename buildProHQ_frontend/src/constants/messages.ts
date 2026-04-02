export const MESSAGES = {
  validation: {
    emailRequired: "Email is required",
    emailInvalid: "Please enter a valid email address",
    emailMaxLength: "Email must be at most 255 characters",
    passwordRequired: "Password is required",
    passwordMinLength: "Password must be at least 8 characters",
    passwordMaxLength: "Password must be at most 128 characters",
    passwordWhitespaceOnly: "Password cannot be only spaces",
    fieldRequired: "This field is required",
  },
  task: {
    created: "Task created successfully",
    completed: "Task completed successfully",
    deleted: "Task deleted successfully",
    loadFailed: "Failed to load tasks",
  },
  user: {
    created: "User created successfully",
    updated: "User updated successfully",
    removed: "User removed successfully",
  },
  auth: {
    loginSuccess: "Login successful",
    loginFailed: "Invalid email or password",
    logoutSuccess: "Logged out",
    portalUnauthorized:
      "This account does not have access to this portal. Sign in using the correct portal for your role.",
  },
  filter: {
    added: "Filter added successfully",
    updated: "Filter updated successfully",
    deleted: "Filter deleted successfully",
  },
  common: {
    validationFailed: "Validation failed",
    somethingWrong: "Something went wrong",
    saveFailed: "Failed to save changes",
    unauthorized: "Your session has expired. Please sign in again.",
    forbidden: "You do not have permission to perform this action.",
    notFound: "The requested resource could not be found.",
    networkError: "Unable to connect. Please try again.",
    timeoutError: "The request timed out. Please try again.",
    serverError: "Something went wrong. Please try again later.",
    pageCrashed: "We hit an unexpected issue while rendering this page.",
  },
} as const;
