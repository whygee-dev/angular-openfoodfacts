export type User = {
  id: number;
  username: string;
  token: Token;
};

export type Token = {
  token: string;
  type: string;
};

export type RegisterUser = Pick<User, "username"> & { password: string };

export type LoginUser = Pick<User, "username"> & { password: string };

export type AuthError = {
  rule: string;
  field: string;
  message: string;
};

export type AuthErrors = {
  errors: AuthError[];
};
