---
version: 3
slug: "src-app-quem-somos-page-tsx"
primary_target: "src/app/(frontend)/quem-somos/page.tsx"
related_targets: []
---

## Escopo e modo

Página `/quem-somos`. Modo **Persuade** — o visitante decide se confia, e a página é o argumento.

Superfície reconstruída dentro do mundo estabelecido. O sistema visual não se toca; a composição foi refeita do zero em **05/08/2026**.

## Público, trabalho, ação

Lojista avaliando se vale abrir conversa com esta representação, e arquiteto avaliando se confia a área externa de um projeto de alto padrão a ela. Silenciosamente, o terceiro leitor: o diretor comercial de uma quinta fábrica decidindo se entrega o Sul do Brasil para a Belmare.

Ação primária: **falar com a Belmare** (WhatsApp, no fecho). Secundária: `/representadas`.

## A direção anterior — "o arquivo" — foi ANULADA em 05/08/2026

Não herdar. A rota era um documento de arquivo: seis blocos numerados de `01` a `06`, com o número em mono na coluna de margem, um ano de fundação em display sozinho na primeira tela, um bloco inteiro sobre o nome que a empresa usava antes, e o território numa prancha de arquitetura completa — moldura, carimbo, graticula e escala gráfica com o paralelo declarado.

O desenho era coerente; o argumento, não. Três defeitos, e o terceiro derruba os outros dois:

1. **O ano solto não trabalha.** Quatro dígitos em display ocupavam a primeira tela antes de o visitante saber o que a empresa faz. Um número só vira lastro depois que a frase à qual ele pertence já foi lida.
2. **A biografia provava a coisa errada.** O bloco do nome existia para dar conteúdo aos anos de casa, e falava de reposicionamento antigo com um leitor que veio decidir uma compra. Nada disso decide conversa comercial.
3. **A página não dizia o que a empresa FAZ.** Seis blocos contando de onde ela veio, nenhum dizendo o que acontece entre o primeiro contato e a peça instalada — que é a única coisa que um lojista e um arquiteto vêm decidir aqui.

⚠️ **Esta seção registra que a direção caiu, e não reencena o que ela dizia.** A versão 2 deste arquivo citava o texto antigo por extenso, e o mesmo trecho estava copiado em mais quatro arquivos de código e documentação — o que fazia a história continuar publicada dentro do repositório depois de ter saído da página. Não a reintroduza aqui para "dar contexto".

A prancha caiu junto por um motivo próprio: era desenho sobre o próprio desenho. Escala gráfica, carimbo e nota de projeção numa página institucional são a empresa exibindo o método em vez de dar a resposta. **O mapa ficou** — malha do IBGE, mesma geometria, mesmo fio de 1px — sem o aparato.

## Direção — a página institucional comum (05/08/2026)

A decisão é não ter direção autoral nenhuma, e isso é deliberado. A empresa diz o que é, o que faz, o que representa e onde atende, em frases inteiras, em seções não numeradas.

Recusa os dois extremos que esta rota já visitou: o "sobre nós" da categoria (foto de equipe, missão/visão/valores, contador animando até 26) e o extrato de registro (CNAE, porte e razão social em faixa). E recusa o terceiro, que era a direção anterior: o documento de arquivo, que fala da empresa em vez de falar com quem chegou.

**Sequência — seis seções, sem numeração:**

| Seção | Carrega |
|---|---|
| **A apresentação** — h1 e um parágrafo, os dois do painel | O que a empresa é e há quanto tempo. Sem foto e sem número solto: o LCP é tipográfico |
| **O que a Belmare faz** — parágrafo + ficha de etapas, todos do painel | **A seção que faltava.** Representação, especificação, pedido, pós-venda |
| **As fábricas representadas** — as quatro em lista de ficha: nome, origem, linha, link | Não repete `/representadas` nem a galeria da home |
| **Onde a Belmare atende** — PR · SC · RS no fio de 1px, Florianópolis marcada | O único gráfico da página |
| **Projetos entregues** — seção anulável, no ar a partir de três projetos | A prova exclusiva da Belmare, quando existir (P43) |
| **Fale com a Belmare** — foto larga (a única da rota) + ação + ficha de atendimento | Ancora o fecho e expõe a ação |

A ordem ajuda a leitura, mas **não é mais o argumento**: nenhuma seção depende de ter sido lida depois da anterior, e nenhuma some se a outra sumir. Foi por isso que a numeração saiu — numerar o que não é sequência empresta autoridade de documento a um índice.

## [05/08/2026 · v3] A rota inteira passou a ser editável no painel

Nenhuma linha de texto desta página mora em código. Os seis títulos eram fixos, três parágrafos eram metade fixos — o site montava a primeira oração contando o dado e o campo era o que vinha depois — e o parágrafo do território não tinha campo nenhum.

O que destravou foi `src/lib/marcadores.ts`. O conflito nunca foi entre editar e não editar, e sim entre editar e **congelar**: um "quatro" digitado num textarea continua dizendo quatro no dia em que a quinta fábrica entra pelo painel, três centímetros acima de uma lista com cinco linhas. Com marcador — `{anos}`, `{fabricas}`, `{cidade}`, `{estados}`, `{quantosEstados}` — a frase inteira é do operador e o número continua sendo contado a cada renderização.

Duas regras opostas para campo em branco, e a diferença é acessibilidade: **título cai no padrão, parágrafo some.** Um parágrafo a menos é uma seção mais curta; um `h2` vazio é um cabeçalho que o leitor de tela anuncia sem nome. A legenda da foto do fecho segue a regra do título, e por um motivo próprio: sem ela a imagem de banco passa a valer como obra entregue.

Continuam fora do painel, e só eles: **a ordem das seções** — porque um construtor de blocos genérico oferece item por item a lista de anti-metas abaixo — e **o mapa**, que é malha oficial reprojetada.

## O mapa, e o que sobrou dele

Continua sendo a **malha oficial do IBGE** (API de malhas, região Sul, recorte por UF), reprojetada em Mercator e simplificada a ~8 KB de vetor, em `src/lib/territorio.ts`. Geometria em SVG, rótulo em HTML por cima — dentro do `viewBox` a mono escalaria com o desenho. As siglas assentam no polo de inacessibilidade de cada contorno.

Regerar a partir do IBGE; **não editar coordenada à mão.**

Saíram: moldura, carimbo, graticula, escala gráfica, os rótulos `PRANCHA 01` e `MALHA IBGE`, e a legenda visível que declarava a projeção e o paralelo. Ficaram: os três contornos, as três siglas, a marca da sede e a descrição em `sr-only`.

## Prova publicável nesta superfície, e nada além

Anos de mercado **calculados por `anosDeMercado()`, nunca escritos à mão** · `PR · SC · RS` · Florianópolis/SC como sede · as quatro fábricas e suas cidades de origem · a venda é sempre por loja · os telefones do cadastro.

Fora disso, **nada**: sem obra, cliente, prêmio, número de projetos ou depoimento.

Quatro coisas foram cortadas por não terem lastro ou por não servirem ao leitor, e a regra que elas deixaram vale para a rota inteira:

- **exclusividade de terceiro** ("nenhuma vende para o Sul sem passar por aqui") — termo comercial das fábricas, e o terceiro leitor desta página é uma fábrica;
- **absoluto histórico** ("o nome mudou uma vez", "a razão social nunca mudou") — existe UM nome anterior em documento, não a contagem de mudanças;
- **papelada** (CNAE, porte, razão social em faixa) — registro se confere pelo CNPJ do rodapé;
- **[05/08/2026] biografia da empresa** (o ano em display, o nome antigo, "o começo") — verdadeira, conferível, e irrelevante para as duas pessoas que compram.

## Projetos realizados — decisão registrada

A seção está **construída inteira e no ar em zero pixels**: `projetosPublicaveis()` só devolve conteúdo com ≥3 projetos reais e completos (`obra · cidade/UF · ano · marcas · foto · crédito do arquiteto`). Sem markup vazio, sem título órfão, sem "em breve".

**[05/08/2026]** Com a numeração fora, ela deixou de deslocar a seção seguinte — o parâmetro `numero` saiu do componente. A página em pé **não tem buraco** sem ela: foi por isso que a rota sobreviveu ao P43 nas duas direções.

⚠️ A foto do fecho carrega **legenda visível** dizendo que não é obra entregue. É a única legenda de foto do site, e existe por causa da posição: ela cai exatamente no vão que a seção de projetos deixa vazio, e `alt` não resolve — ninguém que enxerga lê `alt`.

## Restrições que o builder não pode inventar

- Mundo visual **inalterado**: tokens de `globals.css`, Söhne com fallback Geist, papel `#F5F3F0`, fio `#C9C6C0`, raio 0, sombra 0, **cor 0**, duas famílias.
- Dado vem de `src/lib/territorio.ts`, do global `Empresa` e do global `QuemSomos` — **nunca hardcoded no JSX**. `anosDeMercado()` e `linkDeWhatsapp()` seguem como fonte única. `src/lib/registro.ts` **não existe mais**.
- Imagem só via `src/lib/acervo.ts`; `alt` honesto terminando em "imagem de referência".
- Campo sem dado renderiza "não declarada" com todas as letras, não travessão.
- O mapa nomeia **estados, não cidades**. Florianópolis entra por ser o endereço verificado.
- Toda contagem em prosa é gerada (`lib/frase.ts`), inclusive dentro de texto do painel, por marcador (`lib/marcadores.ts`) — a quinta fábrica corrige a página sozinha.
- Texto de seção **nunca volta para o JSX**: título, parágrafo e etapa são campos. O padrão de `lib/quem-somos-consulta.ts` responde ao painel vazio, não é o conteúdo da página.
- Sem vocabulário de movimento novo; herda a contenção da home. Sem movimento por rolagem. `prefers-reduced-motion` respeitado.
- Server Component, WCAG AA. Sem hero raster, o LCP é tipográfico.
- `export const revalidate = 86400`: a contagem de anos é avaliada no build e, sem revalidação, a página erra o próprio número todo 22 de abril.

**Anti-metas:** foto de equipe · missão/visão/valores · contador animado · prosa em superlativo · projeto, cliente ou prêmio inventado · terceira família · qualquer cor · e-mail de fábrica exposto · repetir a grade de marcas da home · **repetir o h1 da home** · **numeração de seção** · **o ano de fundação como elemento de desenho** · **biografia da empresa em qualquer forma** · **texto de seção escrito direto no componente**.

## Decisões em aberto

P43 fotos de projetos entregues (a página foi desenhada para não depender) · **P6b número real do WhatsApp — a ação primária da rota depende dele, e sem ele a faixa não é desenhada** · nomear João Padova em texto, a confirmar com ele (hoje a página diz "quem representa", sem nome) · **26 × 27 anos: `PRODUCT.md` diz 26, a aritmética a partir de 22/04/1999 dá 27** · P41 fotos originais em alta · P52 aprovação da marca · P57 revisão jurídica.
