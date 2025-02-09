import { validateUserSession } from "@/auth";
import AddEventForm from "@/components/custom/form/AddEvent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/drizzle/db";

type Props = {
  params: Promise<{ eventId: string }>;
};

export default async function EditEventPage({ params }: Props) {
  const { eventId } = await params;
  const { user, redirect } = await validateUserSession();

  if (!user) {
    return redirect("/login");
  }

  const event = await db.query.EventTable.findFirst({
    where: (event, { eq, and }) =>
      and(eq(event.id, eventId), eq(event.userId, user.id)),
  });

  if (!event) {
    return redirect("/events");
  }

  return (
    <div className="container py-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Event</CardTitle>
        </CardHeader>
        <CardContent>
          <AddEventForm defaultValues={event} />
        </CardContent>
      </Card>
    </div>
  );
}
