// import { prisma } from "@/utils/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { hashPassword } from "@/utils/bcrypt";
import { prisma } from "@/utils/prisma";
import { restfulResponse } from "@/utils/response";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

// Zod validation
const signUpSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be at most 100 characters" }),
  email: z
    .email({
      message: "Email is required",
    })
    .min(1, { message: "Email is required" }),
  password: z
    .string({
      message: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters long.",
    }),
});

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json();

    const parsedData = signUpSchema.safeParse(data);

    if (!parsedData.success) {
      throw parsedData.error;
    }

    const { name, email, password } = parsedData.data;

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword(password),
      },
    });

    // default first message by ai
    const initialMessage = [
      {
        role: "ai",
        content: `Hi ${newUser.name}! Welcome to JaPi. What's your English learning goal?`,
      },
    ];

    await prisma.conversation.create({
      data: {
        messages: initialMessage,
        userId: newUser.id,
      },
    });

    return NextResponse.json<restfulResponse<unknown>>(
      {
        code: 201,
        message: "Successfully registered new account!",
      },
      {
        // actual status
        status: 201,
      }
    );
  } catch (err) {
    console.error(err);

    // zod Validation error
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
      err.code === "P2002"
    ) {
      // prisma validation unique email
      return NextResponse.json<restfulResponse<never>>(
        {
          code: 400,
          error: "Email already registered.",
        },
        {
          status: 400,
        }
      );
    }

    // Default error
    return NextResponse.json<restfulResponse<never>>(
      {
        code: 500,
        error: "Internal Server Error!",
      },
      {
        status: 500,
      }
    );
  }
};
