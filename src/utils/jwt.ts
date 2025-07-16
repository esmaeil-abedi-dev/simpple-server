import jwt from "jsonwebtoken";

// Generate JWT token
export const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || "your_jwt_secret_key";
  const expiresIn = process.env.JWT_EXPIRES_IN || "30d";
  return jwt.sign({ id }, secret);
};

// Set JWT cookie
export const setCookieWithToken = (res: any, token: string): void => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + Number(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", token, cookieOptions);
};
