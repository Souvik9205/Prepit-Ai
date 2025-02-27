import { hash, compare } from "../utils/script";
import prisma from "../utils/PrismaClient";
import { GenerateAccessToken } from "../utils/tokenGenerate";
import { successfulAuthResponse } from "../types";
import { Mailer } from "../utils/Mailer";
import jwt from "jsonwebtoken";
import { GenerateRandomOTP } from "../utils/OTPgenerate";

export const loginService = async (
  email: string,
  password: string
): Promise<successfulAuthResponse> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        status: 404,
        data: {
          message: "User not found",
        },
      };
    }
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return {
        status: 401,
        data: {
          message: "Invalid credentials",
        },
      };
    }
    const token = await GenerateAccessToken(user.id);
    // const Rtoken = await GenerateRefressToken(user.id);

    return {
      status: 200,
      data: {
        message: "Login successful",
        token: token,
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: {
        message: `Internal server error, ${error}`,
      },
    };
  }
};

export const signUpService = async (
  email: string
): Promise<{
  status: number;
  message: string;
}> => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return {
        status: 409,
        message: "User already exists",
      };
    }
    const OTP = await GenerateRandomOTP(6);
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);

    const existingOtp = await prisma.otp.findFirst({
      where: {
        email,
      },
    });
    if (existingOtp) {
      await prisma.otp.update({
        where: {
          id: existingOtp.id,
        },
        data: {
          otp: OTP,
          expiresAt: otpExpiry,
        },
      });

      const emailSent = await Mailer(
        email,
        "User Verification",
        OTP,
        "otp-verification"
      );
      if (!emailSent) {
        return {
          status: 400,
          message: "Error sending email",
        };
      }
      return {
        status: 201,
        message: "OTP updated successfully",
      };
    }
    await prisma.otp.create({
      data: {
        email,
        otp: OTP,
        expiresAt: otpExpiry,
      },
    });
    const emailSent = await Mailer(
      email,
      "User Verification",
      OTP,
      "otp-verification"
    );
    if (!emailSent) {
      return {
        status: 400,
        message: "Error sending email",
      };
    }
    return {
      status: 201,
      message: "OTP sent successfully",
    };
  } catch (error) {
    return {
      status: 500,
      message: `Internal server error, ${error}`,
    };
  }
};

export const OTPVerificationService = async (
  email: string,
  otp: string,
  password: string,
  name: string,
  imgURL: string
): Promise<successfulAuthResponse> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return {
        status: 409,
        data: {
          message: "User already exists",
        },
      };
    }
    const existingOtp = await prisma.otp.findFirst({
      where: {
        email,
      },
    });
    if (!existingOtp) {
      return {
        status: 404,
        data: {
          message: "OTP Not Found",
        },
      };
    }

    if (existingOtp.otp !== otp || existingOtp.expiresAt < new Date()) {
      return {
        status: 400,
        data: {
          message: "Invalid OTP",
        },
      };
    }
    const hashedPassword = await hash(password);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        imgURL,
      },
    });
    await prisma.otp.delete({
      where: {
        id: existingOtp.id,
      },
    });
    const token = await GenerateAccessToken(newUser.id);
    // const Rtoken = await GenerateRefressToken(newUser.id);

    return {
      status: 200,
      data: {
        message: "Signup successful",
        // accessToken: Atoken,
        // refreshToken: Rtoken,
        token: token,
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: {
        message: `Internal server error, ${error}`,
      },
    };
  }
};

export const refreshTokenService = async (
  refreshToken: string
): Promise<{ status: number; accessToken: string; message: string }> => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const newAccessToken = await GenerateAccessToken(decoded.userId);

    return {
      status: 200,
      accessToken: newAccessToken,
      message: "Token refreshed successfully",
    };
  } catch (error: any) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return {
        status: 400,
        accessToken: "",
        message: "Unauthorized",
      };
    }
    return {
      status: 500,
      accessToken: "",
      message: "Internal server error",
    };
  }
};

//TODO-
// 1. Add forgot password feature
