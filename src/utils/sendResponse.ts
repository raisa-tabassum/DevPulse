import type { Response } from "express";
import { StatusCodes } from "http-status-codes";

export const sendResponse = <T>(
  res: Response,
  {
    message,
    data,
    errors,
  }: {
    message: unknown;
    data?: T | undefined;
    errors?: unknown;
  },
  status = StatusCodes.OK,
): void => {
  res.status(status).json({
    success: errors ? false : true,
    message: message,
    data: errors ? undefined : data,
    errors: errors,
  });
};
