import jwt, { type JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "not-safe";

export const createToken = (payload: JwtPayload) =>
  jwt.sign(payload, JWT_SECRET);
export const readPayload = (token: string) => jwt.verify(token, JWT_SECRET);
