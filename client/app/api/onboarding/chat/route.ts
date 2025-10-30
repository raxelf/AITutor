import { MessageType } from "@/contexts/ChatContext";
import { openai } from "@/services/openai";
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
        error: "Internal Server Error!",
      },
      {
        status: 500,
      }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const userId = request.headers.get("x-user-id");

    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });
    const userGoal = user?.goal;
    const userLevel = user?.level;

    const { message } = await request.json();

    let onboardingPrompt = "";
    let maxTokens: number;

    if (!userGoal || userGoal === "null") {
      onboardingPrompt = `STEP 1/2: Extract user's English learning goal.
      If they ask for examples, give 2-3 simple goals (e.g., "speak fluently", "pass TOEFL").
      Accept only English-related goals. Briefly acknowledge valid goal, then ask their level (beginner/intermediate/advanced).

      Reply JSON: {"reply":"...","goal":"extracted goal or empty","level":""}`;
      maxTokens = 120;
    } else if (!userLevel || userLevel === "null") {
      onboardingPrompt = `STEP 2/2: Goal="${userGoal}". Extract level (beginner/intermediate/advanced).
      If level not in message, ask again briefly.
      Once you get level, start first lesson for "${userGoal}". Give warm welcome + first task.

      Reply JSON: {"reply":"Perfect! You're at [level]. Let's begin with [first lesson].
      [first task]","goal":"${userGoal}","level":"extracted level or empty"}`;
      maxTokens = 180;
    } else {
      onboardingPrompt = `Goal="${userGoal}", Level="${userLevel}". You're an English tutor. Keep responses concise.
      Reply JSON: {"reply":"your response","goal":"${userGoal}","level":"${userLevel}"}`;
      maxTokens = 150;
    }

    // prompt for limiting  topic
    const systemPrompt: MessageType = {
      role: "system",
      content: onboardingPrompt,
    };

    const conversation = await prisma.conversation.findFirst({
      where: {
        userId: Number(userId),
      },
    });

    const chatHistory: MessageType[] = conversation?.messages
      ? (conversation.messages as MessageType[])
      : [];

    const fullMessages: MessageType[] = [
      ...chatHistory,
      { role: "user", content: message, date: new Date().toISOString() },
    ];

    // limit chat history to latest 8 chat
    const limitHistory = chatHistory.slice(-2);
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
      response_format: { type: "json_object" },
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    const response = completion.choices?.[0]?.message?.content ?? "{}";
    const reply = JSON.parse(response);
    console.log(reply);

    const aiReply = reply.reply || "Sorry, please try again.";

    // assign goal or level to database
    if (reply.goal) {
      await prisma.user.update({
        where: {
          id: Number(userId),
        },
        data: {
          goal: reply.goal,
        },
      });
    }
    if (reply.level) {
      await prisma.user.update({
        where: {
          id: Number(userId),
        },
        data: {
          level: reply.level,
        },
      });
    }

    await prisma.conversation.update({
      where: { id: conversation?.id },
      data: {
        messages: [
          ...fullMessages,
          { role: "ai", content: aiReply, date: new Date().toISOString() },
        ],
      },
    });

    return NextResponse.json<restfulResponse<string>>({
      code: 200,
      data: aiReply,
    });
  } catch (err) {
    console.error(err);

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
