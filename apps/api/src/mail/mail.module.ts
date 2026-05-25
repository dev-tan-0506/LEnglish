import { Module } from "@nestjs/common";
import { MailboxTestController } from "./mailbox-test.controller";
import { MailService } from "./mail.service";

@Module({
  controllers: [MailboxTestController],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
