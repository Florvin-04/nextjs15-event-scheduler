"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

export default function Navlink({
  className,
  ...props
}: ComponentProps<typeof Link>) {
  const pathname = usePathname();

  const isActive = pathname === props.href;

  return (
    <Link
      className={cn(
        "transition-colors hover:text-foreground text-muted-foreground",
        isActive && "text-foreground",
        className
      )}
      {...props}
    >
      {props.children}
    </Link>
  );
}
