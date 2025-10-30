"use client";

import { useFormStatus } from "react-dom";

const ClientSubmitButton = ({ label }: { label: string }) => {
  const { pending } = useFormStatus();

  const base =
    label === "signup"
      ? { idle: "Sign Up", busy: "Signing up..." }
      : { idle: "Login", busy: "Logging in..." };

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      aria-busy={pending}
      className="w-full px-5 py-3 bg-primary rounded-lg text-white cursor-pointer hover:bg-primary/75 transition delay-75 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? base.busy : base.idle}
    </button>
  );
};

export default ClientSubmitButton;
