import config from "@payload-config";
import { getPayload } from "payload";

import { QUEM_SOMOS } from "@/seed/quem-somos-texto";

/**
 * Escreve os campos novos de `/quem-somos` no global que já está publicado.
 *
 * Como rodar: `pnpm payload run src/seed/preencher-quem-somos.ts`.
 *
 * ⚠️ **É UM SCRIPT DE UMA VEZ SÓ, E ELE EXISTE PORQUE O SEED NÃO PODE FAZER
 * ISTO.** `semear-globais.ts` pula todo global já publicado, de propósito:
 * depois da primeira execução o painel é a fonte da verdade, e uma segunda
 * execução que sobrescrevesse apagaria em silêncio a correção que o operador
 * fez à mão. Esta migração de conteúdo precisa exatamente do contrário — o
 * global ESTÁ publicado, e as colunas novas nasceram nulas na migração
 * `20260805_172941`. Sem este passo a página vai ao ar sem a ficha de etapas e
 * com os títulos no padrão de código.
 *
 * ⚠️ **NÃO É IDEMPOTENTE COM A EDIÇÃO DO OPERADOR: ELE SOBRESCREVE.** Rodar
 * duas vezes devolve o texto de partida e joga fora o que tiver sido escrito no
 * painel no meio. É para rodar uma vez, logo depois da migração, e depois nunca
 * mais. Por isso ele imprime o antes e o depois de cada campo: o que ele
 * apagou fica no terminal de quem rodou.
 *
 * ⚠️ **OS TEXTOS TÊM MARCADOR DENTRO, E É ASSIM QUE ELES DEVEM CHEGAR AO
 * BANCO.** `{fabricas}` é gravado literalmente na coluna; quem troca é o site,
 * a cada renderização (`lib/marcadores.ts`). Um script que resolvesse os
 * marcadores antes de gravar congelaria a contagem no banco, que é a falha
 * inteira que eles existem para evitar.
 */

const CAMPOS = [
  "titulo",
  "apresentacao",
  "atuacaoTitulo",
  "atuacao",
  "acervoTitulo",
  "acervo",
  "territorioTitulo",
  "territorio",
  "projetosTitulo",
  "projetos",
  "contatoTitulo",
  "contato",
  "contatoLegenda",
] as const;

function resumo(valor: unknown): string {
  if (valor === null || valor === undefined || valor === "") return "— vazio —";
  const texto = String(valor);
  return texto.length > 72 ? `${texto.slice(0, 72)}…` : texto;
}

async function preencher(): Promise<void> {
  const payload = await getPayload({ config });

  const antes = await payload.findGlobal({ slug: "quem-somos", depth: 0 });

  console.log("ANTES:");
  for (const campo of CAMPOS) {
    console.log(`  ${campo.padEnd(18)} ${resumo(antes[campo])}`);
  }
  console.log(`  ${"atuacaoLinhas".padEnd(18)} ${antes.atuacaoLinhas?.length ?? 0} etapa(s)`);
  console.log(`  ${"_status".padEnd(18)} ${antes._status}`);

  await payload.updateGlobal({
    slug: "quem-somos",
    draft: false,
    // `_status` explícito: `draft: false` sozinho NÃO publica — o padrão do
    // campo é `"draft"`, e sem esta linha o global vira rascunho e a página
    // perde o texto inteiro, porque `lib/espinha-consulta.ts` só deixa passar
    // publicado. É o achado de PRA-118, e ele custou caro uma vez.
    data: { ...QUEM_SOMOS, _status: "published" },
  } as never);

  const depois = await payload.findGlobal({ slug: "quem-somos", depth: 0 });

  console.log("\nDEPOIS:");
  for (const campo of CAMPOS) {
    console.log(`  ${campo.padEnd(18)} ${resumo(depois[campo])}`);
  }
  console.log(`  ${"atuacaoLinhas".padEnd(18)} ${depois.atuacaoLinhas?.length ?? 0} etapa(s)`);
  for (const linha of depois.atuacaoLinhas ?? []) {
    console.log(`      · ${linha.rotulo}: ${resumo(linha.texto)}`);
  }
  console.log(`  ${"_status".padEnd(18)} ${depois._status}`);

  console.log(
    "\n⚠️  Os marcadores ficam gravados como estão — {fabricas}, {anos}, {cidade}.\n" +
      "    Quem os troca pelo dado é o site, a cada renderização.",
  );

  await payload.destroy();
}

// `payload run` importa este módulo diretamente — daí o `await` de topo de
// nível, e não um export que outra coisa chama.
await preencher();
