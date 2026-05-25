export type AuthUser = {
  id: string;
  email: string;
  profile?: {
    name?: string;
    targetToeicScore?: number | null;
  } | null;
};

export type RegisterInput = {
  email: string;
  password: string;
  name: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type PasswordResetRequestInput = {
  email: string;
};

export type PasswordResetConfirmInput = {
  token: string;
  password: string;
};
