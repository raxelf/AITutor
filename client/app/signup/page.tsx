import Link from "next/link";
import WelcomeAnimationComponent from "@/components/WelcomeAnimationComponent";
import ClientFlashComponent from "@/components/ClientFlashComponent";
import { doSignUp } from "./action";
import { Metadata } from "next";
import ClientSubmitButton from "@/components/ClientSubmitButton";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "SignUp",
};

export default function SignUpPage() {
  return (
    <section className="bg-white min-h-screen grid grid-cols-1 md:grid-cols-12">
      {/* Left side */}
      <div className="w-full h-full col-span-6 flex flex-col">
        {/* LOGO */}
        <div className="font-bold p-4 text-3xl">
          <span className="text-primary">Ja</span>
          <span className="text-secondary">Pi</span>
        </div>

        {/* header */}
        <div className="w-full h-full flex flex-col justify-center items-center gap-4 md:gap-8 md:px-16 lg:px-32 px-8 my-16 md:my-0">
          <div className="flex flex-col text-center gap-2">
            <h1 className="font-bold text-2xl md:text-4xl text-primary">
              Sign Up
            </h1>
            <h2 className="text-md">
              Start learning in minutes—just one step to go!
            </h2>
          </div>

          {/* Form */}
          <form action={doSignUp} className="flex flex-col gap-4 w-full">
            <Suspense fallback={<></>}>
              <ClientFlashComponent />
            </Suspense>

            <div className="flex flex-col gap-1">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                placeholder="Your Name"
                id="name"
                name="name"
                required
                className="w-full px-5 py-3 border border-gray-400 rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Your Email"
                id="email"
                name="email"
                required
                className="w-full px-5 py-3 border border-gray-400 rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Your password"
                id="password"
                name="password"
                required
                className="w-full px-5 py-3 border border-gray-400 rounded-lg"
              />
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <ClientSubmitButton label="signup" />
              <p className="text-center">
                Already have an account?{" "}
                <Link href={"/login"} className="text-primary hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full h-full col-span-6 bg-linear-to-br from-primary to-[#0ea5e9] md:flex hidden justify-center items-center">
        <WelcomeAnimationComponent />
      </div>
    </section>
  );
}
