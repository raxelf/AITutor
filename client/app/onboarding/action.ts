"use server";

import { BASE_URL } from "@/utils/constant";
import { readPayload } from "@/utils/jwt";
import { prisma } from "@/utils/prisma";
import { restfulResponse } from "@/utils/response";
import { cookies } from "next/headers";

export const doSendMessage = async (inputMessage: string) => {
  const cookieStorage = await cookies();
  const token = cookieStorage.get("token");

  const tokenData = readPayload(token!.value) as {
    id: string;
    email: string;
  };

  const user = await prisma.user.findUnique({
    where: { id: Number(tokenData.id) },
    select: { goal: true, level: true },
  });

  const hasGoal = user?.goal && user.goal !== "null";
  const hasLevel = user?.level && user.level !== "null";

  if (!hasGoal || !hasLevel) {
    const response = await fetch(`${BASE_URL}/api/onboarding/chat`, {
      method: "POST",
      body: JSON.stringify({ message: inputMessage }),
      headers: {
        Cookie: cookieStorage.toString(),
      },
    });
    if (!response.ok) throw new Error("AI request failed");

    const data: restfulResponse<string> = await response.json();

    return data?.data;
  }

  const response = await fetch(`${BASE_URL}/api/lesson/start`, {
    method: "POST",
    body: JSON.stringify({ message: inputMessage }),
    headers: {
      Cookie: cookieStorage.toString(),
    },
  });
  if (!response.ok) throw new Error("AI request failed");

  const data: restfulResponse<string> = await response.json();

  return data?.data;
};
