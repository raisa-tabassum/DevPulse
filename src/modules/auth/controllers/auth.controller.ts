import type { Request, Response } from "express";
import authService from "../services/auth.service";
import { sendResponse } from "../../../utils/sendResponse";
import { signToken } from "../../../utils/jwt";
import { StatusCodes } from "http-status-codes";

export const signup = async (req: Request, res: Response) => {
  const user = await authService.createUser(req.body);

  if (!user) {
    sendResponse(
      res,
      { message: "Failed to Create User", errors: "User registration failed" },
      StatusCodes.BAD_REQUEST,
    );
    return;
  }
  sendResponse(
    res,
    { message: "User Registered Successfully!", data: user },
    StatusCodes.CREATED,
  );
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.validateUser(email, password);

  if (!user) {
    sendResponse(
      res,
      {
        message: "Invalid email or password",
        errors: "Invalid email or password",
      },
      StatusCodes.UNAUTHORIZED,
    );
    return;
  }

  const { accessToken } = signToken(user);

  const result = {
    token: accessToken,
    user: user,
  };

  return sendResponse(res, {
    message: "Login Successful!",
    data: result,
  });
};
