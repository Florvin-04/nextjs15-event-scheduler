import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { createdAt, updatedAt, id } from "../schemaHelpers";
import { users } from "./users";

export const EventTable = pgTable(
  "events",
  {
    id,
    name: text("name").notNull(),
    description: text("description").notNull(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id),
    isActive: boolean("isActive").notNull().default(true),
    duration: integer("duration").notNull(),
    createdAt,
    updatedAt,
  },
  (table) => ({
    userIdIndex: index("userIdIdx").on(table.userId),
  })
);

export type EventTableType = typeof EventTable.$inferSelect;
