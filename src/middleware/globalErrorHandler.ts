import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err instanceof Error ? err.message : "Internal Server Error",
    /* stack:
      config.node_env === "development" && err instanceof Error
        ? err.stack
        : undefined, */
    errors: err instanceof Error ? err.message : "Something went wrong"
  });
};
