export const PASSWORD_POLICY_MESSAGE =
  'Password must be min 8 with 1 uppercase, 1 lowercase, 1 number, 1 special character, and no spaces.';

export const PASSWORD_POLICY_REGEX = {
  NO_SPACES: /^\S+$/,
  LOWER: /(?=.*[a-z])/,
  UPPER: /(?=.*[A-Z])/,
  NUMBER: /(?=.*\d)/,
  SPECIAL: /(?=.*[^A-Za-z0-9])/,
} as const;
