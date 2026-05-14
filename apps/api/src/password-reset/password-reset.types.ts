export type CreatePasswordResetTokenInput = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};

export type PasswordResetAcceptedResponse = {
  ok: true;
  message: string;
};
