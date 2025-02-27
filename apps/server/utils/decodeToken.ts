import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET;
export function decodeToken(token: string): string {
  try {
    const decoded = jwt.verify(token, secret!) as jwt.JwtPayload;

    if (!decoded || !decoded.userId) {
      throw new Error("Invalid token payload");
    }

    return decoded.userId;
  } catch (error) {
    console.error("Token decoding error:", error);
    throw new Error("Invalid or expired token");
  }
}
