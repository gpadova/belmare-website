---
version: 1
slug: "src-app-quem-somos-page-tsx"
primary_target: "src/app/quem-somos/page.tsx"
related_targets: []
---

## Escopo e modo

Página `/quem-somos`. Modo **Persuade** — o visitante decide se confia, e a página é o argumento.

Superfície nova dentro do mundo estabelecido (Direção A, editorial/arquivo). O sistema visual não se toca; só a composição estava aberta.

> ⚠️ Uma direção anterior — **"o mostruário"**, abrindo na matriz de cobertura marca × matéria — foi **anulada em 30/07/2026** junto com o eixo de matéria (`briefing/estrutura.md` §4). Não herdar.

## Público, trabalho, ação

Arquiteto avaliando se confia a área externa de um projeto de alto padrão a este interlocutor. Silenciosamente, o segundo leitor: o diretor comercial de uma quinta fábrica decidindo se entrega o Sul do Brasil para a Belmare.

Ação primária: **falar com a Belmare** (WhatsApp/contato, no fecho). Secundária: `/representadas`.

## Direção — "o arquivo" (confirmada 30/07/2026, construída 30/07/2026)

Sorteio de estrutura: escopo superfície, modo persuade, chave **`921239f0`**, índice **7 de 7** da lista ordenada por ressonância.

O segmento inteiro escreve *26 anos de tradição e excelência*. A Belmare não escreve nada: **ela abre o registro.** O lastro vem de documento datado, não de adjetivo, e não de fotografia que ela não tem.

Isso resolve o problema estrutural da rota. `/quem-somos` é a página que mais depende de material inexistente (P43, fotos de projeto), e o acervo **documental** da empresa existe inteiro e é verificável.

Recusa explícita: a página "Sobre nós" com foto de equipe, tríptico missão/visão/valores e contador animando até 26.

**Sequência — seis blocos, numerados em mono na margem (`01`–`06`):**

| | Bloco | Carrega |
|---|---|---|
| 01 | **Abertura — o registro.** Sem foto. Faixa de identificação em mono, `1999` em display, h1 curto | O tempo, primeiro fato |
| 02 | **O que o registro diz** — os cinco CNAEs, código e descrição, em tabela regrada | Evidência, não afirmação |
| 03 | **O nome anterior** — o registro público de antes e o logotipo de agora, lado a lado | Os anos de casa com conteúdo |
| 04 | **`PRANCHA 01` — o território** — PR · SC · RS no fio de 1px, Florianópolis como sede | **Momento memorável.** Único gráfico da página |
| 05 | **O acervo representado** — as quatro em ledger: nome, origem, o que resolve, link | Não repete `/representadas` nem a grade da home |
| 06 | **O interlocutor** — foto larga (a única da página) + ficha de atendimento | Ancora o fecho e expõe a ação |

Ritmo: registro denso → prancha silenciosa → ficha densa → foto larga e fecho.

## Como a prancha foi construída, e por que importa

Não é ilustração: é a **malha oficial do IBGE** (API de malhas, região Sul, recorte por UF), reprojetada em Mercator e simplificada a ~8 KB de vetor, em `src/lib/territorio.ts`. Geometria em SVG, rótulo em HTML por cima — dentro do `viewBox` a mono escalaria com o desenho. Escala gráfica calculada da projeção, com o paralelo declarado, porque em Mercator a escala varia com a latitude. As siglas assentam no polo de inacessibilidade de cada contorno.

Regerar a partir do IBGE; **não editar coordenada à mão.**

## Prova publicável nesta superfície, e nada além

`22.04.1999` · anos de mercado **calculados por `anosDeMercado()`, nunca escritos à mão** · `Bello Mare Mercantil Ltda` · `CNPJ 03.133.708/0001-09` · EPP · os cinco CNAEs nas palavras do registro · `PR · SC · RS` · Trindade, Florianópolis/SC · as quatro fábricas e suas cidades de origem · nunca vende direto · o nome público anterior.

Fora disso, **nada**: sem obra, cliente, prêmio, número de projetos ou depoimento.

Três frases foram cortadas na revisão de finalização por não terem lastro, e a regra que elas deixaram vale para a rota inteira:
- **exclusividade de terceiro** ("nenhuma vende para o Sul sem passar por aqui") — termo comercial das fábricas, não está em documento nenhum, e o segundo leitor desta página é uma fábrica;
- **absoluto histórico** ("o nome mudou uma vez", "a razão social nunca mudou") — existe UM nome anterior em documento, não a contagem de mudanças;
- **continuidade cadastral** ("27 anos de registro ativo") — os fatos em mão dão a data de abertura, não o histórico da situação.

## Projetos realizados — decisão registrada

A seção está **construída inteira e no ar em zero pixels**: `projetosPublicaveis()` só devolve conteúdo com ≥3 projetos reais e completos (`obra · cidade/UF · ano · marcas · foto · crédito do arquiteto`). Sem markup vazio, sem título órfão, sem "em breve". Entra entre 05 e 06 e assume o `06`; o interlocutor passa a `07`.

A página em pé **não tem buraco** sem ela — foi por isso que esta direção sobreviveu ao P43.

⚠️ A foto do bloco 06 carrega **legenda visível** dizendo que não é obra entregue. É a única legenda de foto do site, e existe por causa da posição: ela cai exatamente no vão que a seção de projetos deixa vazio, e `alt` não resolve — ninguém que enxerga lê `alt`.

## Restrições que o builder não pode inventar

- Mundo visual **inalterado**: tokens de `globals.css`, Söhne com fallback Geist, papel `#F5F3F0`, fio `#C9C6C0`, raio 0, sombra 0, **cor 0**, duas famílias.
- Fatos novos vivem em `src/lib/registro.ts` e `src/lib/territorio.ts` — **nunca hardcoded no JSX**. `EMPRESA`, `anosDeMercado()` e `whatsapp()` seguem como fonte única.
- Imagem só via `src/lib/acervo.ts`; `alt` honesto terminando em "imagem de referência".
- Campo sem dado renderiza "não declarada" com todas as letras, não travessão.
- A prancha nomeia **estados, não cidades**. Florianópolis entra por ser o endereço verificado.
- **P1 segue aberto** (comissão × atacado): publica-se o código do CNAE, não a conclusão.
- Sem vocabulário de movimento novo; herda a contenção da home. Sem movimento por rolagem. `prefers-reduced-motion` respeitado.
- Server Component, WCAG AA. Sem hero raster, o LCP é tipográfico.
- `export const revalidate = 86400`: a contagem de anos é avaliada no build e, sem revalidação, a página erra o próprio número de abertura todo 22 de abril.

**Anti-metas:** foto de equipe · missão/visão/valores · contador animado · prosa em superlativo · projeto, cliente ou prêmio inventado · terceira família · qualquer cor · e-mail de fábrica exposto · repetir a grade de marcas da home.

## Decisões em aberto

P43 fotos de projetos entregues (a página foi desenhada para não depender) · **P6b número real do WhatsApp — a ação primária da rota aponta para um mock** · nomear João Padova em texto, a confirmar com ele (hoje a página diz "quem representa", sem nome) · **26 × 27 anos: `PRODUCT.md` diz 26, a aritmética a partir de 22/04/1999 dá 27** · P41 fotos originais em alta · P52 aprovação da marca · P57 revisão jurídica · `/representadas`, `/catalogos` e `/arquivos-3d` ainda não existem: cinco dos seis links de saída desta página caem no 404.
