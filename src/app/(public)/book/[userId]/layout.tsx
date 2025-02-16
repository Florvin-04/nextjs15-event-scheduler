import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import SessionProvider from "@/provider/Session";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

type ParamsType = Promise<{ userId: string }>;

export default async function PublicBookingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: ParamsType;
}) {
  const paramsData = await params;

  const user = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(users)
    .where(eq(users.id, paramsData.userId))
    .limit(1);

  if (!user.length) {
    return notFound();
  }

  return (
    <SessionProvider value={{ user: user[0] }}>{children}</SessionProvider>
  );
}
