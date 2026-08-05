import Image from "next/image";
import Link from "next/link";

import { Logotipo } from "@/components/logotipo";
import { buscarHome } from "@/lib/espinha-consulta";
import { porExtenso } from "@/lib/frase";
import { imagemDaRepresentada, paginaDaRepresentada } from "@/lib/representadas";
import { representadasDaPagina } from "@/lib/representadas-consulta";

/**
 * As representadas — **um trilho horizontal desde 05/08/2026**, e não mais uma
 * grade de quatro colunas.
 *
 * ⚠️ **A GRADE CAIU COM A TROCA DE MUNDO, MAS O MOTIVO É O MESMO QUE JÁ VALIA.**
 * A versão anterior era `sm:grid-cols-2 lg:grid-cols-4`, e o comentário dela já
 * registrava o risco: P18 está aberto — não se sabe se o portfólio cresce — e
 * uma grade de quatro quebra com três ou com seis. Uma quinta fábrica cadastrada
 * hoje deixaria a última fileira com um cartão sozinho e três buracos. O trilho
 * não quebra com nenhuma quantidade: quatro cabem, seis rolam, três param antes
 * da borda. É a mesma decisão que fez `/catalogos` virar lista plana em vez de
 * blocos por marca — estrutura que não depende da contagem.
 *
 * ⚠️ **O INDICADOR É O CARTÃO CORTADO NA BORDA, MAIS `barra-fio` — não um widget
 * de progresso.** O comp aprovado desenha uma trilha fina com um segmento escuro
 * embaixo do trilho, e ela não foi construída: uma barra de progresso honesta
 * precisa saber o deslocamento, e saber o deslocamento é JavaScript no cliente
 * ou uma linha do tempo de rolagem que o Firefox ainda não tem. Trilha que não
 * anda é pior que trilha nenhuma. O projeto já resolveu este mesmo problema duas
 * vezes — na navegação do telefone e na faixa de índice das páginas de marca — e
 * a resposta das duas é a mesma: a barra de rolagem VIRA o fio do sistema
 * (`barra-fio`, 3px na cor de divisor) e o item cortado na borda diz que há
 * mais. Zero JavaScript, funciona em todo navegador, e é peça que já existe.
 *
 * ⚠️ **NÃO HÁ RÓTULO "ARRASTE".** O comp o desenha, e ele erra o verbo em metade
 * dos dispositivos: quem está no desktop com mouse não arrasta, rola. Um
 * controle que descreve errado o próprio gesto custa mais do que a descoberta
 * que ele compra.
 *
 * ⚠️ **A MARCA ENCABEÇA O CARTÃO, E A FAIXA É DECIDIDA PELA SEÇÃO.** As duas
 * regras sobreviveram inteiras à troca de mundo, e são de produto, não de
 * desenho: a fotografia responde o h2 (o que a fábrica FAZ), coisa que quatro
 * logotipos não respondem; e a faixa abre em todos os cartões assim que UMA
 * fábrica mandar o vetor, porque o estado que vamos viver por meses é "uma
 * respondeu, três não" — faixa por cartão sairia como fotografias começando em
 * alturas diferentes, e grade desalinhada lê como defeito de build.
 *
 * ⚠️ **A MARCA NÃO ENCOSTA NO NOME.** A fotografia inteira separa os dois. O
 * `h3` continua carregando o link, o sublinhado e o nome acessível; a marca é
 * publicada com `alt=""`.
 *
 * ⚠️ As imagens ilustram a LINHA de cada marca; não são peças do catálogo dela.
 * Isso está dito em texto visível no pé da seção, não só no alt.
 *
 * ⚠️ **O TÍTULO CONTA AS MARCAS, O PARÁGRAFO É CAMPO.** A frase do título é fixa
 * e o número dentro dela é gerado das representadas publicadas: cadastrar a
 * quinta fábrica muda "quatro" para "cinco" sem ninguém editar nada. O parágrafo
 * abaixo dele é o único campo de texto desta seção (global `Home`) — e some
 * quando está em branco, em vez de abrir um vão.
 */
export async function RepresentadasGaleria() {
  const representadas = await representadasDaPagina();
  const { galeria } = await buscarHome();

  const temFaixaDeMarca = representadas.some((r) => r.logotipo !== undefined);

  return (
    <section aria-labelledby="representadas" className="py-20 md:py-28">
      <div className="px-5 md:px-8">
        <div className="max-w-[46ch]">
          <h2 id="representadas" className="text-h1 font-normal text-balance">
            O que cada uma das {porExtenso(representadas.length)} fábricas faz.
          </h2>
          {galeria !== undefined && (
            <p className="text-body mt-5 text-pretty text-graphite">{galeria}</p>
          )}
        </div>
      </div>

      {/* ⚠️ **A REVELAÇÃO MORA AQUI, E EM MAIS NENHUM LUGAR DA PÁGINA.** É o "um
          momento só" que a nota de `globals.css` cobra como preço de ter
          revogado a Regra do Movimento Fechado. Ela está no trilho inteiro, e
          não em cada cartão: `view()` mede contra o scrollport mais próximo, e o
          mais próximo de um `<li>` daqui é o próprio trilho, que rola na
          horizontal — a faixa nunca dispararia. */}
      <div className="revelar mt-12 md:mt-16">
        {/* ⚠️ O recuo lateral abre o trilho na mesma margem do texto acima, e o
            `pb` reserva a altura da `barra-fio` para ela não comer a última
            linha do cartão.

            ⚠️ **`scroll-pl` NÃO É REDUNDANTE COM `px`, E SEM ELE A MARGEM DA
            PÁGINA SOME.** Encaixe obrigatório (`snap-mandatory`) alinha o
            cartão à borda da CAIXA DE ROLAGEM, e não à borda do padding: no
            primeiro repouso o navegador rolava 20px no telefone e 32px no
            desktop sozinho, encostando a primeira fotografia na borda da janela
            enquanto o título logo acima continuava na margem. Lia como imagem
            sangrando por engano. `scroll-padding` é o que informa ao encaixe
            onde a margem começa, e ele tem que repetir o `px` — os dois valores
            andam juntos, e mexer num sem o outro traz o defeito de volta. */}
        <ul className="barra-fio flex snap-x snap-mandatory scroll-pl-5 gap-6 overflow-x-auto px-5 pb-6 md:scroll-pl-8 md:gap-8 md:px-8">
          {representadas.map((r) => {
            const imagem = imagemDaRepresentada(r);

            return (
              <li
                key={r.slug}
                /* ⚠️ 24rem, e não 30rem. Em 1440px o cartão de 30rem deixava
                   2,9 dos quatro visíveis: a quarta fábrica ficava inteira fora
                   da tela e a terceira cortada pela metade, o que faz o trilho
                   parecer ter três marcas. Em 24rem cabem 3,5 — a quarta entra
                   pela borda e diz que há mais, que é exatamente o que o comp
                   aprovado desenha. É o mesmo raciocínio do item cortado na
                   navegação do telefone: o corte É o indicador, mas só funciona
                   quando o que está cortado dá para reconhecer. */
                className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[24rem]"
              >
                <Link href={paginaDaRepresentada(r)} className="group block">
                  {temFaixaDeMarca && (
                    <div className="mb-5 flex h-9 items-end md:h-10">
                      {r.logotipo && (
                        <Logotipo
                          src={r.logotipo}
                          className="max-h-9 max-w-[9rem] md:max-h-10 md:max-w-[11rem]"
                        />
                      )}
                    </div>
                  )}

                  {/* ⚠️ Um aspecto só, em todas as larguras — e isso é mudança.
                      A grade antiga trocava de 3/2 no telefone para 4/5 a partir
                      de `sm` porque quatro retratos empilhados viravam um rolo
                      interminável. Num trilho nada empilha: o cartão tem quase a
                      largura da tela no telefone e um terço dela no desktop, e a
                      paisagem serve as duas. Também é o que mantém o ponto focal
                      do painel válido — um aspecto só, um corte só. */}
                  <div className="relative aspect-3/2 overflow-hidden bg-ink">
                    <Image
                      src={imagem.src}
                      alt={imagem.alt}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 24rem, (min-width: 640px) 46vw, 78vw"
                      style={
                        imagem.posicao
                          ? { objectPosition: imagem.posicao }
                          : undefined
                      }
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                    />
                  </div>

                  <h3 className="text-h3 mt-6 font-normal underline decoration-line decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-ink">
                    {r.nome}
                  </h3>
                  <p className="text-support mt-3 text-graphite">{r.resolve}.</p>
                  <p className="text-support mt-2 text-graphite">
                    {r.base ? `${r.base} · ` : ""}
                    {r.fato}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="px-5 md:px-8">
        <p className="text-support mt-8 max-w-[68ch] text-graphite">
          Imagens de referência, para mostrar a linha de cada fábrica. As
          fotografias das marcas entram no lugar delas assim que chegarem.
        </p>
      </div>
    </section>
  );
}
