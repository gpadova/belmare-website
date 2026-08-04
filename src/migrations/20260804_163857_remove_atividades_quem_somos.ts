import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "quem_somos" DROP COLUMN "atividades";
  ALTER TABLE "_quem_somos_v" DROP COLUMN "version_atividades";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "quem_somos" ADD COLUMN "atividades" varchar;
  ALTER TABLE "_quem_somos_v" ADD COLUMN "version_atividades" varchar;`)
}
