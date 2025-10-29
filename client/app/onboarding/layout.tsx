import { ChatProvider, MessageType } from "@/contexts/ChatContext";
import { BASE_URL } from "@/utils/constant";
import { restfulResponse } from "@/utils/response";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { Conversation } from "../generated/prisma/client";

const fetchChatHistory = async () => {
  const cookieStorage = await cookies();

  const response = await fetch(`${BASE_URL}/api/onboarding/chat`, {
    method: "GET",
    headers: {
      Cookie: cookieStorage.toString(),
    },
  });

  const data: restfulResponse<Conversation> = await response.json();
  return data;
};

const OnboardingLayout = async ({ children }: { children: ReactNode }) => {
  const { data } = await fetchChatHistory();

  const chatHistory: MessageType[] = data?.messages ? data.messages as MessageType[] : [];

  return <ChatProvider initialMessages={chatHistory}>{children}</ChatProvider>;
};

export default OnboardingLayout;
