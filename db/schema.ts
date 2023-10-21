import { relations } from "drizzle-orm";
import { sqliteTable, integer, text, unique } from "drizzle-orm/sqlite-core";

/**
 * Table Definitions
 */

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique().notNull(),
});

export const conversations = sqliteTable("conversations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  body: text("body").notNull(),
  conversationId: integer("conversation_id")
    .notNull()
    .references(() => conversations.id),
  senderId: integer("sender_id")
    .notNull()
    .references(() => users.id),
});

export const participants = sqliteTable(
  "participants",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    conversationId: integer("conversation_id")
      .notNull()
      .references(() => conversations.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => ({
    participantUniqueConstraint: unique("participant_unique_constraint").on(
      table.conversationId,
      table.userId
    ),
  })
);

/**
 * Table Relationships
 */

export const userRelations = relations(users, ({ many }) => ({
  messages: many(messages),
  participants: many(participants),
}));

export const conversationRelations = relations(conversations, ({ many }) => ({
  messages: many(messages),
  participants: many(participants),
}));

export const messageRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const participantRelations = relations(participants, ({ one }) => ({
  conversation: one(conversations, {
    fields: [participants.conversationId],
    references: [conversations.id],
  }),
  user: one(users, {
    fields: [participants.userId],
    references: [users.id],
  }),
}));
