import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, updatedAt, id } from "../schemaHelpers";

export const users = pgTable("users", {
  id,
  email: text("email").notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  googleId: text("googleId").unique(),
  createdAt,
  updatedAt,
});

export type UserFromDB = typeof users.$inferSelect;

export type User = Pick<UserFromDB, "id" | "email" | "firstName" | "lastName">;
