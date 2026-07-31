import type { CollectionConfig } from "payload";

/**
 * Quem entra no painel.
 *
 * A coleção é deliberadamente rasa: e-mail e senha vêm da autenticação do
 * Payload, e o único campo próprio é o nome — que existe para o histórico de
 * versões dizer "Fulano publicou" em vez de mostrar um e-mail.
 *
 * ⚠️ Papéis (operador × desenvolvedor) NÃO estão aqui. A decisão 14 da spec
 * pede dois, mas papel sem coleção para restringir é campo que só pode ser
 * preenchido errado. Ele entra junto com as coleções que ele governa.
 */
export const Usuarios: CollectionConfig = {
  slug: "usuarios",
  labels: { singular: "Usuário", plural: "Usuários" },
  auth: true,
  admin: {
    useAsTitle: "nome",
    defaultColumns: ["nome", "email"],
    group: "Configuração",
  },
  fields: [
    {
      name: "nome",
      type: "text",
      required: true,
      label: "Nome",
      admin: {
        description:
          "Como você aparece no histórico de alterações. Nome e sobrenome bastam.",
      },
      validate: (valor: string | null | undefined) =>
        valor && valor.trim() !== ""
          ? true
          : "Escreva um nome. O histórico de versões mostra quem publicou cada mudança, e um e-mail no lugar do nome não diz nada a quem for consultar depois.",
    },
  ],
};
