import { getGoogleCalendarEvents } from "@/app/server/googleCalendar";
import { ScheduleAvailabilityTableType } from "@/drizzle/schema";
import { clsx, type ClassValue } from "clsx";
import {
  addMinutes,
  areIntervalsOverlapping,
  isFriday,
  isMonday,
  isSaturday,
  isSunday,
  isThursday,
  isTuesday,
  isWednesday,
  isWithinInterval,
  setHours,
  setMinutes,
} from "date-fns";
import { twMerge } from "tailwind-merge";
import { DayOfWeekType } from "./constants";

import { getSchedules } from "@/app/server/getSchedule";
import { OAuth2Tokens } from "arctic";
import { fromZonedTime } from "date-fns-tz";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMinsDurationToHrs(duration: number) {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  const minutesString = `${minutes}${minutes > 1 ? "mins" : "min"}`;
  const hoursString = `${hours}${hours > 1 ? "hrs" : "hr"}`;

  if (minutes === 0) {
    return hoursString;
  }

  if (hours === 0) {
    return minutesString;
  }

  return `${hoursString} ${minutesString}`;
}

export function timeToInt(time: string) {
  return parseFloat(time.replace(":", "."));
}

export function formatTimezoneOffset(timezone: string) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    timeZoneName: "shortOffset",
  })
    .formatToParts(new Date())
    .find((part) => part.type === "timeZoneName")?.value;
}

export const groupBy = <T, K extends string | number>(
  array: T[],
  getKey: (item: T) => K
): Record<K, T[]> =>
  array.reduce((acc, item) => {
    const key = getKey(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);

export async function getValidTimesFromSchedule({
  event,
  timesInOrder,
  token,
}: {
  timesInOrder: Date[];
  token: OAuth2Tokens;
  event: { userId: string; durationInMinutes: number };
}) {
  const start = timesInOrder[0];
  const end = timesInOrder.at(-1);

  if (!start || !end) {
    return [];
  }

  const schedule = await getSchedules(event.userId);

  if (!schedule) {
    return [];
  }

  const groupedAvailabilities = groupBy(
    schedule.availabilities,
    (availability) => availability.dayOfWeek
  );

  const calendarEvents = await getGoogleCalendarEvents({
    token,
    startDate: start,
    endDate: end,
  });

  const timeInOrder = timesInOrder.filter((date) => {
    const availabilities = getAvailabilities({
      groupedAvailabilities,
      date,
      timezone: schedule.timezone,
    });

    const intervalEvent = {
      start: date,
      end: addMinutes(date, event.durationInMinutes),
    };

    const overlapSlot = calendarEvents.every((event) => {
      return !areIntervalsOverlapping(event, intervalEvent);
    });

    const checkAvailability = availabilities.some((availability) => {
      return (
        isWithinInterval(intervalEvent.start, {
          start: availability.startTime,
          end: availability.endTime,
        }) &&
        isWithinInterval(intervalEvent.end, {
          end: availability.endTime,
          start: availability.startTime,
        })
      );
    });

    return overlapSlot && checkAvailability;
  });

  return timeInOrder;
}

type GroupedAvailabilitiesType = Partial<
  Record<DayOfWeekType, ScheduleAvailabilityTableType[]>
>;

function getAvailabilities({
  groupedAvailabilities,
  date,
  timezone,
}: {
  groupedAvailabilities: GroupedAvailabilitiesType;
  date: Date;
  timezone: string;
}) {
  let availabilities: ScheduleAvailabilityTableType[] | undefined;

  if (isMonday(date)) {
    availabilities = groupedAvailabilities.monday;
  }
  if (isTuesday(date)) {
    availabilities = groupedAvailabilities.tuesday;
  }
  if (isWednesday(date)) {
    availabilities = groupedAvailabilities.wednesday;
  }
  if (isThursday(date)) {
    availabilities = groupedAvailabilities.thursday;
  }
  if (isFriday(date)) {
    availabilities = groupedAvailabilities.friday;
  }
  if (isSaturday(date)) {
    availabilities = groupedAvailabilities.saturday;
  }
  if (isSunday(date)) {
    availabilities = groupedAvailabilities.sunday;
  }

  if (!availabilities) {
    return [];
  }

  const availableTime = availabilities.map((availability) => {
    const startTime = convertTimezoneToUtc({
      date,
      time: availability.startTime,
      timezone,
    });
    const endTime = convertTimezoneToUtc({
      date,
      time: availability.endTime,
      timezone,
    });

    return { startTime, endTime };
  });

  return availableTime;
}

// time shoudl be in the format of "HH:MM"
function convertTimezoneToUtc({
  date,
  time,
  timezone,
}: {
  time: string;
  timezone: string;
  date: Date;
}): Date {
  const timeToHours = parseInt(time.split(":")[0]);
  const timeToMinues = parseInt(time.split(":")[1]);

  const hours = setHours(date, timeToHours);
  const minutes = setMinutes(hours, timeToMinues);

  return fromZonedTime(minutes, timezone);
}

type DateStyleType = Intl.DateTimeFormatOptions["dateStyle"];
type TimeStyleType = Intl.DateTimeFormatOptions["timeStyle"];

export function dateFormat({
  date,
  dateStyle = "medium",
}: {
  date: Date;
  dateStyle?: DateStyleType;
  timeStyle?: TimeStyleType;
}) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle,
  }).format(date);
}

export function formatTimeString({
  date,
  timeStyle = "short",
}: {
  date: Date;
  timeStyle?: TimeStyleType;
}) {
  return new Intl.DateTimeFormat(undefined, {
    timeStyle,
  }).format(date);
}
