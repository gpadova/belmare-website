import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * `/quem-somos` refeita: os campos passam a acompanhar as seções que a página
 * de fato tem.
 *
 * `registro` legendava o ano de fundação em display e `nome` era o parágrafo do
 * bloco que comparava o nome público anterior ao logotipo de hoje — os dois
 * blocos saíram da rota. Entram `apresentacao` (o que a empresa é) e `atuacao`
 * (o que ela faz por quem chega).
 *
 * ⚠️ **`interlocutor` VIRA `contato` POR RENAME, E NÃO POR DROP + ADD.** O
 * gerador do Payload não tem como saber que é a mesma coluna e emitiu o par
 * DROP/ADD; trocado à mão, porque aquele é o único dos quatro parágrafos que
 * sobreviveu à reescrita inteiro — é o do fecho, e o operador pode já tê-lo
 * editado no painel. Um DROP ali apaga texto publicado em silêncio. O `.json`
 * ao lado descreve só o esquema resultante, que é o mesmo nos dois caminhos.
 *
 * Os dois DROPs que sobraram apagam mesmo o que estava em `registro` e `nome`,
 * inclusive nas versões. É o pretendido: aquele texto descrevia blocos que não
 * existem mais, e a `down` recria as colunas vazias, não o conteúdo.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "quem_somos" RENAME COLUMN "interlocutor" TO "contato";
  ALTER TABLE "_quem_somos_v" RENAME COLUMN "version_interlocutor" TO "version_contato";
  ALTER TABLE "quem_somos" ADD COLUMN "apresentacao" varchar;
  ALTER TABLE "quem_somos" ADD COLUMN "atuacao" varchar;
  ALTER TABLE "_quem_somos_v" ADD COLUMN "version_apresentacao" varchar;
  ALTER TABLE "_quem_somos_v" ADD COLUMN "version_atuacao" varchar;
  ALTER TABLE "quem_somos" DROP COLUMN "registro";
  ALTER TABLE "quem_somos" DROP COLUMN "nome";
  ALTER TABLE "_quem_somos_v" DROP COLUMN "version_registro";
  ALTER TABLE "_quem_somos_v" DROP COLUMN "version_nome";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "quem_somos" RENAME COLUMN "contato" TO "interlocutor";
  ALTER TABLE "_quem_somos_v" RENAME COLUMN "version_contato" TO "version_interlocutor";
  ALTER TABLE "quem_somos" ADD COLUMN "registro" varchar;
  ALTER TABLE "quem_somos" ADD COLUMN "nome" varchar;
  ALTER TABLE "_quem_somos_v" ADD COLUMN "version_registro" varchar;
  ALTER TABLE "_quem_somos_v" ADD COLUMN "version_nome" varchar;
  ALTER TABLE "quem_somos" DROP COLUMN "apresentacao";
  ALTER TABLE "quem_somos" DROP COLUMN "atuacao";
  ALTER TABLE "_quem_somos_v" DROP COLUMN "version_apresentacao";
  ALTER TABLE "_quem_somos_v" DROP COLUMN "version_atuacao";`)
}
