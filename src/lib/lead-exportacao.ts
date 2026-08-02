import type { Payload, TypedUser } from "payload";

import { estaAutenticado } from "@/collections/papeis";
import { csvDeLeads, type LinhaDeExportacaoDoLead } from "@/lib/lead";

/**
 * O CSV de "Leads" — o critério "read, filtered and exported from the panel"
 * (PRA-126). `collections/leads.ts#endpoints` é quem monta o caminho HTTP
 * (`GET /api/leads/exportar`) e chama esta função só com o que o Payload já
 * resolveu do cookie de sessão — nada aqui analisa requisição.
 *
 * ⚠️ **UM ENDPOINT CUSTOMIZADO NÃO HERDA `access` DA COLEÇÃO SOZINHO.** Ele é
 * uma rota à parte, chamada ANTES de qualquer `access` ser conferido — então a
 * recusa explícita abaixo é quem, de fato, tranca a porta. `overrideAccess:
 * false` na consulta logo em seguida é a segunda fechadura, pela mesma razão
 * que `lib/lead-acao.ts` a usa na escrita: se a checagem explícita tivesse um
 * buraco, `access.read` de `collections/leads.ts` ainda seguraria.
 *
 * ⚠️ **EXPORTA TUDO QUE A SESSÃO PODE LER, NUNCA UM RECORTE DA TELA.** Filtrar
 * pelo que a lista do painel está mostrando na hora exigiria repetir aqui a
 * mesma tradução de `where` que o Payload já faz por dentro da própria lista
 * — complexidade que não se paga para um painel que uma pessoa abre uma vez
 * por mês. O CSV inteiro, aberto no Excel, é o caminho mais curto até essa
 * necessidade aparecer de verdade.
 */
export async function respostaDeExportacaoDeLeads({
  payload,
  user,
}: {
  payload: Payload;
  user: TypedUser | null;
}): Promise<Response> {
  if (!estaAutenticado({ req: { user } })) {
    return Response.json(
      { erro: "É preciso estar autenticado no painel para exportar leads." },
      { status: 401 },
    );
  }

  const { docs } = await payload.find({
    collection: "leads",
    overrideAccess: false,
    user,
    sort: "-createdAt",
    // `0` é o valor que desliga a paginação do Payload — o painel só tem
    // dezenas de leads hoje, e um CSV "exportação" que corta na primeira
    // página seria uma exportação incompleta, silenciosamente.
    limit: 0,
  });

  const linhas: LinhaDeExportacaoDoLead[] = docs.map((lead) => ({
    id: lead.id,
    nome: lead.nome,
    email: lead.email,
    cidade: lead.cidade,
    escritorio: lead.escritorio,
    consentimentoMarketing: lead.consentimentoMarketing ?? false,
    origem: {
      pagina: lead.origem.pagina,
      ...(lead.origem.marca ? { marca: lead.origem.marca } : {}),
    },
    criadoEm: new Date(lead.createdAt).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    }),
  }));

  return new Response(csvDeLeads(linhas), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="leads.csv"',
    },
  });
}
