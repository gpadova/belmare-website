import { Bloco } from "@/components/quem-somos/bloco";
import { anosDeMercado, EMPRESA } from "@/lib/site";

/**
 * 01 — A abertura. O registro.
 *
 * Sem foto, de propósito. Todo site de representação abre com "26 anos de
 * tradição e excelência" sobre uma imagem de banco. A Belmare não escreve nada:
 * ela abre o registro. O lastro vem de documento datado, e o primeiro fato é o
 * tempo — por isso o único elemento em escala de display na página inteira é um
 * número de quatro dígitos.
 *
 * Isso também resolve o problema estrutural da rota. `/quem-somos` é a página
 * que mais dependeria de material que não existe (fotos de projetos entregues,
 * P43); o acervo documental existe inteiro e é conferível.
 *
 * ⚠️ O LCP desta página é tipográfico. Nada aqui deve virar imagem.
 *
 * ⚠️ O contador de anos NUNCA é escrito à mão. `anosDeMercado()` conta a partir
 * de 22/04/1999 com dia e mês; a diferença simples de anos erra por um durante
 * quatro meses todo ano, e um site que abre o próprio registro não pode errar
 * o primeiro número dele.
 */

/** O cabeçalho de ficha: quatro campos do registro, em faixa, no topo da folha. */
const CABECALHO = [
  { rotulo: "Razão social", valor: EMPRESA.razaoSocial, mono: false },
  { rotulo: "CNPJ", valor: EMPRESA.cnpj, mono: true },
  { rotulo: "Abertura", valor: EMPRESA.abertura, mono: true },
  { rotulo: "Porte", valor: EMPRESA.porte.extenso, mono: false },
] as const;

export function RegistroAbertura() {
  const anos = anosDeMercado();

  return (
    <Bloco numero="01">
      {/* Faixa de identificação. Rótulo em mono e caixa alta; razão social e
          porte na grotesca — dado longo em versal vira grito, e o sistema
          reserva a caixa alta para rótulo e código. */}
      <dl className="grid grid-cols-2 border-y border-line md:grid-cols-4">
        {CABECALHO.map((campo, i) => (
          <div
            key={campo.rotulo}
            className={[
              "py-4 sm:py-5 md:px-6",
              // Fio vertical entre colunas — some na primeira de cada largura.
              i % 2 === 1 ? "border-l border-line pl-5" : "pr-5",
              i === 0 ? "md:pl-0" : "md:border-l md:border-line md:pl-6",
              i === CABECALHO.length - 1 ? "md:pr-0" : "",
              // Fio horizontal só enquanto a ficha tem duas fileiras.
              i < 2 ? "border-b border-line md:border-b-0" : "",
            ].join(" ")}
          >
            <dt className="mono uppercase text-graphite">{campo.rotulo}</dt>
            {/* `leading-5` nos dois: a mono de 11px e a grotesca de 14px têm
                caixas de linha de alturas diferentes, e sem igualá-las os
                valores da faixa assentam em linhas de base distintas — numa
                ficha, onde o alinhamento é o argumento, isso se vê. */}
            <dd
              className={`mt-2 leading-5 ${campo.mono ? "mono text-ink" : "text-support"}`}
            >
              {campo.valor}
            </dd>
          </div>
        ))}
      </dl>

      <p className="text-display mt-12 font-normal tabular-nums md:mt-16">
        {EMPRESA.fundacao}
      </p>
      {/* "…de registro ativo" saiu por dois motivos: afirmava continuidade de
          situação cadastral que os fatos em mão não cobrem, e a linha inteira
          media 348px numa coluna de 350px — órfã em qualquer telefone abaixo
          de 390. */}
      <p className="mono mt-3 text-graphite">
        Aberta em {EMPRESA.abertura} · {anos} anos
      </p>

      <div className="mt-10 border-t border-line pt-10 md:mt-14 md:pt-14">
        <h1 className="text-h1 max-w-[18ch] font-normal text-balance">
          A empresa, por extenso.
        </h1>
        <p className="text-body mt-6 max-w-[64ch] text-pretty text-graphite">
          Representação comercial de mobiliário de alto padrão para área externa,
          aberta em 22 de abril de 1999, em Florianópolis. Esta página não narra
          a empresa — mostra o registro dela. Cada linha daqui em diante é
          pública e pode ser conferida.
        </p>
      </div>
    </Bloco>
  );
}
