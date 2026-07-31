import config from "@payload-config";
import { getPayload } from "payload";

import { presente } from "@/lib/campo-opcional";
import { comCache } from "@/lib/cache-do-painel";
import { projetoDoPainel, projetosPublicaveis, type Projeto } from "@/lib/projetos";
import { TAG_QUEM_SOMOS } from "@/lib/revalidacao";

/**
 * A seção anulável de `/quem-somos`, já traduzida para o domínio e passada
 * pelo portão de três.
 *
 * ⚠️ **UMA FUNÇÃO SÓ, SEM ARGUMENTO — DIFERENTE DE `pecas-consulta.ts` E
 * IRMÃS.** Peça, Arquivo3D e Acabamento são sempre consultados DENTRO de uma
 * representada (a árvore da decisão 10); Projeto cita representadas sem
 * pender de nenhuma, e a única pergunta que a página faz é "quantos projetos
 * publicáveis existem", nunca "os projetos de qual marca". Não há parâmetro
 * de marca para esta função aceitar.
 *
 * ⚠️ **O PORTÃO DE TRÊS É CHAMADO AQUI, NÃO REIMPLEMENTADO.** Esta função lê o
 * painel, mapeia cada documento publicado para o domínio — descartando
 * qualquer um que `projetoDoPainel` devolveu ausente (representada não
 * resolvida, foto não resolvida, ou foto marcada como mock: ver a nota
 * completa em `lib/projetos.ts`) — e entrega a lista resultante para
 * `projetosPublicaveis`, a mesma função pura testada em `projetos.test.ts`.
 * Menos de três e ela devolve lista vazia; a página não desenha título, "em
 * breve" nem markup vazio.
 *
 * ⚠️ Tagueada só com `TAG_QUEM_SOMOS`: é a única superfície onde um projeto
 * aparece (ver a nota em `lib/revalidacao.ts` sobre `colecao: "projetos"`).
 */

async function painel() {
  return getPayload({ config });
}

export async function buscarProjetosPublicaveis(): Promise<Projeto[]> {
  return comCache(
    async () => {
      const payload = await painel();

      const { docs } = await payload.find({
        collection: "projetos",
        depth: 1,
        pagination: false,
        sort: "-ano",
        // Rascunho nunca vaza — mesma garantia explícita de
        // `lib/representadas-consulta.ts`, confirmada em PRA-118.
        where: { _status: { equals: "published" } },
      });

      const projetos = docs.map(projetoDoPainel).filter(presente);

      return projetosPublicaveis(projetos);
    },
    ["projetos-publicaveis"],
    [TAG_QUEM_SOMOS],
  );
}
