import {
  identidadeDoRelacionamento,
  revalidarTags,
  slugDaRepresentadaPai,
} from "@/collections/apoio";
import { tagsDaMudanca } from "@/lib/revalidacao";
import type { CollectionConfig } from "payload";

/**
 * Os acabamentos, dentro do painel — tecido ou pintura, um por representada.
 *
 * ⚠️ Pende de uma representada só, como Peça e Arquivo3D (decisão 10 da spec):
 * nada atravessa, e o nome de amostra é o da própria fábrica.
 */
export const Acabamentos: CollectionConfig = {
  slug: "acabamentos",
  labels: { singular: "Acabamento", plural: "Acabamentos" },
  admin: {
    useAsTitle: "nome",
    defaultColumns: ["nome", "representada", "tipo", "updatedAt"],
    group: "Marcas",
    description: "Os tecidos e pinturas de cada representada, com amostra.",
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
          tagsDaMudanca({ colecao: "acabamentos", representadaSlug: slug }),
        );
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        const slug = await slugDaRepresentadaPai(req.payload, doc.representada);
        if (slug === undefined) return;

        revalidarTags(
          tagsDaMudanca({ colecao: "acabamentos", representadaSlug: slug }),
        );
      },
    ],
  },

  /* Mesma nota de `collections/pecas.ts`. */
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
        description: "A fábrica a quem este acabamento pertence.",
      },
    },
    {
      name: "nome",
      type: "text",
      required: true,
      label: "Nome do acabamento",
      admin: {
        description:
          "Como a fábrica chama este acabamento — \"Olefina Areia\", \"Grafite Texturizado\".",
      },
      validate: (valor: string | null | undefined) =>
        valor && valor.trim() !== ""
          ? true
          : "Escreva o nome do acabamento antes de salvar.",
    },
    {
      name: "tipo",
      type: "select",
      required: true,
      label: "Tipo",
      options: [
        { label: "Tecido", value: "tecido" },
        { label: "Pintura", value: "pintura" },
      ],
      admin: {
        description: "Tecido ou pintura — não há um terceiro tipo hoje.",
      },
    },
    {
      name: "amostra",
      type: "upload",
      relationTo: "imagens",
      required: true,
      label: "Fotografia da amostra",
      admin: {
        description: "A fotografia de perto deste acabamento.",
      },
      validate: (valor: unknown) =>
        identidadeDoRelacionamento(valor) !== undefined
          ? true
          : "Escolha a fotografia da amostra. Sem ela o acabamento aparece como um quadro vazio.",
    },
  ],
};
