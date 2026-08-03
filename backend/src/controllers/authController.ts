import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
} from "../services/authService";

export const registerHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser(
      name,
      email,
      password
    );

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({
      message: (error as Error).message,
    });
  }
};

export const loginHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const token = await loginUser(
      email,
      password
    );

    res.json({
      token,
    });
  } catch (error) {
    res.status(401).json({
      message: (error as Error).message,
    });
  }
};