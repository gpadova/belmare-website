import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * `Empresa.porte` sai do cadastro — o campo perdeu o leitor e ninguém reparou.
 *
 * "Empresa de pequeno porte" abria `/quem-somos` numa faixa de identificação.
 * A faixa saiu na reescrita de 05/08/2026 (ver a migração anterior) e o campo
 * ficou para trás: `lib/empresa-traducao.ts` continuava traduzindo-o para o
 * tipo de domínio e nenhum componente o lia. O operador preenchia, o site nunca
 * publicava.
 *
 * ⚠️ **O DROP APAGA MESMO O QUE ESTAVA GRAVADO, inclusive nas versões**, e a
 * `down` recria a coluna VAZIA — não o conteúdo. O valor que se perde é a
 * transcrição de uma linha do cadastro nacional ("Empresa de pequeno porte"),
 * que se reconsulta na fonte a qualquer momento; é por isso que aqui cabe um
 * DROP e não o rename cuidadoso que `contato` exigiu na migração anterior, onde
 * o que estava na coluna era prosa que o operador podia ter escrito.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "empresa" DROP COLUMN "porte";
  ALTER TABLE "_empresa_v" DROP COLUMN "version_porte";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "empresa" ADD COLUMN "porte" varchar;
  ALTER TABLE "_empresa_v" ADD COLUMN "version_porte" varchar;`)
}
