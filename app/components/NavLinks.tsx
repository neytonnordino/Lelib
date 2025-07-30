import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { twMerge } from "tailwind-merge";
import { navigationItems } from "../config/navigation";

interface NavLinksProps {
  className?: string;
  isMobile?: boolean;
  onMobileItemClick?: () => void; // Callback to close mobile menu
}

const NavLinks = ({
  className,
  isMobile = false,
  onMobileItemClick,
}: NavLinksProps) => {
  const pathname = usePathname();

  const handleItemClick = () => {
    if (isMobile && onMobileItemClick) {
      onMobileItemClick();
    }
  };

  return (
    <nav className={twMerge("", className)}>
      <ul
        className={twMerge(
          "flex items-center gap-2",
          isMobile && "flex-col items-start gap-2 w-full"
        )}
      >
        {navigationItems.map((item) => (
          <li
            key={item.label}
            className={twMerge(
              "hover:text-amber-300 transition-colors",
              isMobile && "w-full border-b border-gray-100 pb-2",
              pathname === item.href && "border-b-2 border-amber-300",
              isMobile && pathname === item.href && "text-amber-300 font-medium"
            )}
          >
            <Link
              href={item.href}
              onClick={handleItemClick}
              className={twMerge("block", isMobile && "text-lg py-2 w-full")}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavLinks;
