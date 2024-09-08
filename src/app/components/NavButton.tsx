import { useState, MouseEventHandler, ReactNode, HTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/helpers/mergeFunction";

interface NavButtonProps extends HTMLAttributes<HTMLDivElement> {
  // Extend from HTMLAttributes
  type?: "sm" | "md" | "lg";
  link?: string;
  children?: ReactNode;
  isUnderline?: boolean;
  dropdown?: boolean;
  dropdownItems?: { label: string; link: string }[];
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
}

export default function NavButton({
  type,
  link,
  children,
  isUnderline,
  dropdown = false,
  dropdownItems = [],
  onClick,
  ...rest // Capture additional props
}: NavButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isUnderlined = isUnderline
    ? "relative after:bg-black after:absolute after:h-[2px] after:w-0 after:top-[38px] after:left-0 hover:after:w-full after:transition-all after:duration-300"
    : "";

  return (
    <div
      className={cn(
        `${isUnderlined} py-[9px] text-[18px] tracking-[.2em] uppercase my-[6px] mx-[14px] font-montserrat bg-transparent cursor-pointer relative group`,
        { "text-[10px]": type === "sm", "text-xs": type === "md" }
      )}
      onClick={onClick}
      onMouseEnter={() => dropdown && setIsHovered(true)}
      onMouseLeave={() => dropdown && setIsHovered(false)}
      {...rest} // Spread additional props onto the div
    >
      {link ? (
        <Link href={link} className="hover:text-black">
          {children}
        </Link>
      ) : (
        children
      )}

      {dropdown && isHovered && dropdownItems.length > 0 && (
        <ul className="absolute left-0 top-[40px] bg-white border text-[#454545] w-48 z-10 p-4">
          {dropdownItems.map((item, index) => (
            <Link key={index} href={item.link}>
              <li className="px-4 py-2">{item.label}</li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}
