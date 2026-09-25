import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "./sendResponse";
import { verifyToken } from "./jwt";
import authService from "../modules/auth/services/auth.service";
import type { Role } from "../types";
import { StatusCodes } from "http-status-codes";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  // Token from Request header
  try {
    const token = req.headers.authorization;

    if (!token) {
      return sendResponse(
        res,
        {
          message: "Token not found",
        },
        StatusCodes.UNAUTHORIZED,
      );
    }

    // Verify Access token
    const payload = verifyToken(token);

    if (!payload) {
      return sendResponse(res, { message: "Invalid access Token" }, StatusCodes.UNAUTHORIZED);
    }

    // find user from database by token id
    const user = await authService.getUserById(payload.id);

    if (!user) {
      return sendResponse(res, { message: "User not Found" }, StatusCodes.UNAUTHORIZED);
    }

    // including the user with the request
    req.user = user;

    next();
  } catch (error: unknown) {
    return sendResponse(
      res,
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      StatusCodes.UNAUTHORIZED,
    );
  }
};
export const authorizeRole = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendResponse(
        res,
        {
          message: "Unauthorized",
        },
        StatusCodes.UNAUTHORIZED,
      );
    }
    if (!roles.includes(req.user.role)) {
      return sendResponse(
        res,
        {
          message: "You don't have permission",
        },
        403,
      );
    }
    next();
  };
};
