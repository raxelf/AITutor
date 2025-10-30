import ClientChatBox from "@/components/ClientChatBox";
import LogoutButton from "@/components/LogoutButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat",
};

const OnboardingPage = () => {
  return (
    // container
    <main className="w-full min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-2xl mx-auto shadow-2xl rounded-2xl bg-white overflow-hidden">
        {/* Header */}
        <div className="w-full flex items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b border-gray-200 bg-white/60">
          <div className="font-bold text-2xl md:text-3xl">
            <span className="text-primary">Ja</span>
            <span className="text-secondary">Pi</span>
          </div>

          {/* logout */}
          <LogoutButton />
        </div>

        {/* body */}
        <div className="p-4 md:p-6 bg-white">
          <ClientChatBox />
        </div>
      </div>
    </main>
  );
};

export default OnboardingPage;
