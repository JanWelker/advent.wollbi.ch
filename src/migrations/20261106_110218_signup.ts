import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "signups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"house" varchar NOT NULL,
  	"names" varchar NOT NULL,
  	"contact" varchar,
  	"note" varchar,
  	"time" varchar,
  	"day" varchar NOT NULL,
  	"year" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "signup" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"open" boolean DEFAULT false,
  	"first_day" timestamp(3) with time zone NOT NULL,
  	"last_day" timestamp(3) with time zone NOT NULL,
  	"intro" varchar,
  	"code" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_blocks_windows_entries" ALTER COLUMN "date" DROP NOT NULL;
  ALTER TABLE "pages_blocks_windows_entries" ALTER COLUMN "names" DROP NOT NULL;
  ALTER TABLE "pages_blocks_windows_entries" ALTER COLUMN "house" DROP NOT NULL;
  ALTER TABLE "pages_blocks_windows" ADD COLUMN "signup_year" numeric;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "signups_id" integer;
  CREATE UNIQUE INDEX "signups_day_idx" ON "signups" USING btree ("day");
  CREATE INDEX "signups_updated_at_idx" ON "signups" USING btree ("updated_at");
  CREATE INDEX "signups_created_at_idx" ON "signups" USING btree ("created_at");
  CREATE UNIQUE INDEX "year_house_idx" ON "signups" USING btree ("year","house");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_signups_fk" FOREIGN KEY ("signups_id") REFERENCES "public"."signups"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_signups_id_idx" ON "payload_locked_documents_rels" USING btree ("signups_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "signups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "signup" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "signups" CASCADE;
  DROP TABLE "signup" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_signups_fk";
  
  DROP INDEX "payload_locked_documents_rels_signups_id_idx";
  ALTER TABLE "pages_blocks_windows_entries" ALTER COLUMN "date" SET NOT NULL;
  ALTER TABLE "pages_blocks_windows_entries" ALTER COLUMN "names" SET NOT NULL;
  ALTER TABLE "pages_blocks_windows_entries" ALTER COLUMN "house" SET NOT NULL;
  ALTER TABLE "pages_blocks_windows" DROP COLUMN "signup_year";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "signups_id";`)
}
