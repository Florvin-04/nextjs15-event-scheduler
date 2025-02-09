"use client";

import { Button } from "@/components/ui/button";
import { deleteEvent } from "../action";
import { toast } from "sonner";
import { useTransition } from "react";

type Props = {
  eventId: string;
};

export default function DeleteEventButton({ eventId }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleDeleteEvent = () => {
    startTransition(async () => {
      const { error } = await deleteEvent(eventId);

      if (error) {
        toast.error(error);
      }

      toast.success("Event deleted successfully");
    });
  };

  return (
    <Button
      isLoading={isPending}
      disabled={isPending}
      variant="destructive"
      onClick={handleDeleteEvent}
    >
      Delete
    </Button>
  );
}
