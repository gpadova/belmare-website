import { Bloco } from "@/components/quem-somos/bloco";
import { CNAES } from "@/lib/registro";
import { EMPRESA } from "@/lib/site";

/**
 * 02 — O que o registro diz.
 *
 * Os cinco CNAEs, código e descrição, transcritos. É evidência, não afirmação:
 * um arquiteto que não conhece a Belmare aprende aqui, do cadastro nacional e
 * não da nossa redação, que ela representa móvel e que está nisso desde 1999.
 *
 * ⚠️ Nada de leitura estratégica em texto visível. Os códigos 4649 (atacado)
 * ao lado do 4618 (representação) sugerem que a empresa pode faturar venda
 * própria — e isso NÃO foi confirmado (P1). Publica-se o código; a conclusão
 * fica de fora até haver resposta. Ver `lib/registro.ts`.
 *
 * Tabela de verdade, não grade de cartões: são dois dados por linha, com uma
 * relação de cabeçalho, e é isso que um leitor de tela precisa ouvir.
 */
export function Atividades() {
  return (
    <Bloco numero="02">
      <h2 className="text-h1 max-w-[20ch] font-normal text-balance">
        Cinco atividades registradas.
      </h2>
      <p className="text-body mt-6 max-w-[64ch] text-pretty text-graphite">
        Código e descrição como constam no cadastro nacional da pessoa jurídica.
        A atividade principal é a que define o ramo — representação comercial.
      </p>

      <table className="mt-10 w-full border-collapse text-left md:mt-14">
        <caption className="sr-only">
          Atividades econômicas registradas no CNPJ {EMPRESA.cnpj}
        </caption>
        <thead>
          <tr className="border-y border-line">
            <th scope="col" className="mono uppercase py-3 pr-6 font-normal text-graphite">
              Código
            </th>
            <th scope="col" className="mono uppercase py-3 font-normal text-graphite">
              Atividade
            </th>
          </tr>
        </thead>
        <tbody>
          {CNAES.map((cnae) => (
            <tr key={cnae.codigo} className="border-b border-line align-baseline">
              <th
                scope="row"
                className="mono py-4 pr-6 align-baseline font-normal whitespace-nowrap text-ink"
              >
                {cnae.codigo}
              </th>
              <td className="text-support py-4">
                {cnae.descricao}
                {cnae.principal ? (
                  <span className="mono uppercase mt-2 block text-graphite">
                    Atividade principal
                  </span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Só a fonte. Razão social, CNPJ e porte já abriram a página na faixa de
          identificação do bloco 01, uma tela acima. */}
      <p className="text-support mt-6 text-graphite">
        Fonte: cadastro nacional da pessoa jurídica, CNPJ {EMPRESA.cnpj}.
      </p>
    </Bloco>
  );
}
