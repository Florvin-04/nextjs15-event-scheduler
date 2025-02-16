"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Fragment, useEffect, useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import CustomFormFields from "./CustomFormFields";

import { createSchedule } from "@/app/(main)/schedules/action";
import { DayOfWeekType, DAYS_OF_WEEK_IN_ORDER } from "@/lib/constants";
import { formatTimezoneOffset, timeToInt } from "@/lib/utils";
import { ScheduleFormSchemaType, scheduleSFormSchema } from "@/schema/schedule";
import { Plus, X } from "lucide-react";
import SelectOptionItems from "../SelectItemOptions";
import FormMessage from "./FormMessage";

type Props = {
  defaultValues?: ScheduleFormSchemaType;
};

const groupBy = <T, K extends string | number>(
  array: T[],
  getKey: (item: T) => K
): Record<K, T[]> =>
  array.reduce((acc, item) => {
    const key = getKey(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);

export default function ScheduleForm({ defaultValues }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false); // to avoid hydration error
  const {
    control: formControl,
    formState: { errors, isDirty },
    trigger,
    handleSubmit,
    clearErrors,
  } = useForm<ScheduleFormSchemaType>({
    resolver: zodResolver(scheduleSFormSchema),
    defaultValues: {
      timezone:
        defaultValues?.timezone ??
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      availabilities: defaultValues?.availabilities?.toSorted((a, b) => {
        return timeToInt(a.startTime) - timeToInt(b.endTime);
      }),
    },
    mode: "onChange",
  });

  const {
    append: addAvailability,
    remove: removeAvailability,
    fields: availabilityFields,
  } = useFieldArray({
    name: "availabilities",
    control: formControl,
  });

  // const groupAvailabilityFields = Object.groupBy(
  //   AvailabilityFields.map(
  //     (field, index) => ({ ...field, index }),
  //     (Availability) => Availability.daysOfWeek
  //   )
  // );

  // *use this once stable and available
  // const groupedAvailabilityFields = Object.groupBy(
  //   availabilityFields.map((field, index) => ({ ...field, index })),
  //   (availability) => availability.dayOfWeek
  // );

  // const groupedAvailabilityFields = _.groupBy(
  //   availabilityFields.map((field, index) => ({ ...field, index })),
  //   (availability) => availability.dayOfWeek
  // );

  // const groupedAvailabilityFields = useMemo(() => {
  //   if (typeof window === "undefined") return {}; //
  //   return _.groupBy(
  //     availabilityFields.map((field, index) => ({ ...field, index })),
  //     (availability) => availability.dayOfWeek.toString()
  //   );
  // }, [availabilityFields]); // Ensures stable value across renders

  const handleCreateSchedule = async (data: ScheduleFormSchemaType) => {
    startTransition(async () => {
      const { error } = await createSchedule(data);
      if (error) {
        toast.error("Something went wrong", {
          description: error,
        });
      }
      toast.success("Schedule saved successfully");
    });
  };

  // const handleUpdateEvent = async ({
  //   eventData,
  //   eventId,
  // }: {
  //   eventData: ScheduleFormSchemaType;
  //   eventId: string;
  // }) => {
  //   // startTransition(async () => {
  //   //   const { error } = await updateEvent({
  //   //     eventData,
  //   //     eventId,
  //   //   });
  //   //   if (error) {
  //   //     toast.error("Something went wrong", {
  //   //       description: error,
  //   //     });
  //   //   }
  //   // });
  // };

  const handleSubmitForm = async (data: ScheduleFormSchemaType) => {
    // if (defaultValues) {
    //   handleUpdateEvent({ eventData: data, eventId: defaultValues.id });
    //   return;
    // }

    console.log({ data });

    handleCreateSchedule(data);
  };

  const groupedAvailabilityFields = groupBy(
    availabilityFields.map((field, index) => ({
      ...field,
      dayOfWeek: field.dayOfWeek as DayOfWeekType,
      index,
    })),
    (availability) => availability.dayOfWeek as DayOfWeekType
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="space-y-4">
          <CustomFormFields
            className="w-fit min-w-[180px]"
            type="select"
            control={formControl}
            name="timezone"
            error={errors.timezone?.message}
          >
            <SelectOptionItems
              items={Intl.supportedValuesOf("timeZone").map((timezone) => ({
                value: timezone,
                displayName: `${timezone}  (${formatTimezoneOffset(timezone)})`,
              }))}
            />
          </CustomFormFields>

          <div className="grid grid-cols-[auto,1fr] gap-y-6 gap-x-4">
            {DAYS_OF_WEEK_IN_ORDER.map((day) => {
              return (
                <Fragment key={day}>
                  <div className="font-bold capitalize self-center">
                    {day.substring(0, 3)}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      icon={<Plus />}
                      onClick={() =>
                        addAvailability({
                          dayOfWeek: day,
                          endTime: "12:00",
                          startTime: "10:00",
                        })
                      }
                    />

                    {isMounted &&
                      groupedAvailabilityFields[day]?.map(
                        (field, labelIndex) => {
                          return (
                            <div key={field.id}>
                              <div className="flex gap-2 items-center">
                                <CustomFormFields
                                  aria-label={`${field.dayOfWeek} start time ${
                                    labelIndex + 1
                                  }`}
                                  className="w-24"
                                  type="text"
                                  control={formControl}
                                  name={`availabilities.${field.index}.startTime`}
                                />

                                {" - "}

                                <CustomFormFields
                                  aria-label={`${field.dayOfWeek} start time ${
                                    labelIndex + 1
                                  }`}
                                  className="w-24"
                                  type="text"
                                  control={formControl}
                                  name={`availabilities.${field.index}.endTime`}
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="destructiveGhost"
                                  icon={<X />}
                                  onClick={() => {
                                    trigger("availabilities");
                                    removeAvailability(field.index);
                                    clearErrors("availabilities");
                                  }}
                                />
                              </div>
                              <FormMessage
                                message={
                                  errors.availabilities?.at?.(field.index)?.root
                                    ?.message || ""
                                }
                                isError
                              />

                              <FormMessage
                                message={
                                  errors.availabilities?.at?.(field.index)
                                    ?.startTime?.message || ""
                                }
                                isError
                              />
                              <FormMessage
                                message={
                                  errors.availabilities?.at?.(field.index)
                                    ?.endTime?.message || ""
                                }
                                isError
                              />
                            </div>
                          );
                        }
                      )}
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button asChild disabled={isPending} type="button" variant="outline">
            <Link href="/schedules">Cancel</Link>
          </Button>

          <Button
            disabled={isPending || !isDirty}
            isLoading={isPending}
            type="submit"
          >
            {defaultValues ? "Update Schedule" : "Save Schedule"}
          </Button>
        </div>
      </form>

      {/* {defaultValues && (
        <DeleteAlertDialog
          actionButton={<DeleteEventButton eventId={defaultValues.id} />}
          open={isDeleteDialogOpen}
          setOpen={setIsDeleteDialogOpen}
        />
      )} */}
    </>
  );
}
