import config from "@payload-config";
import { getPayload } from "payload";

import { comCache } from "@/lib/cache-do-painel";
import { empresaDoPainel } from "@/lib/empresa-traducao";
import { TAG_SITE } from "@/lib/revalidacao";
import type { Empresa } from "@/lib/empresa";

/**
 * A identidade e os canais da Belmare, lidos do painel.
 *
 * ⚠️ **ESTA LEITURA É A DO SITE INTEIRO, E É POR ISSO QUE A ETIQUETA É UMA
 * SÓ.** O rodapé mora no layout, logo está em toda rota — inclusive a 404 —, e
 * o WhatsApp está no cabeçalho, que também é do layout. Não existe "as seis
 * rotas onde a empresa aparece": a mudança já É o site inteiro. `TAG_SITE` sai
 * de `lib/revalidacao.ts#tagsDaMudanca`, a mesma função pura que os hooks de
 * `globals/empresa.ts` chamam quando o operador publica — a etiqueta nunca é
 * escrita à mão nos dois lados.
 *
 * ⚠️ **RASCUNHO NUNCA VAZA, E A GARANTIA MORA AQUI.** Achado de PRA-118,
 * confirmado por experimento: o Payload NÃO filtra `_status` sozinho, e o
 * padrão do campo é `"draft"`. Num global isso tem uma cara própria — enquanto
 * ele nunca tiver sido publicado, `findGlobal` devolve o rascunho como se fosse
 * conteúdo no ar. Por isso a condição está escrita aqui, explícita: só
 * `_status === "published"` atravessa; qualquer outra coisa é lida como global
 * vazio, e o site desenha menos página em vez de publicar rascunho.
 *
 * ⚠️ **GLOBAL VAZIO É RESPOSTA VÁLIDA, NÃO ERRO.** Banco recém-criado, seed
 * ainda não rodado, ou o operador ainda não preencheu os canais: o retorno é
 * `{}` e cada componente deixa de desenhar o que não tem dado. É a seção
 * anulável aplicada à identidade — e é o que permite o site subir antes de o
 * número de WhatsApp real existir, sem publicar um `wa.me` para lugar nenhum.
 */

async function painel() {
  return getPayload({ config });
}

export async function buscarEmpresa(): Promise<Empresa> {
  return comCache(
    async () => {
      const payload = await painel();

      const doc = await payload.findGlobal({ slug: "empresa", depth: 0 });

      // Ver a nota "rascunho nunca vaza" acima.
      return doc._status === "published" ? empresaDoPainel(doc) : {};
    },
    ["empresa"],
    [TAG_SITE],
  );
}
