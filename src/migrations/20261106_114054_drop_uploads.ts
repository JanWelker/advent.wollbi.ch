import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_windows" DROP CONSTRAINT "pages_blocks_windows_calendar_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_windows" DROP CONSTRAINT "pages_blocks_windows_flyer_id_media_id_fk";
  
  DROP INDEX "pages_blocks_windows_calendar_idx";
  DROP INDEX "pages_blocks_windows_flyer_idx";
  ALTER TABLE "pages_blocks_windows" DROP COLUMN "calendar_id";
  ALTER TABLE "pages_blocks_windows" DROP COLUMN "flyer_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_windows" ADD COLUMN "calendar_id" integer;
  ALTER TABLE "pages_blocks_windows" ADD COLUMN "flyer_id" integer;
  ALTER TABLE "pages_blocks_windows" ADD CONSTRAINT "pages_blocks_windows_calendar_id_media_id_fk" FOREIGN KEY ("calendar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_windows" ADD CONSTRAINT "pages_blocks_windows_flyer_id_media_id_fk" FOREIGN KEY ("flyer_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_windows_calendar_idx" ON "pages_blocks_windows" USING btree ("calendar_id");
  CREATE INDEX "pages_blocks_windows_flyer_idx" ON "pages_blocks_windows" USING btree ("flyer_id");`)
}
