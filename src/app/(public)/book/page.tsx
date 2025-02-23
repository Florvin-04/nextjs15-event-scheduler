import PublicUserCard from "@/components/custom/publicUserCard";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";

export default async function PublicBookToUser() {
  const allUsers = await db
    .select({ id: users.id, name: users.firstName })
    .from(users);

  return (
    <div className="container py-4">
      <h1 className="text-center text-2xl font-semibold">
        Select To Book An Event
      </h1>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] pt-4">
        {allUsers.map((user) => {
          return <PublicUserCard key={user.id} user={user} />;
        })}
      </div>
    </div>
  );
}
