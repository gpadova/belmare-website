import type { CollectionConfig } from "payload";

import { estaAutenticado } from "@/collections/papeis";
import { descricaoDeImagem } from "@/lib/acervo";

/**
 * O acervo de imagens do site, dentro do painel.
 *
 * ⚠️ ESTA COLEÇÃO É O MOLDE. Toda imagem do site — abertura, galeria, página
 * de marca, peça, projeto — vem daqui, então o que estiver errado aqui está
 * errado em todo lugar de uma vez. Três garantias, nesta ordem de importância:
 *
 *   1. **Descrição obrigatória.** O site não publica foto inacessível. A recusa
 *      é dura e explica o porquê em pt-BR — decisão 2 da spec: validação que
 *      recusa, não que avisa.
 *   2. **Ponto focal nativo.** Substitui os `object-position` medidos à mão em
 *      `lib/acervo.ts`. O operador clica no assunto; ninguém calcula
 *      porcentagem.
 *   3. **Marcação de mock.** O operador diz que a imagem é referência; o `alt`
 *      final é gerado. Ver `descricaoDeImagem` em `lib/acervo.ts`.
 */
export const Imagens: CollectionConfig = {
  slug: "imagens",
  labels: { singular: "Imagem", plural: "Imagens" },
  admin: {
    useAsTitle: "descricao",
    defaultColumns: ["descricao", "mock", "updatedAt"],
    group: "Acervo",
    description:
      "As fotografias do site. Toda imagem precisa de descrição, e toda imagem que ainda não é fotografia real precisa estar marcada como referência.",
  },
  access: {
    // O site público lê imagens sem sessão. Escrita continua exigindo login.
    read: () => true,

    /* ⚠️ **"CONTINUA EXIGINDO LOGIN" ERA SÓ O COMENTÁRIO ATÉ PRA-125 — NÃO
       HAVIA `access` NENHUM AQUI PARA `create`/`update`/`delete`.** O padrão
       do Payload quando o campo fica ausente é liberar geral, então qualquer
       chamada sem sessão conseguia subir, trocar ou apagar uma fotografia do
       acervo direto pela API, apesar do que o comentário prometia. Subir
       fotografia é trabalho comum de operador — a guarda é só autenticação,
       igual nos dois papéis. */
    create: estaAutenticado,
    update: estaAutenticado,
    delete: estaAutenticado,
  },

  /**
   * ⚠️ **HISTÓRICO DE VERSÃO, SEM RASCUNHO — ESCOPO DELIBERADO DE PRA-118.**
   * A decisão 8 da spec pede rascunho e versão em toda coleção, mas rascunho
   * aqui abriria um problema que este ticket não precisa resolver: uma
   * representada lida em `depth: 1` populariza `imagem`/`imagemLarga` por
   * relacionamento, e uma imagem só-rascunho nesse relacionamento vazaria a
   * mesma pergunta de visibilidade que `representadas.ts` resolve com
   * `access.read` — só que agora dentro de uma leitura aninhada, sem rota
   * própria para testar o preview. `versions: true` (sem `.drafts`) dá
   * histórico e restauração — o operador desfaz uma descrição ou um ponto
   * focal errado — sem criar `_status` nenhum para essa relação carregar.
   */
  versions: true,
  upload: {
    mimeTypes: ["image/*"],

    /* Só vale quando o R2 não está configurado — com ele, o Payload liga
       `disableLocalStorage` sozinho e nada toca o disco. `.uploads/` é
       ignorado pelo git: é rascunho de máquina, não acervo. */
    staticDir: ".uploads/imagens",

    /* O clique no assunto que substitui o número medido à mão. */
    focalPoint: true,

    /* ⚠️ Recorte e `imageSizes` ficam DESLIGADOS de propósito. Os dois exigem
       que o servidor tenha os bytes da imagem para processá-la com sharp — e é
       exatamente isso que o upload direto para o R2 evita (o arquivo vai do
       navegador para o bucket). Redimensionamento responsivo é trabalho do
       `next/image` sobre o original. Ligar qualquer um dos dois aqui quebra o
       upload de arquivo grande, que é a razão de existir desta configuração. */
    crop: false,

    displayPreview: true,
  },
  fields: [
    {
      name: "descricao",
      type: "text",
      required: true,
      label: "Descrição da imagem",
      admin: {
        description:
          "Descreva o que aparece na foto para quem não pode vê-la. Nomeie objetos e materiais — \"poltrona de área externa trançada em corda\" —, não a sensação. Não escreva \"imagem de referência\" aqui: se a imagem estiver marcada abaixo, o site acrescenta isso sozinho.",
      },
      validate: (valor: string | null | undefined) =>
        valor && valor.trim() !== ""
          ? true
          : "Escreva a descrição da imagem antes de salvar. Sem ela, quem usa leitor de tela não sabe o que há na foto, e a busca por imagem não encontra este acervo. O site não publica fotografia sem descrição.",
    },
    {
      name: "mock",
      type: "checkbox",
      label: "Imagem de referência (ainda não é fotografia real)",

      /* ⚠️ Começa MARCADA. Hoje todo o acervo é geração de IA, e o modo de
         falha de esquecer a marcação é o site apresentar imagem gerada como
         obra entregue — a única mentira grave que este site poderia contar.
         Esquecer de DESMARCAR só custa uma frase a mais num alt verdadeiro. */
      defaultValue: true,

      admin: {
        description:
          "Marque enquanto a imagem for geração ou foto de terceiro usada como exemplo. Com isso marcado, a descrição publicada termina em \"imagem de referência\". Desmarque no dia em que a fotografia real substituir esta — a marcação some sozinha de todos os lugares onde aparecia.",
      },
    },
    {
      name: "alt",
      type: "text",
      virtual: true,
      label: "Descrição publicada",
      admin: {
        readOnly: true,
        description:
          "O texto que o site realmente publica. É composto a partir dos dois campos acima e não pode ser editado aqui.",
      },
      hooks: {
        /* ⚠️ Composto na LEITURA, nunca gravado. Um hook de escrita que
           concatenasse o sufixo concatenaria de novo no salvamento seguinte, e
           desmarcar o mock não limparia nada. A regra mora em `lib/acervo.ts`,
           onde é testada; aqui só se chama. */
        afterRead: [
          ({ data }) =>
            descricaoDeImagem({
              descricao: typeof data?.descricao === "string" ? data.descricao : "",
              mock: Boolean(data?.mock),
            }),
        ],
      },
    },
  ],
};
