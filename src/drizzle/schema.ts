import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

const createdAt = timestamp("createdAt").defaultNow();
const updatedAt = timestamp("updatedAt")
  .defaultNow()
  .$onUpdateFn(() => new Date());


export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  googleId: text("googleId").unique(),
  createdAt,
  updatedAt,

});
