import { InferSelectModel } from 'drizzle-orm';
import {
  primaryKey,
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  serial,
  integer,
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';


export const users = pgTable('users', {
  id: text('id').$defaultFn(() => createId()).primaryKey().notNull(),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  role: text('role').default('user'),
});

export type User = InferSelectModel<typeof users>;


export const accounts = pgTable('account', {
  userId: text('userId').notNull(),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state')
})

export type accountsTable = InferSelectModel<typeof accounts>;


export const sessions = pgTable('sessions', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId').notNull(),
  expires: timestamp('expires').notNull()
})

export type Session = InferSelectModel<typeof sessions>;

export const verificationTokens = pgTable('verificationToken', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires').notNull()
}, (table) => ({
  compoundKey: primaryKey(table.identifier, table.token)
}))

export type verificationToken = InferSelectModel<typeof verificationTokens>;

export const chat = pgTable('Chat', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  message: text('message').notNull(),
  role: text('role').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export type Chat = InferSelectModel<typeof chat>;
