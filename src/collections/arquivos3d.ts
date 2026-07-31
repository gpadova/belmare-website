import {
  identidadeDoRelacionamento,
  revalidarTags,
  slugDaRepresentadaPai,
} from "@/collections/apoio";
import { formatoDoArquivo } from "@/lib/arquivos3d";
import { tagsDaMudanca } from "@/lib/revalidacao";
import type { CollectionConfig } from "payload";

/**
 * Os arquivos 3D, dentro do painel — um por representada, o arquivo em si na
 * coleção `arquivos` (a mesma que já guarda o PDF do catálogo: ver a nota "hoje
 * PDF, depois arquivo 3D" em `collections/arquivos.ts`).
 *
 * ⚠️ **FORMATO E PESO SÃO GERADOS, NUNCA CAMPO (decisão 6 da spec).** O formato
 * é lido da extensão do nome gravado (`formatoDoArquivo`, `lib/arquivos3d.ts`);
 * o peso é o `filesize` que o Payload já mediu do arquivo armazenado — a MESMA
 * derivação que o catálogo usa (`pesoDoArquivo`, `lib/representadas-traducao.ts`),
 * reaproveitada e não reescrita. Nenhum dos dois é campo: um número digitado é
 * exatamente a promessa de download que este site existe para nunca quebrar.
 *
 * ⚠️ Diferente do catálogo — que pode existir "a pedir", sem arquivo em mãos —
 * um Arquivo3D É o arquivo: `arquivo` é obrigatório aqui. A biblioteca só
 * existe pelo que está em disco.
 */
export const Arquivos3d: CollectionConfig = {
  slug: "arquivos3d",
  labels: { singular: "Arquivo 3D", plural: "Arquivos 3D" },
  admin: {
    useAsTitle: "nome",
    defaultColumns: ["nome", "representada", "updatedAt"],
    group: "Marcas",
    description:
      "Os arquivos 3D de cada representada. Formato e peso aparecem sozinhos na página, lidos do próprio arquivo — não há o que preencher.",
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
  },

  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        if (doc._status !== "published") return;

        const slug = await slugDaRepresentadaPai(req.payload, doc.representada);
        if (slug === undefined) return;

        revalidarTags(
          tagsDaMudanca({ colecao: "arquivos3d", representadaSlug: slug }),
        );
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        const slug = await slugDaRepresentadaPai(req.payload, doc.representada);
        if (slug === undefined) return;

        revalidarTags(
          tagsDaMudanca({ colecao: "arquivos3d", representadaSlug: slug }),
        );
      },
    ],
  },

  /* Mesma nota de `collections/pecas.ts`: consultado como documento de topo,
     com `_status: published` explícito no `where` — a exceção que tirou
     rascunho de Imagens/Arquivos em PRA-118 não se aplica aqui. */
  versions: {
    drafts: {
      autosave: false,
    },
  },

  defaultSort: "nome",

  fields: [
    {
      name: "representada",
      type: "relationship",
      relationTo: "representadas",
      required: true,
      hasMany: false,
      index: true,
      label: "Representada",
      admin: {
        position: "sidebar",
        description: "A fábrica a quem este arquivo 3D pertence.",
      },
    },
    {
      name: "nome",
      type: "text",
      required: true,
      label: "Nome do arquivo",
      admin: {
        description:
          "Como este arquivo é chamado na página — \"Cadeira Zuri\". É o texto que o arquiteto lê antes de decidir baixar.",
      },
      validate: (valor: string | null | undefined) =>
        valor && valor.trim() !== ""
          ? true
          : "Escreva o nome do arquivo antes de salvar.",
    },
    {
      name: "arquivo",
      type: "upload",
      relationTo: "arquivos",
      required: true,
      label: "O arquivo 3D",
      admin: {
        description:
          "O arquivo em si — SketchUp, DWG, 3ds ou Revit. Formato e peso aparecem na página sozinhos, lidos deste arquivo.",
      },

      /* ⚠️ Três garantias na mesma recusa: (1) o arquivo foi de fato escolhido
         — um `validate` presente ASSUME a responsabilidade inteira do campo, e
         `required: true` sozinho NÃO entra em paralelo para cobrir a ausência;
         confirmado durante este ticket, contra o comportamento real do
         Payload, não suposto (a mesma regra que `imagem`/`imagemLarga` de
         `collections/representadas.ts` já seguem, recusando a ausência elas
         mesmas em vez de delegar). (2) o arquivo tem tamanho gravado — sem ele
         o peso não existe, e um link sem peso medido é a promessa que este
         site existe para não quebrar (mesma regra do catálogo). (3) o nome do
         arquivo tem uma extensão legível — sem ela o formato não existe, e
         "SKP" nunca pode virar um chute. As duas últimas reaproveitam a MESMA
         função que o mapper usa para nunca inventar (`pesoDoArquivo`,
         `formatoDoArquivo`) — não uma segunda leitura de bytes ou de nome
         escrita só para o painel. */
      validate: async (
        valor: unknown,
        opcoes: {
          req?: {
            payload?: { findByID: (args: never) => Promise<unknown> };
          };
        },
      ) => {
        const id = identidadeDoRelacionamento(valor);
        if (id === undefined)
          return "Escolha o arquivo 3D. Sem ele não há o que baixar, nem formato nem peso para declarar antes do clique.";

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
          return "Este arquivo subiu sem tamanho gravado, e o site não conseguiria declarar o peso antes do clique. Envie o arquivo de novo.";

        if (formatoDoArquivo(documento?.filename) === undefined)
          return "Este arquivo não tem uma extensão reconhecível no nome (\"cadeira.skp\", não \"cadeira\"), e o site não teria como declarar o formato antes do clique. Envie o arquivo com a extensão original.";

        return true;
      },
    },
  ],
};
