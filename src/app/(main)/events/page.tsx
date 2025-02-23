import AddNewEventButton from "@/components/custom/AddNewEventButton";
import CopyButton from "@/components/custom/CopyButton";
import { withAuth } from "@/components/custom/withAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { EventTableType, User } from "@/drizzle/schema";
import { cn, formatMinsDurationToHrs } from "@/lib/utils";
import Link from "next/link";
import DeleteEventButtonParent from "./_components/DeleteEventButtonParent";

async function EventsPage({ user }: { user: User }) {
  const events = await db.query.EventTable.findMany({
    where: ({ userId }, { eq }) => eq(userId, user.id),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
  });

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[30rem] gap-3">
        <p className="text-sm text-muted-foreground">
          You don&apos;t have any events yet.
        </p>
        <AddNewEventButton />
      </div>
    );
  }

  return (
    <div className="container py-4 space-y-4">
      <div className="flex items-baseline gap-2">
        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-semibold self-start">
          Events
        </h1>
        <AddNewEventButton />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

export default withAuth(EventsPage);

function EventCard({ event }: { event: EventTableType }) {
  const { name, description, duration, isActive } = event;
  return (
    <Card className={cn("flex flex-col p-4", !isActive && "border-opacity-50")}>
      <CardTitle
        title={name}
        className={cn("truncate", !isActive && "opacity-50")}
      >
        {name}
      </CardTitle>
      <CardDescription className={cn(!isActive && "opacity-50")}>
        <p className="text-sm text-muted-foreground">
          {formatMinsDurationToHrs(duration)}
        </p>
      </CardDescription>
      {description && (
        <CardContent className={cn("p-0", !isActive && "opacity-50")}>
          <p className="text-sm text-muted-foreground min-w-0 break-words">
            {description}
          </p>
        </CardContent>
      )}
      <CardFooter className="p-0 mt-auto pt-4">
        <div className="flex justify-end gap-2 w-full">
          {isActive && (
            <CopyButton
              variant="outline"
              textToCopy={`/book/${event.userId}/${event.id}`}
              isUrl
            />
          )}

          <Button asChild>
            <Link href={`/events/${event.id}/edit`}>Edit</Link>
          </Button>

          <DeleteEventButtonParent id={event.id} />
        </div>
      </CardFooter>
    </Card>
  );
}
