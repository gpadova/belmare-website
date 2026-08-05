import type { Metadata } from "next";

import { AcaoDeFecho } from "@/components/acao-de-fecho";
import { PranchaAreaExterna } from "@/components/representadas/prancha-area-externa";
import { RegistrosDasRepresentadas } from "@/components/representadas/registros";
import { TERRITORIO } from "@/lib/empresa";
import { emLista } from "@/lib/frase";
import { representadasDaPagina } from "@/lib/representadas-consulta";

export async function generateMetadata(): Promise<Metadata> {
  const representadas = await representadasDaPagina();

  return {
    title: "Representadas",
    description: `As ${representadas.length} fábricas de móveis para área externa representadas pela Belmare no Paraná, em Santa Catarina e no Rio Grande do Sul: ${representadas.map((r) => r.nome).join(", ")}.`,
  };
}

/**
 * `/representadas` — a área externa desmontada.
 *
 * O problema desta rota não era falta de material, era excesso de repetição: a
 * home já mostra as quatro marcas em galeria e `/quem-somos` já as lista em
 * ledger. Uma terceira lista não se justifica. O que nenhuma das duas faz é
 * mostrar que as quatro, JUNTAS, cobrem uma área externa inteira — e é isso que
 * a prancha faz, por demonstração e não por afirmação.
 *
 * A sequência:
 *
 *   PRANCHA 02   o desenho chaveado e a legenda que atribui
 *   Registros    a mesma ordem, agora com origem e fato
 *   Fecho        falar com a Belmare
 *
 * Ritmo: imagem larga e silenciosa → registros densos → ação. É o inverso
 * deliberado de `/quem-somos`, que vai de denso a foto.
 *
 * ⚠️ O QUE NÃO ENTRA, e a lista é vinculante: grade de quatro colunas · tabela
 * comparativa marca × atributo, que é o eixo de material voltando pela porta
 * dos fundos · repetir a galeria da home · território por marca, porque a
 * promessa é "Sul do Brasil" igual para as quatro · qualquer chamada de
 * recrutamento de novas marcas, que é oferta comercial que ninguém confirmou.
 *
 * ⚠️ **"LOGO DAS FÁBRICAS" SAIU DESSA LISTA EM 05/08/2026.** Ela dizia "logo
 * das fábricas, de que não existe vetor autorizado", e o item caiu por decisão
 * de produto. O que a lista de fato protegia — e continua protegendo — é a
 * GRADE de logos: o que entrou é uma marca por linha de ficha, encabeçando os
 * registros, na mesma gramática do cartão da home. A miniatura fotográfica
 * continua sendo a coluna da esquerda em todas as linhas, e a lista segue em
 * duas colunas.
 */
/* O contrato de direção desta rota, no HTML construído para poder ser auditado
   depois do build. Só decisão de design entra aqui; o rastro de processo vive
   em `.impeccable/surfaces/`. */
const CONTRATO_DE_DIRECAO = `<!--
THESIS: O índice não lista as marcas outra vez — ele desmonta uma área externa
e mostra qual fábrica resolve cada parte. Recusa a grade de logos, a grade de
quatro colunas e a tabela comparativa marca × atributo. O logotipo da fábrica
encabeça a ficha dela nos registros, uma por linha — o que a tese recusa é a
grade, não a marca.
OWN-WORLD: o mundo do site, inalterado. Papel #F5F3F0, tinta #17171A, fio
#C9C6C0, raio 0, sombra 0. Cor existe apenas dentro de uma marca — a da Belmare
e a das fábricas representadas, publicadas como o arquivo original —, e nunca na
interface: não vira acento, estado, fio nem fundo. Aqui o mundo vira folha
desenhada: moldura com registro de canto, chamada numerada recortada em papel
sobre a foto, carimbo no pé e legenda regrada.
STORY: quatro partes, quatro fábricas; o visitante conclui a cobertura sozinho e
desce para a marca que resolve o vão dele.
FIRST VIEWPORT: prancha à esquerda com quatro chamadas, fio vertical, e à
direita rótulo em mono, h1 de duas linhas e a legenda de quatro linhas com seta.
FORM: "a área externa desmontada", candidata 5 da lista ordenada, chave 77738b15.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export default async function Representadas() {
  return (
    <>
      <div hidden dangerouslySetInnerHTML={{ __html: CONTRATO_DE_DIRECAO }} />
      <PranchaAreaExterna />
      <RegistrosDasRepresentadas />

      <section
        aria-labelledby="fecho"
        className="border-t border-line px-5 py-14 md:px-8 md:py-20"
      >
        <h2 id="fecho" className="text-h1 max-w-[20ch] font-normal text-balance">
          Ficou com alguma dúvida?
        </h2>
        {/* Sem contador em prosa: `REPRESENTADAS.length` interpolado no meio de
            uma frase sai como "para as 4", e algarismo em texto corrido lê como
            erro de revisão. O contador vive onde ele é medida — na mono da
            legenda da prancha. */}
        {/* ⚠️ A regra de funil saiu do texto visível. "Todo contato passa pela
            Belmare, e é ela quem aciona a fábrica depois" explica ao visitante
            uma decisão comercial interna que ele não perguntou — e explicar
            soa defensivo. O que ele quer saber é quem responde e onde. A regra
            continua valendo e continua escrita no código que a aplica
            (`components/quem-somos/contato.tsx`). */}
        <p className="text-body mt-6 max-w-[64ch] text-pretty text-graphite">
          Quem responde é a Belmare, para qualquer uma das marcas. O
          atendimento cobre {emLista(TERRITORIO)}, sem divisão de região por
          marca.
        </p>

        <AcaoDeFecho
          contexto="estava vendo as representadas"
          className="mt-10 md:mt-14"
        />
      </section>
    </>
  );
}
