import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import {
  findUserByEmail
} from "../repositories/user.repository.js";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export async function registerUser(data: RegisterInput) {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const result = await prisma.$transaction(async (tx) => {

    const user = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash
      }
    });

    const wallet = await tx.wallet.create({
      data: {
        userId: user.id
      }
    });

    return { user, wallet };
  });

  return result.user;
}