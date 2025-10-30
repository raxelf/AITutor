"use client";

import { useSearchParams } from "next/navigation";

const ClientFlashComponent = () => {
  const searchParam = useSearchParams();
  const errorMessage = searchParam.get("error");
  const successMessage = searchParam.get("s");

  return (
    <>
      {errorMessage && (
        <p className="w-full px-5 py-3 bg-red-300 text-red-700 rounded-lg">
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p className="w-full px-5 py-3 bg-green-300 text-green-700 rounded-lg">
          {successMessage}
        </p>
      )}
    </>
  );
};

export default ClientFlashComponent;
