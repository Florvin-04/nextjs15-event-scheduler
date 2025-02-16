import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
