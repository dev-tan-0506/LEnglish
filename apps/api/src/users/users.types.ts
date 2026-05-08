export type CreateUserInput = {
  email: string;
  password: string;
  name: string;
};

export type CreateUserRecordInput = {
  email: string;
  passwordHash: string;
  name: string;
};
