import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/utils/prisma";

import { comparePassword } from "@/utils/bcrypt";
import { createToken } from "@/utils/jwt";
import { restfulResponse } from "@/utils/response";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

// Zod validation
const loginSchema = z.object({
  email: z
    .email({
      message: "Email is required",
    })
    .min(1, { message: "Email is required" }),
  password: z.string({
    message: "Password is required",
  }),
});

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json();
    const parsedData = loginSchema.safeParse(data);

    if (!parsedData.success) {
      throw parsedData.error;
    }

    const { email, password } = parsedData.data;

    const foundUser = await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });

    if (!foundUser || !comparePassword(password, foundUser.password)) {
      return NextResponse.json<restfulResponse<never>>(
        {
          code: 401,
          error: "Invalid email or password!",
        },
        { status: 401 }
      );
    }

    const payload = {
      id: foundUser.id,
      email: foundUser.email,
    };

    const token = createToken(payload);
    // making sure
    if (!token) {
      return NextResponse.json<restfulResponse<never>>(
        {
          code: 401,
          error: "Invalid email or password!",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      code: 200,
      message: "Succefully Logged in",
      access_token: token,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errMessage = err.issues[0].message;

      return NextResponse.json<restfulResponse<never>>(
        {
          code: 400,
          error: `${errMessage}`,
        },
        {
          status: 400,
        }
      );
    }

    // prisma validation authentication
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json<restfulResponse<never>>(
        {
          code: 401,
          error: "Invalid email or password!",
        },
        {
          status: 401,
        }
      );
    }

    // Default error
    return NextResponse.json<restfulResponse<never>>(
      {
        code: 500,
        message: "Internal Server Error!",
      },
      {
        status: 500,
      }
    );
  }
};
