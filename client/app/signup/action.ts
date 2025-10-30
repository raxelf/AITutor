"use server";

import { BASE_URL } from "@/utils/constant";
import { restfulResponse } from "@/utils/response";
import { redirect } from "next/navigation";

export const doSignUp = async (formData: FormData) => {
  // console.log(formData);

  const response = await fetch(`${BASE_URL}/api/signup`, {
    method: "POST",
    body: JSON.stringify({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // console.log(response);

  const responseJson: restfulResponse<never> = await response.json();

  if (!response.ok) {
    // error msg
    const message = responseJson.error ?? "Something went wrong!";

    return redirect(`/signup?error=${message}`);
  }

  const successMessage = responseJson.message;
  return redirect(`/login?s=${successMessage}`);
};
