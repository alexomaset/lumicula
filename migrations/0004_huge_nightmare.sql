ALTER TABLE "accounts" RENAME TO "account";--> statement-breakpoint
ALTER TABLE "account" DROP CONSTRAINT "accounts_provider_providerAccountId_pk";--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "expires_at" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "createdAt";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "updatedAt";