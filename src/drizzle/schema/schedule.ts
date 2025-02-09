import { index, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { users } from "./users";
import { DAYS_OF_WEEK_IN_ORDER } from "@/lib/constants";
import { relations } from "drizzle-orm";

export const ScheduleTable = pgTable("schedule", {
  id,
  timezone: text("timezone").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id)
    .unique(),

  createdAt,
  updatedAt,
});

export const scheduleRelations = relations(ScheduleTable, ({ many }) => ({
  availabilities: many(ScheduleAvailabilityTable),
}));

export const scheduleDayOfWeekEnum = pgEnum("day", DAYS_OF_WEEK_IN_ORDER);

export const ScheduleAvailabilityTable = pgTable(
  "schedule_availabilities",
  {
    id,
    scheduleId: uuid("scheduleId")
      .notNull()
      .references(() => ScheduleTable.id, { onDelete: "cascade" }),
    startTime: text("startTime").notNull(),
    endTime: text("endTime").notNull(),
    createdAt,
    updatedAt,

    dayOfWeek: scheduleDayOfWeekEnum("dayOfWeek").notNull(),
  },
  (table) => ({
    scheduleIdIdx: index("scheduleIdIdx").on(table.scheduleId),
  })
);

export const scheduleAvailabilityRelations = relations(
  ScheduleAvailabilityTable,
  ({ one }) => ({
    schedule: one(ScheduleTable, {
      fields: [ScheduleAvailabilityTable.scheduleId],
      references: [ScheduleTable.id],
    }),
  })
);
