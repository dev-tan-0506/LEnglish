import { Controller, Get, NotFoundException } from "@nestjs/common";
import { MailService } from "./mail.service";

@Controller("test/mailbox")
export class MailboxTestController {
  constructor(private readonly mailService: MailService) {}

  /** Delegates latest test-mailbox lookup to the mail service. */
  @Get("latest")
  latest() {
    const latestMessage = this.mailService.getLatestTestMailboxMessage();
    if (!latestMessage) {
      throw new NotFoundException("No mailbox messages found.");
    }

    return {
      email: latestMessage.to,
      resetUrl: latestMessage.resetUrl
    };
  }
}
