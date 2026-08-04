import config from "@payload-config";
import { getPayload, type Payload } from "payload";

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
  porte: "Empresa de pequeno porte",
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

/** O parágrafo que estava em `components/representadas-galeria.tsx`. */
const HOME = {
  galeria:
    "Mobiliário de autor, alumínio fundido, estofado de performance e ombrelone. Linhas que se completam numa área externa inteira, com um interlocutor só.",
};

/**
 * A prosa que estava dentro dos blocos de `/quem-somos`.
 *
 * ⚠️ `nome` e `acervo` começam na SEGUNDA frase do parágrafo. A primeira é
 * montada pelo site com dado — a razão social do cadastro no bloco 02, a
 * contagem de fábricas no bloco 04 — para que a prosa não possa discordar do
 * painel nem congelar num "quatro". Ver `globals/quem-somos.ts`.
 *
 * ⚠️ **A REESCRITA CONTA UMA HISTÓRIA, E ISSO NÃO AFROUXOU NENHUMA REGRA.** A
 * versão anterior era prosa de arquivo: explicava a própria página ("esta
 * página não narra a empresa — mostra o registro dela"), legendava uma tabela
 * de CNAEs que já não existe, e justificava ao visitante uma decisão interna de
 * funil. Nenhuma frase daqui narra intenção, sonho ou valor de quem fundou a
 * empresa — o arco é feito só do que está em documento: o nome antigo lista os
 * produtos do começo, e o cadastro de representadas lista os de hoje.
 *
 * ⚠️ **O REGISTRO É O DE UM SITE BRASILEIRO, NÃO O DE UM PORTFÓLIO DE DESIGN.**
 * A primeira tentativa de reescrita caiu num terceiro estilo, pior que o
 * original: fragmentos sem sujeito e substantivo no singular sem artigo
 * ("móvel de jardim, ombrelone, móvel de design"), antíteses de duas frases
 * nominais, travessão a cada parágrafo. Ninguém escreve assim em português. A
 * referência do setor é como as próprias fábricas contam a história delas — a
 * Butzke, de Timbó, abre com "Foi no ano de 1899 que Emil Butzke produziu as
 * primeiras peças em madeira. Naquela época as peças mais necessárias eram
 * baldes, barricas, bacias para cozinha e para banho, e carroças para
 * transporte": oração com verbo, substantivo concreto no plural, cronologia
 * simples. O polo oposto, que a lista vinculante desta página já proíbe, é o
 * "somos mais do que uma representação comercial: somos parceiros estratégicos
 * da indústria" que a categoria escreve.
 *
 * Ao editar estes campos, o teste é ler em voz alta: se soar como legenda de
 * catálogo ou como slogan, está errado nos dois casos.
 *
 * ⚠️ **NENHUMA CONTAGEM EM PROSA AQUI.** "Quatro fábricas" e "três estados" são
 * gerados pelo site (`lib/frase.ts`), e digitá-los dentro de um destes campos é
 * como a página congela em "quatro" no dia da quinta marca.
 */
const QUEM_SOMOS = {
  registro:
    "Na época a empresa se chamava Bello Mare e trabalhava com pouco mais que isso: ombrelones e móveis de design. O nome mudou e a linha cresceu, mas o ramo é o mesmo até hoje: mobiliário para área externa, sempre através de lojas.",
  nome:
    "O nome antigo listava os produtos um a um, que era como as lojas encontravam a empresa nos anos 1990. Belmare é mais curto, e quem quiser saber o que a empresa vende encontra tudo no catálogo de cada representada.",
  acervo:
    "Cada uma cobre uma parte da área externa, e juntas elas atendem um projeto completo. As linhas não se sobrepõem.",
  interlocutor:
    "Quem atende é quem representa as fábricas. A mesma pessoa responde à primeira dúvida de especificação, acompanha o pedido na loja e resolve a assistência três anos depois, para qualquer uma das marcas.",
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
    ["quem-somos", "a prosa dos blocos numerados", QUEM_SOMOS],
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
