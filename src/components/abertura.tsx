import Image from "next/image";

import { ABERTURA } from "@/lib/acervo";
import { anosDeMercado } from "@/lib/empresa";
import { buscarEmpresa } from "@/lib/empresa-consulta";
import { emLista } from "@/lib/frase";
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
 * 2. O TÍTULO DIZ O RAMO, COM O NOME QUE O RAMO USA. Quatro versões já caíram,
 *    e o motivo de cada uma continua valendo:
 *
 *    · "Quatro fábricas. Um interlocutor." — rejeitado em 30/07/2026. Contar
 *      fábricas e contar interlocutores descreve o ORGANOGRAMA da Belmare, e
 *      quem chega não veio saber como ela se organiza.
 *    · "Móveis para área externa" — a categoria pura descreve uma FÁBRICA, e a
 *      Belmare é representação. **É esta a objeção que "representação comercial
 *      de…" resolve, e é por isso que a categoria só volta com essas duas
 *      palavras na frente.**
 *    · "Sofá, mesa, espreguiçadeira e ombrelone." — durou de 30/07 a 04/08/2026
 *      e caiu por um defeito que só aparece lendo a página inteira: **ele
 *      descreve uma loja.** Quem cai de busca entende que compra um sofá ali,
 *      desce a página e descobre que a Belmare não vende direto.
 *    · "A área externa inteira, para quem especifica e para quem revende." —
 *      durou 04→05/08/2026. Nomear as duas portas no h1 dava simetria com o pé
 *      da página e mesmo assim o cliente a rejeitou na leitura: promessa de
 *      posicionamento, sem verbo, que não diz em que ramo a empresa está. Um
 *      lojista lê a primeira tela para saber se é com ele, e "a área externa
 *      inteira" não responde isso — "representação comercial" responde em duas
 *      palavras.
 *
 *    ⚠️ **O TESTE DO OBJETO NÃO VALE PARA ESTE H1, E ISSO É DELIBERADO.** A
 *    regra que derrubou "Quatro fábricas. Um interlocutor." era "a frase põe um
 *    objeto na cabeça de quem lê?" — e ela continua valendo para copy escrita
 *    ao consumidor. Aqui não: o leitor desta tela é o LOJISTA e o ESCRITÓRIO DE
 *    ARQUITETURA, e para ele o termo do setor é mais concreto do que o objeto.
 *    Ele já sabe o que é móvel de área externa; o que ele não sabe é se está
 *    diante de uma fábrica, de uma loja ou de uma representação — e é essa a
 *    pergunta que o h1 responde.
 *
 *    ⚠️ **A ENUMERAÇÃO DE PRODUTO NÃO VOLTA, NEM REBAIXADA PARA A LINHA DE
 *    APOIO.** Foi a tentativa de conserto de 04/08/2026 e erra o mesmo ICP: um
 *    comprador de loja não precisa que lhe expliquem que móvel de área externa
 *    inclui sofá e espreguiçadeira — ele já vende isso. Listar peça a peça é
 *    escrever para quem vai mobiliar a própria varanda.
 *
 * ⚠️ **O H1 NÃO TEM CAMPO NO PAINEL, E NÃO PODE PASSAR A TER.** Ele é o
 * argumento do desenho, não conteúdo dentro dele: um campo de texto aqui é o
 * caminho de volta para uma das quatro versões rejeitadas, numa tarde em que
 * ninguém se lembra por que elas caíram. Trocá-lo é reposicionar a empresa, e
 * reposicionamento é conversa, não edição (decisão 3 da spec).
 *
 * 3. A LINHA DE APOIO PAROU DE EXPLICAR O QUE O ICP JÁ SABE — 05/08/2026. Ela
 *    dizia "…, quatro fábricas brasileiras de mobiliário de área externa.
 *    Atende lojas e escritórios de arquitetura no Sul do país há N anos", e as
 *    duas metades sobravam: a primeira DEFINE a categoria, que o h1 agora diz;
 *    a segunda NOMEIA O LEITOR DE VOLTA PARA ELE — um comprador de loja não
 *    precisa que a primeira tela lhe informe que ela atende lojas. Sobrou o que
 *    ele não tem como adivinhar: quais marcas, onde, e desde quando.
 *
 *    A contagem ("quatro fábricas") saiu junto e não deve voltar aqui: ela
 *    continua viva no título da galeria, três dedos abaixo, e dita duas vezes
 *    na mesma rolagem é redundância, não prova.
 *
 * ⚠️ **A LINHA DE APOIO É INTEIRAMENTE GERADA — nenhuma palavra dela é digitada
 * em lugar nenhum.** A lista das marcas sai das representadas PUBLICADAS no
 * painel e o tempo de casa sai da data de abertura. Cadastrar a quinta fábrica
 * muda esta frase sozinho.
 */
export async function Abertura() {
  const representadas = await representadasDaPagina();
  const { abertura } = await buscarEmpresa();

  const nomeadas = emLista(representadas.map((r) => r.nome));
  const anos = anosDeMercado(abertura);
  const tempoDeCasa = anos === undefined ? "" : ` há ${anos} anos`;

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
          Representação comercial de mobiliário de área externa.
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
          A Belmare representa {nomeadas} no Sul do país{tempoDeCasa}.
        </p>
      </div>
    </section>
  );
}
