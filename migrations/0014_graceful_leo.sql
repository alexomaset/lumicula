CREATE TABLE IF NOT EXISTS "attachments" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"character_id" varchar(36) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(100) NOT NULL,
	"size" integer NOT NULL,
	"url" text NOT NULL,
	"storage_key" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "characters" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
