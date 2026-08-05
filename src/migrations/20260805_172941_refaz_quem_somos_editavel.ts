import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * `/quem-somos` passa a ser editável por inteiro — títulos, parágrafos e a
 * lista de etapas.
 *
 * ⚠️ **NADA É DERRUBADO NEM RENOMEADO, E ISSO FOI DESENHADO ASSIM.** As quatro
 * colunas que já tinham texto publicado — `apresentacao`, `atuacao`, `acervo`,
 * `contato` — atravessam esta migração intocadas. Foi por causa disso que os
 * campos novos entraram PLANOS no global (`titulo`, `atuacao_titulo`, …) em vez
 * de agrupados: um `group` do Payload teria renomeado `apresentacao` para
 * `apresentacao_texto`, e um rename de coluna com texto publicado dentro é
 * risco que uma reorganização de formulário não paga. O agrupamento do painel é
 * `collapsible`, que é só aparência e não toca no banco.
 *
 * A tabela nova é a das etapas de "O que a Belmare faz", que eram quatro linhas
 * em código e viraram lista ordenável.
 *
 * ⚠️ As colunas novas nascem NULAS, e o site trata nulo como "não escreveram
 * nada": título cai no padrão de `lib/quem-somos-consulta.ts`, parágrafo some.
 * A página não quebra entre esta migração e o preenchimento — mas fica sem a
 * ficha de etapas até `seed/preencher-quem-somos.ts` rodar.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "quem_somos_atuacao_linhas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rotulo" varchar,
  	"texto" varchar
  );
  
  CREATE TABLE "_quem_somos_v_version_atuacao_linhas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rotulo" varchar,
  	"texto" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "quem_somos" ADD COLUMN "titulo" varchar;
  ALTER TABLE "quem_somos" ADD COLUMN "atuacao_titulo" varchar;
  ALTER TABLE "quem_somos" ADD COLUMN "acervo_titulo" varchar;
  ALTER TABLE "quem_somos" ADD COLUMN "territorio_titulo" varchar;
  ALTER TABLE "quem_somos" ADD COLUMN "territorio" varchar;
  ALTER TABLE "quem_somos" ADD COLUMN "projetos_titulo" varchar;
  ALTER TABLE "quem_somos" ADD COLUMN "projetos" varchar;
  ALTER TABLE "quem_somos" ADD COLUMN "contato_titulo" varchar;
  ALTER TABLE "quem_somos" ADD COLUMN "contato_legenda" varchar;
  ALTER TABLE "_quem_somos_v" ADD COLUMN "version_titulo" varchar;
  ALTER TABLE "_quem_somos_v" ADD COLUMN "version_atuacao_titulo" varchar;
  ALTER TABLE "_quem_somos_v" ADD COLUMN "version_acervo_titulo" varchar;
  ALTER TABLE "_quem_somos_v" ADD COLUMN "version_territorio_titulo" varchar;
  ALTER TABLE "_quem_somos_v" ADD COLUMN "version_territorio" varchar;
  ALTER TABLE "_quem_somos_v" ADD COLUMN "version_projetos_titulo" varchar;
  ALTER TABLE "_quem_somos_v" ADD COLUMN "version_projetos" varchar;
  ALTER TABLE "_quem_somos_v" ADD COLUMN "version_contato_titulo" varchar;
  ALTER TABLE "_quem_somos_v" ADD COLUMN "version_contato_legenda" varchar;
  ALTER TABLE "quem_somos_atuacao_linhas" ADD CONSTRAINT "quem_somos_atuacao_linhas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quem_somos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quem_somos_v_version_atuacao_linhas" ADD CONSTRAINT "_quem_somos_v_version_atuacao_linhas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_quem_somos_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "quem_somos_atuacao_linhas_order_idx" ON "quem_somos_atuacao_linhas" USING btree ("_order");
  CREATE INDEX "quem_somos_atuacao_linhas_parent_id_idx" ON "quem_somos_atuacao_linhas" USING btree ("_parent_id");
  CREATE INDEX "_quem_somos_v_version_atuacao_linhas_order_idx" ON "_quem_somos_v_version_atuacao_linhas" USING btree ("_order");
  CREATE INDEX "_quem_somos_v_version_atuacao_linhas_parent_id_idx" ON "_quem_somos_v_version_atuacao_linhas" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "quem_somos_atuacao_linhas" CASCADE;
  DROP TABLE "_quem_somos_v_version_atuacao_linhas" CASCADE;
  ALTER TABLE "quem_somos" DROP COLUMN "titulo";
  ALTER TABLE "quem_somos" DROP COLUMN "atuacao_titulo";
  ALTER TABLE "quem_somos" DROP COLUMN "acervo_titulo";
  ALTER TABLE "quem_somos" DROP COLUMN "territorio_titulo";
  ALTER TABLE "quem_somos" DROP COLUMN "territorio";
  ALTER TABLE "quem_somos" DROP COLUMN "projetos_titulo";
  ALTER TABLE "quem_somos" DROP COLUMN "projetos";
  ALTER TABLE "quem_somos" DROP COLUMN "contato_titulo";
  ALTER TABLE "quem_somos" DROP COLUMN "contato_legenda";
  ALTER TABLE "_quem_somos_v" DROP COLUMN "version_titulo";
  ALTER TABLE "_quem_somos_v" DROP COLUMN "version_atuacao_titulo";
  ALTER TABLE "_quem_somos_v" DROP COLUMN "version_acervo_titulo";
  ALTER TABLE "_quem_somos_v" DROP COLUMN "version_territorio_titulo";
  ALTER TABLE "_quem_somos_v" DROP COLUMN "version_territorio";
  ALTER TABLE "_quem_somos_v" DROP COLUMN "version_projetos_titulo";
  ALTER TABLE "_quem_somos_v" DROP COLUMN "version_projetos";
  ALTER TABLE "_quem_somos_v" DROP COLUMN "version_contato_titulo";
  ALTER TABLE "_quem_somos_v" DROP COLUMN "version_contato_legenda";`)
}
