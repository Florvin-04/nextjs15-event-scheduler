import { validateUserSession } from "@/auth";
import ScheduleForm from "@/components/custom/form/ScheduleForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/drizzle/db";

export default async function CreateSchedulePage() {
  const { user, redirect } = await validateUserSession();

  if (!user) {
    return redirect("/login");
  }

  const userSchedules = await db.query.ScheduleTable.findFirst({
    where: ({ userId }, { eq }) => eq(userId, user.id),
    with: {
      availabilities: true,
    },
  });

  // const defaultValues = {
  //   timezone: "asdas",
  //   Availabilities: [
  //     {
  //       daysOfWeek: "monday",
  //       startTime: "10:00",
  //       endTime: "12:00",
  //     },
  //   ],
  // };

  // console.log({ defaultValues });

  return (
    <div className="container py-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleForm defaultValues={userSchedules} />
        </CardContent>
      </Card>
    </div>
  );
}
