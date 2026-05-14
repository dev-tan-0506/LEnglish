export type PasswordResetMail = {
  to: string;
  resetUrl: string;
};

export type SentMail = PasswordResetMail & {
  subject: string;
};
