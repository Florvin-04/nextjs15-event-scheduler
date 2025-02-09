import AddEventForm from "@/components/custom/form/AddEvent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateEventPage() {
  return (
    <div className="container py-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
        </CardHeader>
        <CardContent>
          <AddEventForm />
        </CardContent>
      </Card>
    </div>
  );
}
