"use client";

import Lottie from "lottie-react";
import learningAnimation from "../animations/learning-onboarding.json";

const WelcomeAnimationComponent = () => {
  return (
    <Lottie
      animationData={learningAnimation}
      loop={true}
      className="w-[60%] h-full"
    />
  );
};

export default WelcomeAnimationComponent;
