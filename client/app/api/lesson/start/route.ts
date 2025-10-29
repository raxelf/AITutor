import { MessageType } from "@/contexts/ChatContext";
import { openai } from "@/services/openai";
import { prisma } from "@/utils/prisma";
import { restfulResponse } from "@/utils/response";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    console.log("lesson started");

    const userId = request.headers.get("x-user-id");
    const userGoal = request.headers.get("x-user-goal");
    const userLevel = request.headers.get("x-user-level");

    const { message } = await request.json();

    const systemPrompt: MessageType = {
      role: "system",
      content: `
        You are an expert English tutor for "${userGoal}" students at the "${userLevel}" level.
        Begin the first lesson in a friendly way. Use simple and clear language.
        Introduce the topic, give guidance, and encourage the student.
        If the user asks unrelated questions, politely redirect to the lesson topic.
        Reply in plain text only (NO JSON), keep it conversational and interactive.
      `,
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

    // limit chat history to latest 8 chat
    const limitHistory = chatHistory.slice(-12);
    const fullMessagesWithPrompt: MessageType[] = [
      systemPrompt,
      ...limitHistory,
      { role: "user", content: message, date: new Date().toISOString() },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: fullMessagesWithPrompt.map(({ role, content }) => ({
        role: role === "ai" ? "assistant" : role,
        content,
      })),
      max_tokens: 256,
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
