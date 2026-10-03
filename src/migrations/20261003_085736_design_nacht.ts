import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_windows_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"names" varchar NOT NULL,
  	"house" varchar NOT NULL,
  	"note" varchar,
  	"time" varchar
  );
  
  CREATE TABLE "pages_blocks_windows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Wann, wo, bei wem',
  	"weekday_time" varchar DEFAULT '19:00',
  	"weekend_time" varchar DEFAULT '17:00',
  	"calendar_id" integer,
  	"flyer_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_callout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Euer OK',
  	"note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_archive_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Frühere Jahre',
  	"archive_slug" varchar DEFAULT 'archiv',
  	"count" numeric DEFAULT 3,
  	"block_name" varchar
  );
  
  CREATE TABLE "site_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"house" varchar NOT NULL,
  	"names" varchar NOT NULL
  );
  
  ALTER TABLE "site" ADD COLUMN "intro" varchar;
  ALTER TABLE "site" ADD COLUMN "email" varchar DEFAULT 'advent@wollbi.ch';
  ALTER TABLE "pages_blocks_windows_entries" ADD CONSTRAINT "pages_blocks_windows_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_windows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_windows" ADD CONSTRAINT "pages_blocks_windows_calendar_id_media_id_fk" FOREIGN KEY ("calendar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_windows" ADD CONSTRAINT "pages_blocks_windows_flyer_id_media_id_fk" FOREIGN KEY ("flyer_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_windows" ADD CONSTRAINT "pages_blocks_windows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_callout" ADD CONSTRAINT "pages_blocks_callout_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_callout" ADD CONSTRAINT "pages_blocks_callout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team" ADD CONSTRAINT "pages_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_archive_teaser" ADD CONSTRAINT "pages_blocks_archive_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_team" ADD CONSTRAINT "site_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_windows_entries_order_idx" ON "pages_blocks_windows_entries" USING btree ("_order");
  CREATE INDEX "pages_blocks_windows_entries_parent_id_idx" ON "pages_blocks_windows_entries" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_windows_order_idx" ON "pages_blocks_windows" USING btree ("_order");
  CREATE INDEX "pages_blocks_windows_parent_id_idx" ON "pages_blocks_windows" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_windows_path_idx" ON "pages_blocks_windows" USING btree ("_path");
  CREATE INDEX "pages_blocks_windows_calendar_idx" ON "pages_blocks_windows" USING btree ("calendar_id");
  CREATE INDEX "pages_blocks_windows_flyer_idx" ON "pages_blocks_windows" USING btree ("flyer_id");
  CREATE INDEX "pages_blocks_callout_order_idx" ON "pages_blocks_callout" USING btree ("_order");
  CREATE INDEX "pages_blocks_callout_parent_id_idx" ON "pages_blocks_callout" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_callout_path_idx" ON "pages_blocks_callout" USING btree ("_path");
  CREATE INDEX "pages_blocks_callout_image_idx" ON "pages_blocks_callout" USING btree ("image_id");
  CREATE INDEX "pages_blocks_team_order_idx" ON "pages_blocks_team" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_parent_id_idx" ON "pages_blocks_team" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_path_idx" ON "pages_blocks_team" USING btree ("_path");
  CREATE INDEX "pages_blocks_archive_teaser_order_idx" ON "pages_blocks_archive_teaser" USING btree ("_order");
  CREATE INDEX "pages_blocks_archive_teaser_parent_id_idx" ON "pages_blocks_archive_teaser" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_archive_teaser_path_idx" ON "pages_blocks_archive_teaser" USING btree ("_path");
  CREATE INDEX "site_team_order_idx" ON "site_team" USING btree ("_order");
  CREATE INDEX "site_team_parent_id_idx" ON "site_team" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_windows_entries" CASCADE;
  DROP TABLE "pages_blocks_windows" CASCADE;
  DROP TABLE "pages_blocks_callout" CASCADE;
  DROP TABLE "pages_blocks_team" CASCADE;
  DROP TABLE "pages_blocks_archive_teaser" CASCADE;
  DROP TABLE "site_team" CASCADE;
  ALTER TABLE "site" DROP COLUMN "intro";
  ALTER TABLE "site" DROP COLUMN "email";`)
}
