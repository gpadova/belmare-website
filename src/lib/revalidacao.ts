/**
 * A derivação pura das etiquetas de cache — decisão 7 da spec, ISR sob demanda.
 *
 * ⚠️ **ESTE ARQUIVO NÃO FALA COM O PAYLOAD NEM COM O NEXT.** Ele recebe o
 * evento — qual coleção mudou, qual documento — e devolve a lista de
 * etiquetas a invalidar. Nada mais: sem `getPayload`, sem `unstable_cache`,
 * sem `revalidateTag`. É essa ausência que permite testar o fan-out de seis
 * rotas chamando a função com um objeto comum, sem subir servidor nem simular
 * cache nenhum — quem lê o Payload e quem chama `revalidateTag` mora em
 * `lib/representadas-consulta.ts` e em `collections/representadas.ts`, e os
 * dois são só CHAMADORES desta função. Inlinear a derivação num desses dois
 * lugares era a alternativa mais simples e a errada: o fan-out voltaria a ser
 * uma lista lembrada de cabeça, e é exatamente essa lista que este arquivo
 * existe para não deixar ninguém escrever à mão de novo.
 *
 * ⚠️ **UMA REPRESENTADA APARECE EM SEIS LUGARES**, e a lista abaixo é a
 * conferida contra o que o código de fato renderiza hoje — não a suposta:
 *
 *   1. a home            `RepresentadasGaleria` — a galeria das marcas
 *   2. `/quem-somos`       `FabricasRepresentadas` — a lista de ficha
 *   3. `/representadas`    `PranchaAreaExterna` + `RegistrosDasRepresentadas`
 *   4. a própria página   `/representadas/[marca]`
 *   5. `/catalogos`        `documentosDeCatalogo` — vista sobre o mesmo dado,
 *                          nunca uma segunda árvore (ver `lib/representadas.ts`)
 *   6. o rodapé            `Rodape`, no layout — portanto em TODA rota do
 *                          site, inclusive a 404
 *
 * ⚠️ **AS SEIS LEEM O PAINEL.** Não há mais fonte dupla: o array `REPRESENTADAS`
 * de `lib/representadas.ts` continua existindo, mas só como ENTRADA DO SEED
 * (`seed/semear-representadas.ts`) — nenhuma superfície o lê para renderizar. As
 * cinco etiquetas de lista já estavam aqui de antes, previstas para este dia, e
 * é por isso que a migração das seis não precisou acrescentar nenhuma: a única
 * leitura de painel que existe (`buscarRepresentadas`) é tagueada com todas.
 *
 * A identidade da empresa é o segundo caso da decisão 7: ela mora no rodapé e,
 * por natureza, em qualquer canto do site — não há "seis rotas" quando a
 * mudança já É o site inteiro, então ela deriva uma etiqueta só.
 *
 * ⚠️ **OS TRÊS GLOBAIS DE PRA-122 SÃO O CONTRASTE QUE DEIXA `TAG_SITE` FAZER
 * SENTIDO.** `Empresa` deriva o site inteiro porque está no layout; `Home` e
 * `QuemSomos` derivam UMA etiqueta de página cada, porque a prosa da home não
 * aparece em `/quem-somos` e vice-versa. Publicar uma vírgula corrigida na home
 * não pode invalidar a página estática de quatro marcas que não mudaram — e o
 * caminho de errar isso é justamente dar `TAG_SITE` a tudo que vem de global,
 * como se "global" fosse sinônimo de "toda rota". Não é: o que põe `Empresa` em
 * toda rota é o RODAPÉ, não o fato de ela ser um global.
 */

/** A galeria da home (`components/representadas-galeria.tsx`). */
export const TAG_HOME = "home";

/** A lista das fábricas em `/quem-somos`
 *  (`components/quem-somos/fabricas-representadas.tsx`). */
export const TAG_QUEM_SOMOS = "quem-somos";

/** A prancha e os registros de `/representadas`
 *  (`components/representadas/prancha-area-externa.tsx` e `registros.tsx`). */
export const TAG_REPRESENTADAS = "representadas";

/** O índice de documentos de `/catalogos` (`lib/representadas.ts#documentosDeCatalogo`). */
export const TAG_CATALOGOS = "catalogos";

/** O rodapé (`components/rodape.tsx`) — no layout, portanto em toda rota do
 *  site, inclusive `not-found`. */
export const TAG_RODAPE = "rodape";

/**
 * A biblioteca 3D (`app/(frontend)/arquivos-3d/page.tsx`) — **e só o PACOTE
 * dela**, PRA-127.
 *
 * ⚠️ **NÃO É A ETIQUETA DOS ARQUIVOS 3D.** Um arquivo da biblioteca continua
 * derivando `tagDaRepresentada`, como `tagsDaMudanca` já fazia antes desta rota
 * existir — a página lê a biblioteca por N leituras escopadas por marca
 * (`lib/arquivos3d-consulta.ts`), cada uma já carimbada com a etiqueta da
 * própria fábrica, e é isso que a nota de `MudancaNoPainel` previu com "nada
 * muda aqui nesse dia". O que É novo é o pacote completo: ele não pertence a
 * fábrica nenhuma — pertence às quatro ao mesmo tempo —, então não existe
 * `tagDaRepresentada` que o descreva, e uma etiqueta própria é a única forma
 * de publicá-lo invalidar esta rota sem invalidar quatro páginas de marca que
 * não mudaram.
 */
export const TAG_ARQUIVOS_3D = "arquivos-3d";

/** A identidade da empresa — WhatsApp, e-mail, endereço, território. Está no
 *  rodapé e potencialmente em qualquer página, então a mudança é sempre o
 *  site inteiro, nunca uma lista de rotas para enumerar. */
export const TAG_SITE = "site";

/**
 * A própria página da marca — uma etiqueta POR marca, nunca uma só para
 * todas. Editar a Trisol não pode invalidar a página estática da Bux, que não
 * mudou.
 */
export function tagDaRepresentada(slug: string): string {
  return `representada:${slug}`;
}

/**
 * ⚠️ **PÁGINA LIVRE (PRA-124) É O CASO MAIS ESTREITO QUE EXISTE: UMA ROTA, E
 * SÓ ELA — mesmo estando ligada da home e do rodapé.** `/arquitetos` e
 * `/contato` são o destino das duas portas da home, e
 * `/politica-de-privacidade` está no rodapé, que mora no layout e portanto em
 * TODA rota do site. Mesmo assim a etiqueta é uma só, por marca de página: o
 * que a home e o rodapé mostram é o RÓTULO do link — texto fixo em
 * `components/portas.tsx` e `components/rodape.tsx` —, e nenhuma letra da
 * composição vaza para fora da própria rota. Trocar um bloco de `/contato` não
 * pode invalidar a página estática de quatro marcas que não mudaram.
 *
 * ⚠️ Uma etiqueta POR endereço, nunca uma só para as três: editar a política de
 * privacidade não invalida `/arquitetos`. Mesma regra de `tagDaRepresentada`.
 */
export function tagDaPaginaLivre(slug: string): string {
  return `pagina:${slug}`;
}

/**
 * ⚠️ **PEÇA, ARQUIVO3D E ACABAMENTO — UM SÓ LUGAR, NÃO SEIS.** Diferente de
 * representada, nenhum dos três aparece em outra rota além da página da PRÓPRIA
 * marca (PRA-120): não há galeria, não há lista em `/quem-somos`, não há
 * `/catalogos` equivalente. O fan-out inteiro é a etiqueta que já existe para a
 * marca — `tagDaRepresentada` — e é por isso que os três casos abaixo convergem
 * para a mesma chamada em vez de ganhar etiquetas próprias. Quando a página que
 * de fato lista peças/arquivos/acabamentos existir (marca ou `/arquivos-3d`,
 * PRA-127), ela já lê essa etiqueta — nada muda aqui nesse dia.
 *
 * ✅ **CONFIRMADO EM PRA-127, E A PREVISÃO SE PAGOU.** `/arquivos-3d` nasceu e
 * estes três casos não mudaram uma letra: a rota lê a biblioteca por N leituras
 * escopadas por marca, cada uma carimbada com `tagDaRepresentada`, então
 * publicar um arquivo 3D já invalida a rota nova sem ninguém acrescentar
 * etiqueta. O que o ticket acrescentou foi `pacote-3d`, logo abaixo — e ele é
 * outra coisa: não pende de fábrica nenhuma.
 *
 * ⚠️ **PROJETO (PRA-121) É O CASO OPOSTO — UM SÓ LUGAR, MAS NÃO É O DA
 * MARCA.** Um projeto cita representadas em vez de pender de uma só (decisão
 * 10 da spec: nada aqui atravessa "cada coisa tem um pai", porque um projeto
 * não tem pai nenhum na árvore), e a única superfície onde ele aparece é a
 * seção anulável de `/quem-somos` — nunca a página da marca. Por isso a
 * etiqueta não é `tagDaRepresentada`, e o evento nem carrega slug: mudar
 * QUALQUER projeto invalida `/quem-somos` inteira, porque o portão de três
 * (`lib/projetos.ts#projetosPublicaveis`) depende do CONJUNTO publicado, não
 * de um documento isolado.
 */
export type MudancaNoPainel =
  | { colecao: "representadas"; slug: string }
  | { colecao: "empresa" }
  | { colecao: "home" }
  | { colecao: "quem-somos" }
  | { colecao: "prancha" }
  | { colecao: "paginas"; slug: string }
  | {
      colecao: "pecas" | "arquivos3d" | "acabamentos";
      representadaSlug: string;
    }
  | { colecao: "projetos" }
  | { colecao: "pacote-3d" };

/**
 * Coleção e documento entram, a lista de etiquetas sai — literalmente a frase
 * da decisão 7. Sem esta função, o fan-out de seis rotas é uma lista escrita à
 * mão dentro de um hook, e uma lista escrita à mão é exatamente o tipo de
 * defeito silencioso que este projeto já se recusou a repetir uma vez (ver o
 * comentário sobre etiquetas em `representadas-consulta.ts`, antes desta
 * função existir).
 *
 * ⚠️ O `switch` é exaustivo de propósito, e o `default` com `satisfies never`
 * é o que torna uma coleção nova sem caso aqui um erro de build — não um
 * silêncio em produção.
 */
export function tagsDaMudanca(mudanca: MudancaNoPainel): string[] {
  switch (mudanca.colecao) {
    case "representadas":
      return [
        TAG_HOME,
        TAG_QUEM_SOMOS,
        TAG_REPRESENTADAS,
        TAG_CATALOGOS,
        TAG_RODAPE,
        tagDaRepresentada(mudanca.slug),
      ];
    case "empresa":
      return [TAG_SITE];
    case "home":
      return [TAG_HOME];
    case "quem-somos":
      return [TAG_QUEM_SOMOS];
    /* ⚠️ **PRANCHA (PRA-123) É O CASO MAIS ESTREITO DE TODOS: UMA ROTA.** A
       fotografia e as chamadas só aparecem em `/representadas` — não há
       galeria, não há ledger, não há rodapé. Trocar a fotografia da prancha não
       pode invalidar a página estática de nenhuma marca. Reparar que esta é a
       MESMA etiqueta que a mudança de uma representada já derruba não é
       coincidência: a legenda da prancha nomeia as fábricas, então as duas
       edições mexem na mesma superfície — e é justamente por elas convergirem
       para uma etiqueta só que ninguém precisa lembrar de invalidar as duas. */
    case "prancha":
      return [TAG_REPRESENTADAS];
    /* ⚠️ **PÁGINA LIVRE: UMA ROTA, APESAR DE A HOME E O RODAPÉ APONTAREM PARA
       ELA.** Ver a nota completa em `tagDaPaginaLivre` — o que está fora da
       rota é o RÓTULO do link, que é texto fixo em código, não composição. */
    case "paginas":
      return [tagDaPaginaLivre(mudanca.slug)];
    case "pecas":
    case "arquivos3d":
    case "acabamentos":
      return [tagDaRepresentada(mudanca.representadaSlug)];
    case "projetos":
      return [TAG_QUEM_SOMOS];
    /* ⚠️ **O PACOTE 3D É O ÚNICO DOCUMENTO DO PROJETO QUE PERTENCE ÀS QUATRO
       MARCAS AO MESMO TEMPO, E POR ISSO NÃO USA `tagDaRepresentada`.** Um
       arquivo 3D pende de uma fábrica só e cai na etiqueta dela (o caso logo
       acima, inalterado por PRA-127); o pacote É o conjunto — remontá-lo não
       muda uma linha de nenhuma página de marca, e derivar as quatro etiquetas
       "por simetria" invalidaria quatro páginas estáticas que não mudaram. Uma
       rota, uma etiqueta: o caso mais estreito que existe, como a prancha. */
    case "pacote-3d":
      return [TAG_ARQUIVOS_3D];
    default:
      return mudanca satisfies never;
  }
}
