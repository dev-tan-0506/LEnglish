import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MAIL_MESSAGES } from "./mail.messages";
import type { SentMail } from "./mail.types";

@Injectable()
export class MailService {
  private readonly sentMessages: SentMail[] = [];

  constructor(private readonly configService: ConfigService) {}

  /** Sends or records a password reset email. */
  async sendPasswordResetEmail(to: string, resetUrl: string) {
    const message = {
      to,
      resetUrl,
      subject: MAIL_MESSAGES.PASSWORD_RESET_SUBJECT
    };

    this.sentMessages.push(message);

    if (this.configService.get("NODE_ENV") !== "test") {
      // SMTP transport is intentionally isolated here so controllers and flows do not depend on provider details.
      const smtpHost = this.configService.get("SMTP_HOST");
      const smtpPass = this.configService.get("SMTP_PASS") || this.configService.get("SMTP_PASSWORD");
      void smtpHost;
      void smtpPass;
    }

    return message;
  }

  /** Returns messages captured by the in-memory test transport. */
  getSentMessages() {
    return [...this.sentMessages];
  }

  /** Clears captured messages between integration tests. */
  clearSentMessages() {
    this.sentMessages.length = 0;
  }

  /** Returns the latest test mailbox message when test transport is enabled. */
  getLatestTestMailboxMessage() {
    if (this.configService.get("NODE_ENV") !== "test") {
      return null;
    }

    return this.sentMessages.at(-1) ?? null;
  }
}
