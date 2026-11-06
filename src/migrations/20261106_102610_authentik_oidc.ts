import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Editors sign in through Authentik: the password, reset and lockout columns
// and the session table go, `sub` holds Authentik's user ID. Existing rows
// keep their email, which is what a first Authentik login matches on.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  ALTER TABLE "users" DROP COLUMN "reset_password_token";
  ALTER TABLE "users" DROP COLUMN "reset_password_expiration";
  ALTER TABLE "users" DROP COLUMN "salt";
  ALTER TABLE "users" DROP COLUMN "hash";
  ALTER TABLE "users" DROP COLUMN "reset_password_requested_at";
  ALTER TABLE "users" DROP COLUMN "login_attempts";
  ALTER TABLE "users" DROP COLUMN "lock_until";
  ALTER TABLE "users" ADD COLUMN "sub" varchar;
  CREATE INDEX "users_sub_idx" ON "users" USING btree ("sub");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "users_sub_idx";
  ALTER TABLE "users" DROP COLUMN "sub";
   CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  ALTER TABLE "users" ADD COLUMN "reset_password_token" varchar;
  ALTER TABLE "users" ADD COLUMN "reset_password_expiration" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "salt" varchar;
  ALTER TABLE "users" ADD COLUMN "hash" varchar;
  ALTER TABLE "users" ADD COLUMN "reset_password_requested_at" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "login_attempts" numeric DEFAULT 0;
  ALTER TABLE "users" ADD COLUMN "lock_until" timestamp(3) with time zone;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");`)
}
