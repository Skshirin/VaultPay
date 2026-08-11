import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import {
  findUserByEmail
} from "../repositories/user.repository.js";
import jwt from "jsonwebtoken";

interface LoginInput {
  email: string;
  password: string;
}

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

export async function loginUser(data: LoginInput) {
  const user = await findUserByEmail(data.email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(
    data.password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw new Error("Invalid email or password");
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign(
    {
      userId: user.id
    },
    secret,
    {
      expiresIn: "15m"
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };
}