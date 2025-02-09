export const COOKIE_NAME = "auth_session_event_app";

export const DAYS_OF_WEEK_IN_ORDER = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK_IN_ORDER)[number];
