export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  mobile?: string;
  created_at: Date;
  updated_at: Date;
  deleted: 0 | 1;
};


export type UserCreationRepoInput = Pick<User, "name" | "email" | "password"> & Partial<Pick<User, "mobile">>