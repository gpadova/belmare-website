import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "logotipos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric
  );
  
  CREATE TABLE "_logotipos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_url" varchar,
  	"version_thumbnail_u_r_l" varchar,
  	"version_filename" varchar,
  	"version_mime_type" varchar,
  	"version_filesize" numeric,
  	"version_width" numeric,
  	"version_height" numeric,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "representadas" ADD COLUMN "logotipo_id" integer;
  ALTER TABLE "_representadas_v" ADD COLUMN "version_logotipo_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "logotipos_id" integer;
  ALTER TABLE "_logotipos_v" ADD CONSTRAINT "_logotipos_v_parent_id_logotipos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."logotipos"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "logotipos_updated_at_idx" ON "logotipos" USING btree ("updated_at");
  CREATE INDEX "logotipos_created_at_idx" ON "logotipos" USING btree ("created_at");
  CREATE UNIQUE INDEX "logotipos_filename_idx" ON "logotipos" USING btree ("filename");
  CREATE INDEX "_logotipos_v_parent_idx" ON "_logotipos_v" USING btree ("parent_id");
  CREATE INDEX "_logotipos_v_version_version_updated_at_idx" ON "_logotipos_v" USING btree ("version_updated_at");
  CREATE INDEX "_logotipos_v_version_version_created_at_idx" ON "_logotipos_v" USING btree ("version_created_at");
  CREATE INDEX "_logotipos_v_version_version_filename_idx" ON "_logotipos_v" USING btree ("version_filename");
  CREATE INDEX "_logotipos_v_created_at_idx" ON "_logotipos_v" USING btree ("created_at");
  CREATE INDEX "_logotipos_v_updated_at_idx" ON "_logotipos_v" USING btree ("updated_at");
  ALTER TABLE "representadas" ADD CONSTRAINT "representadas_logotipo_id_logotipos_id_fk" FOREIGN KEY ("logotipo_id") REFERENCES "public"."logotipos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_representadas_v" ADD CONSTRAINT "_representadas_v_version_logotipo_id_logotipos_id_fk" FOREIGN KEY ("version_logotipo_id") REFERENCES "public"."logotipos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_logotipos_fk" FOREIGN KEY ("logotipos_id") REFERENCES "public"."logotipos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "representadas_logotipo_idx" ON "representadas" USING btree ("logotipo_id");
  CREATE INDEX "_representadas_v_version_version_logotipo_idx" ON "_representadas_v" USING btree ("version_logotipo_id");
  CREATE INDEX "payload_locked_documents_rels_logotipos_id_idx" ON "payload_locked_documents_rels" USING btree ("logotipos_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "logotipos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_logotipos_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "logotipos" CASCADE;
  DROP TABLE "_logotipos_v" CASCADE;
  ALTER TABLE "representadas" DROP CONSTRAINT "representadas_logotipo_id_logotipos_id_fk";
  
  ALTER TABLE "_representadas_v" DROP CONSTRAINT "_representadas_v_version_logotipo_id_logotipos_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_logotipos_fk";
  
  DROP INDEX "representadas_logotipo_idx";
  DROP INDEX "_representadas_v_version_version_logotipo_idx";
  DROP INDEX "payload_locked_documents_rels_logotipos_id_idx";
  ALTER TABLE "representadas" DROP COLUMN "logotipo_id";
  ALTER TABLE "_representadas_v" DROP COLUMN "version_logotipo_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "logotipos_id";`)
}
