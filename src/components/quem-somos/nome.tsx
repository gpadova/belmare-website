import { MarcaVertical } from "@/components/marca-belmare";
import { Bloco } from "@/components/quem-somos/bloco";
import { buscarEmpresa } from "@/lib/empresa-consulta";
import { buscarQuemSomos } from "@/lib/espinha-consulta";
import { NOME_PUBLICO_ANTERIOR } from "@/lib/registro";

/**
 * 03 — O nome anterior.
 *
 * Este é o bloco que dá conteúdo aos anos. "26 anos de tradição" é uma frase que
 * qualquer empresa escreve; o nome público antigo é um documento que só esta
 * tem — e ele lista, produto a produto, exatamente o mesmo ramo. É a prova de
 * continuidade mais barata e mais forte do projeto.
 *
 * O nome novo entra como o logotipo de verdade, não como texto: é o único lugar
 * do site onde o lockup vertical aparece fora do rodapé, e aqui ele está sendo
 * comparado a um documento — que é o trabalho dele.
 *
 * ⚠️ O perfil ainda está no ar com o nome antigo, por isso a fonte é citada e o
 * verbo não fica no passado absoluto. E tapetes aparecem no nome antigo sem
 * aparecer no portfólio atual (P2): o bloco cita o registro, nunca afirma que a
 * Belmare vende tapete hoje.
 *
 * ⚠️ NENHUM ABSOLUTO HISTÓRICO AQUI. Uma versão anterior dizia "o nome mudou uma
 * vez" e "a razão social nunca mudou". O que existe em documento é UM nome
 * público anterior e a razão social que consta no registro hoje — nem a
 * contagem de mudanças, nem o histórico do cadastro. Numa página que só publica
 * o que é conferível, "uma vez" e "nunca" são as duas únicas palavras que ela
 * não pode conferir.
 *
 * ⚠️ **O NOME PÚBLICO ANTERIOR FICA EM `lib/registro.ts`, NO CÓDIGO.** É uma
 * citação com fonte declarada — o perfil que ainda está no ar —, e citação não
 * é conteúdo a editar: reescrevê-la em palavras melhores quebraria exatamente o
 * que ela prova. O que é campo aqui é a leitura que a Belmare faz do contraste
 * entre os dois nomes, e ela começa depois da primeira frase.
 *
 * ⚠️ **A PRIMEIRA FRASE DO PARÁGRAFO É MONTADA COM A RAZÃO SOCIAL DO PAINEL, e
 * não digitada dentro do campo.** Se ela fosse parte do texto livre, trocar a
 * razão social no cadastro deixaria esta linha nomeando a antiga — numa página
 * cujo argumento inteiro é que cada linha pode ser conferida na fonte.
 */
export async function Nome() {
  const { razaoSocial } = await buscarEmpresa();
  const { nome } = await buscarQuemSomos();

  return (
    <Bloco numero="03">
      <h2 className="text-h1 max-w-[22ch] font-normal text-balance">
        Outro nome. O mesmo ramo.
      </h2>

      <div className="mt-10 grid gap-10 border-t border-line md:mt-14 md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] md:gap-0">
        <div className="border-b border-line pt-6 pb-8 md:border-b-0 md:pr-10 md:pb-10">
          <p className="mono uppercase text-graphite">Nome público anterior</p>
          <p className="text-h3 mt-5 max-w-[24ch] font-normal text-pretty">
            {NOME_PUBLICO_ANTERIOR.valor}
          </p>
          <p className="mono uppercase mt-6 text-graphite">
            Fonte · {NOME_PUBLICO_ANTERIOR.fonte}
          </p>
        </div>

        <div className="pb-2 md:border-l md:border-line md:pt-6 md:pl-10 md:pb-10">
          <p className="mono uppercase text-graphite">Nome público agora</p>
          <MarcaVertical className="mt-6" />
        </div>
      </div>

      {(razaoSocial !== undefined || nome !== undefined) && (
        <p className="text-body mt-10 max-w-[64ch] text-pretty text-graphite md:mt-12">
          {razaoSocial !== undefined && (
            <>No registro, a razão social continua {razaoSocial}. </>
          )}
          {nome}
        </p>
      )}
    </Bloco>
  );
}
