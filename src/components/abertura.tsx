import Image from "next/image";

import { ABERTURA } from "@/lib/acervo";
import { anosDeMercado } from "@/lib/empresa";
import { buscarEmpresa } from "@/lib/empresa-consulta";
import { emLista, porExtenso } from "@/lib/frase";
import { representadasDaPagina } from "@/lib/representadas-consulta";

/**
 * A abertura.
 *
 * Duas correções de rumo estão embutidas aqui e não devem ser desfeitas.
 *
 * 1. A FOTO CARREGA A PÁGINA. Ela sangra na tela inteira e o texto vive sobre
 *    ela. Nada de painel regrado, nada de campo de textura: num site de
 *    mobiliário o herói é a peça, e a interface some para deixá-la falar.
 *    É também o que sobrou de pé quando o sistema de textura caiu — a direção
 *    editorial não precisava dele, e a foto ficou maior sem ele.
 *
 * 2. O TÍTULO NOMEIA O PÚBLICO, E OS OBJETOS DESCERAM PARA A LINHA DE APOIO.
 *    Três versões já caíram, e o motivo de cada uma continua valendo:
 *
 *    · "Quatro fábricas. Um interlocutor." — rejeitado em 30/07/2026. Contar
 *      fábricas e contar interlocutores descreve o ORGANOGRAMA da Belmare, e
 *      quem chega não veio saber como ela se organiza.
 *    · "Móveis para área externa" — a categoria pura descreve uma FÁBRICA, e a
 *      Belmare é representação.
 *    · "Sofá, mesa, espreguiçadeira e ombrelone." — durou de 30/07 a 04/08/2026
 *      e caiu por um defeito que só aparece lendo a página inteira: **ele
 *      descreve uma loja.** Quem cai de busca entende que compra um sofá ali,
 *      desce a página e descobre que a Belmare não vende direto — o h1 montava
 *      a expectativa que o resto do site passa o tempo desmontando, inclusive
 *      na porta "Quero comprar ou revender". E os quatro substantivos não eram
 *      as quatro linhas: sofá, mesa e espreguiçadeira saem todos do móvel, e a
 *      estrutura em alumínio e o estofado não apareciam.
 *
 *    O título de agora nomeia as duas pessoas que de fato compram — quem
 *    especifica e quem revende —, que são exatamente as duas portas no pé da
 *    home.
 *
 *    ⚠️ **A ENUMERAÇÃO DE PRODUTO NÃO VOLTA, NEM REBAIXADA PARA A LINHA DE
 *    APOIO.** Foi a primeira tentativa de conserto, em 04/08/2026, e ela erra
 *    o ICP: o cliente de uma representação comercial é o LOJISTA e o ESCRITÓRIO
 *    DE ARQUITETURA, nunca o consumidor final. Um comprador de loja não precisa
 *    que lhe expliquem que móvel de área externa inclui sofá e espreguiçadeira
 *    — ele já vende isso. Listar peça a peça é escrever para quem vai mobiliar
 *    a própria varanda, e é o mesmo erro do h1 antigo com outra roupa. A linha
 *    de apoio nomeia as FÁBRICAS, o público e o território, que é o que decide
 *    uma conversa comercial.
 *
 * ⚠️ **O H1 NÃO TEM CAMPO NO PAINEL, E NÃO PODE PASSAR A TER.** Ele é o
 * argumento do desenho, não conteúdo dentro dele: um campo de texto aqui é o
 * caminho de volta para uma das duas versões rejeitadas, numa tarde em que
 * ninguém se lembra por que elas caíram. Trocá-lo é reposicionar a empresa, e
 * reposicionamento é conversa, não edição (decisão 3 da spec).
 *
 * ⚠️ **A LINHA DE APOIO É INTEIRAMENTE GERADA — nenhuma palavra dela é digitada
 * em lugar nenhum.** A lista das marcas e a contagem saem das representadas
 * PUBLICADAS no painel, o território sai da malha que desenha a prancha de
 * `/quem-somos`, e o tempo de casa sai da data de abertura. Cadastrar a quinta
 * fábrica muda esta frase sozinho, em duas partes: ela entra na lista E o
 * número vira cinco.
 */
export async function Abertura() {
  const representadas = await representadasDaPagina();
  const { abertura } = await buscarEmpresa();

  const nomeadas = emLista(representadas.map((r) => r.nome));
  const quantas = porExtenso(representadas.length);
  const anos = anosDeMercado(abertura);

  return (
    <section
      aria-labelledby="promessa"
      className="relative flex h-[calc(100svh-9rem)] min-h-[30rem] flex-col justify-end overflow-hidden bg-ink md:h-[calc(100svh-4.5rem)]"
    >
      <Image
        src={ABERTURA.src}
        alt={ABERTURA.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[38%_50%] md:object-center"
      />

      {/* Véu de legibilidade, não ornamento: sem ele o texto claro cai sobre o
          deck iluminado em parte das telas. Ele escurece só o pé da imagem. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/70 via-black/30 to-transparent"
      />

      <div className="relative px-5 pb-10 md:px-8 md:pb-14">
        <h1
          id="promessa"
          className="text-display max-w-[18ch] font-normal text-balance text-white"
        >
          A área externa inteira, para quem especifica e para quem revende.
        </h1>
        {/* ⚠️ "no Sul do país", e não a lista de estados: `emLista` devolve
            "Paraná, Santa Catarina e Rio Grande do Sul" sem preposição, e cada
            estado pede a sua — "no Paraná", "em Santa Catarina", "no Rio Grande
            do Sul". A frase antiga imprimia "no Paraná, Santa Catarina e Rio
            Grande do Sul", que não é português, e essa regência não cabe numa
            junção genérica. Os três estados continuam nomeados por extenso na
            descrição de SEO do layout, no rodapé, em `/quem-somos` e em
            `/representadas` — a home não é o único lugar onde eles aparecem. */}
        <p className="text-body mt-5 max-w-[62ch] text-pretty text-white/85">
          A Belmare representa {nomeadas}, {quantas} fábricas brasileiras de
          mobiliário de área externa. Atende lojas e escritórios de arquitetura
          no Sul do país{anos !== undefined ? ` há ${anos} anos` : ""}.
        </p>
      </div>
    </section>
  );
}
