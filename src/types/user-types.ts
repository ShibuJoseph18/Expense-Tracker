export type UserType = {
  id: number;
  name: string;
  email: string;
  password: string;
  mobile?: string;
  created_at: Date;
  updated_at: Date;
  deleted: 0 | 1;
};


export type UserCreationRepoInputType = Pick<UserType, "name" | "email" | "password"> & Partial<Pick<UserType, "mobile">>