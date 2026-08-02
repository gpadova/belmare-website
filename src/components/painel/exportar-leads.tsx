"use client";

import { Button, useConfig } from "@payloadcms/ui";

/**
 * O botão "Exportar CSV" da lista de Leads — PRA-126, o critério "read,
 * filtered and exported from the panel". Registrado em
 * `collections/leads.ts#admin.components.beforeListTable`.
 *
 * ⚠️ **É UM `<a>` DE VERDADE, NÃO `fetch` + `Blob`.** A navegação do próprio
 * link já carrega o cookie de sessão do painel — a mesma fronteira que
 * `access.read` de `collections/leads.ts` confere em qualquer outra leitura
 * — e o `Content-Disposition: attachment` que
 * `lib/lead-exportacao.ts#respostaDeExportacaoDeLeads` devolve já é o que
 * faz o navegador baixar o arquivo em vez de tentar exibi-lo. Buscar o CSV
 * por `fetch` e montar um Blob à mão seria reimplementar o que o navegador
 * já faz de graça.
 *
 * ⚠️ **NÃO FILTRA PELO QUE A LISTA ESTÁ MOSTRANDO NA TELA.** O botão exporta
 * TODOS os leads que a sessão pode ler, sempre — não o recorte de uma busca
 * ou de um filtro aplicado acima. Ver a nota em `lib/lead-exportacao.ts`
 * sobre por que esse recorte não paga a complexidade agora.
 */
export function ExportarLeads() {
  const {
    config: {
      routes: { api },
      serverURL,
    },
  } = useConfig();

  return (
    <div style={{ margin: "0 0 var(--base)" }}>
      <Button
        el="anchor"
        url={`${serverURL ?? ""}${api}/leads/exportar`}
        buttonStyle="secondary"
        size="small"
      >
        Exportar CSV
      </Button>
    </div>
  );
}
