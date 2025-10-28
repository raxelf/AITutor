"use client";

import { useSearchParams } from "next/navigation";

const ClientFlashComponent = () => {
  const searchParam = useSearchParams();
  const errorMessage = searchParam.get("error");

  return (
    <>
      {errorMessage && (
        <p className="w-full px-5 py-3 bg-red-300 text-red-700 rounded-lg">
          {errorMessage}
        </p>
      )}
    </>
  );
};

export default ClientFlashComponent;
