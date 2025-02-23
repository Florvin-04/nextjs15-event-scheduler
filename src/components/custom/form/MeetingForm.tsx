"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import CustomFormFields from "./CustomFormFields";

import { createMeeting } from "@/app/(public)/action";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  cn,
  dateFormat,
  formatTimeString,
  formatTimezoneOffset,
} from "@/lib/utils";
import { meetingFormSchema, MeetingFormSchemaType } from "@/schema/meeting";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { isSameDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import SelectOptionItems from "../SelectItemOptions";

type DefaultValues = {
  validTimes: Date[];
  eventId: string;
  userId: string;
};

type Props = {
  defaultValues: DefaultValues;
};

export default function MeetingForm({ defaultValues }: Props) {
  const [isPending, startTransition] = useTransition();

  const {
    control: formControl,
    formState: { errors },
    handleSubmit,
    watch: formWatch,
  } = useForm<MeetingFormSchemaType>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  const timezone = formWatch("timezone");
  const formWatchDate = formWatch("date");
  const validTimesInTimezone = useMemo(() => {
    return defaultValues.validTimes.map((date) => {
      return toZonedTime(date, timezone);
    });
  }, [defaultValues.validTimes, timezone]);

  const handleSubmitForm = async (data: MeetingFormSchemaType) => {
    startTransition(async () => {
      const { error } = await createMeeting({
        ...data,
        eventId: defaultValues.eventId,
        userId: defaultValues.userId,
      });

      if (error) {
        toast.error("Something went wrong", {
          description: error,
        });
      }

      toast.success("Event created successfully");
    });
  };

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="space-y-4">
          <CustomFormFields
            label="Timezone"
            className=""
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

          <div className="flex flex-col gap-4 md:flex-row">
            <CustomFormFields
              className=""
              label="Date"
              type="customField"
              control={formControl}
              name="date"
              error={errors.date?.message}
              renderCustomField={({ field }) => {
                return (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal flex w-full",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          dateFormat({ date: field.value })
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          !validTimesInTimezone.some((time) =>
                            isSameDay(date, time)
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                );
              }}
            />

            <CustomFormFields
              label="Time"
              className=""
              type="customField"
              control={formControl}
              name="startTime"
              error={errors.startTime?.message}
              renderCustomField={({ field }) => {
                return (
                  <Select
                    disabled={formWatchDate == null || timezone == null}
                    onValueChange={(value) =>
                      field.onChange(new Date(Date.parse(value)))
                    }
                    defaultValue={field.value?.toISOString()}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          formWatchDate == null || timezone == null
                            ? "Select a date/timezone first"
                            : "Select a meeting time"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {validTimesInTimezone
                        .filter((time) => isSameDay(time, formWatchDate))
                        .map((time) => (
                          <SelectItem
                            key={time.toISOString()}
                            value={time.toISOString()}
                          >
                            {formatTimeString({
                              date: time,
                            })}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                );
              }}
            >
              {/* <SelectOptionItems
              items={validTimesInTimezone
                .filter((time) => isSameDay(time, formWatchDate))
                .map((time) => ({
                  value: time.toISOString(),
                  displayName: formatTimeString({
                    date: time,
                  }),
                }))}
            /> */}
            </CustomFormFields>
          </div>

          <div className="flex flex-col gap-4 md:flex-row">
            <CustomFormFields
              label="Name"
              className=""
              placeholder="Enter your name"
              type="text"
              control={formControl}
              name="guestName"
              error={errors.guestName?.message}
            />
            <CustomFormFields
              label="Email"
              className=""
              placeholder="Enter your email"
              type="text"
              control={formControl}
              name="guestEmail"
              error={errors.guestEmail?.message}
            />
          </div>

          <CustomFormFields
            label="Notes"
            className=""
            type="textarea"
            control={formControl}
            name="guestNotes"
            error={errors.guestNotes?.message}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button asChild disabled={isPending} type="button" variant="outline">
            <Link href={`/book/${defaultValues.userId}`}>Cancel</Link>
          </Button>

          <Button disabled={isPending} isLoading={isPending} type="submit">
            Book Event
          </Button>
        </div>
      </form>
    </>
  );
}
