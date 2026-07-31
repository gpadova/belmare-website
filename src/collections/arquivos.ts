import type { CollectionConfig } from "payload";

/**
 * Os binários pesados do site: catálogo em PDF hoje, arquivo 3D depois.
 *
 * ⚠️ Esta coleção existe primeiro como PROVA DA INFRAESTRUTURA. O catálogo da
 * Trisol tem 24 MB e a função serverless da Vercel recusa corpo de requisição
 * acima de 4,5 MB — se o upload não atravessar, a escolha de plataforma inteira
 * está errada, e é melhor descobrir isso aqui do que depois de sete coleções
 * modeladas. O caminho que faz atravessar é o `clientUploads` do adaptador S3
 * em `payload.config.ts`: o navegador assina e envia direto para o bucket.
 *
 * ⚠️ Peso e formato NÃO são campos. O Payload já grava `filesize` e `mimeType`
 * do arquivo que armazenou, e número digitado à mão é como o site passa a
 * prometer um download que não pode medir (decisão 6 da spec).
 */
export const Arquivos: CollectionConfig = {
  slug: "arquivos",
  labels: { singular: "Arquivo", plural: "Arquivos" },
  admin: {
    useAsTitle: "titulo",
    defaultColumns: ["titulo", "filename", "filesize", "updatedAt"],
    group: "Acervo",
    description:
      "Os arquivos que o visitante baixa: catálogos em PDF e, mais adiante, os arquivos 3D. O peso e o formato são lidos do próprio arquivo — não há o que preencher.",
  },
  access: {
    // O site público lê arquivos sem sessão. Escrita continua exigindo login.
    read: () => true,
  },
  upload: {
    /* Só vale quando o R2 não está configurado — ver a nota gêmea em
       `imagens.ts`. */
    staticDir: ".uploads/arquivos",

    /* ⚠️ Sem lista de tipos permitidos, de propósito. PDF se identifica
       sozinho, mas arquivo 3D não: `.skp`, `.3ds` e `.dwg` chegam do navegador
       como `application/octet-stream` na maior parte dos sistemas, e uma lista
       branca aqui recusaria justamente o acervo que a coleção existe para
       servir. Restringir tipo é trabalho da coleção que tiver um tipo só. */
    displayPreview: false,
  },
  fields: [
    {
      name: "titulo",
      type: "text",
      required: true,
      label: "Título do arquivo",
      admin: {
        description:
          "Como este arquivo é chamado na página — \"Catálogo Trisol 2026\". É o texto que o visitante lê antes de decidir baixar.",
      },
      validate: (valor: string | null | undefined) =>
        valor && valor.trim() !== ""
          ? true
          : "Escreva um título antes de salvar. O nome do arquivo no seu computador não serve: é ele que apareceria na página, e o visitante decide baixar 24 MB olhando para esse texto.",
    },
  ],
};
