export const API_ENDPOINTS = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    logout: "/auth/logout",
    me: "/auth/me"
  },
  passwordReset: {
    request: "/password-reset/request",
    confirm: "/password-reset/confirm"
  },
  profile: {
    me: "/profile/me",
    avatar: "/profile/avatar"
  }
} as const;
