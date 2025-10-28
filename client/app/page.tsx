"use client";

import Lottie from "lottie-react";
import learningAnimation from "../public/lotties/learning-onboarding.json";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-white min-h-screen grid grid-cols-1 md:grid-cols-12">
      {/* Left side */}
      <div className="w-full h-full col-span-6 flex flex-col">
        {/* LOGO */}
        <div className="font-bold p-4 text-3xl">
          <span className="text-primary">Ja</span>
          <span className="text-secondary">Pi</span>
        </div>

        {/* Welcoming */}
        <div className="w-full h-full flex justify-center items-center flex-col gap-6">
          <div className="flex flex-col text-center">
            <h1 className="font-bold text-4xl">
              Welcome to <span className="text-primary">Jadi</span>
              <span className="text-secondary">Pintar</span>
            </h1>
            <h2>Learn smarter, practice better with AI tutor.</h2>
          </div>

          {/* CTA */}
          <div className="flex justify-center items-center flex-col">
            <Link
              href={"/signup"}
              className="text-white bg-secondary px-5 py-3 rounded-xl cursor-pointer hover:bg-secondary/75 transition shadow-lg"
            >
              Let’s Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full h-full col-span-6 bg-linear-to-br from-primary to-[#0ea5e9] flex justify-center items-center">
        <Lottie
          animationData={learningAnimation}
          loop={true}
          className="w-[60%] h-full"
        />
      </div>
    </main>
  );
}
