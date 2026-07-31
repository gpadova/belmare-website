import type { GlobalConfig } from "payload";

import { identidadeDoRelacionamento } from "@/collections/apoio";
import { estaAutenticado } from "@/collections/papeis";
import { aoPublicarGlobal, VERSOES_DO_GLOBAL } from "@/globals/apoio";
import { formatoDoArquivo } from "@/lib/arquivos3d";

/**
 * O pacote completo de `/arquivos-3d` — **um campo só, e o campo é um arquivo
 * pronto** (PRA-127).
 *
 * ⚠️ **É O ÚNICO DOWNLOAD DO SITE ATRÁS DE CADASTRO, E A EXCEÇÃO REVERTE A
 * SUPOSIÇÃO DO `PRODUCT.md`.** O briefing recomendava cadastro leve para BAIXAR
 * 3D — qualquer 3D (P11, `briefing/audiencias.md`). A recomendação não sobrevive
 * ao alerta competitivo escrito três parágrafos abaixo dela: a **Casoca** é
 * gratuita, dominante e **já tem a GDA**. Pedir nome, e-mail, cidade e
 * escritório em troca de um bloco que a Casoca entrega sem pedir nada não
 * captura esse lead — **doa** esse lead, porque a aba seguinte já tem o arquivo
 * de graça, e o arquiteto passa a associar a Belmare ao atrito. O gate só se
 * sustenta sobre o que a Casoca **estruturalmente não tem**: as quatro fábricas
 * juntas, com as cartas de acabamento e tecido, num download só. Por isso os
 * arquivos avulsos são abertos (`components/arquivos-3d/linha-de-arquivo.tsx`)
 * e só este campo fica atrás do formulário.
 *
 * ⚠️ **O PACOTE É MONTADO PELO OPERADOR E SUBIDO PRONTO — NÃO É ZIPADO SOB
 * DEMANDA.** Três razões, em ordem de peso:
 *
 *   1. **Peso antes do clique.** Um zip montado na hora não tem tamanho até
 *      terminar de ser montado, e a página teria que ou omitir o peso (quebrando
 *      a promessa que ela existe para fazer) ou estimá-lo (inventando dado, o
 *      que o projeto inteiro recusa). Um arquivo em disco tem `filesize` medido
 *      pelo Payload, e é o MESMO `pesoDoArquivo` de toda outra linha do site.
 *   2. **A plataforma.** `collections/arquivos.ts` existe porque a função
 *      serverless recusa corpo acima de 4,5 MB e o upload precisou ir direto ao
 *      bucket. Montar um zip de dezenas de MB dentro dessa mesma função, a cada
 *      pedido, é reabrir por dentro o limite que aquele ticket rodeou por fora.
 *   3. **Curadoria é o produto.** O que a Casoca não entrega não é "os arquivos
 *      concatenados": é o conjunto organizado. Um zip automático é um despejo da
 *      coleção com a estrutura de pastas que o código inventar; o pacote que
 *      ganha do concorrente é o que uma pessoa arrumou.
 *
 * **Custo aceito, e declarado aqui em vez de descoberto depois:** o pacote
 * envelhece. Um arquivo 3D novo entra na biblioteca sozinho e NÃO entra no
 * pacote — quem remonta é o operador. A ajuda do campo diz isso com todas as
 * letras, e é a única obrigação de manutenção que este ticket cria.
 *
 * ⚠️ **NÃO HÁ CAMPO DE DATA DO PACOTE, E É DELIBERADO.** A data óbvia
 * (`Arquivo.updatedAt`) mexe quando alguém corrige o TÍTULO do upload, não só
 * quando o binário é trocado — ela diria "remontado em julho" sobre um pacote de
 * março. Um carimbo que se atualiza sozinho sem o conteúdo ter mudado é a
 * definição de "o site passa a mentir sozinho" (`CONTEXT.md`), e um campo de
 * data digitado à mão é a mesma mentira com uma tecla a mais.
 *
 * ⚠️ **SEM PACOTE PUBLICADO, A SEÇÃO E O FORMULÁRIO SOMEM JUNTOS.** O campo é
 * opcional de propósito: hoje não existe pacote nenhum, e exigi-lo obrigaria a
 * seed a inventar um arquivo. Seção anulável — e aqui ela protege o visitante,
 * não o layout: um cadastro em troca de um arquivo que não existe é a única
 * forma de o site pedir dado pessoal sem dar nada em troca.
 */
export const Pacote3D: GlobalConfig = {
  slug: "pacote-3d",
  label: "Pacote 3D completo",
  typescript: { interface: "Pacote3D" },
  admin: {
    group: "O site",
    description:
      "O download único de /arquivos-3d: as quatro fábricas, com acabamentos e tecidos, num arquivo só. É o ÚNICO arquivo do site que pede cadastro — os arquivos 3D avulsos baixam direto, sem formulário, porque a Casoca já os entrega de graça e cobrar cadastro por eles só afasta o arquiteto.",
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    update: estaAutenticado,
  },

  versions: VERSOES_DO_GLOBAL,
  hooks: { afterChange: aoPublicarGlobal({ colecao: "pacote-3d" }) },

  fields: [
    {
      name: "pacote",
      type: "upload",
      relationTo: "arquivos",
      label: "O arquivo do pacote",
      admin: {
        description:
          "O pacote pronto, montado por você: os arquivos 3D das quatro fábricas mais as cartas de acabamento e tecido, num arquivo compactado. ⚠️ Ele NÃO se atualiza sozinho — um arquivo 3D novo entra na lista da página na hora, mas só entra no pacote quando você remontar e subir de novo. Em branco, a seção do pacote inteira desaparece da página, com o formulário junto: o site nunca pede cadastro em troca de um arquivo que não existe.",
      },

      /* ⚠️ As duas MESMAS recusas de `collections/arquivos3d.ts`, e pelo mesmo
         motivo — o pacote é o download mais caro do site, e o gate de cadastro
         não compra o direito de escondê-lo. Sem tamanho gravado não há peso a
         declarar antes do clique; sem extensão legível não há formato. As duas
         reaproveitam a função que o mapper usa (`formatoDoArquivo`), nunca uma
         segunda leitura escrita só para o painel.

         Sem `required`: ver a nota de topo. O que se recusa aqui é um pacote
         IMPOSSÍVEL DE DECLARAR, nunca a ausência de pacote. */
      validate: async (
        valor: unknown,
        opcoes: {
          req?: {
            payload?: { findByID: (args: never) => Promise<unknown> };
          };
        },
      ) => {
        const id = identidadeDoRelacionamento(valor);
        if (id === undefined) return true;

        const payload = opcoes.req?.payload;
        if (!payload) return true;

        const documento = await payload
          .findByID({ collection: "arquivos", id, depth: 0 } as never)
          .then(
            (doc) =>
              doc as {
                filesize?: number | null;
                filename?: string | null;
              } | null,
          )
          .catch(() => null);

        const bytes = documento?.filesize;
        if (typeof bytes !== "number" || bytes <= 0)
          return "Este arquivo subiu sem tamanho gravado, e a página não conseguiria declarar o peso antes do cadastro. Envie o pacote de novo.";

        if (formatoDoArquivo(documento?.filename) === undefined)
          return "Este arquivo não tem uma extensão reconhecível no nome (\"pacote-belmare.zip\", não \"pacote-belmare\"), e a página não teria como declarar o formato. Envie o arquivo com a extensão original.";

        return true;
      },
    },
  ],
};
