import ChatBox from "@/components/ChatBox";
import LogoutButton from "@/components/LogoutButton";

const OnboardingPage = () => {
  return (
    // container
    <main className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl mx-auto shadow-2xl rounded-2xl bg-white p-0 md:p-10">
        {/* Header */}
        <div className="w-full flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white/60 rounded-t-2xl">
          <div className="font-bold text-3xl">
            <span className="text-primary">Ja</span>
            <span className="text-secondary">Pi</span>
          </div>

          {/* logout */}
          <LogoutButton />
        </div>

        {/* body */}
        <div className="p-6 bg-white rounded-b-2xl">
          <ChatBox />
        </div>
      </div>
    </main>
  );
};

export default OnboardingPage;
