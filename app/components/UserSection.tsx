import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import LogOut from "../components/signOut";
import Button from "../components/Button";
import Avatar from "../components/Avatar";
import { twMerge } from "tailwind-merge";
import UserDropdown from "./UserDropdown";

interface UserSectionProps {
  isMobile?: boolean;
  className?: string;
}

const UserSection = ({ isMobile = false, className }: UserSectionProps) => {
  const { data: session, status } = useSession();

  // Show loading state during initial load to prevent hydration mismatch
  if (status === "loading") {
    return (
      <div
        className={twMerge(
          "animate-pulse rounded-3xl bg-gradient-to-r from-amber-300 to bg-amber-500 transition-colors duration-75",
          isMobile ? "w-full h-12" : "w-20 h-10"
        )}
      ></div>
    );
  }

  if (!session) {
    return (
      <Button
        className={twMerge(
          "bg-gradient-to-r from-amber-200 to-amber-500 hover:bg-gradient-to-l hover:scale-95 transition-all ease-in-out duration-200",
          isMobile ? "w-full px-8" : "hidden md:inline-flex",
          className
        )}
      >
        <Link
          href="/signin"
          className="text-[12px] md:text-base whitespace-nowrap"
        >
          Log in
        </Link>
      </Button>
    );
  }

  const userName = session.user?.name || session.user?.email || "User";
  const userInitial = userName.charAt(0).toUpperCase();
  const userImage = session.user?.image;

  return (
    <div
      className={twMerge(
        "flex items-center gap-4",
        isMobile && "flex-col gap-4 w-full"
      )}
    >
      {!isMobile ? (
        <UserDropdown />
      ) : (
        <>
          <div className="flex items-center gap-3 w-full">
            <Avatar>
              {userImage ? (
                <Image
                  src={userImage}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-amber-500 flex items-center justify-center text-white font-semibold rounded-full">
                  {userInitial}
                </div>
              )}
            </Avatar>
            <span className="text-lg font-medium text-gray-800">
              {userName}
            </span>
          </div>
          <LogOut className="w-full" />
        </>
      )}
    </div>
  );
};

export default UserSection;
