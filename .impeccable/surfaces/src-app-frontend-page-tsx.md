---
version: 1
slug: "src-app-frontend-page-tsx"
primary_target: "src/app/(frontend)/page.tsx"
related_targets: ["src/app/(frontend)/layout.tsx","src/components/abertura.tsx","src/components/representadas-galeria.tsx","src/components/portas.tsx"]
---

## Escopo e modo

Home `/` do site da Belmare. Modo **Persuade** — o visitante decide e age; o design é o produto.

> ⚠️ **v3, 05/08/2026 — o mundo visual foi substituído.** A v2 descrevia a home construída sob a Direção A, editorial/arquivo: papel `#F5F3F0`, fio de 1px, mono de 11px, raio 0, sombra 0, zero movimento por rolagem. Aquele mundo foi **aposentado nesta superfície por decisão do cliente**, tomada na página de decisão de direção (semente `b95c2020`): das cinco cartas oferecidas — a designada, três desafiantes e a saída permanente — ele escolheu **a saída permanente, o padrão da categoria**. A escolha é deliberada e registrada; não é o resultado de uma rolagem.
>
> A v1, cancelada em 30/07/2026, descrevia a anatomia de etiqueta de amostra e o eixo de material. Continua cancelada.

## Público, trabalho, ação

Arquiteto e designer de interiores do Sul, entre projetos, procurando quem resolve a área externa inteira. Secundários: consumidor final, lojista e — silenciosamente — o diretor comercial de uma quinta fábrica avaliando se entrega o Sul para a Belmare.

Ação primária: **escolher uma das duas portas** (`/arquitetos` · `/contato`). Persistente: WhatsApp no topo.

Prova publicável nesta superfície, e nada além: `1999` e o tempo de casa calculado · `PR · SC · RS` · as quatro fábricas e o que cada uma resolve · Florianópolis/SC · CNPJ.

## Direção — o padrão da categoria, executado no teto do segmento

**A convenção é o compromisso.** Nada de ironia, nada de gesto de autor contrabandeado das cartas recusadas. O que separa esta home das dos concorrentes não é a estrutura — é o acabamento.

**Barra de qualidade, escolhida pelo cliente:** Gandiablasco, Tribù, Paola Lenti, Kettal (escala fotográfica e contenção tipográfica) · Artefacto, Breton, Sollos, Micasa (como "alto padrão" se lê em português para um comprador do Sul).

**Comp aprovado:** `.impeccable/mocks/home-c-rail.webp` (sidecar `home-c-rail.json`, `approved: true`), com o herói enxertado de `.impeccable/mocks/home-a-vitrine.webp`.

**Sequência aprovada:** abertura (100svh, sangrando) → as representadas em trilho horizontal → faixa editorial → catálogos em destaque → as duas portas → rodapé.

Duas decisões que governam o resultado:

1. **A abertura sangra de ponta a ponta.** Os três comps renderizaram o herói recuado por margem de página; isso é falha de geração, não proposta. Nesta barra de qualidade o herói é full-bleed e ocupa a tela.
2. **As quatro fábricas são um trilho, nunca uma grade de quatro colunas.** P18 continua aberto, e o motivo pelo qual a v2 usava linhas vale igual aqui: uma grade de 4 quebra com 3 ou com 6. Um trilho não quebra com nenhum. Abaixo de `md` ele empilha.

**A contenção da home caiu por decisão do cliente.** A v2 registrava "abertura, as quatro marcas, duas portas. Nada mais" como decisão a ser defendida. O cliente liberou a sequência em 05/08/2026 e escolheu o que entra: faixa editorial e catálogos em destaque. Território foi oferecido e recusado.

## Inventário de fidelidade

Lido do comp aprovado, e é daqui que sai tudo que o comp não mostra.

**Gramática:** canto **reto em tudo** (o namespace de raio segue deletado no `@theme`) · fio de 1px só onde há separação real · elevação por tom, nunca por sombra dura · fotografia sem moldura, sem borda, sem legenda flutuante · toda ação é link, sem botão preenchido · uma família de texto e uma de dado.

**Rampa de tipo:** display da abertura `--text-display` (`clamp(2.5rem, 4.6vw, 4.5rem)`), peso 300 na chamada · h2 de seção em `--text-h1` · nome de fábrica em h3 · `resolve` em support grafite · mono **só** onde há medida real (formato, peso, CNPJ). A mono deixa de ser a voz de rótulo do site.

> ⚠️ **O h2 de seção usa `--text-h1`, e isso não é engano.** Uma versão anterior desta linha pedia `clamp(1.5rem, 2.2vw, 2.25rem)`, que **não é token nenhum** — era um terceiro tamanho inventado entre `--text-h2` e `--text-h1`. Todo h2 de seção do site já veste `text-h1` (`faixa-representacao`, `catalogos-em-destaque`, `quem-somos/secao`, `marca/secao`, `paginas/secao`), e dois deles rolam na mesma tela que o do trilho: baixar só este deixaria o título de cima menor que os de baixo. O elemento é `<h2>` de verdade; o que o token nomeia é tamanho, não nível.

| Ingrediente | Meio | Nota |
|---|---|---|
| Fotografia de abertura, full-bleed 100svh | **Raster gerado** | Substitui `/acervo/abertura.jpg` em escala de herói. `priority`, AVIF/WebP, `sizes="100vw"` |
| Véu de legibilidade no pé do herói | CSS gradient | Só onde o texto cai |
| h1 + linha de apoio | HTML/CSS | **Verdade de produto, não muda.** A linha de apoio é gerada das representadas publicadas e da data de abertura |
| Trilho das representadas | HTML/CSS + raster | Quatro cartões, `scroll-snap`, empilha abaixo de `md`. Uma foto por marca |
| Logotipo da fábrica no cartão | Existing project asset | `Representada.logotipo`, via `components/logotipo.tsx`. Faixa decidida pela seção, `<img>`, `alt=""`, sem recolorir |
| Trilha de progresso do trilho | HTML/CSS | Fio fino, segmento escuro proporcional ao deslocamento |
| Faixa editorial (imagem + texto) | HTML/CSS + raster | Texto do global `Home`; some quando em branco |
| Catálogos em destaque | Existing component | Reusa `linha-de-catalogo.tsx` — formato e peso declarados antes do clique |
| As duas portas | HTML/CSS + raster | Dois campos de igual peso, não um botão e um link |
| Rodapé | Existing component | Sem mudança de conteúdo |

**Movimento — a regra mudou.** "A Regra do Movimento Fechado" da v2 proibia movimento por rolagem em todo o código. O padrão da categoria o usa, e o cliente escolheu o padrão: entram **revelações suaves por rolagem** (opacidade e deslocamento curto, saindo de um estado já visível) e a escala lenta de imagem que já existia. `prefers-reduced-motion` continua respeitado sem exceção, e continua sem scroll-jacking, sem parallax e sem loader.

## Restrições que o builder não pode inventar

- O h1 é fixo e não tem campo no painel. Quatro formulações já caíram entre 30/07 e 05/08/2026; trocá-lo é reposicionamento, e reposicionamento é conversa, não edição.
- Söhne + Söhne Mono seguem, com Geist como fallback na mesma pilha. A licença continua pendente e o `@font-face` continua comentado.
- O lead é da Belmare. Nenhum caminho desintermedia o funil; nenhuma página expõe e-mail de fábrica.
- Toda imagem é mock fal.ai, centralizada em `src/lib/acervo.ts`, `alt` honesto terminando em "imagem de referência", nunca legendada como foto de produto ou obra entregue.
- LCP < 2,5s em 4G · CLS < 0,1 · INP < 200ms. A foto de abertura é o LCP.
- Anti-metas que sobrevivem à troca de mundo: carrossel automático, depoimento, newsletter, contador animado, faixa de logos soltos, scroll-jacking, parallax, loader, preço.

## Decisões em aberto

P41 fotos originais em alta (teto de qualidade) · P18 o portfólio cresce (por isso trilho, não grade) · P52 quem aprova a marca · P53/P55 prazo e orçamento · P46b peças em destaque por marca.
