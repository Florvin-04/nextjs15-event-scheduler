import { google as googleAuth } from "@/auth";
import MeetingForm from "@/components/custom/form/MeetingForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { cn, getValidTimesFromSchedule } from "@/lib/utils";
import {
  addMonths,
  eachMinuteOfInterval,
  endOfDay,
  roundToNearestMinutes,
} from "date-fns";
import { notFound } from "next/navigation";

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

    with: {
      user: {
        columns: {
          firstName: true,
          lastName: true,
          googleRT: true,
        },
      },
    },
  });

  if (event == null || event.user.googleRT == null) return notFound();

  const token = await googleAuth.refreshAccessToken(event.user.googleRT);

  const eventPayload = {
    userId: event.userId,
    durationInMinutes: event.duration,
  };

  // rounde the current date to the nearest 15 minutes
  const startDate = roundToNearestMinutes(new Date(), {
    nearestTo: 15,
    roundingMethod: "ceil",
  });

  // get the end date of the current date in 2 months
  const endDate = endOfDay(addMonths(startDate, 2));

  const interval = eachMinuteOfInterval(
    { start: startDate, end: endDate },
    { step: 15 }
  );

  const validTime = await getValidTimesFromSchedule({
    event: eventPayload,
    timesInOrder: interval,
    token,
  });

  if (validTime.length === 0) {
    return <div>No Avaible time slots</div>;
  }

  return (
    <div className="container py-4 space-y-4">
      <Card className={cn("flex flex-col p-4")}>
        <CardTitle title={event.name} className={cn("truncate")}>
          {`Book "${event.name}" with ${event.user.firstName} ${event.user.lastName}`}
        </CardTitle>
        <CardDescription>
          <p className="text-sm text-muted-foreground">
            {/* {formatMinsDurationToHrs(duration)} */}
          </p>
        </CardDescription>

        <CardContent className={cn("p-0 space-y-4 pt-4")}>
          <MeetingForm
            defaultValues={{
              eventId: event.id,
              userId: event.userId,
              validTimes: validTime,
            }}
          />
        </CardContent>
        {/* <CardFooter className="p-0 mt-auto pt-4">
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
      </CardFooter> */}
      </Card>
    </div>
  );
}
