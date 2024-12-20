DROP TABLE "attachments" CASCADE;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "profile_image" varchar(512);--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "language_style" text;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "core_traits" jsonb;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "prompts" jsonb;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "dos_and_donts" jsonb;