"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";

import { PaginaLivreDesenhada } from "@/components/paginas/pagina-livre";
import type { Empresa } from "@/lib/empresa";
import {
  paginaDoPainel,
  type DocumentoDePagina,
} from "@/lib/paginas-traducao";

/**
 * O que faz o iframe do painel ACOMPANHAR o arrasto de um bloco — decisão 8 da
 * spec, e o único componente de cliente que este site tem.
 *
 * ⚠️ **NÃO É "ATUALIZAR AO SALVAR", E A DIFERENÇA FOI MEDIDA, NÃO SUPOSTA.** O
 * pacote oficial oferece dois caminhos. `RefreshRouteOnSave` escuta o evento
 * `payload-document-event`, que o painel só emite quando o documento é GRAVADO —
 * com `autosave` desligado (e ele é, por decisão 8, nesta coleção como em todas
 * as outras), isso significa "atualiza quando você clica em Salvar", que é o
 * botão "Visualizar" com passos a menos. O hook abaixo escuta
 * `payload-live-preview`, que o painel emite a cada MUDANÇA DE CAMPO — inclusive
 * a reordenação de um bloco —, e é ele que entrega o motivo de o iframe existir:
 * a composição se redesenha enquanto a mão ainda está no bloco, sem gravar nada
 * no banco.
 *
 * ⚠️ **O DADO PASSA PELO MESMO MAPPER QUE O SITE PUBLICADO USA.** O hook entrega
 * o documento cru do formulário; `paginaDoPainel` o traduz exatamente como a
 * leitura do banco é traduzida, e `PaginaLivreDesenhada` é literalmente o mesmo
 * componente. Um segundo caminho de desenho para o preview mostraria ao operador
 * uma página que o site não publica — que é o pior defeito que um preview pode
 * ter, porque ele destrói a única coisa que o preview promete.
 *
 * ⚠️ **O CADASTRO DA EMPRESA NÃO ENTRA NO HOOK, E ISSO ESTÁ CERTO.** Ele vem do
 * servidor, resolvido uma vez, e não muda enquanto se monta uma página — é outro
 * documento do painel. O que o preview segue é a composição.
 *
 * ⚠️ **A ORIGEM CONFIÁVEL É A DA PRÓPRIA PÁGINA.** O hook só aceita mensagens
 * vindas de `serverURL`. O painel e o site são a MESMA aplicação Next (grupos
 * `(payload)` e `(frontend)`), então a origem do painel é a origem desta
 * página — e usar `window.location.origin` significa que qualquer outra página
 * que embuta este site num iframe tem as mensagens dela ignoradas, sem variável
 * de ambiente para alguém esquecer de configurar. No servidor `window` não
 * existe e o valor é vazio; ele não aparece no HTML, então não há divergência de
 * hidratação — e o ouvinte só é instalado depois de hidratar, já com a origem
 * certa.
 *
 * ⚠️ Este componente só é renderizado sob o modo de rascunho. Um visitante comum
 * nunca o recebe e nunca baixa este JavaScript.
 */
export function ComposicaoEmPreview({
  documento,
  empresa,
}: {
  documento: DocumentoDePagina;
  empresa: Empresa;
}) {
  const { data } = useLivePreview<DocumentoDePagina>({
    initialData: documento,
    serverURL: typeof window === "undefined" ? "" : window.location.origin,
    /* Profundidade 0: nenhum bloco tem upload nem relacionamento, então não há
       nada para o hook ir buscar na API a cada tecla. É a mesma profundidade da
       leitura publicada em `lib/paginas-consulta.ts`. */
    depth: 0,
  });

  const pagina = paginaDoPainel(data);

  /* ⚠️ Composição impossível de desenhar — título apagado, endereço fora do
     registro — não derruba o quadro: ele fica em branco até o campo voltar a
     ter valor. É a mesma seção anulável do site publicado, e é o que impede o
     preview de virar uma tela de erro no meio de uma edição. */
  if (pagina === undefined) return null;

  return <PaginaLivreDesenhada pagina={pagina} empresa={empresa} />;
}
