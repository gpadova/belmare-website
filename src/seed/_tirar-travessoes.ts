import { getPayload } from "payload";

import config from "@payload-config";

/**
 * Tira os travessões do conteúdo JÁ GRAVADO no banco.
 *
 * ⚠️ Pareado com as mesmas correções em `semear-paginas.ts` e
 * `lib/representadas.ts`. As sementes pulam página e representada que já
 * existem, então corrigir o arquivo do seed não corrige um banco semeado — as
 * duas metades precisam andar juntas, ou o texto no ar diverge do código.
 *
 * Substituição LITERAL, par a par. Nada de regex sobre "—": o travessão também
 * aparece em texto que ninguém pediu para mexer, e uma varredura cega
 * repontuaria frases sem ler o que elas dizem.
 */
const TROCAS: ReadonlyArray<readonly [string, string]> = [
  [
    "o levantamento factual do que este site faz com dados — não é, e não deve ser lido como, uma política de privacidade em vigor.",
    "o levantamento factual do que este site faz com dados. Ele não é, e não deve ser lido como, uma política de privacidade em vigor.",
  ],
  [
    "a empresa ou escritório que a pessoa representa — e nada além disso.",
    "a empresa ou escritório que a pessoa representa, e nada além disso.",
  ],
  [
    "escreve numa conversa iniciada por ela — WhatsApp, e-mail ou telefone —, e ele chega pelo aplicativo ou provedor correspondente, não por este site.",
    "escreve numa conversa iniciada por ela, por WhatsApp, e-mail ou telefone. Esse dado chega pelo aplicativo ou provedor correspondente, não por este site.",
  ],
  [
    "ele registra o acesso — endereço de origem, data e arquivo pedido — para operação e segurança do serviço.",
    "ele registra o acesso (endereço de origem, data e arquivo pedido) para operação e segurança do serviço.",
  ],
  [
    "Esta seção — prazos de guarda, base legal de cada tratamento, encarregado pelo tratamento de dados e o procedimento para pedir acesso, correção ou eliminação — aguarda a redação jurídica.",
    "Esta seção aguarda a redação jurídica: prazos de guarda, base legal de cada tratamento, encarregado pelo tratamento de dados e o procedimento para pedir acesso, correção ou eliminação.",
  ],
  [
    "A Belmare indica a loja mais próxima que a tem — ou responde a dúvida",
    "A Belmare indica a loja mais próxima que a tem, ou responde a dúvida",
  ],
  [
    "Cláudio, Minas Gerais — polo de fundição artesanal de alumínio",
    "Cláudio, Minas Gerais, polo de fundição artesanal de alumínio",
  ],
];

let trocados = 0;

function trocar<T>(valor: T): T {
  if (typeof valor === "string") {
    let saida = valor;
    for (const [de, para] of TROCAS) {
      if (saida.includes(de)) {
        saida = saida.split(de).join(para);
        trocados++;
      }
    }
    return saida as unknown as T;
  }
  if (Array.isArray(valor)) return valor.map(trocar) as unknown as T;
  if (valor && typeof valor === "object") {
    return Object.fromEntries(
      Object.entries(valor).map(([k, v]) => [k, trocar(v)]),
    ) as T;
  }
  return valor;
}

const payload = await getPayload({ config });

for (const collection of ["paginas", "representadas"] as const) {
  const { docs } = await payload.find({ collection, depth: 0, limit: 100 });

  for (const doc of docs) {
    const antes = trocados;
    const corrigido = trocar(doc as Record<string, unknown>);
    if (trocados === antes) continue;

    try {
      await payload.update({
        collection,
        id: doc.id as number,
        draft: false,
        data: { ...corrigido, _status: "published" },
      } as never);
      console.log(`  ${collection}/${doc.id} atualizado (${trocados - antes} troca(s))`);
    } catch (erro) {
      const detalhe = (erro as { data?: { errors?: unknown } })?.data?.errors;
      console.log(
        `  ✗ ${collection}/${doc.id} RECUSADO: ${JSON.stringify(detalhe ?? erro, null, 2)}`,
      );
    }
  }
}

console.log(`\n${trocados} troca(s) no total.`);
process.exit(0);
