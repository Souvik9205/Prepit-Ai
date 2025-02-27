import jwt from "jsonwebtoken";

const JWT_SECRET = "bwiuheriwg34242b3";

export async function GenerateAccessToken(userId: string): Promise<string> {
  return jwt.sign({ userId }, process.env.JWT_SECRET || JWT_SECRET, {
    expiresIn: "1d",
  });
}

// export async function GenerateRefressToken(userId: string): Promise<string> {
//   return jwt.sign({ userId }, process.env.JWT_SECRET || JWT_SECRET, {
//     expiresIn: "15d",
//   });
// }
