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
 *      palavras na frente.** As três palavras seguintes são as mesmas de 30/07,
 *      e isso é correto: o que estava errado nelas nunca foi o vocabulário, era
 *      a ausência do sujeito.
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
 *    ⚠️ **É "MÓVEIS", E NUNCA "MOBILIÁRIO" — 05/08/2026.** O h1 nasceu dizendo
 *    "mobiliário de área externa" e o cliente derrubou a palavra na leitura:
 *    "quem que fala isso". Ele está certo, e as fábricas provam: a Bux Garden
 *    vende "móveis de luxo para área externa", a GDA "móveis de alto padrão"
 *    (`briefing/empresa.md`). "Mobiliário" é palavra de catálogo e de release;
 *    ninguém do ramo a diz em voz alta. **O termo do setor é o que o setor
 *    escreve sobre a própria porta, e isso se confere no briefing, não no bom
 *    gosto de quem edita.**
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

  /* ⚠️ **A ALTURA PASSOU A FECHAR EXATAMENTE NA TELA — 05/08/2026.** Era
     `100svh-9rem` no telefone contra um cabeçalho de 6rem (3,5rem da faixa da
     marca mais 2,5rem da navegação): sobravam 3rem de propósito, deixando
     aparecer uma tira da seção seguinte como convite à rolagem. No mundo de
     arquivo aquilo era coerente — a página se anunciava como documento, e
     documento não finge ser tela cheia. Na barra de qualidade escolhida pelo
     cliente o herói ocupa a tela e a rolagem se descobre rolando; uma tira de
     off-white no pé de uma fotografia sangrada lê como imagem cortada curta,
     não como convite. Os dois valores agora são o cabeçalho e nada mais. */
  return (
    <section
      aria-labelledby="promessa"
      className="relative flex h-[calc(100svh-6rem)] min-h-[32rem] flex-col justify-end overflow-hidden bg-ink md:h-[calc(100svh-4.5rem)]"
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
          deck iluminado em parte das telas. Ele escurece só o pé da imagem.

          ⚠️ **SUBIU DE 70/30 PARA 80/42 EM 05/08/2026, E O NÚMERO SAIU DE
          MEDIÇÃO, NÃO DE OLHO.** A fotografia de abertura foi refeita em luz de
          fim de tarde, e o deck iluminado que ela trouxe é MUITO mais claro do
          que o da versão cinzenta anterior. Medindo o fundo real sob os glifos
          do h1 na captura de 1440×900 — com o texto escondido, para não medir a
          própria letra —, o véu antigo entregava média de 9,8:1 e **2,39:1 no
          pior pixel**, contra os 3:1 que a WCAG pede para texto grande. A média
          passar não basta: a palavra que cai no ponto claro é a que ninguém lê.
          A linha de apoio já passava com folga (9,1:1 no percentil 95) e passa
          com mais agora.

          ⚠️ **TROCAR A FOTOGRAFIA DE ABERTURA PEDE REMEDIR ISTO.** O véu é
          calibrado contra uma imagem específica; uma foto mais clara torna
          estes dois números insuficientes de novo, e o defeito é invisível em
          revisão porque a média continua ótima. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/80 via-black/42 to-transparent"
      />

      <div className="relative px-5 pb-14 md:px-8 md:pb-20">
        {/* ⚠️ A medida acompanha a copy, e mudou com ela em 05/08/2026: 18ch
            quebrava o título antigo, de 62 caracteres, em quatro linhas. A
            frase de agora tem 52 e cabe nas DUAS linhas que a composição pede
            (`.impeccable/surfaces/src-app-frontend-page-tsx.md`) —
            "Representação comercial de" / "móveis para área externa."
            Reescrever o h1 sem reconferir este número é como a primeira tela
            volta a quebrar torto. No telefone o `px-5` do contêiner limita antes
            deste teto, e a frase quebra sozinha.

            ⚠️ **O PESO É 300 AQUI E SÓ AQUI.** A display subiu para 72px com a
            troca de mundo, e 400 nesse corpo sobre fotografia fecha os contornos
            e lê como anúncio. O 300 mora nesta chamada, e não no token, porque
            `/quem-somos` usa a mesma display para o ano de fundação em numeral
            tabular — ali o ultraleve some. Ver a nota do token em
            `globals.css`. */}
        <h1
          id="promessa"
          className="text-display max-w-[27ch] font-light text-balance text-white"
        >
          Representação comercial de móveis para área externa.
        </h1>
        {/* ⚠️ "no Sul do país", e não a lista de estados: `emLista` devolve
            "Paraná, Santa Catarina e Rio Grande do Sul" sem preposição, e cada
            estado pede a sua — "no Paraná", "em Santa Catarina", "no Rio Grande
            do Sul". A frase antiga imprimia "no Paraná, Santa Catarina e Rio
            Grande do Sul", que não é português, e essa regência não cabe numa
            junção genérica. Os três estados continuam nomeados por extenso na
            descrição de SEO do layout, no rodapé, em `/quem-somos` e em
            `/representadas` — a home não é o único lugar onde eles aparecem. */}
        {/* ⚠️ **O TETO SUBIU DE 62ch PARA 78ch PARA MATAR UMA VIÚVA.** Com 62ch
            a frase quebrava em 1440px deixando "27 anos." sozinho numa segunda
            linha, logo abaixo de uma display de 72px — duas palavras órfãs no
            lugar mais visível do site. `text-pretty` não resolve sozinho porque
            o teto é que estava apertado, não o algoritmo de quebra. 78ch cabe a
            frase inteira numa linha nas larguras de desktop e continua deixando
            o telefone quebrar sozinho no `px-5`. Reescrever a lista de marcas
            (ela é gerada, e cresce com a quinta fábrica) pede reconferir isto. */}
        <p className="text-body mt-5 max-w-[78ch] text-pretty text-white/85">
          A Belmare representa {nomeadas} no Sul do país{tempoDeCasa}.
        </p>
      </div>
    </section>
  );
}
