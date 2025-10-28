"use server";

import { BASE_URL } from "@/utils/constant";
import { loginResponse } from "@/utils/response";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const doLogin = async (formData: FormData) => {
  const response = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    body: JSON.stringify({
      email: formData.get("email"),
      password: formData.get("password"),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseJson: loginResponse = await response.json();

  if (!response.ok) {
    // error msg
    const message = responseJson.error ?? "Something went wrong!";

    return redirect(`/login?error=${message}`);
  }

  // console.log(responseJson);

  const token = responseJson.access_token!;

  const cookieStorage = await cookies();
  cookieStorage.set("token", token, {
    httpOnly: true,
    secure: false,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hour
    sameSite: "strict",
  });

  return redirect(`/onboarding`);
};
