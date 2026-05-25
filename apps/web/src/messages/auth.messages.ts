export const AUTH_ERROR_MESSAGES = {
  LOGIN_REQUIRED_FIELDS: "Email and password are required.",
  LOGIN_INVALID_CREDENTIALS: "Email or password is incorrect.",
  SIGNUP_REQUIRED_FIELDS: "Name, email, and password are required.",
  SIGNUP_EMAIL_IN_USE: "This email may already be in use.",
  RESET_TOKEN_MISSING: "Reset token is missing.",
  RESET_PASSWORD_MISMATCH: "Passwords must match.",
  RESET_LINK_INVALID: "This reset link is invalid or expired."
} as const;

export const AUTH_SUCCESS_MESSAGES = {
  RESET_EMAIL_SENT: "If an account exists for this email, a reset link has been sent."
} as const;
