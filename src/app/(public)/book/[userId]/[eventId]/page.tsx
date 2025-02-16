import { db } from "@/drizzle/db";

type Props = {
  params: Promise<{ userId: string; eventId: string }>;
};

export default async function PublicEventPage({ params }: Props) {
  const paramsData = await params;

  const event = await db.query.EventTable.findFirst({
    where: (event, { eq, and }) =>
      and(
        eq(event.id, paramsData.eventId),
        eq(event.userId, paramsData.userId),
        eq(event.isActive, true)
      ),
  });

  console.log({ event });

  return (
    <div>
      <h1>Public book page</h1>
      <p>{paramsData.userId}</p>
      <p>{paramsData.eventId}</p>
    </div>
  );
}
