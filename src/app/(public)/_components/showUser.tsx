"use client";

import { useSession } from "@/provider/Session";

export default function ShowUser() {
  const { user } = useSession();

  return (
    <div>
      <p className="text-4xl md:text-5xl font-semibold mb-4 tracking-[.1rem] uppercase">
        {user.firstName}
      </p>
    </div>
  );
}
