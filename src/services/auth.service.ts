import bcrypt from "bcryptjs";
import {
  findUserByEmail,
  createUser
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

  const user = await createUser(
    data.name,
    data.email,
    passwordHash
  );

  return user;
}