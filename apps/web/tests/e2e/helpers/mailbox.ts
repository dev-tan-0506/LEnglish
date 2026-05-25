export type ResetMailboxMessage = {
  email: string;
  resetUrl: string;
};

/** Returns the latest reset mailbox message via test-only API endpoint. */
export async function readLatestResetMessage(baseApiUrl: string): Promise<ResetMailboxMessage> {
  const response = await fetch(`${baseApiUrl.replace(/\/$/, "")}/test/mailbox/latest`);
  if (!response.ok) {
    throw new Error(`Mailbox endpoint unavailable: ${response.status}`);
  }

  return (await response.json()) as ResetMailboxMessage;
}
