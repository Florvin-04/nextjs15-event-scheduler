import { CalendarPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function AddNewEventButton() {
  return (
    <Button className="cursor-pointer" asChild icon={<CalendarPlus />}>
      <Link href="/events/create">Add Event</Link>
    </Button>
  );
}
