import config from "@payload-config";
import { getPayload, type Payload } from "payload";

import { QUEM_SOMOS } from "@/seed/quem-somos-texto";

/**
 * O seed dos três globais de PRA-122 — `Empresa`, `Home` e `QuemSomos`.
 *
 * Como rodar: `pnpm payload run src/seed/semear-globais.ts`, ou `pnpm db:seed`,
 * que roda este depois do seed das representadas.
 *
 * ⚠️ **AQUI OS LITERAIS SÃO ESPERADOS, AO CONTRÁRIO DO SEED DE PRA-119.**
 * Aquele importava `REPRESENTADAS` porque o array continuava existindo em
 * `lib/representadas.ts`; este não pode importar de `lib/site.ts` porque
 * `lib/site.ts` deixou de ter identidade nenhuma — o ponto do ticket é que
 * esses valores saíram do código. Eles atravessam este arquivo uma vez, na
 * migração, e a partir daí o painel é a fonte. Um arquivo de seed não é
 * importável por componente nenhum, então isto não recria a fonte dupla que a
 * camada de tradução existe para não ter.
 *
 * ⚠️ **O WHATSAPP E O E-MAIL COMERCIAL NÃO SÃO SEMEADOS, E ISSO É O TICKET.**
 * Os dois valores que estavam em `lib/site.ts` eram MOCKS — um
 * `wa.me/5548000000000` que abre e diz que o número não existe, e um
 * `comercial@exemplo.belmare.com.br` que não recebe nada. Semeá-los seria
 * mover o mock de lugar em vez de tirá-lo do ar. Os dois campos entram vazios
 * de propósito: enquanto estiverem vazios o site não desenha botão de WhatsApp
 * nem linha de e-mail em página nenhuma, e preenchê-los é a primeira edição de
 * verdade do operador — que é exatamente o teste de aceite do sistema inteiro.
 *
 * ⚠️ **REEXECUÇÃO: PULA O QUE JÁ ESTÁ PUBLICADO, NUNCA SOBRESCREVE.** Mesma
 * política de PRA-119, e pelo mesmo motivo: depois da primeira execução o
 * painel é a fonte da verdade, e o operador pode ter corrigido um telefone à
 * mão. Apagar essa correção em silêncio numa segunda execução seria pior do que
 * não fazer nada.
 *
 * ⚠️ `_status: "published"` explícito em cada `data`. `draft: false` sozinho NÃO
 * publica — o padrão do campo é `"draft"` (achado de PRA-118). Sem esta linha
 * os três globais entram como rascunho e `lib/empresa-consulta.ts`, que só
 * deixa passar publicado, devolveria vazio: o site subiria sem rodapé nenhum.
 */

/** A identidade transcrita do registro. Nada aqui é redação. */
const EMPRESA = {
  nomeCompleto: "Belmare Representações",
  razaoSocial: "Bello Mare Mercantil Ltda",
  cnpj: "03.133.708/0001-09",
  /* Meia-noite UTC: é assim que o seletor "só o dia" do Payload grava, e é o
     que `lib/empresa.ts#anosDeMercado` corta nos dez primeiros caracteres. */
  abertura: "1999-04-22T00:00:00.000Z",
  endereco: {
    logradouro: "Rua Zanzibar do Nascimento Lins, 81",
    bairro: "Trindade",
    cidade: "Florianópolis",
    uf: "SC",
    cep: "88.036-225",
  },
  telefones: [{ numero: "(48) 3234-6004" }, { numero: "(48) 99137-5030" }],
  instagram: "https://www.instagram.com/belmarerepresentacoes",
};

/**
 * O parágrafo que estava em `components/representadas-galeria.tsx`.
 *
 * ⚠️ **REESCRITO EM 05/08/2026, E O QUE SAIU IMPORTA MAIS DO QUE O QUE FICOU.**
 * A frase era "Móvel de autor, estrutura, conforto e sombra. Juntas, resolvem
 * uma área externa inteira — e há um único interlocutor para as quatro.", e
 * quebrava três regras que este repositório já tinha escrito:
 *
 *   · **"conforto" e "sombra" são benefício.** A ajuda do campo `resolve`, em
 *     `collections/representadas.ts`, proíbe as duas palavras pelo nome: "'a
 *     sombra' e 'o conforto' dizem o que o cliente sente, e o arquiteto
 *     especifica o que a fábrica faz". A regra existia e o parágrafo da home
 *     passava por cima dela.
 *   · **"há um único interlocutor para as quatro" é "Quatro fábricas. Um
 *     interlocutor." em prosa** — o jargão de organograma rejeitado em
 *     30/07/2026, de volta com outra pontuação.
 *   · **a enumeração duplicava os cartões.** Cada fábrica já imprime a própria
 *     linha três dedos abaixo, concreta e conferível ("Ombrelones laterais e
 *     centrais"), e a lista abstrata acima era a versão pior da mesma coisa.
 *
 * O que sobrou faz o trabalho que os cartões não fazem: manda ler as quatro
 * como um conjunto. O argumento da empresa vira um fato sobre o portfólio, em
 * vez de uma promessa sobre o resultado.
 *
 * ⚠️ Sem número aqui. A quinta fábrica entra pelo painel e esta frase continua
 * verdadeira sozinha — era esse o defeito de "para as quatro".
 *
 * ⚠️ **CORRIGIDO OUTRA VEZ EM 05/08/2026: A FRASE ANTERIOR ERA FALSA.** Ela
 * dizia "Nenhuma delas repete a linha da outra.", e a revisão de acabamento a
 * derrubou com o próprio `PRODUCT.md` na mão: a tabela de categorias lista
 * sofás, poltronas, cadeiras, espreguiçadeiras e mesas na Marê **e** na GDA, e
 * a Bux é estofado de área externa como as duas. As linhas se cruzam, sim — o
 * que não se repete é o PAPEL de cada fábrica no projeto, e papel é outra
 * coisa. Era uma afirmação de não-sobreposição que o registro contradiz, numa
 * página cuja regra declarada é dado antes de adjetivo.
 *
 * A frase de agora diz o que o modelo de dados já afirma: o campo `parte` de
 * `lib/representadas.ts` guarda "Móvel", "Estrutura", "Estofado" e "Sombra" —
 * uma parte por fábrica. Ela manda ler as quatro como conjunto, continua sem
 * número, e não promete que os catálogos não se encostam.
 */
const HOME = {
  galeria: "Cada uma entra por uma parte diferente da área externa.",
};

async function semearGlobal(
  payload: Payload,
  slug: "empresa" | "home" | "quem-somos",
  rotulo: string,
  dados: Record<string, unknown>,
): Promise<"criado" | "existente"> {
  const atual = await payload.findGlobal({ slug, depth: 0 });

  if (atual._status === "published") {
    console.log(`  já publicado — pulando ("${slug}")`);
    return "existente";
  }

  await payload.updateGlobal({
    slug,
    draft: false,
    data: { ...dados, _status: "published" },
  } as never);

  console.log(`  publicado ("${slug}") — ${rotulo}`);
  return "criado";
}

async function semear(): Promise<void> {
  const payload = await getPayload({ config });

  console.log("Semeando os três globais no Payload...\n");

  const resultados = { criado: 0, existente: 0 };

  for (const [slug, rotulo, dados] of [
    ["empresa", "identidade, telefones e endereço", EMPRESA],
    ["home", "o parágrafo da seção das marcas", HOME],
    ["quem-somos", "a prosa das seções da página", QUEM_SOMOS],
  ] as const) {
    console.log(`- ${slug}`);
    resultados[await semearGlobal(payload, slug, rotulo, dados)]++;
  }

  console.log(
    `\n${resultados.criado} publicado(s), ${resultados.existente} já existia(m) e foi(ram) preservado(s).`,
  );
  console.log(
    "\n⚠️  O WhatsApp e o e-mail comercial ficaram VAZIOS de propósito — eram mocks.\n" +
      "    Preencha os dois no painel, em \"O site › A Belmare › Canais\", e publique:\n" +
      "    enquanto estiverem vazios, o site não mostra WhatsApp em página nenhuma.",
  );

  await payload.destroy();
}

// `payload run` importa este módulo diretamente — daí o `await` de topo de
// nível, e não um export que outra coisa chama.
await semear();
