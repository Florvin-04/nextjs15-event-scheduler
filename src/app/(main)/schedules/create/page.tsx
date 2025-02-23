import { getSchedules } from "@/app/server/getSchedule";
import ScheduleForm from "@/components/custom/form/ScheduleForm";
import { withAuth } from "@/components/custom/withAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/drizzle/schema";

async function CreateSchedulePage({ user }: { user: User }) {
  const userSchedules = await getSchedules(user.id);

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

export default withAuth(CreateSchedulePage);
