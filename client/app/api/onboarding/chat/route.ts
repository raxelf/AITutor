import { prisma } from "@/utils/prisma";
import { restfulResponse } from "@/utils/response";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const userId = request.headers.get("x-user-id");

    const conversation = await prisma.conversation.findFirst({
      where: {
        userId: Number(userId),
      },
    });

    return NextResponse.json<restfulResponse<typeof conversation>>({
      code: 200,
      data: conversation,
    });
  } catch (err) {
    console.error(err);

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

export const POST = (request: NextRequest) => {
  
};
