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
    if (!userGoal || userGoal === "null") {
      onboardingPrompt = `STEP 1/2: Extract the user's English learning goal from their message.
      If they ask for examples or what a goal means,
      give 2-3 simple English learning goals (like “speak fluently”, “pass TOEFL”, "write emails").
      Only accept real English-related goals (speaking, listening, writing, grammar, exams).
      Briefly acknowledge a valid goal, then ask for their English level (beginner/intermediate/advanced).

      Reply JSON: {"reply":"...","goal":"extracted goal or empty","level":""}
      `;
    } else if (!userLevel || userLevel === "null") {
      onboardingPrompt = `STEP 2/2: Goal set: "${userGoal}". Extract their level from message (beginner/intermediate/advanced).
      If level not in message, ask again briefly.
      Once you get the level, immediately start the first lesson/activity related to their goal "${userGoal}".
      Give them a warm welcome and present the first learning task or topic.
      Reply JSON: {"reply":"Perfect! You're at [level] level.
      Let's begin with [specific first lesson/exercise for their goal].
      [Give first task or question]","goal":"${userGoal}","level":"extracted level or empty"}`;
    } else {
      onboardingPrompt = `Profile: Goal="${userGoal}", Level="${userLevel}".
      You're an English tutor. Help with learning. Keep responses concise.
      Reply JSON: {"reply":"your response","goal":"${userGoal}","level":"${userLevel}"}`;
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
    const limitHistory = chatHistory.slice(-8);
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
      max_tokens: 150,
      temperature: 0.5,
      response_format: { type: "json_object" },
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
