import Image from "next/image";
import Link from "next/link";
import React from "react";

interface LogoProps {
  showText?: boolean;
  imgSize?: number;
  className?: string;
}

const Logo = ({ showText = true, imgSize = 80, className = "" }: LogoProps) => {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <Image
        src="/images/mainIcon.png"
        width={imgSize}
        height={imgSize}
        alt="Lelib Icon"
        priority
      />
      {showText && (
        <h1 className="text-base md:text-2xl title">
          Lelib
        </h1>
      )}
    </Link>
  );
};

export default Logo;
