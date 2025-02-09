"use client";

import { useForm } from "react-hook-form";
import { EventFormSchemaType, eventFormSchemaZod } from "@/schema/events";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomFormFields from "./CustomFormFields";
import { Button } from "@/components/ui/button";
import { createEvent, updateEvent } from "@/app/(main)/events/action";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import Link from "next/link";

import { EventTableType } from "@/drizzle/schema";
import DeleteEventButton from "@/app/(main)/events/_components/DeleteEventButton";
import DeleteAlertDialog from "../DeleteAlertDialog";

type Props = {
  defaultValues?: EventTableType;
};

export default function AddEventForm({ defaultValues }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<EventFormSchemaType>({
    resolver: zodResolver(eventFormSchemaZod),
    defaultValues: {
      name: defaultValues?.name ?? "",
      isActive: defaultValues?.isActive ?? true,
      duration: defaultValues?.duration ?? 30,
      ...(defaultValues?.description && {
        description: defaultValues.description,
      }),
    },
  });

  const handleCreateEvent = async (data: EventFormSchemaType) => {
    startTransition(async () => {
      const { error } = await createEvent(data);

      if (error) {
        toast.error("Something went wrong", {
          description: error,
        });
      }

      toast.success("Event created successfully");
    });
  };

  const handleUpdateEvent = async ({
    eventData,
    eventId,
  }: {
    eventData: EventFormSchemaType;
    eventId: string;
  }) => {
    startTransition(async () => {
      const { error } = await updateEvent({
        eventData,
        eventId,
      });

      if (error) {
        toast.error("Something went wrong", {
          description: error,
        });
      }
    });
  };

  const handleSubmitForm = async (data: EventFormSchemaType) => {
    if (defaultValues) {
      handleUpdateEvent({ eventData: data, eventId: defaultValues.id });
      return;
    }

    handleCreateEvent(data);
  };

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="space-y-4">
          <CustomFormFields
            control={control}
            type="text"
            name="name"
            error={errors.name?.message}
            label="Event Name"
            placeholder="Event Name"
          />

          <CustomFormFields
            control={control}
            type="number"
            name="duration"
            error={errors.duration?.message}
            label="Duration (minutes)"
            placeholder="Duration in minutes"
          />

          <CustomFormFields
            className="h-[10rem] min-h-[10rem] resize-none"
            control={control}
            type="textarea"
            name="description"
            error={errors.description?.message}
            label="Description (optional)"
            placeholder="Description"
          />

          <CustomFormFields
            className="h-[10rem] min-h-[10rem] resize-none"
            control={control}
            type="switch"
            name="isActive"
            error={errors.isActive?.message}
            label="Active"
            placeholder="Active"
            description="If the event is active, it will be shown in the events list."
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button asChild disabled={isPending} type="button" variant="outline">
            <Link href="/events">Cancel</Link>
          </Button>

          <Button disabled={isPending} isLoading={isPending} type="submit">
            {defaultValues ? "Update Event" : "Add Event"}
          </Button>

          {defaultValues && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          )}
        </div>
      </form>

      {defaultValues && (
        <DeleteAlertDialog
          actionButton={<DeleteEventButton eventId={defaultValues.id} />}
          open={isDeleteDialogOpen}
          setOpen={setIsDeleteDialogOpen}
        />
      )}
    </>
  );
}
