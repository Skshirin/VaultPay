import { Request, Response } from "express";
import { registerSchema } from "../validators/auth.validator";
import { registerUser } from "../services/auth.service";

export async function register(req: Request, res: Response) {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid request",
      errors: result.error.flatten()
    });
  }

  try {
    const user = await registerUser(result.data);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "User with this email already exists"
    ) {
      return res.status(409).json({
        message: error.message
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}