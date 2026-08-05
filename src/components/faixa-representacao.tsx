import Image from "next/image";

import { FAIXA_REPRESENTACAO } from "@/lib/acervo";

/**
 * A faixa editorial — a seção que responde a pergunta que o h1 planta.
 *
 * ⚠️ **ELA EXISTE PORQUE A CONTENÇÃO DA HOME CAIU POR DECISÃO DO CLIENTE EM
 * 05/08/2026.** Até aqui a home era abertura, as marcas e as portas, "nada
 * mais", e essa contenção estava registrada como decisão a defender. O cliente
 * liberou a sequência e escolheu o que entra; esta é uma das duas seções novas.
 * A regra que ela NÃO revoga é a de não inventar: cada afirmação abaixo é fato
 * de `PRODUCT.md`, e nenhuma é adjetivo.
 *
 * ⚠️ **O TÍTULO RESPONDE O H1, E É POR ISSO QUE A SEÇÃO SE PAGA.** A abertura diz
 * "Representação comercial de móveis para área externa." — e um lojista que nunca
 * comprou de representação não sabe o que isso significa na prática. A seção não
 * repete a frase de cima em outras palavras (que é como uma seção vira
 * comprimento sem substância): ela diz o MECANISMO, que a home nunca disse em
 * lugar nenhum — quem atende, o que é respondido, e por onde a compra acontece.
 *
 * ⚠️ **A COPY É FIXA, E ISSO É CONSISTENTE, NÃO ATALHO.** Não virou campo do
 * painel, pela mesma razão que o h1 e o texto das duas portas não são campo
 * (`globals/home.ts`): isto é posicionamento — o que a empresa É e por onde ela
 * vende —, e posicionamento é conversa, não edição. Um campo de texto aqui é o
 * caminho para alguém escrever "soluções completas em ambientes externos" numa
 * tarde, e a regra da voz do projeto é dado antes de adjetivo.
 *
 * ⚠️ **O ARGUMENTO DO INTERLOCUTOR ÚNICO NÃO ENTRA AQUI, E A TENTAÇÃO É REAL.**
 * A primeira redação desta seção terminava em "respondidos por quem fala com as
 * quatro". É verdade, e mesmo assim saiu: contar fábricas e contar interlocutores
 * foi recusado duas vezes (30/07 e 05/08/2026) por descrever o organograma da
 * Belmare a quem não perguntou. O argumento continua no site, e continua sendo
 * feito por DEMONSTRAÇÃO — o trilho logo acima mostra as quatro fábricas lado a
 * lado, e o visitante conclui sozinho. Concluir é mais forte do que ser
 * informado.
 *
 * ⚠️ **A REGRA DO CANAL É A SEGUNDA FRASE, E ELA É A MAIS ÚTIL DA PÁGINA.** "Quem
 * compra, compra na loja" protege integralmente o revendedor e responde, antes
 * do clique, a pergunta que faz um consumidor final abandonar a página irritado
 * três telas depois. Ver `PRODUCT.md → Canal de venda`.
 *
 * ⚠️ **SEM REVELAÇÃO POR ROLAGEM AQUI.** O movimento novo do projeto é um
 * momento só, e ele é o trilho das representadas. Repetir a entrada em cada
 * faixa é exatamente a décima visita que a Regra do Movimento Fechado existia
 * para evitar — ver a nota em `globals.css`.
 */
export function FaixaRepresentacao() {
  return (
    <section
      aria-labelledby="representacao"
      className="border-t border-line px-5 py-20 md:px-8 md:py-28"
    >
      {/* Imagem à esquerda e texto à direita a partir de `md`; empilhados abaixo
          dela, com a fotografia primeiro — a imagem é o que faz a seção respirar
          depois do trilho, e mandá-la para baixo do texto no telefone deixaria
          dois blocos de prosa encostados. */}
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-4/3 overflow-hidden bg-ink">
          <Image
            src={FAIXA_REPRESENTACAO.src}
            alt={FAIXA_REPRESENTACAO.alt}
            fill
            loading="lazy"
            sizes="(min-width: 768px) 46vw, 90vw"
            className="object-cover"
          />
        </div>

        <div className="max-w-[52ch]">
          <h2 id="representacao" className="text-h1 font-normal text-balance">
            O que uma representação faz.
          </h2>
          <p className="text-body mt-6 text-pretty text-graphite">
            A Belmare leva as fábricas que representa ao escritório de
            arquitetura e ao lojista: catálogo, medida, acabamento e arquivo 3D.
          </p>
          <p className="text-body mt-4 text-pretty text-graphite">
            Quem compra, compra na loja — e quando quem chega é o consumidor
            final, a Belmare indica a loja mais próxima.
          </p>
        </div>
      </div>
    </section>
  );
}
