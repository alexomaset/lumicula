ALTER TABLE "chats" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "chats" DROP CONSTRAINT "chats_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chats" ADD CONSTRAINT "chats_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
