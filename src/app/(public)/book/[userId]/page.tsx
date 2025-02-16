import { db } from "@/drizzle/db";
import { notFound } from "next/navigation";
import ShowClientComponent from "@/components/custom/showClientComponent";
import ShowUser from "../../_components/showUser";
import { EventTableType } from "@/drizzle/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatMinsDurationToHrs } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function PublicBookingPage({ params }: Props) {
  const { userId } = await params;

  const eventsBooking = await db.query.EventTable.findMany({
    where: (event, { eq, and }) =>
      and(eq(event.userId, userId), eq(event.isActive, true)),
    orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
  });

  if (!eventsBooking.length) {
    return notFound();
  }

  return (
    <div className="container">
      <div className="text-center py-4">
        <ShowClientComponent>
          <ShowUser />
          <p className="text-sm opacity-80">Welcome Message Here</p>
        </ShowClientComponent>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4">
        {eventsBooking.map((event) => {
          return <PublicEventCard key={event.id} event={event} />;
        })}
      </div>
    </div>
  );
}

function PublicEventCard({ event }: { event: EventTableType }) {
  const { name, description, duration, isActive } = event;
  return (
    <Card className={cn("flex flex-col p-4")}>
      <CardTitle title={name} className={cn("truncate")}>
        {name}
      </CardTitle>
      <CardDescription className={cn(!isActive && "opacity-50")}>
        <p className="text-sm text-muted-foreground">
          {formatMinsDurationToHrs(duration)}
        </p>
      </CardDescription>
      {description && (
        <CardContent className={cn("p-0")}>
          <p className="text-sm text-muted-foreground min-w-0 break-words">
            {description}
          </p>
        </CardContent>
      )}
      <CardFooter className="p-0 mt-auto pt-4">
        <div className="flex justify-end gap-2 w-full">
          <Button asChild>
            <Link href={`/book/${event.userId}/${event.id}`}>Select</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
