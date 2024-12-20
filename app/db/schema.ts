import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import {
  primaryKey,
  pgTable,
  varchar,
  timestamp,
  text,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { createId } from '@paralleldrive/cuid2';


export const characters = pgTable('characters', {
  id: varchar('id', { length: 36 }).$defaultFn(() => createId()).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  profileImage: varchar('profile_image', { length: 512 }),
  languageStyle: text('language_style'),
  coreTraits: jsonb('core_traits').$type<Array<{title: string, description: string}>>(),
  prompts: jsonb('prompts').$type<Array<{
    category: string, 
    prompt: string, 
    exampleResponse: string
  }>>(),
  dosAndDonts: jsonb('dos_and_donts').$type<{
    dos: string[],
    donts: string[]
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdateFn(() => new Date()),
});

export type Character = InferSelectModel<typeof characters>;
export type NewCharacter = InferInsertModel<typeof characters>;


export const users = pgTable('users', {
  id: text('id').$defaultFn(() => createId()).primaryKey().notNull(),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  role: text('role').default('user'),
  createdAt: timestamp("created_at").defaultNow(),
});

export type User = InferSelectModel<typeof users>;
// For fetched user data
export type NewUser = InferSelectModel<typeof users>


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

export type accounts = InferSelectModel<typeof accounts>;


export const sessions = pgTable('sessions', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId').notNull(),
  expires: timestamp('expires').notNull()
})

export type Sessions = InferSelectModel<typeof sessions>;

export const verificationTokens = pgTable('verificationToken', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires').notNull()
}, (table) => ({
  compoundKey: primaryKey(table.identifier, table.token)
}))

export type verificationToken = InferSelectModel<typeof verificationTokens>;

export const chat = pgTable('chats', {
  // Use uuid for more robust identifier
  id: text('id').primaryKey(),
  
  // Foreign key to users
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  
  // Store messages as JSONB for flexible storage
  messages: jsonb('messages').$type<any[]>().notNull(),
  
  // Metadata fields
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  
  // Optional: character or context identifier
  characterId: text('character_id'),
});


export type Chat = InferSelectModel<typeof chat>;

// Relation to users table
export const chatRelations = relations(chat, ({ one }) => ({
  user: one(users, {
    fields: [chat.userId],
    references: [users.id]
  })
}));

// Type definition
export type NewChat = InferSelectModel<typeof chat>;
