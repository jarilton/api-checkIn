import { Prisma, User } from "@prisma/client";
import { PrismaUsersRepository } from "./prisma/prisma-users-repository";

export interface UsersRepository {
  findByEmail: (email: string) => Promise<User | null>;
  create: (data: Prisma.UserCreateManyInput) => Promise<User>;
}
