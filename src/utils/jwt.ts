import config from "../config";
import type { RUser } from "../types";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const verifyToken = (token: string) => {
  try {
    const secret = config.jwt_secret;
    const decode = jwt.verify(token, secret);
    
    return decode as JwtPayload;
  } catch {
    return null;
  }
};

export const signToken = (payload: RUser & { id: number }) => {
  const accessToken = jwt.sign(payload, config.jwt_secret, {
    expiresIn: "3d",
  });
  return {
    accessToken,
  };
};
