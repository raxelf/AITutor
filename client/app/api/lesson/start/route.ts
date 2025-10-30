import { MessageType } from "@/contexts/ChatContext";
import { openai } from "@/services/openai";
import { prisma } from "@/utils/prisma";
import { restfulResponse } from "@/utils/response";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    // console.log("lesson started");

    const userId = request.headers.get("x-user-id");
    const userGoal = request.headers.get("x-user-goal");
    const userLevel = request.headers.get("x-user-level");

    const { message } = await request.json();

    const systemPrompt: MessageType = {
      role: "system",
      content: `You are an expert English tutor for ${userGoal} students at ${userLevel} level.

      Teaching approach:
      - Correct grammar, spelling, and word order mistakes gently with brief explanations
      - Provide examples when correcting errors
      - Ask follow-up questions to check understanding
      - Keep explanations clear but thorough enough to help learning

      Reply in plain text only (NO JSON).`,
    };

    // Load lesson conversation
    const conversation = await prisma.conversation.findFirst({
      where: { userId: Number(userId) },
    });
    const chatHistory: MessageType[] = conversation?.messages
      ? (conversation.messages as MessageType[])
      : [];

    const fullMessages: MessageType[] = [
      ...chatHistory,
      { role: "user", content: message, date: new Date().toISOString() },
    ];

    // limit chat history beginner need less context
    const historyLimit = userLevel === "beginner" ? 6 : 8;
    const limitHistory = chatHistory.slice(-historyLimit);

    const cleanMessage = message.trim().replace(/\s+/g, " ");

    const fullMessagesWithPrompt: MessageType[] = [
      systemPrompt,
      ...limitHistory,
      { role: "user", content: message, date: new Date().toISOString() },
    ];

    const isShortMessage = cleanMessage.length < 50;
    const isQuestion = cleanMessage.includes("?");

    let maxTokens: number;
    if (isShortMessage && !isQuestion) {
      maxTokens = 150; // Simple corrections
    } else if (isQuestion || cleanMessage.length > 100) {
      maxTokens = 256; // Explanations, teaching moments
    } else {
      maxTokens = 200; // Standard responses
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: fullMessagesWithPrompt.map(({ role, content }) => ({
        role: role === "ai" ? "assistant" : role,
        content,
      })),
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    const aiReply = completion.choices?.[0]?.message?.content ?? "";

    if (aiReply) {
      await prisma.conversation.update({
        where: { id: conversation!.id },
        data: {
          messages: [
            ...fullMessages,
            { role: "ai", content: aiReply, date: new Date().toISOString() },
          ],
        },
      });
    }

    return NextResponse.json<restfulResponse<string>>({
      code: 200,
      data: aiReply,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json<restfulResponse<never>>(
      {
        code: 500,
        error: "Internal Server Error!",
      },
      { status: 500 }
    );
  }
};
