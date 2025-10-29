import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const LogoutButton = () => {
  const doLogout = async () => {
    "use server";
    const cookieStorage = await cookies();

    cookieStorage.delete("token");

    redirect("/login");
  };

  return (
    <form
      action={doLogout}
      className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded-full transition"
    >
      <button type="submit" className="flex items-center cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-primary"
        >
          <path d="M5 22C4.44772 22 4 21.5523 4 21V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V6H18V4H6V20H18V18H20V21C20 21.5523 19.5523 22 19 22H5ZM18 16V13H11V11H18V8L23 12L18 16Z"></path>
        </svg>
      </button>
    </form>
  );
};

export default LogoutButton;
