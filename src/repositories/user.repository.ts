import { prisma } from "../config/prisma.js";

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email
    }
  });
}

export function createUser(
  name: string,
  email: string,
  passwordHash: string
) {
  return prisma.user.create({
    data: {
      name,
      email,
      passwordHash
    }
  });
}