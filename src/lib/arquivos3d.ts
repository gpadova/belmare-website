import { texto } from "@/lib/campo-opcional";
import { pesoDoArquivo } from "@/lib/representadas-traducao";
import type {
  Arquivo as ArquivoGerado,
  Arquivos3D as Arquivo3DGerado,
  Pacote3D as PacoteGerado,
} from "@/payload-types";

/**
 * O formato de um arquivo 3D, lido da extensão do nome gravado.
 *
 * ⚠️ **GERADO, NUNCA DIGITADO (decisão 6 da spec) — "SKP" não pode ser erro de
 * digitação porque ninguém digita.** `.skp`, `.3ds` e `.dwg` chegam do
 * navegador como `application/octet-stream` na maior parte dos sistemas (ver
 * `collections/arquivos.ts`), então `mimeType` não serve para identificar o
 * formato — só a extensão do nome do arquivo é confiável aqui. A mesma função
 * é chamada pela coleção (para recusar um upload sem extensão antes de
 * publicar, `collections/arquivos3d.ts`) e por este mapper — uma segunda
 * leitura de extensão escrita à mão divergiria da primeira na primeira
 * mudança de regra.
 */
export function formatoDoArquivo(
  nomeDoArquivo: string | null | undefined,
): string | undefined {
  const nome = nomeDoArquivo?.trim();
  if (!nome) return undefined;

  const pontoFinal = nome.lastIndexOf(".");
  // Sem ponto, ou ponto colado no início do nome (sem nome antes dele): não
  // há extensão nenhuma para ler, e inventar "ARQUIVO" mentiria sobre um
  // formato que ninguém declarou.
  if (pontoFinal <= 0 || pontoFinal === nome.length - 1) return undefined;

  return nome.slice(pontoFinal + 1).toUpperCase();
}

/**
 * Um download, pronto para o componente — o item da biblioteca (`Arquivo3D`) e
 * o pacote completo (`Baixavel` sozinho) saem os dois daqui.
 *
 * ⚠️ **FORMATO E PESO SÃO OS DOIS GERADOS, E OS DOIS TÊM QUE EXISTIR JUNTOS —
 * NÃO HÁ ESTADO "A PEDIR" AQUI.** Diferente do catálogo (que pode ser
 * declarado sem arquivo em mãos), um Arquivo3D É o arquivo: a biblioteca só
 * existe pelo que está em disco. Por isso este mapper devolve `undefined`
 * inteiro — não um objeto pela metade — quando o upload veio só como
 * identificador (profundidade errada), sem tamanho medido, ou sem extensão
 * legível. `collections/arquivos3d.ts` já recusa os dois últimos casos ANTES
 * de publicar; esta função é a segunda camada da mesma garantia (decisão 5:
 * validação de editor e segurança de tipo são dois trabalhos, os dois
 * existem), para o dia em que uma consulta populariza em profundidade 0 por
 * engano.
 *
 * `nome`, `formato` e `mb` sempre chegam juntos ao componente — é o tipo, não
 * uma convenção de UI, que garante que formato e peso "aparecem antes do link
 * de download": não existe como montar um `Arquivo3D` sem os três.
 *
 * ⚠️ **PRA-127 NÃO ABRE UMA EXCEÇÃO PARA O DOWNLOAD COM CADASTRO.** O pacote
 * completo é o único arquivo do site atrás de um formulário, e ele atravessa
 * exatamente este mesmo tipo: sem peso medido e sem extensão legível ele não
 * existe, e o formulário que o pediria não é desenhado. Um gate que esconde o
 * tamanho até depois do cadastro é a versão pior da mesma quebra de promessa —
 * a pessoa paga com o dado dela e só então descobre que são 60 MB.
 */
export type Baixavel = {
  url: string;
  formato: string;
  mb: number;
};

export type Arquivo3D = Baixavel & {
  nome: string;
};

/**
 * O upload traduzido em endereço, formato e peso — os três juntos ou nenhum.
 *
 * ⚠️ **EXTRAÍDA EM PRA-127 PORQUE O PACOTE COMPLETO FAZ A MESMA PROMESSA QUE UM
 * ARQUIVO SOLTO.** O gate de cadastro muda QUEM baixa; não muda o que a página
 * declara antes do clique. Se esta leitura fosse escrita duas vezes — uma para
 * o item da biblioteca, outra para o pacote —, o dia em que a regra de peso
 * mudasse deixaria as duas discordando na mesma tela, que é exatamente o modo
 * de falha que `components/linha-de-catalogo.tsx` já registra para "24,0 MB"
 * virando "24MB" na página ao lado.
 */
function baixavelDoUpload(
  arquivo: number | ArquivoGerado | null | undefined,
): Baixavel | undefined {
  // Veio só como identificador (profundidade 0): nem endereço nem tamanho
  // existem ali — mesmo estado que `catalogoDoPainel` trata em
  // `lib/representadas-traducao.ts`.
  if (!arquivo || typeof arquivo !== "object") return undefined;

  const url = texto(arquivo.url);
  const formato = formatoDoArquivo(arquivo.filename);
  const mb = pesoDoArquivo(arquivo);

  if (url === undefined || formato === undefined || mb === undefined)
    return undefined;

  return { url, formato, mb };
}

export function arquivo3DDoPainel(doc: Arquivo3DGerado): Arquivo3D | undefined {
  const nome = texto(doc.nome);
  if (nome === undefined) return undefined;

  const baixavel = baixavelDoUpload(doc.arquivo);
  if (baixavel === undefined) return undefined;

  return { nome, ...baixavel };
}

/**
 * O pacote completo — as quatro marcas, mais acabamentos e tecidos, num
 * download só (PRA-127).
 *
 * ⚠️ **É O ÚNICO DOWNLOAD DO SITE ATRÁS DE CADASTRO, E A EXCEÇÃO TEM MOTIVO
 * ECONÔMICO, NÃO DE PRODUTO.** A GDA já está na Casoca — gratuita, sem
 * cadastro, dominante. Pedir os dados de um arquiteto em troca de um arquivo
 * que a Casoca entrega ungated não captura o lead: **doa** o lead, porque a
 * pessoa fecha a aba e baixa do outro lado em dez segundos. O que a Casoca
 * estruturalmente não tem é o conjunto — quatro fábricas juntas, com as cartas
 * de acabamento e tecido —, e é só sobre esse conjunto que o cadastro se
 * sustenta. Ver `lib/arquivos3d-consulta.ts` e a nota de topo de
 * `app/(frontend)/arquivos-3d/page.tsx`.
 *
 * ⚠️ **SEM PACOTE PUBLICADO, A SEÇÃO INTEIRA SOME — E ISSO É A GARANTIA, NÃO A
 * DEGRADAÇÃO.** `undefined` aqui apaga o formulário junto: um cadastro em troca
 * de um arquivo que não existe é a única forma de o site pedir dado pessoal sem
 * dar nada em troca, e nenhum estado de painel pode produzi-la. Seção anulável
 * aplicada ao único lugar onde ela protege o visitante em vez do layout.
 *
 * ⚠️ **O PACOTE NÃO TEM `nome`, DE PROPÓSITO.** Um item da biblioteca precisa
 * dizer QUAL peça é ("Cadeira Zuri"); o pacote é um só, e o título dele é fixo
 * no desenho da seção. Ler `Arquivo.titulo` daqui daria uma segunda escrita do
 * mesmo cabeçalho — a que continua dizendo "Pacote 2026" em 2027.
 */
export function pacoteDoPainel(doc: PacoteGerado): Baixavel | undefined {
  return baixavelDoUpload(doc.pacote);
}

/**
 * A biblioteca agrupada por representada, sem grupo vazio.
 *
 * ⚠️ **O AGRUPAMENTO DEIXOU DE SER O DESENHO DA PÁGINA EM 05/08/2026, e esta
 * função sobreviveu por outro motivo.** `/arquivos-3d` achata os grupos em uma
 * lista só (`arquivos3DDoSite`) e recorta por filtro; o que continua a ser feito
 * aqui é **descartar a fábrica sem arquivo**, e isso não é layout — é a garantia
 * de que uma marca sem nada em disco não vire opção de filtro que devolve tela
 * vazia. Ver a nota de `recortesDeMarca`.
 *
 * ⚠️ **AGRUPAR NÃO É FILTRAR, E A DISTINÇÃO É O PRINCÍPIO 2 DO `PRODUCT.md`
 * INTEIRO.** "O filtro nunca sai da marca" continua valendo ao pé da letra:
 * nenhuma consulta deste projeto pede arquivos de duas fábricas ao mesmo tempo
 * (ver `buscarBiblioteca3D` em `lib/arquivos3d-consulta.ts`, que é N leituras
 * escopadas por `representada.slug`, nunca uma leitura sem escopo). O que esta
 * função faz é ORDENAR na tela o que já veio separado — e é por isso que ela é
 * pura e recebe os grupos prontos: não existe aqui um lugar onde um `where`
 * transversal pudesse nascer.
 *
 * ⚠️ **UMA FÁBRICA SEM ARQUIVO NÃO VIRA OPÇÃO ÓRFÃ.** Seção anulável
 * (`CONTEXT.md`) na forma que a lista plana lhe deu: enquanto a página agrupava,
 * a marca sem arquivo virava um `<h2>` sobre nada; agora ela viraria um botão de
 * filtro que zera a tela. É o mesmo defeito com outra cara, e morre no mesmo
 * lugar. Hoje NENHUMA das quatro tem arquivo 3D cadastrado.
 */
export function bibliotecaPorRepresentada<M>(
  grupos: readonly { marca: M; arquivos: Arquivo3D[] }[],
): { marca: M; arquivos: Arquivo3D[] }[] {
  return grupos.filter((grupo) => grupo.arquivos.length > 0);
}

/**
 * A fábrica, reduzida ao que uma lista de arquivos precisa saber dela.
 *
 * ⚠️ **É PROPOSITALMENTE MAGRO, E O MOTIVO É A FRONTEIRA DO CLIENTE** — a mesma
 * razão, palavra por palavra, de `lib/representadas.ts#MarcaDoCatalogo`. A lista
 * de `/arquivos-3d` filtra no navegador, então ela atravessa como props
 * serializadas; mandar a `Representada` inteira levaria fotografia, ficha, oito
 * designers e dezenove categorias por linha, dezenas de KB de JSON para desenhar
 * um nome.
 *
 * ⚠️ **NÃO É UM ALIAS DE `MarcaDoCatalogo`, E A DUPLICAÇÃO É DELIBERADA.** As
 * duas têm hoje os mesmos dois campos por coincidência de necessidade, não por
 * parentesco: uma é o que a linha de catálogo precisa, a outra é o que a linha
 * de arquivo precisa. Aliasadas, o dia em que a lista de catálogos precisar do
 * `slug` de outra coisa reescreve a biblioteca 3D junto — que é exatamente o
 * acoplamento que `GRADE_DO_ARQUIVO` recusa em
 * `components/arquivos-3d/linha-de-arquivo.tsx`, pelo mesmo motivo.
 */
export type MarcaDoArquivo = {
  slug: string;
  nome: string;
};

/**
 * Um arquivo e a fábrica dele — a entrada da lista de `/arquivos-3d`.
 *
 * ⚠️ **A LISTA FICOU PLANA EM 05/08/2026, e isso reverte o agrupamento por
 * fábrica que esta biblioteca nasceu tendo.** O argumento antigo era que
 * "Cadeira Zuri" não diz de quem é, e ele continua verdadeiro — o que mudou é
 * quem responde: **a fábrica virou uma coluna da linha**, como já é em
 * `/catalogos`. Um `<h2>` por marca e uma coluna `FÁBRICA` respondem à mesma
 * pergunta; a coluna responde em toda linha, e a lista plana ainda pode ser
 * recortada por um filtro, que blocos empilhados não podem.
 */
export type ItemDaBiblioteca = {
  arquivo: Arquivo3D;
  marca: MarcaDoArquivo;
};

/**
 * A biblioteca inteira numa lista só, na ordem em que a página a apresenta.
 *
 * A ordem é **fábrica, depois nome da peça, depois formato** — e o desempate
 * final é o formato justamente para o caso que motivava o agrupamento antigo:
 * "Cadeira Zuri" em `.skp` e em `.dwg` são duas linhas com o mesmo nome, e aqui
 * elas saem **encostadas uma na outra**, diferindo só na medida à direita. A
 * ordem das fábricas é a que chegou do painel (campo `ordem`), a mesma da
 * galeria da home: uma segunda ordenação por nome aqui faria a mesma marca
 * aparecer em terceiro num lugar e em primeiro no outro.
 *
 * ⚠️ **A ORDENAÇÃO É ESCRITA AQUI, e não herdada do `sort: "nome"` da consulta.**
 * A consulta ordena por nome e não tem como expressar o desempate por formato —
 * e uma ordem que depende de duas metades, uma no Payload e outra em lugar
 * nenhum, é uma ordem que ninguém consegue afirmar por teste. Esta função
 * declara a ordem inteira e é pura.
 *
 * ⚠️ A marca é **estreitada** para dois campos na saída, e não repassada como
 * veio: ver a nota de `MarcaDoArquivo`.
 */
export function arquivos3DDoSite(
  grupos: readonly { marca: MarcaDoArquivo; arquivos: readonly Arquivo3D[] }[],
): ItemDaBiblioteca[] {
  return grupos.flatMap(({ marca, arquivos }) =>
    [...arquivos]
      .sort((a, b) => {
        const porNome = a.nome.localeCompare(b.nome, "pt-BR");
        if (porNome !== 0) return porNome;
        return a.formato.localeCompare(b.formato, "pt-BR");
      })
      .map((arquivo) => ({
        arquivo,
        marca: { slug: marca.slug, nome: marca.nome },
      })),
  );
}

/** Uma opção de filtro: a chave que recorta, o que ela se chama na tela, e
 *  quantos arquivos ela devolve. */
export type OpcaoDeRecorte = {
  chave: string;
  rotulo: string;
  quantidade: number;
};

/**
 * As opções de um eixo do filtro, contadas sobre a lista que recebem.
 *
 * ⚠️ **A QUANTIDADE É O RESULTADO DO CLIQUE, NÃO UM TOTAL DE CATÁLOGO — e é por
 * isso que a lista entra por parâmetro em vez de ser lida aqui dentro.** Quem
 * chama passa a biblioteca **já recortada pelo outro eixo**, então o número ao
 * lado de `SKP` é literalmente quantas linhas sobram se você clicar em `SKP`
 * agora. É a regra do `SKP · 8,4 MB` aplicada a um controle: declarar o custo do
 * clique antes do clique. Contadas sobre a lista inteira, as duas facetas
 * ofereceriam combinações que devolvem tela vazia — o botão morto de novo, em
 * miniatura.
 */
function contarRecortes(
  entradas: readonly { chave: string; rotulo: string }[],
): OpcaoDeRecorte[] {
  const porChave = new Map<string, OpcaoDeRecorte>();

  for (const { chave, rotulo } of entradas) {
    const existente = porChave.get(chave);
    if (existente) existente.quantidade += 1;
    else porChave.set(chave, { chave, rotulo, quantidade: 1 });
  }

  return [...porChave.values()];
}

/**
 * As fábricas que o filtro oferece — só as que têm arquivo na lista recebida.
 *
 * A ordem é a de aparição, que é a do painel: as opções ficam na mesma ordem das
 * linhas que elas recortam.
 */
export function recortesDeMarca(
  lista: readonly ItemDaBiblioteca[],
): OpcaoDeRecorte[] {
  return contarRecortes(
    lista.map(({ marca }) => ({ chave: marca.slug, rotulo: marca.nome })),
  );
}

/**
 * Os formatos que o filtro oferece — só os que têm arquivo na lista recebida.
 *
 * ⚠️ **ESTE EIXO É A REVERSÃO DECLARADA DE 05/08/2026, e ele foi recusado duas
 * vezes por escrito antes de entrar.** As duas recusas estavam certas sobre o
 * filtro que elas viram, e nenhuma das duas alcança este:
 *
 *   1. *"Exigiria uma leitura de arquivos 3D sem pai"* — a porta por onde "o
 *      filtro nunca sai da marca" (princípio 2 do `PRODUCT.md`) deixaria de
 *      valer. **Não exige.** `buscarBiblioteca3D` continua sendo N leituras
 *      escopadas por `representada.slug`, sem um `where` transversal em lugar
 *      nenhum; o recorte é `Array.filter` no navegador, sobre a lista que a
 *      página já tinha desenhado. É exatamente a construção que `/catalogos`
 *      publicou para o filtro por fábrica, e pelo mesmo argumento: **filtrar na
 *      tela não é filtrar na consulta.**
 *   2. *"Desenharia quatro botões sobre zero arquivo"* — a matriz vazia. **Não
 *      desenha.** As opções saem da lista, então um formato sem arquivo não vira
 *      opção, e uma biblioteca vazia não tem eixo nenhum para mostrar.
 *
 * O que muda de verdade é a frase *"o filtro cabe dentro de um grupo — nunca por
 * cima deles"*, que esta função contradiz: com a lista plana não há grupo, e o
 * formato passa a recortar as fábricas todas de uma vez. É o recorte certo para
 * o eixo: quem só abre SketchUp quer os `.skp` **das quatro**, não os `.skp` de
 * uma. Agrupar por formato dentro da marca nunca deu isso.
 *
 * ⚠️ **A ORDEM É ALFABÉTICA, E NÃO PODIA SER OUTRA COISA.** `formato` é gerado
 * da extensão — não há campo de painel a respeitar, como `Representada.ordem` é
 * para as fábricas — e a ordem de aparição seria a ordem de cadastro, arbitrária
 * na tela.
 */
export function recortesDeFormato(
  lista: readonly ItemDaBiblioteca[],
): OpcaoDeRecorte[] {
  return contarRecortes(
    lista.map(({ arquivo }) => ({
      chave: arquivo.formato,
      rotulo: arquivo.formato,
    })),
  ).sort((a, b) => a.chave.localeCompare(b.chave, "pt-BR"));
}

/** O recorte que não recorta. Não é slug de marca nem sigla de formato — o
 *  formato de um slug de painel proíbe o valor vazio, e uma extensão vazia não
 *  produz `Arquivo3D` nenhum (ver `formatoDoArquivo`). */
export const SEM_RECORTE = "";

/** O estado inteiro da lista filtrada: o que está ativo, o que cada eixo
 *  oferece, e o que sobra na tela. */
export type RecorteDaBiblioteca = {
  marca: string;
  formato: string;
  marcas: OpcaoDeRecorte[];
  formatos: OpcaoDeRecorte[];
  visiveis: ItemDaBiblioteca[];
};

/**
 * A biblioteca vista através dos dois eixos do filtro.
 *
 * ⚠️ **É UMA FUNÇÃO PURA, E É POR ISSO QUE O COMPONENTE DE LISTA NÃO TEM
 * LÓGICA.** O que o navegador guarda são duas strings — a INTENÇÃO de quem
 * clicou. Tudo o que aparece na tela (as opções de cada eixo, as contagens delas
 * e as linhas visíveis) é derivado daqui, de uma vez, e pode ser afirmado por
 * teste comum sem montar React.
 *
 * ⚠️ **CADA EIXO CONTA SOBRE A LISTA JÁ RECORTADA PELO OUTRO.** É o que impede a
 * combinação morta: escolhida a Trisol, `formatos` só oferece os formatos que a
 * Trisol tem, e o número ao lado de cada um é quantas linhas sobram se você
 * clicar nele. Sem isso, `Trisol + DWG` seria oferecido por dois controles que
 * concordam em levar a uma tela vazia — o botão morto que esta rota e
 * `/catalogos` já mataram uma vez cada.
 *
 * ⚠️ **A INTENÇÃO NÃO PODE PRENDER A TELA NUM RECORTE QUE DEIXOU DE EXISTIR.**
 * Uma marca que perde o último arquivo entre duas renderizações, ou um formato
 * que some quando o `.dwg` é despublicado, deixariam o estado apontando para uma
 * chave sem correspondente. Por isso a cascata: tenta o recorte pedido; depois
 * abre mão da marca; depois abre mão do formato; e só então mostra tudo. Quem
 * escolheu duas coisas e perdeu uma fica com a outra, em vez de voltar à estaca
 * zero — e a função termina sempre, porque o último degrau não filtra nada.
 */
export function recorteDaBiblioteca(
  lista: readonly ItemDaBiblioteca[],
  marcaPretendida: string,
  formatoPretendido: string,
): RecorteDaBiblioteca {
  const daMarca = (chave: string) => (item: ItemDaBiblioteca) =>
    chave === SEM_RECORTE || item.marca.slug === chave;

  const doFormato = (chave: string) => (item: ItemDaBiblioteca) =>
    chave === SEM_RECORTE || item.arquivo.formato === chave;

  const recortar = (marca: string, formato: string): RecorteDaBiblioteca => ({
    marca,
    formato,
    marcas: recortesDeMarca(lista.filter(doFormato(formato))),
    formatos: recortesDeFormato(lista.filter(daMarca(marca))),
    visiveis: lista.filter(daMarca(marca)).filter(doFormato(formato)),
  });

  const cascata: [string, string][] = [
    [marcaPretendida, formatoPretendido],
    [SEM_RECORTE, formatoPretendido],
    [marcaPretendida, SEM_RECORTE],
  ];

  for (const [marca, formato] of cascata) {
    const tentativa = recortar(marca, formato);
    if (tentativa.visiveis.length > 0) return tentativa;
  }

  return recortar(SEM_RECORTE, SEM_RECORTE);
}

/**
 * Quantos arquivos a biblioteca inteira tem — **gerado**, nunca digitado.
 *
 * A mesma regra de toda contagem em prosa do site (`lib/frase.ts`): o dia em
 * que o segundo lote de blocos entrar pelo painel, um número escrito à mão
 * continuaria dizendo o do primeiro.
 */
export function totalDeArquivos3D(
  grupos: readonly { arquivos: Arquivo3D[] }[],
): number {
  return grupos.reduce((soma, grupo) => soma + grupo.arquivos.length, 0);
}
