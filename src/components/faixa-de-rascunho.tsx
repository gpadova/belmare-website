/**
 * A faixa que avisa: esta visita está vendo rascunho, não o site publicado.
 *
 * ⚠️ Existe para a mesma razão de ser do preview inteiro — dissolver o medo de
 * quem está no painel. Sem um aviso, a página de preview é PIXEL POR PIXEL
 * igual à publicada, e é fácil esquecer que se está olhando um rascunho e
 * fechar a aba achando que aquilo já está no ar. `/preview/sair` desliga o
 * modo de rascunho do Next — ver `app/(frontend)/preview/sair/route.ts`.
 *
 * Tinta sobre papel invertido, igual ao rodapé: zero cor de marca, mesmo
 * fora de um estado de erro — isto é aviso operacional, não alarme.
 */
export function FaixaDeRascunho() {
  return (
    <div className="mono flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-ink px-4 py-2 text-center text-paper uppercase">
      <span>Pré-visualização de rascunho — este conteúdo ainda não foi publicado</span>
      {/* ⚠️ `<a>` de propósito, e NÃO `<Link>`. O destino não é página: é o
          route handler que APAGA o cookie de rascunho. O `<Link>` do Next faz
          prefetch do que está em viewport, e prefetch aqui significa sair da
          pré-visualização sozinho, sem ninguém clicar — a faixa desligaria o
          modo que ela existe para anunciar. A regra de lint abaixo supõe uma
          página no destino; aqui ela está errada. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/preview/sair" className="underline underline-offset-2 hover:no-underline">
        Sair da pré-visualização
      </a>
    </div>
  );
}
