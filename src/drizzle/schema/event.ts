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
import { relations } from "drizzle-orm";

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

export const eventRelations = relations(EventTable, ({ one }) => ({
  user: one(users, {
    fields: [EventTable.userId],
    references: [users.id],
  }),
}));

export type EventTableType = typeof EventTable.$inferSelect;
