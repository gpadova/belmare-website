import Image from "next/image";

import { Ficha, FichaLinha } from "@/components/ficha";
import { Logotipo } from "@/components/logotipo";
import { TERRITORIO } from "@/lib/empresa";
import { emLista } from "@/lib/frase";
import {
  imagemLargaDaRepresentada,
  informacoesDaRepresentada,
  type Representada,
} from "@/lib/representadas";

/**
 * A identificação — e, depois de PRA-131, quase a página inteira.
 *
 * ⚠️ **A FOTOGRAFIA DESCEU E A FICHA SUBIU NO LUGAR DELA.** A página abria com a
 * imagem sangrando de ponta a ponta e, logo abaixo, 86 caracteres explicando que
 * a imagem é gerada. Numa rota cuja acusação era "pouca informação", a primeira
 * tela gastava cerca de 480px de altura para mostrar uma fotografia genérica e
 * desmenti-la em seguida — com o nome da fábrica, que é o motivo da visita,
 * dividindo a dobra com o desmentido.
 *
 * A ordem nova é a que as referências próximas usam sem exceção, verificado em
 * fonte primária em 05/08/2026: o Casoca abre a página de uma fábrica com nome,
 * cidade/UF e contato; o Archiproducts com marca, nome e país. **Nenhuma
 * plataforma de especificação abre com fotografia de ambiente em altura total.**
 * É a mesma razão que já tinha deixado `/catalogos` sem nenhuma imagem: quando o
 * visitante veio buscar um dado, fotografia de ambiente é ruído entre ele e o
 * dado. A fotografia continua sendo a única cor da página — ela fecha o bloco em
 * vez de abri-lo.
 *
 * ⚠️ **A FICHA ABSORVEU A SEÇÃO "O QUE A FÁBRICA INFORMA".** Como seção, aquelas
 * linhas tinham título de 42px, fio, número e nota de rodapé — todo esse aparato
 * para transportar duas linhas na Marê e três na Bux. Aqui elas saem coladas no
 * nome, que é onde quem chega já está olhando. Ver `informacoesDaRepresentada`.
 *
 * ⚠️ **O `fato` SAIU DAQUI, E É UM CORTE, NÃO UM ESQUECIMENTO.** A mesma string
 * era impressa três vezes no caminho até esta tela: cartão da home, ficha de
 * `/representadas`, e de novo no topo desta — o visitante clicava para ver mais
 * e recebia de volta exatamente o que o fez clicar. Ela continua viva onde ainda
 * trabalha: nas duas listas que levam até aqui, e na `description` da rota, que é
 * o resumo que o buscador mostra.
 *
 * ⚠️ A imagem é OUTRA que a da galeria da home, de propósito. Ver `acervo.ts`.
 */
export function AberturaDaMarca({
  representada,
}: {
  representada: Representada;
}) {
  const imagem = imagemLargaDaRepresentada(representada);
  const informacoes = informacoesDaRepresentada(
    representada,
    emLista(TERRITORIO),
  );

  return (
    <section
      id="identificacao"
      aria-labelledby="identificacao-titulo"
      className="scroll-mt-36 px-5 pt-10 pb-12 md:scroll-mt-30 md:px-8 md:pt-14 md:pb-16"
    >
      <div className="max-w-[64rem]">
        {/* A marca da fábrica encabeça a página dela, como já encabeça o cartão
            na home e a ficha em `/representadas`. Esta rota era a única
            superfície de uma marca que não mostrava a marca.

            ⚠️ Sem o vetor a caixa não é desenhada: reservar espaço para o que
            nunca vem abriria um vão de 40px acima do nome nas quatro páginas —
            e hoje as quatro fábricas estão sem logotipo. Com o vetor, a altura
            fixa em classe é o que impede o nome de saltar na primeira pintura. */}
        {representada.logotipo ? (
          <div className="mb-8 flex h-10 items-center md:h-12">
            <Logotipo
              src={representada.logotipo}
              className="max-h-10 max-w-44 md:max-h-12 md:max-w-52"
            />
          </div>
        ) : null}

        <h1
          id="identificacao-titulo"
          className="text-display max-w-[14ch] font-normal text-balance"
        >
          {representada.nome}
        </h1>

        {/* O subtítulo, e a única frase corrida da página: o que esta fábrica
            produz, nomeando um objeto. */}
        <p className="text-body mt-5 max-w-[48ch] text-pretty">
          {representada.resolve}.
        </p>

        {/* ⚠️ **46rem, E NÃO O TETO DE 64rem DA COLUNA.** Medido em 1440px: com o
            teto largo, a régua de "Alumínio" corria oitocentos pixels além do
            valor, e uma tabela cujo fio termina longe demais do dado lê como
            quebrada, não como ledger. 46rem deixa a coluna de valor com cerca de
            37rem — a mais longa das quatro fábricas ("Hugo Evandro, designer
            interno — repertório escandinavo e japonês com toque brasileiro",
            85 caracteres) ainda cabe numa linha, e o fio para perto do que
            mede. */}
        <Ficha className="mt-10 max-w-[46rem] md:mt-12">
          {informacoes.map((informacao) => (
            <FichaLinha key={informacao.rotulo} rotulo={informacao.rotulo}>
              {informacao.valor}
            </FichaLinha>
          ))}
        </Ficha>
      </div>

      {/* ⚠️ A figura sai do teto de 64rem e vai até a margem da página: ela é a
          única cor da tela, e uma fotografia represada na largura de uma tabela
          lê como ilustração de tabela. `-mx` desfaz a margem da seção em vez de
          a seção abrir mão dela — o texto acima continua alinhado à mesma coluna
          do resto do site. */}
      <figure className="-mx-5 mt-12 md:-mx-8 md:mt-16">
        <div className="relative aspect-3/2 w-full bg-ink sm:aspect-3/1">
          <Image
            src={imagem.src}
            alt={imagem.alt}
            fill
            priority
            sizes="100vw"
            style={imagem.posicao ? { objectPosition: imagem.posicao } : undefined}
            className="object-cover"
          />
        </div>
      </figure>
    </section>
  );
}
