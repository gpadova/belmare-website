/**
 * O registro público da Belmare — a matéria-prima de `/quem-somos`.
 *
 * A página não afirma que a empresa é séria: ela abre o registro e deixa a
 * pessoa ler. Para isso funcionar, tudo aqui precisa ser transcrição, não
 * redação.
 *
 * ⚠️ Regra deste arquivo: **nada é reescrito com palavras melhores.** As
 * descrições de CNAE saem do cadastro; o nome público anterior sai do perfil
 * que ainda está no ar. Adjetivo, arredondamento e "tradução para o cliente"
 * não entram — é exatamente a diferença entre abrir um registro e escrever um
 * "sobre nós".
 *
 * ⚠️ P1 SEGUE ABERTO. Os CNAEs 4649 (atacado) ao lado do 4618 (representação)
 * sugerem que a Belmare pode faturar venda própria, não só comissão — mas isso
 * não foi confirmado pelo cliente. Publica-se o código; **não se publica a
 * conclusão.** Ver `briefing/empresa.md` §1.
 *
 * Identidade legal (razão social, CNPJ, endereço, abertura, porte) fica em
 * `site.ts`, que é a fonte única. Aqui ficam só os fatos que existiam apenas
 * no briefing e que esta página estreia.
 */

export type Cnae = {
  /** Código como o cadastro escreve, com hífen e barra. */
  codigo: string;
  /** Descrição oficial, transcrita. */
  descricao: string;
  principal?: true;
};

/** Os cinco CNAEs registrados. Fonte: cadastro nacional da pessoa jurídica. */
export const CNAES: Cnae[] = [
  {
    codigo: "4618-4/99",
    descricao: "Outros representantes comerciais e agentes do comércio",
    principal: true,
  },
  {
    codigo: "4615-0/00",
    descricao:
      "Representantes comerciais de móveis e artigos de uso doméstico",
  },
  {
    codigo: "4649-4/04",
    descricao: "Comércio atacadista de móveis e artigos de colchoaria",
  },
  {
    codigo: "4649-4/05",
    descricao:
      "Comércio atacadista de artigos de tapeçaria, persianas e cortinas",
  },
  {
    codigo: "7020-4/00",
    descricao: "Consultoria em gestão empresarial",
  },
];

/**
 * O nome com que a empresa se apresentou publicamente antes do rebranding.
 *
 * É o único documento disponível dos 26 primeiros anos que não é um código: uma
 * frase que lista, produto a produto, o que a empresa vendia. Vale mais que
 * qualquer "tradição desde 1999" — e continua no ar, por isso a fonte é citada.
 *
 * ⚠️ Tapetes aparecem aqui e não aparecem no portfólio das quatro representadas
 * (P2, em aberto). A página cita o nome como registro do passado e **não afirma
 * que a Belmare vende tapete hoje.**
 */
export const NOME_PUBLICO_ANTERIOR = {
  valor:
    "Bello Mare — Móveis para Jardim, Ombrellones, Móveis de Design e Tapetes",
  fonte: "Facebook · /belmarerepresentacoes",
} as const;
