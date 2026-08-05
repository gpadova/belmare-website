import Image from "next/image";
import Link from "next/link";

import { Logotipo } from "@/components/logotipo";
import { buscarHome } from "@/lib/espinha-consulta";
import { porExtenso } from "@/lib/frase";
import { imagemDaRepresentada, paginaDaRepresentada } from "@/lib/representadas";
import { representadasDaPagina } from "@/lib/representadas-consulta";

/**
 * As quatro representadas.
 *
 * ⚠️ **ESTA SEÇÃO RECUSOU LOGOTIPO ATÉ 05/08/2026, E A RECUSA FOI REVERTIDA
 * POR DECISÃO DE PRODUTO.** O texto anterior dizia: "cada uma entra com
 * produto, não com logotipo em grade — grade de logo é diretório de fornecedor,
 * e além disso não existe vetor autorizado das fábricas". O segundo argumento
 * nunca foi de desenho: ativo que não chegou é motivo para o campo existir, não
 * para ele não existir — `PRODUCT.md` é explícito em que o painel é o registro
 * do que chegou. O primeiro continua valendo, e é por isso que o que entrou
 * **não é** uma grade de logos: a marca encabeça o cartão e a fotografia segue
 * embaixo dela, respondendo o h2, que pergunta o que cada fábrica FAZ — pergunta
 * que quatro logotipos não respondem.
 *
 * ⚠️ **A MARCA NÃO ENCOSTA NO NOME, E ESSA É A CONDIÇÃO DA REVERSÃO.** A regra
 * de `marca/abertura.tsx` proíbe repetir o nome da fábrica imediatamente acima
 * dele — "ler 'TRISOL' logo acima de 'Trisol'" é o leitor gastando um segundo
 * com nada. Aqui a fotografia inteira separa os dois, e o `h3` continua sendo
 * quem carrega o link, o sublinhado e o nome acessível; a marca é publicada com
 * `alt=""`. Encostar um no outro reabre a regra.
 *
 * ⚠️ As imagens ilustram a LINHA de cada marca; não são peças do catálogo
 * dela. Isso está dito em texto visível no pé da seção, não só no alt: um mock
 * que se passa por acervo real é o tipo de mentira que este projeto não comete.
 *
 * ⚠️ **O TÍTULO CONTA AS MARCAS, O PARÁGRAFO É CAMPO.** A frase do título é
 * fixa e o número dentro dela é gerado das representadas publicadas: cadastrar
 * a quinta fábrica muda "quatro" para "cinco" sem ninguém editar nada. O
 * parágrafo abaixo dele é o ÚNICO campo de texto da home inteira (global
 * `Home`) — e some quando está em branco, em vez de abrir um vão.
 *
 * ⚠️ **O TÍTULO ERA "As quatro fábricas que a Belmare representa." E MUDOU EM
 * 05/08/2026, POR CAUSA DA ABERTURA.** Desde que o h1 passou a ser
 * "Representação comercial de móveis para área externa." e a linha de apoio a
 * dizer "A Belmare representa Marê Mobília, GDA Móveis, Bux Garden e Trisol",
 * este h2 repetia "a Belmare representa" uma tela depois — a mesma frase duas
 * vezes na mesma rolagem. O título de agora anuncia o trabalho que a seção de
 * fato faz, que é dizer a LINHA de cada fábrica, e não repetir a relação
 * comercial que a abertura já estabeleceu. Mexer na abertura pede reler esta
 * frase.
 *
 * ⚠️ O aviso do pé da seção continua fixo: ele é a marcação de imagem de
 * referência exigida por desenho, não prosa de marketing sobre as fábricas.
 */
export async function RepresentadasGaleria() {
  const representadas = await representadasDaPagina();
  const { galeria } = await buscarHome();

  /* ⚠️ **A FAIXA DA MARCA É DECIDIDA PELA SEÇÃO, NUNCA PELO CARTÃO.** Se cada
     cartão desenhasse a própria faixa só quando tem logotipo, o estado que vamos
     viver por meses — uma fábrica respondeu ao e-mail, três não — sairia como
     uma fotografia começando 44px abaixo das outras três, e uma grade
     desalinhada lê como defeito de build, não como acervo incompleto. Com uma
     marca só no ar, os quatro cartões abrem a faixa; sem nenhuma, ela não
     existe e a seção fica exatamente como está hoje. É a seção anulável aplicada
     na altura certa da árvore. */
  const temFaixaDeMarca = representadas.some((r) => r.logotipo !== undefined);

  return (
    <section aria-labelledby="representadas" className="px-5 py-16 md:px-8 md:py-24">
      <div className="max-w-[46ch]">
        <h2 id="representadas" className="text-h1 font-normal">
          O que cada uma das {porExtenso(representadas.length)} fábricas faz.
        </h2>
        {galeria !== undefined && (
          <p className="text-body mt-4 text-graphite">{galeria}</p>
        )}
      </div>

      <ul className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
        {representadas.map((r) => {
          const imagem = imagemDaRepresentada(r);

          return (
          <li key={r.slug}>
            <Link href={paginaDaRepresentada(r)} className="group block">
              {/* A faixa reserva a altura mesmo quando esta fábrica ainda não
                  mandou o vetor — ver `temFaixaDeMarca`. Alinhada ao pé para
                  que marcas de proporções diferentes assentem sobre a mesma
                  linha em vez de flutuarem cada uma na sua altura. */}
              {temFaixaDeMarca && (
                <div className="mb-4 flex h-9 items-end md:h-10">
                  {r.logotipo && (
                    <Logotipo
                      src={r.logotipo}
                      className="max-h-9 max-w-[9rem] md:max-h-10 md:max-w-[11rem]"
                    />
                  )}
                </div>
              )}

              {/* Retrato no desktop, paisagem no telefone: quatro retratos
                  empilhados em coluna única transformavam a seção num rolo
                  interminável.

                  ⚠️ E é justamente por trocar de forma entre as duas telas que
                  o ponto focal precisa ser aplicado AQUI. 3/2 e 4/5 cortam a
                  mesma fotografia por eixos diferentes: o que sobra no telefone
                  não é o que sobra no desktop. `imagemDaRepresentada` já traz a
                  posição que o operador clicou no painel — ignorá-la era jogar
                  fora o dado depois de calculá-lo. Sem clique, `posicao` é
                  `undefined` e o CSS segue centralizando. */}
              <div className="relative aspect-3/2 overflow-hidden bg-ink sm:aspect-4/5">
                <Image
                  src={imagem.src}
                  alt={imagem.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                  style={imagem.posicao ? { objectPosition: imagem.posicao } : undefined}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                />
              </div>

              <h3 className="text-h3 mt-5 font-normal underline decoration-line decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-ink">
                {r.nome}
              </h3>
              <p className="text-support mt-2 text-graphite">{r.resolve}.</p>
              <p className="text-support mt-3 text-graphite">
                {r.base ? `${r.base} · ` : ""}
                {r.fato}
              </p>
            </Link>
          </li>
          );
        })}
      </ul>

      <p className="text-support mt-12 max-w-[68ch] text-graphite">
        Imagens de referência, para mostrar a linha de cada fábrica. As
        fotografias das marcas entram no lugar delas assim que chegarem.
      </p>
    </section>
  );
}
