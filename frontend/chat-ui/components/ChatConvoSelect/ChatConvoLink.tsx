"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import cn from "classnames";

export const ChatConvoLink = ({
  convoID,
  title,
}: {
  convoID: string;
  title?: string;
}) => {
  const pathname = usePathname();
  const isCurrent = pathname === `/c/${convoID}`;
  return (
    <Link
      href={`/c/${convoID}`}
      className={cn("block py-2 px-3 rounded-lg border border-transparent", {
        "bg-gray-100": isCurrent,
        "hover:border-gray-200 ": !isCurrent,
      })}
    >
      {title && title !== "None" ? title.slice(0, 20) : convoID.slice(0, 18)}...
    </Link>
  );
};
