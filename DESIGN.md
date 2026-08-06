---
name: Belmare Representações
description: Sistema editorial acromático — papel, fio de 1px e duas famílias tipográficas; a fotografia é a única cor.
colors:
  paper: "#F5F3F0"
  ink: "#17171A"
  graphite: "#3D3D40"
  line: "#C9C6C0"
  surface: "#FFFFFF"
typography:
  display:
    fontFamily: "Söhne, Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 4.6vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  display-leve:
    fontFamily: "Söhne, Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 4.6vw, 4.5rem)"
    fontWeight: 300
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  h1:
    fontFamily: "Söhne, Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 2.6vw, 2.625rem)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  h2:
    fontFamily: "Söhne, Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 1.9vw, 1.875rem)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  h3:
    fontFamily: "Söhne, Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "normal"
  body:
    fontFamily: "Söhne, Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  support:
    fontFamily: "Söhne, Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
  mono:
    fontFamily: "Söhne Mono, Geist Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "0.06em"
    fontFeature: "tnum"
rounded:
  none: "0px"
spacing:
  base: "0.25rem"
  margem: "1.25rem"
  margem-desktop: "2rem"
  secao-home: "5rem"
  secao-home-desktop: "7rem"
  bloco-topo: "3rem"
  bloco-base: "3.5rem"
  bloco-topo-desktop: "4rem"
  bloco-base-desktop: "6rem"
  coluna-rotulo: "9rem"
  coluna-medida: "13rem"
  coluna-medida-3d: "10rem"
  coluna-marca: "11rem"
  coluna-eixo: "6rem"
  teto-lista: "64rem"
  cartao-trilho: "24rem"
components:
  cabecalho:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    height: "3.5rem"
    padding: "0 1.25rem"
  cabecalho-desktop:
    height: "4.5rem"
    padding: "0 2rem"
  nav-item:
    typography: "{typography.mono}"
    textColor: "{colors.graphite}"
  nav-item-hover:
    textColor: "{colors.ink}"
  link-acao:
    typography: "{typography.mono}"
    textColor: "{colors.ink}"
  cartao-trilho:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.none}"
    width: "{spacing.cartao-trilho}"
  porta:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    typography: "{typography.h1}"
    rounded: "{rounded.none}"
    padding: "1.5rem"
    height: "30rem"
  porta-desktop:
    padding: "3.5rem"
    height: "38rem"
  bloco:
    backgroundColor: "{colors.paper}"
    padding: "3rem 1.25rem 3.5rem"
  bloco-desktop:
    padding: "4rem 2rem 6rem"
  ficha-rotulo:
    typography: "{typography.mono}"
    textColor: "{colors.graphite}"
    width: "{spacing.coluna-rotulo}"
  ficha-valor:
    typography: "{typography.support}"
    textColor: "{colors.ink}"
    padding: "1rem 0"
  linha-ledger:
    typography: "{typography.h3}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1.25rem 0"
  linha-ledger-hover:
    backgroundColor: "{colors.surface}"
  linha-documento:
    typography: "{typography.h3}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1.25rem 0"
    width: "{spacing.teto-lista}"
  linha-documento-hover:
    backgroundColor: "{colors.surface}"
  recorte:
    typography: "{typography.body}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.none}"
    padding: "0.25rem 0"
  recorte-ativo:
    textColor: "{colors.ink}"
  recorte-contagem:
    typography: "{typography.mono}"
    textColor: "{colors.graphite}"
  acao-fecho:
    typography: "{typography.h2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1.75rem 0"
  acao-fecho-hover:
    backgroundColor: "{colors.surface}"
  campo-rotulo:
    typography: "{typography.support}"
    textColor: "{colors.graphite}"
  campo:
    typography: "{typography.body}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 0 0.5rem"
  envio:
    typography: "{typography.support}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1rem 2rem"
  envio-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  balao-whatsapp:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "3rem"
    width: "3rem"
  balao-whatsapp-hover:
    backgroundColor: "{colors.paper}"
  pular-conteudo:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.mono}"
    padding: "0.5rem 0.75rem"
---

# Design System: Belmare Representações

## Overview

**Creative North Star: "O Padrão da Categoria, no Teto do Segmento"**

> ⚠️ **A ESTRELA MUDOU EM 05/08/2026, E A ANTIGA NÃO FOI APAGADA — FOI REDUZIDA
> DE ESCOPO.** Este documento abria com **"A Prancha de Arquivo"**: o site como
> folha técnica, e a home como a primeira página dela. O cliente escolheu outra
> coisa numa página de decisão de direção (semente `b95c2020`), com a designada e
> três desafiantes à vista, e ele escolheu **a saída permanente — o padrão da
> categoria, jogado reto**, executado no acabamento de Gandiablasco, Tribù,
> Paola Lenti, Kettal, Artefacto, Breton, Sollos e Micasa. A escolha está gravada
> como `CONTRATO_DE_DIRECAO` em `app/(frontend)/layout.tsx`, e não é resultado de
> rolagem: é decisão registrada, com as alternativas na tela.
>
> **A prancha continua governando — onde a página É um índice ou um registro:**
> `/catalogos`, `/arquivos-3d`, `/representadas` e a página de cada marca. O que
> ela deixou de governar é a home e `/quem-somos`. A matéria não mudou em
> nenhuma das duas pontas: mesma paleta, mesmo fio, mesmas duas famílias, raio 0
> e sombra 0. **O que mudou foi a composição, não o material.**

A convenção é o compromisso. O que separa esta home da home das concorrentes não
é a estrutura — é o acabamento. Fotografia sangrando por 100svh, uma display de
72px em peso leve sobre o pé dela, um trilho de fábricas que rola em vez de uma
grade que quebra, e duas portas do tamanho da escolha que elas oferecem. Nada de
ironia, nada de gesto de autor: as cartas com instrumento, diagrama e trilho
conceitual foram recusadas na mesma página em que esta foi escolhida.

Onde a página é registro, a densidade continua sendo de amostrário: alinhamento
visível e sem exceção, fichas de rótulo e valor, listas regradas com a medida à
direita, cabeçalhos de seção em mono com a contagem à direita e uma prancha
chaveada sobre fotografia. O que dá identidade nas duas pontas é a mesma coisa —
a grade, o fio e o vazio —, não a decoração. O teste que o projeto aplica em si mesmo continua
valendo inteiro: tire tudo menos tipografia, fio e foto, e o site ainda tem que
ficar de pé.

O sistema recusa, em código e não só em intenção: raio, sombra, gradiente
(exceto o véu de legibilidade sobre foto), matiz fora do logotipo, terceira
família tipográfica, textura de fundo, carrossel automático, loader, parallax e
scroll-jacking. **Movimento por rolagem saiu dessa lista em 05/08/2026, e saiu
por decisão do cliente** — há exatamente um, e o que ele custou está escrito em
Movimento.

As superfícies hoje: `/` (a home), `/quem-somos`, `/representadas`, o template
`/representadas/[marca]`, `/catalogos`, `/arquivos-3d`, três **rotas livres**
montadas no painel (`/arquitetos`, `/contato`, `/politica-de-privacidade`) e a
404. `/catalogos` e `/arquivos-3d` são a **mesma** página desde 05/08/2026 —
mesma sequência, mesma gramática de linha, um eixo de recorte a mais na segunda.

`/catalogos` é a primeira superfície **sem uma única imagem**, e isso é direção,
não falta de acervo: numa rota em que o visitante veio buscar um arquivo,
fotografia de ambiente é ruído entre ele e o arquivo. O teste declarado acima
passa a ter uma página que o cumpre com dois dos três elementos — ela fica de pé
só com tipografia e fio. Não é licença para o resto do site. Onde há fotografia,
ela continua sendo a única cor.

**Key Characteristics:**
- Acromático na interface: cinco valores neutros; o matiz existe numa classe de objeto só, o logotipo — o da Belmare e o das fábricas representadas
- Fio de 1px `#C9C6C0` como único ornamento, e estrutural
- Raio 0 e sombra 0 impostos por deleção de namespace, não por convenção
- Duas famílias: grotesca para fala, mono para medida — e a mono recuou para medida real
- Elevação só por tom: `#FFFFFF` sobre `#F5F3F0`
- Movimento fechado em cinco gestos: quatro por ponteiro, e **um** por rolagem
- Toda ação é link; o preenchimento existe num lugar só do site, e é o `hover` do envio de formulário
- Dado ausente é declarado por extenso, nunca inventado nem travessão
- A fotografia é a cor das superfícies — e não é requisito: `/catalogos` fica de pé sem nenhuma
- Formato, peso e edição declarados antes do clique, formatados por uma função só

## Colors

Paleta acromática de cinco valores. Nenhum acento, nenhuma cor de estado. **O
matiz do projeto vive dentro de um logotipo, e não sai dele** — ver **Logotipo**
em Shapes.

> ⚠️ **Reescrita em 05/08/2026, e a regra não afrouxou — ela passou a dizer o que
> sempre quis dizer.** O texto anterior era "o único matiz do projeto está dentro
> do logotipo", no singular, e o logotipo era o da Belmare porque era o único que
> existia. Com `Representada.logotipo` no painel, as marcas das fábricas entram
> trazendo as cores delas. A regra sempre foi sobre ONDE a cor pode estar, não
> sobre quantas marcas há: **a cor vive dentro de uma marca e em nenhum outro
> lugar da interface** — não vira acento, nem estado, nem fio, nem fundo, nem
> matiz de tipografia. O que mudou é que a classe "marca" tem mais de um membro.
> O site publica cada uma como o arquivo original é, sem recolorir.

### Neutral

- **Papel** (`{colors.paper}`): o fundo de todo o site — `body`, cabeçalho fixo, faixa de índice, rodapé e blocos. Nunca branco puro: branco endurece a fotografia e cansa em navegação longa. Também é a cor do recorte que abre a linha sob os rótulos da prancha, do trilho da barra de rolagem, do **encamisamento de 3px sob a linha de chamada** na PRANCHA 02, e do texto do envio de formulário no `hover`.
- **Tinta** (`{colors.ink}`): texto principal, contorno dos estados no mapa, linha de chamada sobre fotografia, traço da seta e do glifo de WhatsApp, a palavra dentro do logotipo, fundo do skip link, fundo de todo contêiner que espera imagem (`bg-ink` atrás de `next/image`, para não haver flash claro), borda da faixa de ação, borda do envio de formulário e do balão fixo. É também o fundo de `::selection`.
- **Grafite** (`{colors.graphite}`): UI secundária — texto de apoio, rótulo em mono, número de bloco, itens de navegação em repouso, rótulo de campo de formulário, a marca de escala do mapa e **o polegar das duas barras de rolagem**, a larga e a `barra-fio`. É o cinza que lê como instrumento sem competir com a tinta.
- **Fio** (`{colors.line}`): divisores, bordas de tabela e de ficha, moldura e graticula de prancha, sublinhado em repouso dos links de título, borda de campo de formulário em repouso. Único ornamento do sistema.
- **Superfície** (`{colors.surface}`): branco puro, usado com parcimônia. É elevação — fundo de linha de ledger, de linha de documento e da faixa de ação no `hover` —, e é o fundo permanente de exatamente um elemento, o balão fixo de WhatsApp. Nunca como fundo de página.

### Sobre fotografia

Sobre imagem, e **somente** sobre imagem, o sistema usa branco puro no texto
(`#FFFFFF`, e `#FFFFFF` a 85% na linha de apoio) e um véu preto em gradiente. Na
abertura o véu cobre os dois terços inferiores (`from-black/80 via-black/42
to-transparent`); nas portas cobre a superfície inteira (`from-black/85
via-black/45 to-black/15`). Não é ornamento: é a única razão de o texto claro ser
legível sobre deck iluminado.

**A Regra do Véu Medido.** O véu da abertura é calibrado contra uma fotografia
específica, e o número sai de medição, não de olho. Ele era `70/30` até
05/08/2026 e subiu para `80/42` quando a fotografia foi refeita em luz de fim de
tarde: medindo o fundo real sob os glifos do h1 em 1440×900 — com o texto
escondido, para não medir a própria letra —, `70/30` dava média de 9,8:1 e
**2,39:1 no pior pixel**, contra os 3:1 que a WCAG pede para texto grande.
`80/42` leva o pior pixel a 3,46:1 e a linha de apoio a 8,51:1. **A média passar
não basta** — a palavra que cai no ponto claro é justamente a que ninguém lê, e é
por isso que a medida é do pior pixel e não do conjunto. **Trocar a fotografia de
abertura obriga a remedir**: uma imagem mais clara torna estes dois números
insuficientes outra vez, e o defeito é invisível em revisão porque a média
continua excelente.

### Named Rules

**A Regra da Cromia Zero.** Nenhum matiz entra em nenhuma superfície. Não há cor
primária, não há cor de estado, não há verde de sucesso nem vermelho de erro.
Estado se comunica por tom (grafite → tinta), por peso de fio e por posição. O
glifo de WhatsApp é o teste que a regra passou: ele entrou em 04/08/2026 **sem o
verde oficial e sem preenchimento**, traçado em `currentColor` como a seta.
Atenção: diferente de raio e sombra, o namespace de cor padrão do Tailwind **não**
foi deletado — `text-red-500` ainda compila. A disciplina aqui é convenção, e a
única guarda é a revisão.

**A Regra do Papel.** `#F5F3F0` é fundo; `#FFFFFF` é superfície. Inverter os dois
quebra a única forma de elevação que o sistema tem.

**A Regra do Indicador Visível — nova em 05/08/2026.** Um elemento que o sistema
usa para dizer que há mais conteúdo tem que passar dos **3:1** que a WCAG 1.4.11
pede para objeto gráfico necessário à compreensão. O polegar da `barra-fio` era
`{colors.line}` sobre papel: ~1,54:1. Um indicador que ninguém enxerga não é um
indicador discreto, é um indicador ausente. Ele foi para `{colors.graphite}`
(~9,8:1), e o `hover` em tinta continua marcando o alvo. Discrição não é licença
para invisibilidade — é a mesma conta que já obrigava a linha de chamada da
PRANCHA 02 a ser traçada duas vezes.

## Typography

**Fonte de texto e título:** Söhne (Klim), com fallback Geist na mesma pilha
**Fonte de dado técnico:** Söhne Mono, com fallback Geist Mono na mesma pilha

Os `@font-face` de Söhne estão **comentados** em `app/(frontend)/globals.css` até
a licença ser comprada: declarados sem os `.woff2` em `public/fonts/`,
produziriam quatro 404 no console a cada visita, e o projeto trata erro de
console como defeito. A pilha já nomeia Söhne em primeiro lugar — soltar os
arquivos e descomentar o bloco basta para a fonte valer, sem tocar em nenhum
componente. Geist entra por `next/font/google` como variável
(`--font-geist-sans`, `--font-geist-mono`) referenciada de dentro da própria
pilha; por isso a troca é de arquivo, não de código.

**Character:** grotesca suíça sem afetação, tracking negativo firme nos títulos,
mono de corpo pequeno e tracking aberto para tudo que é medida. A escala grande
recuperou o corpo em 05/08/2026 e ganhou um peso leve na chamada — é o que separa
um herói caro de um banner nesta barra de qualidade. Fora dela, nada de peso
ultraleve e nada de família de exibição.

### Hierarchy

- **Display** (400, `clamp(2.5rem, 4.6vw, 4.5rem)`, 1.04, −0.03em): usada duas vezes no site inteiro, e as duas são `h1` — o da abertura da home sobre a foto, em peso 300, e o nome da fábrica na abertura de `/representadas/[marca]`, em 400. É gesto de abertura, não de seção.
- **H1** (400, `clamp(1.75rem, 2.6vw, 2.625rem)`, 1.12, −0.025em): título de seção e rótulo das portas. **É o tamanho de todo `h2` de seção do site**, inclusive os da home — o token nomeia tamanho, não nível. Sempre com teto de medida em `ch` (14–24ch) e `text-balance` quando tem duas linhas.
- **H2** (400, `clamp(1.375rem, 1.9vw, 1.875rem)`, 1.2, −0.02em): usada uma vez, no rótulo da faixa de ação ("Falar pelo WhatsApp"). É o tamanho que faz um link de contato pesar sem virar botão.
- **H3** (400, 1.375rem, 1.25): nome de representada no trilho e no ledger, título de documento na linha, rótulo de caminho na página livre, e a mensagem de sucesso do formulário. Sempre sublinhado no fio quando é link.
- **Body** (400, 1.0625rem, 1.55): parágrafo corrido, com teto de 44–68ch e `text-pretty`. Também é o corpo do campo de formulário.
- **Support** (400, 0.875rem, 1.45): dado longo em caixa baixa — razão social, endereço, descrição de CNAE, valor de ficha, legenda de figura, nota de fonte, rótulo de campo, rótulo do envio.
- **Mono** (400, 0.6875rem, 1.35, +0.06em, `tabular-nums`): rótulo, código, sigla, número de bloco, ano, medida, navegação e nome de canal. Nunca frase inteira.

A entrelinha da mono na utilidade `mono` é 1.35 — e não o 1.3 do token
`--text-mono--line-height`, que não é consumido por nada.

> ⚠️ **A DISPLAY SUBIU DE VOLTA, E É A ÚNICA MEDIDA QUE A TROCA DE MUNDO MEXEU —
> 05/08/2026.** A nota anterior deste documento dizia: "a display desceu de 88px
> para 56px e subiu de 300 para 400 justamente para a página ler como voz
> editorial calma, e não como pôster brutalista". **O argumento não vale mais
> aqui, e a razão é literal:** ele foi escrito para o mundo de arquivo, onde a
> página inteira era tipografia e fio e a display competia com um fundo de papel
> vazio. O h1 desta home vive SOBRE fotografia sangrada, e 56px sobre uma foto de
> tela cheia em 1440px lê como legenda, não como abertura. `34–56px` virou
> `40–72px`, a entrelinha foi de 1.06 para 1.04 e o tracking afrouxou de −0.035em
> para −0.03em. **72px é o teto, e ele é deliberado** — passar disso é o pôster
> que a nota antiga temia, dessa vez com razão. O raciocínio inteiro está no
> comentário do token em `globals.css`, e ele é a fonte.

### Named Rules

**A Regra do Peso na Chamada.** O token da display **não carrega peso**, e isso é
decisão, não esquecimento: ela tem dois consumidores com necessidades opostas. O
h1 da home é `font-light` (300) porque 400 nesse corpo sobre fotografia fecha os
contornos e lê como anúncio; o h1 da página de marca fica em 400 porque é um nome
próprio sobre papel, e ali o ultraleve some. **Peso que só serve a uma das
chamadas mora na chamada.** Quando o build de 05/08 subiu a display, o peso 300
foi para `abertura.tsx` justamente para não arrastar o segundo consumidor junto.

**A Regra da Divisão de Trabalho.** A grotesca fala, a mono mede. Material,
formato, contador, código, ano, medida e sigla vão em mono. Frase inteira não é
medida — vai na grotesca. **A mono recuou com a troca de mundo:** ela deixou de
ser a voz de rótulo geral do site e ficou onde há medida real — formato, peso,
CNPJ, sigla de estado, item de navegação e carimbo de prancha.

**A Regra da Caixa Alta.** Versal é aplicada **explicitamente**, item a item. O
teste é de **classe da string, não de tamanho**: medida, código, sigla, rótulo de
campo e estado de campo declarado vão em versal (`PDF · 24,0 MB · 2026`, `EDIÇÃO
NÃO DECLARADA`, `NÃO DECLARADA`); nome próprio, frase e legenda ficam fora **mesmo
curtos** — razão social, endereço, descrição de CNAE, nome de coleção e nome de
fábrica vão na grotesca em caixa baixa. A utilidade `mono` deliberadamente **não**
carrega `text-transform`. A regra sobreviveu a uma violação real: a primeira
linha de documento punha o nome da fábrica em mono versal numa linha própria sob
o título. A correção não foi trocar a caixa — foi **apagar a linha**, e a
atribuição entrou dentro do título, em h3 caixa baixa ("Catálogo Trisol"). Se a
solução for baixar a caixa e manter o elemento, quase sempre o elemento é que
estava errado.

**A Regra das Duas Famílias.** Duas, e só duas. Uma terceira família é o primeiro
sintoma de que alguém tentou resolver hierarquia com fonte em vez de com grade.

> ⚠️ Divergência com `briefing/marca.md` §3, **reduzida em 05/08/2026 e ainda
> não fechada**. A tabela do briefing pede Display 88–120px em peso Leicht (300),
> H1 48–64px, H2 32px, entrelinha de display 0.92 e tracking −0.02em. O código
> construído é menor, e o peso agora bate na home: display 40–72px, 300 na
> chamada da home e 400 na da página de marca; H1 28–42px; H2 22–30px; entrelinha
> 1.04; tracking −0.03em. **O código vence** — a justificativa está em comentário
> no próprio `globals.css`. O briefing também descreve a mono como "caixa alta"
> sem exceção; o código restringe a versal a rótulo, código, sigla e medida.

## Layout

Sem contêiner centralizado. O conteúdo pendura na margem esquerda e a margem
direita fica aberta — é o que separa uma folha de arquivo de um texto esticado de
ponta a ponta em telas largas.

**Margem lateral:** `1.25rem` no telefone, `2rem` a partir de `md`. Vale para
cabeçalho, rodapé, todas as seções, a legenda do fecho e as pranchas. Nenhum
elemento tem margem própria. A única coisa que atravessa a margem é a fotografia
de abertura, que sangra de ponta a ponta.

**Ritmo vertical:** as seções da home usam `5rem` no telefone e `7rem` a partir de
`md` — subiram de `4rem`/`6rem` com a troca de mundo, porque uma sequência de
cinco seções em cima de uma abertura de tela cheia precisa de mais ar entre elas
do que uma folha de três. As páginas de documento (`/quem-somos`, página de
marca, rota livre) usam `3rem`/`3.5rem` (topo/base) no telefone e `4rem`/`6rem` a
partir de `md`, sempre abertas por um fio de 1px no topo.

**Breakpoints:** três, e só três — `sm` 40rem (640px), `md` 48rem (768px), `lg`
64rem (1024px). `md` carrega o sistema (185 dos 206 usos): é onde o cabeçalho
passa de duas faixas para uma, a navegação sai da segunda linha, a faixa
editorial parte em duas colunas e as portas deixam de empilhar. `sm` e `lg` são
raros e quase sempre de trilho ou de grade de imagem.

**Cabeçalho:** fixo no topo (`sticky`, z-20), em papel. No telefone são duas
faixas — `3.5rem` com marca e WhatsApp, mais `2.5rem` de navegação rolável na
horizontal, cada uma fechada por um fio. A partir de `md` é uma faixa só de
`4.5rem`, com a navegação no centro e o WhatsApp separado por um fio vertical.

**Abertura:** `calc(100svh − 6rem)` no telefone com piso de `32rem`, e
`calc(100svh − 4.5rem)` a partir de `md`. **Os dois valores agora são exatamente a
altura do cabeçalho, e nada mais** — a abertura fecha na tela. Ela era
`100svh − 9rem` no telefone contra um cabeçalho de 6rem: sobravam 3rem de
propósito, para aparecer uma tira da seção seguinte como convite à rolagem. Isso
era coerente quando a página se anunciava como documento; numa fotografia sangrada
uma tira de off-white no pé lê como imagem cortada curta, não como convite.

**Medida de texto:** teto sempre em `ch`, nunca em px. Título 14–27ch, corpo
44–78ch. É o que mantém a medida legível sem centralizar nada. **Os dois tetos da
abertura são calibrados contra a copy, e mexer numa exige reconferir o outro:**
o h1 é 27ch porque a frase de 52 caracteres tem que cair nas duas linhas que a
composição pede, e a linha de apoio subiu de 62ch para 78ch para matar uma viúva —
com 62ch a frase quebrava em 1440px deixando "27 anos." sozinho embaixo de uma
display de 72px. `text-pretty` não resolve isso sozinho: o teto é que estava
apertado, não o algoritmo de quebra.

**Grades internas observadas:** trilho de representadas em `flex` com encaixe
(ver Trilho, em Components); faixa editorial em duas colunas a partir de `md`
(`gap-16`), empilhada abaixo com a fotografia primeiro; portas em duas colunas a
partir de `md`, separadas por fio, com piso de `30rem`/`38rem`; rodapé em quatro
colunas a partir de `md`; ledger de `/quem-somos` em quatro colunas (`18rem` /
`10rem` / `1fr` / `2rem`) a partir de `md` e em duas abaixo; grade de projetos
`sm:2` → `lg:3`. As duas rotas de índice de arquivo — `/catalogos` e
`/arquivos-3d` — são **uma coluna de largura total**, sem grade de página. A linha
de documento é quatro colunas a partir de `md` (`minmax(0,11rem)` fábrica /
`minmax(0,1fr)` título / `minmax(0,13rem)` medida / `2rem` seta, calha `2rem`) e
duas abaixo (`minmax(0,1fr)` / `2rem`, calha `1rem`); a linha de arquivo 3D é a
mesma com a medida em `minmax(0,10rem)`. Teto de `64rem` nas duas. A fila de
recortes é `minmax(0,6rem)` rótulo / `minmax(0,1fr)` opções a partir de `md`,
empilhada abaixo.

**Grades de duas colunas, e as três são de conteúdo diferente:** a prancha de
`/representadas` parte em `minmax(0,1.55fr)` desenho / `minmax(0,1fr)` legenda a
partir de `md`, com a linha da legenda em `2.5rem` número / `minmax(0,1fr)` texto
/ `2rem`; o mapa de `/quem-somos` é `minmax(0,1fr)` mapa / `26rem` ficha; e as
duas **bandas de formulário** têm entrada própria em Components — o pacote de
`/arquivos-3d` em `minmax(0,20rem)` argumento / `minmax(0,1fr)` formulário a
partir de `md`, a banda de proposta em duas colunas iguais a partir de `lg`.

**Grade de bloco numerado: não existe mais** — a coluna de `5rem` que carregava o
número saiu com a numeração em 05/08/2026, e a última superfície que a usava era
a página de marca. Ver Cabeçalho de seção, em Components. **O token
`coluna-numero` saiu do frontmatter em 06/08/2026**, no passe de auditoria que
esta linha pedia: nenhuma classe do projeto o consumia mais. A seção de registro
hoje é uma coluna só, com teto de `64rem`; a ficha dentro dela tem teto próprio
de `46rem`, porque uma régua que corre oitocentos pixels além do valor lê como
tabela quebrada, não como ledger.

**Ordem de empilhamento.** As duas rotas de índice de arquivo resolveram por
deleção o que antes se resolvia com `flex`/`order-last`: enquanto havia coluna de
argumento, a saída secundária morava dentro dela e, em grid nas duas larguras,
linearizava **antes** da lista — quem abria no telefone encontrava o link para
fora da página antes do primeiro documento. Sem coluna, a ordem do markup já é a
ordem da leitura, em qualquer largura. **Quando a correção de uma ordem de
empilhamento exige `order-*`, quase sempre a coluna é que estava errada.**

**Separação por distância.** Empilhado no telefone, o bloco da saída secundária
cai logo abaixo da nota de ausência, nos mesmos support e grafite — dois
parágrafos cinzentos a duas entrelinhas de distância lêem como um bloco só. O que
separa ali é `4rem` de afastamento, não um fio: fio alinhado a nada é o que a
Regra do Fio Estrutural proíbe.

**Proporção de imagem:** o trilho é `aspect-3/2` **em toda largura** — a troca de
retrato para paisagem que a grade antiga fazia (`aspect-3/2` no telefone,
`sm:aspect-4/5`) existia porque quatro retratos empilhados viravam rolo
interminável, e num trilho nada empilha. Um aspecto só também é o que mantém o
ponto focal do painel válido: um corte só. A faixa editorial é `aspect-4/3`, a
grade de projetos `aspect-4/3`, e a foto de fecho de `/quem-somos` vai de
`aspect-16/9` para `sm:aspect-21/9`. A prancha chaveada não tem aspecto fixo —
ver PRANCHA 02.

### Named Rules

**A Regra da Margem Única.** Tudo pendura na mesma margem esquerda — fio, rótulo,
parágrafo, tabela e prancha. **A exceção é uma só, e é de composição, não de
conteúdo: a fotografia de abertura sangra.** A prancha em particular **não** leva
`mx-auto`: numa página em que a grade é o argumento, o único gráfico centralizado
seria a única coisa fora do lugar.

**A Regra do Teto de 64rem.** A coluna de conteúdo tem teto; a margem direita fica
aberta. Nada é centralizado para "preencher" tela larga.

## Elevation & Depth

**Não existe sombra neste sistema.** `--shadow-*` e `--drop-shadow-*` estão
definidos como `initial` no `@theme`, o que **apaga os namespaces inteiros**:
`shadow-md`, `shadow-lg`, `drop-shadow-*` não são utilidades desencorajadas, elas
simplesmente não compilam. O CSS servido não contém uma única regra de
`box-shadow` autoral.

A profundidade vem de duas fontes, ambas planas:

1. **Tom.** `#FFFFFF` sobre `#F5F3F0`. É a elevação inteira do sistema. Ela é
   **transitória** em três lugares — linha de ledger, linha de documento e faixa
   de ação, todas no `hover` — e **permanente** em exatamente um, o balão fixo de
   WhatsApp. Um branco sobre papel off-white lê como elevado sem sombra nenhuma,
   que é o que torna raio 0 e sombra 0 sustentáveis.
2. **Fio.** O divisor de 1px em `#C9C6C0` separa faixas, abre seções, fecha linhas
   de tabela e desenha a moldura da prancha. Ele não decora: ele é a estrutura
   visível.

O único gradiente do sistema é o véu de legibilidade sobre fotografia, descrito em
Colors. Ele não é elevação e não deve ser reaproveitado como tal.

### Named Rules

**A Regra da Elevação por Tom.** Se algo precisa parecer acima do papel, ele fica
branco. Não existe segunda opção — e quem tentar acrescentar uma vai descobrir que
a utilidade não existe.

**A Regra do Chrome Fixo.** A elevação por tom é transitória — aparece no `hover`
e some. **A exceção é o chrome fixo sobre conteúdo arbitrário**, e ela tem um
membro: o balão de WhatsApp, que fica em `{colors.surface}` sempre. Ele flutua
tanto sobre papel quanto sobre fotografia, e um fundo que só aparecesse no `hover`
deixaria o ícone ilegível toda vez que passasse por cima de uma imagem clara. A
exceção é do CONTEXTO, não uma reversão da regra: quem estiver dentro do fluxo da
página continua elevando só ao toque.

**A Regra do Fio Estrutural.** Um fio de 1px em `{colors.line}` só entra onde há
separação real de conteúdo. Fio decorativo, fio duplo e fio alinhado a nada estão
fora.

## Shapes

**Raio 0, sem exceção.** `--radius-*` é `initial` no `@theme`: o namespace foi
deletado e `rounded-md`, `rounded-lg`, `rounded-full` não existem como utilidades.
Não há um único canto arredondado no site — nem em imagem, nem em campo, nem no
polegar da barra de rolagem, nem no balão fixo, que em todo concorrente é um
círculo verde e aqui é um quadrado de 3rem no fio.

O vocabulário de forma é retangular e ortogonal:

- **Fio de 1px.** Reto, sem raio, sempre em `{colors.line}` — exceto **quatro** fios em `{colors.ink}`: a borda da faixa de ação, a borda do envio de formulário, a do balão fixo e, desde 06/08/2026, o fio que abre a banda de proposta de uma página livre. É assim que esses quatro ganham peso sem virar preenchimento. **A lista é de ELEMENTOS, não de classes de elemento:** o fio em tinta não pertence ao bloco de caminhos — pertence à banda que carrega o formulário. Em `/arquitetos` o mesmo bloco abre em `{colors.line}` como qualquer seção, porque ali ele é uma das três e não a página inteira. Fio em tinta em toda seção seria fio em tinta em nenhuma.
- **Ícones — dois, e a lista é fechada.** A **seta**, em `viewBox 0 0 32 12`, traço de 1px, ponta reta, sem preenchimento, mesma espessura do fio. E o **glifo de WhatsApp**, em `viewBox 0 0 24 24`, traço de 1,5px com `strokeLinecap`/`strokeLinejoin` em `round` — a curva é o que o torna reconhecível, e ponta reta numa curva vira polígono facetado. Os dois em `currentColor` e com `vector-effect="non-scaling-stroke"`. **É o glifo, nunca a marca:** sem preenchimento e sem o verde oficial, porque um balão verde preenchido seria a marca de outra empresa dentro de uma interface que só tem cor num lugar, e não é este. Glifo tipográfico fazendo papel de ícone continua fora.
- **Registro de sede.** Círculo com quatro braços de cruz, traço de 1,5 na legenda e de 1px no mapa — a marca de registro de desenho técnico.
- **Registro de canto.** Uma cruz simples de 1px em `{colors.line}`, centrada nas quatro quinas da moldura de uma prancha. É a marca de esquadro de folha desenhada, e é irmã do registro de sede — mesma família, sem o círculo, porque marca de esquadro não é ponto de coordenada. **Só entra em moldura de prancha, e hoje isso é uma superfície só:** a PRANCHA 02, em `/representadas`.
- **Logotipo.** O vetor original da Belmare, em dois lockups servidos de `public/marca/`: horizontal (proporção 5,379) no cabeçalho, a 24px no telefone e 32px a partir de `md`; e vertical (proporção 0,969) a 112px no rodapé. É **o único objeto com matiz do projeto** — azul `#00339A`, verde `#009A34` e vermelho `#FE0100` —, e o matiz não sai dele. O símbolo sozinho (`public/marca/simbolo.svg`) só aparece no favicon e nas marcas do painel. **O "b" é vazado, não pintado:** quem dá a cor da letra é o que estiver atrás do SVG, então a marca não vai sobre fundo escuro sem uma versão própria — e é por isso que a cópia do símbolo leva um disco de papel embutido. Substituiu, em 04/08/2026, a imitação tipográfica que compunha BELMARE em Söhne com uma faixa de hachura no lugar do símbolo; a hachura saiu junto, porque só existia para ela.
- **Logotipo da representada.** A marca de cada fábrica, subida no painel (coleção `Logotipos`, campo `Representada.logotipo`) e desenhada por `components/logotipo.tsx`. Aparece em duas superfícies: encabeçando o cartão do trilho na home (36px, 40px a partir de `md`, teto de largura 9rem/11rem) e a ficha nos registros de `/representadas` (20px, teto de 7rem). Em ambas, alinhada à esquerda, `object-contain`, altura fixada por classe — é a classe que reserva a caixa, porque o upload direto para o bucket não devolve dimensão intrínseca confiável e sem reserva a grade salta na primeira pintura. Quatro regras, e nenhuma é preferência:
  - **O site não transforma a marca dos outros.** Sem recolorir, sem filtro, sem `currentColor`, sem recorte: publica-se o arquivo como ele subiu. "Autorização de uso" chega junto com manual de marca, e manual de marca costuma proibir exatamente a versão monocromática que um sistema acromático pediria.
  - **`<img>`, nunca SVG em linha.** Aqui é segurança, não peso: um SVG é conteúdo executável, e ele chega ao bucket sem passar por função nossa (`clientUploads: true`), então nenhum hook de servidor pode higienizá-lo. Dentro de `<img>` o navegador desenha e não executa. `dangerouslySetInnerHTML`, `<object>` e `<embed>` transformam upload de terceiro em execução de código na origem do site — e a tentação de usá-los é justamente herdar `currentColor`, que a regra acima já proíbe.
  - **`alt=""`.** O nome da fábrica está escrito em `h3` ao lado da marca nas duas superfícies; repetir no `alt` faz o leitor de tela dizer o nome duas vezes.
  - **A faixa é decidida pela seção, não pelo cartão.** Com um logotipo no ar, todos os cartões abrem a faixa, mesmo os sem arquivo; sem nenhum, ela não existe. O estado que vamos viver por meses é "uma fábrica respondeu, três não", e faixa por cartão sairia como fotografias começando em alturas diferentes — trilho desalinhado lê como defeito de build, não como acervo incompleto.

  **A compensação óptica não existe, e é deliberado.** Um lockup empilhado e uma palavra deitada na mesma altura não pesam igual; corrigir isso é um número por fábrica, e nenhum dos quatro vetores chegou. Calibrar contra arquivo que ninguém viu é desenhar para um caso imaginado.
- **Barra de rolagem.** Também é do sistema: calha de 12px, trilho em papel com fio de 1px à esquerda, polegar de grafite reduzido a 4px visíveis por uma borda de 4px em cor de papel, e tinta no `hover`. Duas variantes utilitárias existem — **`barra-fio`** (3px, **grafite**, sem trilho, tinta no `hover`, com a mesma cor repetida no `scrollbar-color` do Firefox) e **`sem-barra`** (oculta, para a navegação de 40px do telefone, onde qualquer barra comeria a linha). `barra-fio` serve três lugares: o trilho da home, a fila de recortes e a faixa de índice das páginas de marca.

### Named Rules

**A Regra do Raio Zero.** Não é preferência, é ausência de utilidade. Quem
precisar de canto arredondado terá que reabrir o `@theme` — e essa é exatamente a
conversa que a deleção do namespace existe para forçar.

## Components

Toda **ação** é um link — `<a>` ou `<Link>` — e o peso vem de tipografia, fio e
área, nunca de preenchimento. **Existem dois `<button>` no site, e nenhum dos
dois é uma ação de navegação:** o **recorte**, que muda o que já está na tela sem
sair dela, e o **envio do formulário de proposta**, que é o único elemento do
sistema com estado preenchido — e ele o tem no `hover`, não em repouso. Ver "A
Regra do Link" e "Formulário de proposta", abaixo.

### Navegação

- **Estilo:** itens em mono, caixa alta, grafite em repouso, tinta no `hover` (`transition-colors`, 150ms). Sem sublinhado, sem estado ativo por rota — o cabeçalho é do layout e aparece em todas as rotas, então nenhum item é marcado.
- **Desktop:** faixa única de `4.5rem`, itens com `2rem` de espaço entre eles, WhatsApp à direita em tinta com o glifo à esquerda do rótulo, separado por fio vertical e `2rem` de recuo.
- **Telefone:** segunda faixa de `2.5rem`, rolável na horizontal com `sem-barra` e `whitespace-nowrap`. Os itens cortados na borda são o indicador — nunca vira menu escondido.
- **Fora da navegação:** rotas de destino de porta (`/arquitetos`, `/contato`) ficam de fora, para preservar o peso das portas.

### Links de ação (o par mono + seta)

- **Estilo:** mono em caixa alta, tinta, `inline-flex` com `0.75rem` até a seta.
- **Movimento:** a seta avança `0.375rem` em 300ms `ease-out` no `hover` do grupo (200ms e `0.25rem` na lista do 404). O texto não se move.
- **Uso:** fecho de seção, saída do 404, link de ledger e o "Ver os N catálogos" da home — sempre como saída, nunca como ação de formulário.

### Trilho de representadas (componente de assinatura)

`components/representadas-galeria.tsx` — **um trilho horizontal desde
05/08/2026, e não mais uma grade de quatro colunas.** O nome do arquivo foi
mantido de propósito: seis outros arquivos o referenciam por ele, e renomear um
componente para acompanhar a forma dele é como se troca uma decisão de desenho
por um dia de conflito de merge.

- **Por que trilho.** A versão anterior era `sm:grid-cols-2 lg:grid-cols-4`, e o comentário dela já registrava o risco: P18 está aberto — não se sabe se o portfólio cresce — e **uma grade de quatro quebra com três ou com seis.** Uma quinta fábrica cadastrada hoje deixaria a última fileira com um cartão sozinho e três buracos. O trilho não quebra com nenhuma quantidade: quatro cabem, seis rolam, três param antes da borda. É a mesma decisão que fez `/catalogos` virar lista plana em vez de blocos por marca — estrutura que não depende da contagem.
- **Cartão:** `78vw` no telefone, `46vw` a partir de `sm`, `24rem` a partir de `lg`. **24rem, e não 30rem:** em 1440px o cartão de 30rem deixava 2,9 dos quatro visíveis — a quarta fábrica inteira fora da tela e a terceira cortada ao meio, o que faz o trilho parecer ter três marcas. Em 24rem cabem 3,5, e a quarta entra pela borda dizendo que há mais.
- **Encaixe:** `snap-x snap-mandatory` com `scroll-pl-5 md:scroll-pl-8`. **O `scroll-padding` não é redundante com o `px`, e sem ele a margem da página some:** encaixe obrigatório alinha o cartão à borda da caixa de rolagem, não à borda do padding, e no primeiro repouso o navegador rolava 20px no telefone e 32px no desktop sozinho, encostando a primeira fotografia na borda da janela enquanto o título logo acima continuava na margem. Lia como imagem sangrando por engano. **Os dois valores andam juntos: mexer num sem o outro traz o defeito de volta.**
- **Indicador:** o cartão cortado na borda mais `barra-fio`. **Não há widget de progresso** — o comp aprovado desenha uma trilha com segmento escuro proporcional ao deslocamento, e ela não foi construída: uma barra de progresso honesta precisa saber o deslocamento, e saber o deslocamento é JavaScript no cliente ou uma linha do tempo de rolagem que o Firefox ainda não tem. Trilha que não anda é pior que trilha nenhuma. **E não há rótulo "Arraste":** o comp o desenha, e ele erra o verbo em metade dos dispositivos — quem está no desktop com mouse não arrasta, rola.
- **Anatomia do cartão:** faixa de marca (quando há), fotografia `aspect-3/2` sobre `{colors.ink}`, nome em h3 sublinhado no fio, o que a fábrica resolve em support grafite, e origem + fato numa segunda linha de support. A marca **não encosta no nome**: a fotografia inteira separa os dois, e o `h3` é quem carrega o link, o sublinhado e o nome acessível.
- **Hover:** a imagem escala para 1.03 em 700ms `ease-out` com `overflow-hidden` recortando, e o sublinhado do nome troca de `{colors.line}` para `{colors.ink}` no mesmo gesto.
- **O título conta as marcas, o parágrafo é campo.** A frase do título é fixa e o número dentro dela sai das representadas publicadas: cadastrar a quinta fábrica muda "quatro" para "cinco" sem ninguém editar nada. O parágrafo abaixo é o único campo de texto da seção, e some quando está em branco em vez de abrir um vão.

### Faixa editorial

`components/faixa-representacao.tsx` — imagem à esquerda e texto à direita a
partir de `md`, empilhados abaixo dela **com a fotografia primeiro**, porque a
imagem é o que faz a seção respirar depois do trilho e mandá-la para baixo do
texto deixaria dois blocos de prosa encostados.

- **Estilo:** fio no topo, grade de duas colunas com `4rem` de calha, imagem em `aspect-4/3` sobre `{colors.ink}`, h2 em `text-h1` e dois parágrafos em body grafite com teto de 52ch.
- **A copy é fixa, e isso é consistência, não atalho.** Não virou campo do painel pela mesma razão que o h1 da abertura e o texto das duas portas não são campo: isto é posicionamento — o que a empresa é e por onde ela vende —, e posicionamento é conversa, não edição. Um campo de texto aqui é o caminho para alguém escrever "soluções completas em ambientes externos" numa tarde.
- **Sem revelação por rolagem aqui**, e é deliberado: o movimento novo do projeto é um momento só, e ele é o trilho.

### Catálogos em destaque (seção anulável na home)

`components/catalogos-em-destaque.tsx` — **hoje renderiza zero pixels**, e isso é
o comportamento correto, não pendência. `Catalogo` só existe com arquivo, e a
regra do projeto é literal: **sobe o PDF, aparece a linha.**

- **Não inventa linha de exemplo.** A tentação de desenhar três linhas cinzentas "para mostrar como vai ficar" é a mesma que `/catalogos` cometeu e corrigiu em 05/08/2026. Um botão morto na home é pior do que na página de catálogos, porque a home é onde o arquiteto decide se este site vale uma segunda visita.
- **A linha é a compartilhada** (`LinhaDeCatalogo`), com a coluna da fábrica ligada, porque a home atravessa as quatro. Terceira superfície a usá-la, e não reescreve nada.
- **Teto de quatro linhas, e o resto é um link.** Sem teto, uma fábrica com seis catálogos empurra as duas portas — a ação primária da página — para baixo de uma tabela. O rótulo do link conta o que existe (`Ver os 7 catálogos`) em vez de dizer "ver todos": um número declara o custo do clique, que é a mesma disciplina do `PDF · 24,0 MB` na linha acima. Com nada sobrando, ele vira o convite simples, porque "e mais 0" é a contagem que não se escreve.

### As duas portas

`components/portas.tsx` — a ação primária da home, e por isso o elemento mais
pesado dela: dois campos de igual peso, não um botão e um link.

- **Corner Style:** raio 0. **Fundo:** `{colors.ink}` sob a imagem, com véu de topo a base. **Sombra:** nenhuma. **Borda:** só entre as duas — fio horizontal no telefone, vertical a partir de `md`.
- **Altura e respiro:** piso de `30rem` no telefone e `38rem` a partir de `md`, com `1.5rem` / `3.5rem` de padding interno. **Elas cresceram com a troca de mundo:** o que mudou não foi o papel delas, foi o que está acima — com a abertura ocupando a tela inteira, um trilho e uma faixa editorial antes delas, `26rem`/`32rem` passaram a ler como rodapé de página em vez da escolha que a home inteira existe para oferecer.
- **O piso de três linhas alinha os dois rótulos.** As duas portas ancoram o conteúdo no pé do campo (`justify-end`) e os textos de apoio têm tamanhos diferentes — três linhas em 1440px numa, duas na outra. Ancorados por baixo, isso empurra os dois títulos para alturas diferentes, e dois campos de peso declaradamente igual com os títulos desalinhados leem como erro de montagem. **A correção não foi encurtar a copy** (ela é fixa por decisão de produto, e a simetria "eu especifico / eu compro" é o argumento das portas): `md:min-h-[3lh]` no texto de apoio reserva a altura do mais alto e resolve sem tocar em nenhuma das duas frases.
- **Estado:** a imagem escala para 1.03 em 700ms `ease-out` no `hover` do grupo; a seta avança `0.375rem`.

### Ficha (rótulo / valor)

`components/ficha.tsx` — compartilhada por `/quem-somos`, pelas páginas de marca
e pelo bloco "Ficha da Belmare" das rotas livres. O componente que faz a página
parecer registro em vez de texto sobre a empresa.

- **Estrutura:** `<dl>` com fio no topo; cada linha é um `<div>` com fio na base.
- **Rótulo:** mono, caixa alta, grafite, largura fixa de `9rem` a partir de `sm` — sem essa largura fixa a coluna da direita não alinha entre linhas, e ficha desalinhada vira lista.
- **Valor:** support, tinta, `min-w-0`.
- **Empilhamento:** coluna com `0.25rem` de vão abaixo de `sm`, linha com `2rem` de calha acima.

### Linha de ledger

- **Estilo:** `<li>` com fio na base; a linha inteira é link. Nome em h3 sublinhado no fio, origem em mono caixa alta, o que resolve em support grafite, seta à direita.
- **Grade:** `18rem / 10rem / 1fr / 2rem` a partir de `md`; abaixo disso os três campos empilham na coluna 1 e a seta ocupa a coluna 2 da primeira linha.
- **Hover:** fundo vai a `{colors.surface}`, sublinhado vai a tinta, seta avança `0.375rem` e vira tinta. Três sinais, um gesto.

### Linha de documento

`components/linha-de-catalogo.tsx` — a linha do arquivo, compartilhada por
`/catalogos`, pela seção "Para levar" das páginas de marca e pela seção de
catálogos da home. É a irmã da linha de ledger: mesma anatomia, outro assunto.
Ali a entrada é a marca; aqui é o documento, e a marca só qualifica o título dele.

- **Estilo:** `<li>` com fio na base; a linha inteira é link. Título em h3 sublinhado no fio, medida em mono versal na coluna da direita, seta na ponta, `1.25rem` de altura interna.
- **Grade e teto são exportados**, não reescritos: `GRADE_DA_LINHA` e `TETO_DA_LISTA` saem do próprio componente porque o cabeçalho de colunas de `/catalogos` tem que assentar exatamente sobre a linha. Escrita duas vezes, a grade desalinha na primeira mudança. **O teto é `64rem`**, o mesmo da biblioteca 3D; ele existe porque sem ele a coluna da direita estica até a margem e abre centenas de pixels de vão entre o título e a medida em 1440px. Isso não contraria a margem direita aberta: aquilo é regra de página, isto é buraco dentro de uma linha.
- **Duas escritas, um markup.** Publicado (`arquivo` + `mb` preenchidos) aponta para o arquivo e escreve `PDF · 24,0 MB · 2026`, com a seta já em tinta. A pedir aponta para o WhatsApp com o documento e a fábrica no contexto, escreve `EDIÇÃO 2026` ou `EDIÇÃO NÃO DECLARADA`, acrescenta "Envio pela Belmare" em support grafite caixa baixa, e deixa a seta em grafite até o `hover`. Mesma grade, mesma altura: preencher dois campos vira uma na outra sem tocar em layout.
- **Só o estado que exige explicação escreve uma.** A linha publicada fica com a medida sozinha, e é assim que ela lê como resolvida.
- **A marca entra dentro do título** (`Catálogo Trisol`) quando a página não é dela, e sai na página da própria marca, onde a atribuição é ruído. Ela nunca é linha própria em mono versal — ver a Regra da Caixa Alta.
- **Hover:** fundo vai a `{colors.surface}`, sublinhado vai a tinta, seta avança `0.375rem`.
- **Leitor de tela:** um `sr-only` no fim da linha diz "(abre o PDF)" ou "(abre o WhatsApp)". As duas escritas são o mesmo markup e o mesmo gesto — quem não enxerga a diferença precisa ouvi-la.
- **Alvo externo em toda linha.** As duas escritas saem do site, e as duas levam `target="_blank"` com `rel="noopener noreferrer"`. O `download` da linha publicada é **ignorado em URL de outra origem**, e `arquivo` é URL de storage; ele fica porque volta a valer no dia em que o arquivo for servido da mesma origem, mas quem sustenta o comportamento é o `target`. A copy da página segue o mesmo fato: "abre daqui", não "baixa daqui".

**A Regra do Cabeçalho de Coluna.** Um cabeçalho de coluna assenta sobre a coluna
que nomeia — por isso a grade é importada, não redigitada — e nomeia o que a
coluna **de fato carrega hoje**: enquanto nenhum documento está publicado ela leva
edição e estado de entrega, e se chama `EDIÇÃO`; vira `ARQUIVO` sozinha no dia em
que houver arquivo. Na largura em que a coluna não existe, o rótulo dela também
não existe. Cabeçalho que promete coluna inexistente é pior que cabeçalho nenhum.

### Linha de arquivo 3D

`components/arquivos-3d/linha-de-arquivo.tsx` — a terceira da família, e a mais
curta na medida: `SKP · 8,4 MB` e acabou. Herda a anatomia da linha de documento e
**não importa a grade dela**: a coluna da medida da linha de catálogo é larga
porque a edição cabe ali, e um arquivo 3D não tem ano. Acoplar as duas larguras
faria uma se mexer quando a outra fosse apertada.

- **A coluna da fábrica é obrigatória aqui**, e opcional na linha de catálogo. Aquela também serve a seção "Para levar" da página da própria marca, onde a atribuição é a página inteira; esta só existe em `/arquivos-3d`, que atravessa as quatro fábricas sempre — um parâmetro opcional seria um ramo que nenhuma tela alcança.
- **No telefone a linha empilha nome, fábrica e medida, nessa ordem**, com a seta alinhada ao nome: em leitura linear a fábrica vem primeiro, mas na tela empilhada é o nome da peça que sobe, porque uma seta centrada num rótulo de onze pixels lê como se apontasse para a fábrica em vez de para o arquivo.
- **Uma escrita só, e sempre a que baixa.** Um `Arquivo3D` **é** o arquivo: sem peso medido e sem extensão legível ele não vira item nenhum, então não existe estado em que esta linha desenhe um download mudo.
- **Alvo externo**, `target="_blank"` com `download`, pela mesma razão medida na linha de documento.

**A Regra do Portão.** `/arquivos-3d` gateia **exatamente uma coisa**: o pacote com
as quatro fábricas juntas. Todo arquivo avulso baixa aberto. A regra não é de
generosidade — é de economia: a Casoca é gratuita, dominante e já distribui a GDA,
então um formulário na frente de um arquivo que ela entrega de graça não captura o
lead, **doa** o lead. O portão só se sustenta sobre o que o concorrente
estruturalmente não tem. E ele não compra o direito de esconder a medida: `ZIP ·
62,4 MB` aparece **acima** dos campos, nunca depois do envio. Sem pacote publicado,
a seção e o formulário somem juntos: o site nunca pede dado pessoal em troca de um
arquivo que não existe.

### Índice de biblioteca (`/catalogos` e `/arquivos-3d`)

As duas superfícies **sem uma única imagem**. Desde 05/08/2026 elas são a **mesma
página**: uma coluna de largura total, rótulo em mono, h1 de uma linha, fila de
recortes, cabeçalho de colunas em mono, linhas regradas com a medida à direita e a
contagem gerada no pé. Um arquiteto que aprendeu a ler uma não reaprende nada na
outra — e agora isso é literal, não aproximado.

- **A lista é plana e a fábrica é uma coluna.** Blocos empilhados não se deixam recortar, e uma fábrica com um arquivo ao lado de outra com seis vira uma página que se lê descendo em vez de escolhendo.
- **Dois eixos de recorte em `/arquivos-3d`, lado a lado e nunca aninhados: fábrica e formato.** É o eixo que só uma biblioteca de arquivo tem — a mesma peça vem em `.skp` e em `.dwg`, e quem só abre SketchUp quer os `.skp` **das quatro fábricas**. A sigla do formato entra como rótulo do recorte na caixa em que `formatoDoArquivo` a gerou (`SKP`), e não é violação da Regra da Caixa Alta: sigla é uma das classes que a regra reserva para versal.
- **Ordem da lista: fábrica (ordem do painel), peça, formato.** O desempate por formato é o que põe `Cadeira Zuri · DWG` e `Cadeira Zuri · SKP` em linhas encostadas.
- **Biblioteca vazia escreve o estado:** sem arquivo em disco não há filtro, não há cabeçalho de colunas e não há tabela — a página diz que a Belmare manda o bloco, nunca "em breve".
- **A saída para `/catalogos` mora abaixo da lista**, não numa coluna ao lado dela. É a única razão pela qual a sequência das duas rotas não é idêntica: só uma delas manda o leitor para a outra, e mandar antes da lista é oferecer a saída a quem ainda não viu o que veio ver.

**A Regra do Eixo que Pode Mudar a Tela.** Um eixo de filtro só é desenhado quando
tem mais de uma opção, e cada opção só existe se devolve pelo menos uma linha. Uma
biblioteca inteira em `.skp` desenharia `TODOS 12 · SKP 12` — dois controles que
fazem a mesma coisa, que é nada. Se um controle que não leva a lugar nenhum é um
botão morto, um eixo que não pode mudar a tela é uma fileira deles.

**A Regra da Contagem no Recorte.** O número ao lado de cada opção é **quantas
linhas sobram se você clicar nela** — contado sobre a lista já recortada pelo outro
eixo, nunca sobre o acervo inteiro. É o `SKP · 8,4 MB` aplicado a um controle:
declarar o custo do clique antes do clique.

### Recorte (a opção de filtro)

`components/recorte.tsx` — `Recorte` e `FilaDeRecortes`, compartilhados por
`/catalogos` e `/arquivos-3d`. Nasceu privado dentro da lista de catálogos e saiu
de lá quando a segunda lista apareceu, **antes de existir a segunda cópia**: o
controle carrega uma contagem, que é dado, e dado desenhado em dois lugares
diverge na primeira vez que alguém apertar um dos dois.

- **Estilo:** rótulo em grotesca caixa baixa, contagem em mono grafite ao lado, `0.5rem` entre os dois, `0.25rem` de altura interna, fio de 1px na base. Ativo é tinta com o fio em tinta; inativo é grafite com o fio transparente, indo a tinta no `hover`.
- **É `<button>`, e isso não fura a Regra do Link.** A regra fala de **ação** — o que navega, envia ou baixa é link. O que muda o que já está na tela sem sair dela não é ação, e um `<a href="#">` mentiria para o leitor de tela sobre um destino que não existe. `aria-pressed` carrega o estado; não há preenchimento, raio nem sombra.
- **A caixa do rótulo é de quem chama.** "Trisol" chega em caixa baixa e "SKP" em versal, porque só quem chama sabe se a string é nome próprio ou sigla.
- **A fila anuncia o eixo mesmo quando não o mostra.** `aria-label="Filtrar por fábrica"` existe nas duas rotas; o rótulo visível em mono versal só entra onde há mais de um eixo, e leva `aria-hidden` para o leitor de tela não ouvir "Fábrica, Filtrar por fábrica".
- **O resultado é anunciado.** A `<ul>` recebe o recorte no `aria-label` e a linha de contagem é `aria-live="polite"`.
- **A fila rola na horizontal no telefone**, com `barra-fio`, em vez de embrulhar: um filtro que quebra em duas alturas de linha empurra a lista para baixo da dobra na tela onde ela mais importa.

### Formulário de proposta

`components/formulario-de-lead.tsx` — o único formulário do site, usado no bloco
de caminhos das rotas livres e no pacote completo de `/arquivos-3d`. É também o
único lugar onde o sistema desenha campos.

- **Campo:** sem caixa e sem fundo. Rótulo em support grafite acima, `<input>` transparente com **fio de 1px só embaixo** e `0.5rem` de recuo interno na base. Repouso em `{colors.line}`; foco troca a borda para `{colors.ink}` com `outline-none` — o próprio fio é o anel de foco, e é a única vez no sistema em que o `:focus-visible` global cede o lugar. Recusa também escurece o fio para tinta.
- **Recusa:** support em tinta, presa ao campo por `aria-describedby` e anunciada por `aria-invalid`. **Não há vermelho**, e não por austeridade: a Regra da Cromia Zero não abre exceção para estado, e uma mensagem solta embaixo do input seria invisível para quem navega por leitor de tela de qualquer jeito. O que carrega o erro é a associação, não a cor.
- **Consentimento:** caixa nativa de `1rem` com `accent-ink`, rótulo em support grafite. **Nunca vem marcada e nunca é exigida** — marcar por padrão seria consentimento fabricado; exigir a marcação seria trocar o atendimento por um endereço de mala direta.
- **Envio:** o único elemento do sistema com preenchimento, e só no `hover`. Support em versal com tracking aberto, `1rem`/`2rem` de padding, fio de 1px em tinta em repouso, e no `hover` inverte para fundo tinta e texto papel. Desabilitado enquanto envia, a 50% de opacidade.
- **Teto de `36rem`** na largura do formulário e `52ch` nos parágrafos ao redor.
- **Funciona sem JavaScript.** É um `<form action={…}>` sobre um Server Action: sem JS o navegador faz o POST e a página volta com o resultado. `useActionState` só melhora o que já funciona. Um formulário que exige JS para mandar uma mensagem perde o contato de quem está num aparelho ruim — que é exatamente o arquiteto em obra com sinal fraco que este site diz respeitar.
- **Sucesso substitui o formulário**, em `role="status"`, com h3. O que ele diz varia com o que foi pedido: uma conversa recebe a promessa de resposta por e-mail; um arquivo recebe o link, na hora.
- **Sem captcha e sem honeypot.** Os dois custam acessibilidade real contra spam que ninguém mediu ainda.

**A Regra do Campo Fechado.** A lista de campos é fixa em código — nome, e-mail,
cidade, escritório — num painel cujo propósito inteiro é deixar a Belmare decidir
o que é campo. É o oposto de propósito: um construtor de formulário é exatamente a
ferramenta que deixaria um operador bem-intencionado acrescentar CPF porque uma
fábrica pediu, e isso é violação de minimização de dado criada por acidente.
**Acrescentar um campo aqui é PR, não clique.**

#### As duas bandas de formulário, e a regra que escolhe entre elas

> **Registrado em 06/08/2026, no passe de auditoria.** O site tem dois lugares
> onde o formulário aparece em duas colunas, e eles usam parâmetros opostos.
> Isso não era erro nem estava escrito em lugar nenhum — os dois nasceram em
> tickets diferentes e cada um resolveu o próprio problema. A auditoria os
> colocou lado a lado e achou a regra que já governava os dois.

| | **Pacote completo** (`/arquivos-3d`) | **Banda de proposta** (`/contato`) |
|---|---|---|
| Quebra | `md` | `lg` |
| Colunas | `minmax(0,20rem)` / `minmax(0,1fr)` | duas iguais |
| Formulário | à **direita** | à **esquerda**, na margem |
| Entre as colunas | fio de 1px e `2rem` de recuo | calha de `4rem`, sem fio |
| Abre em | fio de 1px `{colors.line}` | fio de 1px `{colors.ink}` |

**A Regra da Coluna Vizinha.** O que decide de que lado o formulário fica é uma
pergunta só: **a outra coluna serve ao formulário, ou compete com ele?**

- **Serve** — é o argumento dele, o nome do arquivo, o peso, o que se recebe ao enviar. Então ela vem primeiro: à esquerda no desktop e acima no telefone, porque é o que a pessoa precisa ler ANTES de decidir preencher. É o pacote de `/arquivos-3d`, e é por isso que ali o fio entre as colunas faz sentido: ele liga duas metades de uma coisa só.
- **Compete** — é um caminho alternativo, que leva a outro lugar e serve a outra pessoa. Então o formulário toma a margem e lê primeiro, e a coluna vizinha vira um trilho secundário. É `/contato`, e é por isso que ali NÃO há fio entre as colunas: um fio diria que as duas metades formam um argumento, e elas são duas saídas concorrentes.

A quebra segue da mesma pergunta. O pacote parte em `md` porque a coluna de
argumento tem teto de `20rem` e sobra largura para o formulário; a banda de
proposta parte só em `lg` porque duas colunas iguais em 768px dariam 320px cada —
rótulo de caminho quebrando em duas linhas ao lado de campo espremido. **Duas
colunas confortáveis ou uma, nunca duas apertadas.**

### Faixa de ação

`components/faixa-de-acao.tsx` (desenho) e `components/acao-de-fecho.tsx`
(o mesmo com o número do painel já resolvido). O mais próximo de um botão primário
que o sistema tem — e ainda assim é um fio, não um preenchimento.

- **Estilo:** link de largura total com fio **em tinta** acima e abaixo, `1.75rem` de altura interna, glifo de WhatsApp mais rótulo em h2 à esquerda, seta à direita.
- **Hover:** fundo `{colors.surface}` e seta avançando `0.375rem`.
- **Sem link, a faixa inteira não é desenhada.** Um elemento que é o mais pesado da página e leva a um `wa.me` inválido promete a ação principal e entrega um erro do aplicativo. **Menos página, nunca página quebrada.**
- **Contexto obrigatório:** o `href` sai de `linkDeWhatsapp(contexto)`, e o contexto diz de qual página o lead veio.
- **O desenho mora num arquivo sem dependência de servidor**, e isso é fronteira, não organização: as páginas livres desenham a composição no cliente durante o live preview, e um único `import` de módulo de servidor no grafo do cliente arrasta a API local do Payload para o navegador.

### Balão de WhatsApp

`components/balao-whatsapp.tsx` — ação persistente sobre o conteúdo, em toda rota,
fixa no canto inferior direito (`1.25rem` / `2rem` da borda, `z-30`).

- **Estilo:** quadrado de `3rem`, fundo `{colors.surface}`, fio de 1px em tinta, glifo de 24px em tinta, `hover` levando o fundo a `{colors.paper}`.
- **É quadrado, não redondo.** O balão de WordPress de toda representada é um círculo verde preenchido — exatamente o piso de segmento do qual a Belmare decidiu destoar. `--radius-*` está `initial` de propósito, e este componente não reabre o namespace.
- **Fundo sólido sempre**, não só no `hover` — ver A Regra do Chrome Fixo.
- **Sem número cadastrado, o balão não existe.** Um elemento fixo, em toda rota, apontando para um `wa.me` inválido seria o pior caso de todos.

### Cabeçalho de seção

O que abre uma seção de registro: `<section>` com fio de 1px no topo, o rótulo em
mono versal tinta à esquerda e a contagem em mono grafite à direita, na mesma
linha de base. Conteúdo com teto de `64rem`. É a gramática de um cabeçalho de
tabela de especificação, e é irmã da faixa de índice e das listas de
`/catalogos` — as três declaram a mesma coisa: o que existe, e quanto.

- **O rótulo é tinta quando ENCABEÇA, grafite quando LEGENDA.** É a divisão que o
  código já fazia e que este documento não dizia: em tinta ficam os rótulos que
  abrem uma seção ou uma coluna de conteúdo — `marca/secao.tsx`, as três colunas
  do rodapé, a coluna de caminhos da banda de proposta e `representadas/registros.tsx`.
  Em grafite ficam os que apoiam outra coisa: o sobretítulo acima de um `h1`, o
  rótulo de ficha, a medida em `formato · MB`, a legenda da prancha, e o
  `01 · a sombra` que abre cada ficha de registro. **A regra nasceu de uma
  exceção, e a exceção foi fechada:** `registros.tsx` era a única seção
  encabeçada em cor de legenda, achada na auditoria de 06/08/2026 e corrigida no
  mesmo dia. **Resta um `h2` em mono grafite no site, e ele não é exceção — é a
  regra:** o `Legenda` da PRANCHA 02 é, por nome e por função, a legenda de um
  desenho, e quem carrega o conteúdo ali é a fotografia chaveada ao lado. O teste
  não é o nível do heading, é a pergunta: **este rótulo abre o conteúdo, ou
  serve o conteúdo que está ao lado dele?**
- **A contagem repete a da faixa de índice de propósito.** Quem chegou rolando
  nunca leu a faixa; quem chegou pela faixa confere que caiu no lugar certo.
- **Ausência não é desenhada.** Seção sem dado não renderiza — sem "em breve",
  sem célula em branco, sem título órfão. Ver Seção anulável.

> ⚠️ **O BLOCO NUMERADO NÃO EXISTE MAIS EM SUPERFÍCIE NENHUMA — 05/08/2026.**
> Este documento já havia registrado a queda dele em `/quem-somos` e o mantinha
> vivo num lugar só, `marca/secao.tsx`, com o argumento de que ali as seções
> **eram** sequência. Elas não eram, e a página de marca provou isso ao ser
> medida: seis blocos numerados, seis títulos de 42px e seis fios estruturais
> para transportar, na melhor fábrica, seis fatos técnicos — e na pior, três
> declarações e um nome. **O aparato editorial ficou maior que a carga, e é isso,
> não as frases, que lê como storytelling.** A numeração também nunca informou:
> ninguém precisa saber que o catálogo é a segunda seção, ainda mais numa rota em
> que a sequência é calculada e a mesma seção cai em posições diferentes conforme
> a fábrica.
>
> **A regra que sobra é a que já estava escrita, agora sem exceção: numerar
> seções que não são sequência é o defeito.** O sistema não tem mais nenhuma
> sequência, então não tem mais nenhum número de seção. `--spacing-coluna-numero`
> (`5rem`) ficou sem consumidor e sai no próximo passe de tokens.

### Seção anulável

O padrão que sustenta as páginas de marca e as duas seções nulas do site
(`projetos-realizados.tsx` em `/quem-somos`, `catalogos-em-destaque.tsx` na home).

- Seção sem dado renderiza `null` — sem markup vazio, sem título órfão, sem "em breve", sem célula em branco.
- **A condição é o ARQUIVO em mãos, não o documento declarado.** Esta linha dizia o contrário até 05/08/2026, e a inversão veio de um defeito que o cliente encontrou na tela: enquanto *ter catálogo* e *ter o PDF* eram condições diferentes, `/catalogos` mostrava três documentos anunciados para zero uploads, um deles parecendo clicável e apontando para lugar nenhum. **Sobe o arquivo, aparece a linha; não sobe, não aparece** — vale para catálogo e para bloco 3D, e o operador vê no site exatamente o que colocou no painel.
- **A ausência vira canal de pedido, nunca linha fantasma.** É o padrão do setor, verificado em fonte primária: o Casoca acinzenta o formato que a fábrica não forneceu com o motivo escrito, o Architonic escreve `No 3D & BIM files available` e oferece `Request files`. Aqui a ausência não desenha linha nenhuma, e o fecho da página muda a mensagem pré-preenchida do WhatsApp para o pedido do arquivo que falta.
- Campo com dado ausente e conhecido é escrito **por extenso** ("Origem não declarada"), nunca travessão.
- O sumário da página é derivado da mesma função que monta as seções, o que torna impossível apontar para uma âncora que não existe. **E ele só é desenhado quando há o que sumarizar:** com apenas as duas seções incondicionais da página de marca, a faixa fixa diria "IDENTIFICAÇÃO · CONTATO" — um sumário anunciando que não há nada a anunciar, ocupando 40px do topo em toda rolagem para isso.

### Página livre (blocos do painel)

`components/paginas/` — a família que monta `/arquitetos`, `/contato` e
`/politica-de-privacidade` a partir do painel. Ela não introduz vocabulário
visual novo: herda o ritmo das páginas de documento, e é isso que faz uma página
montada no painel pertencer ao mesmo site que as desenhadas em código.

- **Seção livre:** fio de 1px no topo, mesmo respiro vertical, teto de 64rem, margem direita aberta, **sem número na margem**. O título do bloco é `h2` sempre — o `h1` é da página inteira e é campo próprio, no topo. Dois `h1` numa rota é exatamente o que um construtor de blocos produz quando cada bloco escolhe o próprio nível.
- **Caminhos:** a gramática da lista é a da **linha de documento**, não a das portas da home. Rótulo em h3 sublinhado no fio, apoio em support grafite com teto de 52ch, seta à direita, fio na base, teto de 52rem. Um caminho de WhatsApp leva o glifo à esquerda do rótulo e um `sr-only` "(abre o WhatsApp)".
- **Um caminho de WhatsApp sem número cadastrado não vira linha morta — ele some.** Mesma regra da faixa de ação.
- **Um caminho para formulário não entra na lista.** Um item de lista que, ao ser clicado, rola até um formulário sem nome é a pior versão das duas coisas. O rótulo do caminho vira o `h2` que encabeça o formulário; a âncora `#proposta-comercial` continua existindo para quem chega por link direto.
- **Ficha da Belmare:** endereço, telefones, e-mail, território e CNPJ não são digitados na página — são bloco, e leem do cadastro. Duas cópias de um telefone é como a segunda passa a estar errada.

#### A banda de proposta — o segundo desenho do bloco de caminhos

> **Nova em 06/08/2026, por decisão do cliente.** O bloco de caminhos tinha um
> desenho só: lista, e — quando havia formulário — uma segunda seção empilhada
> embaixo dela. Hoje tem dois, e quem escolhe é a presença do formulário. Só
> `/contato` cai no segundo; `/arquitetos` não mudou um pixel.

O que estava errado era o LUGAR, não o formulário. Em `/contato` ele chegava
como a terceira banda de uma pilha — depois de um bloco de texto e de uma lista
de duas linhas —, a **1170px do topo numa tela de 900**, e sozinho num poço de
570px de largura no meio de uma página de 1440. A página inteira era uma fita
estreita descendo pela margem esquerda de uma tela larga.

- **Uma banda, duas colunas a partir de `lg`.** Formulário à esquerda, lista à direita, `grid-cols-2` com calha de `4rem`, dentro do mesmo teto de 64rem — 480px por coluna em 1440. **O teto não foi aberto:** duas colunas dentro dele continuam obedecendo A Regra do Teto de 64rem e a margem direita aberta.
- **O formulário fica na coluna da margem.** A Regra da Margem Única reserva a margem esquerda para o que a página tem de mais pesado, e no telefone a ordem do markup é a ordem da leitura — então a coluna da margem é também a primeira quando as duas empilham. **Nenhum `order-*`:** quando a correção de um empilhamento exige um, quase sempre a coluna é que estava errada. Quem quer comprar não perde nada, porque o balão de WhatsApp é fixo em toda rota.
- **A quebra é em `lg`, e não em `md`.** Em 768px as duas colunas dariam 320px cada: rótulo de caminho quebrando em duas linhas ao lado de um campo de formulário espremido. Duas colunas confortáveis ou uma, nunca duas apertadas.
- **O título do bloco recua para mono versal em tinta.** Duas display de 42px lado a lado diriam que as colunas têm o mesmo peso, e elas não têm — uma leva a uma conversa que começa em um toque, a outra é o único lugar do site que pede dado pessoal. É o mesmo campo do painel, com o peso que o contexto pede, na gramática de Cabeçalho de seção. **O nível continua `h2` nas duas colunas:** o tamanho é do desenho, o nível é do documento, e rebaixar a lista para `h3` a faria soar subordinada ao formulário na leitura assistiva, o que ela não é.
- **A banda abre em fio de tinta** — ver Fio de 1px, em Shapes.
- **Sem a lista, a banda continua; sem o formulário, ela não existe.** Um bloco cujos caminhos de WhatsApp todos sumiram por falta de número cadastrado ainda desenha o formulário, que não depende de cadastro nenhum.

### Mapa de território

`quem-somos/territorio.tsx` + `lib/territorio.ts`.

- **Dado, não decoração.** O contorno dos três estados é a malha territorial oficial do IBGE, reprojetada em Mercator e simplificada por Douglas-Peucker com tolerância de 0,022° — ~8 KB de vetor, nenhuma requisição extra. Mexer no desenho significa regerar a partir do IBGE, nunca editar coordenada à mão.
- **Duas camadas.** Geometria em SVG, rótulo em HTML posicionado por porcentagem por cima. Rótulo dentro do `viewBox` escalaria com o desenho — daria mono de 22px no desktop e 7px no telefone. Fora dele, a mono tem 11px em qualquer largura.
- **Recorte de rótulo.** Cada sigla leva `bg-paper` e `px-1.5`, que abre o contorno para a palavra.
- **Honestidade cartográfica:** nomeia estados, não cidades. Só a sede é marcada, porque é o único endereço verificado.
- **Sem movimento.** Nada de traço que se desenha ao rolar. **A revogação da Regra do Movimento Fechado não alcança esta seção** — ver Movimento.

> ⚠️ **A "PRANCHA 01" NÃO EXISTE MAIS, E O MAPA FICOU — 05/08/2026.** Este
> documento descrevia aqui um componente de assinatura com moldura, carimbo,
> graticula de dois em dois graus, registros de canto e **escala gráfica calculada
> a partir da projeção com o paralelo declarado na legenda**. Todo o aparato saiu.
> O argumento da remoção é o mesmo que governa o resto do site aplicado contra o
> próprio desenho: nada daquilo respondia a pergunta que traz alguém à seção, que
> é se a Belmare atende a cidade de quem está lendo. **Uma escala em quilômetros
> numa página institucional é a empresa exibindo o método em vez de dar a
> resposta.** O que responde são os três contornos, as três siglas e a marca da
> sede. A folha ficou sendo o desenho mais uma folga de 20 unidades, só para os
> braços da cruz da sede não encostarem na borda. **A gramática de prancha
> completa não morreu — ela migrou inteira para a PRANCHA 02, onde a moldura é
> requisito e não ornamento.** `GRATICULA` continua exportada de
> `lib/territorio.ts` e não é consumida por nada.

### Prancha chaveada sobre fotografia (componente de assinatura)

`representadas/prancha-area-externa.tsx` + `lib/prancha-area-externa.ts`.
**PRANCHA 02**, e hoje a única prancha completa do site: moldura em fio, registros
de canto nas quatro quinas, carimbo no pé, rótulo com recorte em papel, e chamadas
numeradas apontando para objetos de uma fotografia. **Aqui a moldura fica** porque
sem o quadro as chamadas ficam soltas sobre a imagem.

- **A linha de chamada é traçada duas vezes.** Encamisamento de 3px em `{colors.paper}` por baixo, traço de 1px em `{colors.ink}` por cima. É como se chama um objeto numa prancha impressa sobre meio-tom, e aqui é requisito: traço único em papel media 1,09:1 a 1,9:1 contra fotografia clara, e a WCAG 1.4.11 pede 3:1 para objeto gráfico necessário à compreensão. **Nunca traçar uma chamada com um traço só.**
- **A prancha não recorta.** O aspecto da caixa é o aspecto do arquivo, em toda largura — e desde que a fotografia passou a vir do painel isso deixou de ser conferível à mão. As chamadas estão em porcentagem da caixa; `object-cover` num aspecto diferente recorta por dentro e cada seta sai de lugar de uma vez só, silenciosamente. 3/2 sobre um arquivo 16/9 corta 7,8% de cada lado e tira a primeira chamada do objeto dela.
- **Sem véu.** A legibilidade vem do recorte em papel do rótulo. Escurecer a foto é o gesto da abertura da home; numa prancha o desenho não se apaga para o rótulo caber.
- **Coordenada pertence ao desenho, não ao dado.** Trocar a fotografia recalcula só o arquivo de coordenadas, e nenhum campo de cadastro se mexe.
- **Chamada sem representada publicada não é desenhada.** O desenho e a legenda saem da MESMA lista filtrada, e a numeração é a posição nela — três chamadas numeram 01–03. Antes, a legenda pulava a linha e o número continuava sobre a foto: uma chave apontando para uma legenda que não existe.
- **O carimbo do pé conta as representadas cadastradas, não as chamadas desenhadas.** Contar as chamadas faria o carimbo dizer "três" três centímetros acima de um índice que lista quatro.

**A Regra da Chamada.** A seta nomeia a **função**, nunca o produto — e é a
legenda, fora do desenho, que atribui a função à fábrica. Sobre fotografia gerada,
uma seta com nome de marca afirma que aquele objeto é produto daquela marca.
Efeito colateral que vale o desenho inteiro: como a chave é a função, o mesmo
desenho aceita N marcas.

### Faixa de índice

`marca/faixa-indice.tsx`. O segundo e último elemento fixo do fluxo da página,
abaixo do cabeçalho: `3.5rem`+`2.5rem` de recuo no telefone, `4.5rem` a partir de
`md`, altura de `2.5rem`, fechada por fio, `z-10` sob o cabeçalho.

- **Ela lista só o que renderizou.** Entradas e conteúdo saem da mesma função, o que torna estruturalmente impossível apontar para uma âncora que não existe.
- **Contagem antes do clique** — `QUEM ASSINA 8` — e ela conta itens **distintos**. É a regra do `SKP · 8,4 MB` aplicada à navegação da própria página.
- **Contagem só onde há custo a declarar.** "Para levar" recebe o peso quando há exatamente um documento publicado (`PDF 8,4 MB`), a quantidade quando há mais de um, e **nada** quando não há nenhum — "1" não é custo de nada.
- **Estado por tom, não por movimento.** Grafite → tinta, `aria-current`. Nada entra, nada desliza, e não há `scroll-behavior: smooth`: âncora que anima é movimento que ninguém pediu.
- **`barra-fio`, não `sem-barra`.** A navegação do cabeçalho pode esconder a barra porque transborda com um item cortado ao meio, e o corte é o indicador; a faixa de índice não transborda assim, e sem indicador ela declara três seções numa marca que tem cinco. **Ela herdou o polegar de grafite** da mesma troca de 05/08/2026, e tinha o mesmo problema de contraste que o trilho.
- **Sem JavaScript, nada é marcado** — em vez de marcar a primeira e afirmar um "você está aqui" errado. A altura da pilha fixa é **medida**, não escrita: 138px no telefone, 113px a partir de `md`.

### Movimento

O vocabulário é fechado em cinco gestos. Quatro disparam por ponteiro; **um, e
apenas um, dispara por rolagem.**

| Gesto | Valor | Onde |
|---|---|---|
| Escala de imagem | `scale(1.03)`, 700ms `ease-out` | trilho, portas, grade de projetos |
| Avanço da seta | `translateX(0.375rem)`, 300ms `ease-out` (0.25rem/200ms no 404) | todo link com seta |
| Troca de cor | 150ms, `cubic-bezier(.4, 0, .2, 1)` | navegação, links de rodapé, fundo de ledger e de linha de documento, fio de campo em foco, envio de formulário |
| Cor de sublinhado | mesma transição de cor | nome de representada, título de documento, rótulo de caminho |
| **Revelação por rolagem** | `translateY(1.5rem) → 0`, `cubic-bezier(0.16, 1, 0.3, 1)`, `animation-timeline: view()`, `animation-range: entry 10% cover 28%` | **o trilho das representadas, e nada mais no site** |

`motion-reduce:transition-none` acompanha **todas** as transições de
transformação, e a revelação é desligada inteira sob `prefers-reduced-motion` —
não uma versão curta do mesmo gesto: quem pediu menos movimento recebe nenhum. O
foco é `outline: 2px solid {colors.ink}` com `2px` de recuo, global, via
`:focus-visible`.

### Named Rules

**A Regra do Movimento Fechado — revogada em parte, em 05/08/2026, pelo cliente.**
O texto anterior era: *"Não existe movimento por rolagem em lugar nenhum do código
— nem revelação suave, nem parallax, nem traço que se desenha. Isso é regra, não
omissão: o arquiteto volta muitas vezes, e o que encanta na primeira visita irrita
na décima."* **O argumento continua bom, e não foi ele que caiu.** O que caiu foi
o veto: na barra de qualidade escolhida — Gandiablasco, Tribù, Paola Lenti,
Kettal — a revelação suave é gramática nativa da categoria, não enfeite, e o
cliente escolheu a categoria com as alternativas à vista. **A revogação cobrou
três travas, e elas são o que sobrou da regra:**

1. **Um momento só.** Não é a entrada de toda seção. É o trilho das representadas, e nada mais na página — e é o trilho INTEIRO, num gesto só, sem escalonamento entre cartões. Movimento repetido em cada faixa é exatamente a décima visita que a regra antiga temia. (`faixa-representacao.tsx` carrega essa proibição escrita no próprio arquivo.)
2. **Sem JavaScript e sem observador.** `animation-timeline: view()` é CSS puro, atrás de um `@supports`. Não há bundle, não há hidratação, não há custo de INP.
3. **O conteúdo nunca desaparece — e a primeira versão disto estava errada.** Ela animava `opacity` de 0 a 1 com `fill-mode: both`, e o comentário afirmava que o `@supports` a tornava segura. **Não tornava:** o `@supports` cobre o navegador que não CONHECE a linha do tempo, e não o contexto em que ela existe mas não roda — captura de página inteira, impressão, PDF, documento mais curto que a janela. Nesses casos o quadro `from` congela em `opacity: 0` e a seção mais importante da home simplesmente não existe. Foi o que apareceu em duas das cinco capturas da revisão: título, um vão de 530px, e a legenda embaixo. **A correção foi estrutural: a opacidade saiu do quadro.** O que anima é só o deslocamento, então o pior caso possível é um cartão 24px abaixo do lugar — visível, legível, clicável.

**O que a revogação NÃO liberou, e continua vinculante:** parallax, scroll-jacking,
loader, carrossel automático, contador animado, `scroll-behavior: smooth` e traço
que se desenha ao rolar. O mapa de território recusa movimento por escrito, e
continua recusando.

**A Regra do Conteúdo Sem Opacidade.** Conteúdo primário não se pendura em
opacidade animada. Se a animação não rodar — e há mais contextos em que ela não
roda do que `@supports` sabe detectar —, o pior caso tem que ser conteúdo no lugar
errado, nunca conteúdo ausente. Anime transform; deixe a opacidade em paz.

**A Regra do Link.** Toda ação é link. Se algo precisar de mais peso, ganha fio em
tinta e corpo maior — nunca preenchimento e canto. Os dois `<button>` do site não
são ações de navegação: o recorte muda o que já está na tela, e o envio manda o
formulário. **Só o envio preenche, e só no `hover`.**

> ⚠️ Divergência com `briefing/marca.md` §7, **parcialmente resolvida em
> 05/08/2026**. O briefing previa "revelação suave ao rolar" e "filtro que
> reordena o grid com transição". A primeira existe hoje, com as três travas
> acima, e por decisão do cliente — não por o briefing tê-la pedido. A segunda
> continua não existindo: o recorte troca a lista sem transição nenhuma.

## Do's and Don'ts

### Do:

- **Do** construir profundidade com `{colors.surface}` sobre `{colors.paper}` e com o fio de 1px. É a elevação inteira do sistema, e ela é transitória em todo lugar menos no chrome fixo.
- **Do** aplicar caixa alta explicitamente, e só em medida, código, sigla, rótulo de campo e estado de campo declarado. Nome próprio e frase vão na grotesca em caixa baixa por curtos que sejam.
- **Do** limitar medida de texto em `ch` (título 14–27ch, corpo 44–78ch) e deixar a margem direita aberta. Reescrever a copy de uma abertura pede reconferir o teto dela.
- **Do** pendurar todo elemento novo na margem única (`1.25rem` / `2rem`), inclusive gráficos. A única coisa que sangra é a fotografia de abertura.
- **Do** deixar o peso na chamada quando ele só serve a uma das chamadas. `font-light` mora no h1 da home, e não no token da display, porque o segundo consumidor da display precisa de 400.
- **Do** repetir `scroll-padding` sempre que houver `snap-mandatory` numa lista com margem de página. Os dois valores andam juntos; mexer num sem o outro encosta a primeira imagem na borda da janela.
- **Do** usar `tabular-nums` em qualquer coluna, ficha, tabela ou contador. Já vem embutido na utilidade `mono`.
- **Do** acompanhar toda transição de transformação com `motion-reduce:transition-none`, e desligar movimento por rolagem inteiro sob `prefers-reduced-motion` — não uma versão curta dele.
- **Do** animar **transform** numa revelação por rolagem, nunca `opacity`. O pior caso de uma linha do tempo que não roda tem que ser conteúdo deslocado, não conteúdo invisível.
- **Do** garantir 3:1 em qualquer elemento que o sistema usa como indicador de que há mais conteúdo. Um indicador que ninguém enxerga é um indicador ausente.
- **Do** terminar o `alt` de toda imagem mock em "imagem de referência", e centralizar as referências em `src/lib/acervo.ts` — trocar o acervo não pode virar caça a URL espalhada.
- **Do** acrescentar **legenda visível** quando a posição da imagem sugerir obra entregue. `alt` não resolve: ninguém que enxerga lê `alt`.
- **Do** escrever campo sem dado por extenso — "não declarada" — em vez de travessão, que o leitor confunde com erro de digitação.
- **Do** manter seção sem conteúdo real renderizando `null`. Duas seções do site estão construídas inteiras e no ar em zero pixels por isso: os projetos de `/quem-somos` e os catálogos da home.
- **Do** traçar toda linha de chamada sobre fotografia **duas vezes** — encamisamento de 3px em papel sob o traço de 1px em tinta.
- **Do** dar à prancha o mesmo aspecto do arquivo em toda largura. Qualquer outro aspecto recorta por dentro e move a chamada para fora do objeto.
- **Do** derivar contagem de sumário de itens **distintos**, e derivar o próprio sumário da mesma função que monta as seções.
- **Do** formatar toda medida por **uma função só**, nunca inline. `pesoEmMB()` fixa uma casa decimal para `PDF · 24,0 MB` assentar embaixo de `SKP · 8,4 MB` numa coluna de numeral tabular.
- **Do** compartilhar o componente de linha entre as superfícies que declaram o mesmo documento, **desde a primeira linha escrita**. O componente exporta a própria grade e o próprio teto, para o cabeçalho de colunas cair exatamente sobre ela. Vale igual para o controle: o recorte saiu de dentro de `/catalogos` no dia em que a segunda lista apareceu, não no dia em que as duas cópias começaram a divergir.
- **Do** desenhar um eixo de filtro só quando ele pode mudar a tela, e uma opção só quando ela devolve pelo menos uma linha.
- **Do** derivar o rótulo de um cabeçalho de coluna do dado que a coluna **carrega hoje**, e esconder o rótulo na largura em que a coluna não existe.
- **Do** dar `target="_blank"` a todo link de arquivo. O atributo `download` é **ignorado em URL de outra origem**, e os arquivos são servidos de storage.
- **Do** derivar número exibido de função, nunca de literal. `anosDeMercado()` conta com dia e mês, e a rota declara `revalidate = 86400` para o número não congelar entre builds.
- **Do** apagar o elemento inteiro quando o dado que o sustenta não existe — a faixa de ação sem número, o balão sem número, o caminho de WhatsApp sem número. **Menos página, nunca página quebrada.**

### Don't:

- **Don't** reabrir `--radius-*`, `--shadow-*` ou `--drop-shadow-*`. Eles estão em `initial` de propósito: as utilidades não existem, e essa impossibilidade é o sistema.
- **Don't** introduzir matiz. Sem cor primária, sem cor de acento, sem verde de sucesso, sem vermelho de erro — nem na recusa de um campo de formulário, que é onde a tentação é maior. O namespace de cor padrão do Tailwind continua compilando; a disciplina é sua.
- **Don't** publicar um ícone de terceiro na cor de marca dele. O glifo de WhatsApp entrou em `currentColor` e sem preenchimento, e é assim que ele fica.
- **Don't** usar branco puro como fundo de página, nem papel como superfície elevada.
- **Don't** tirar as cores de dentro do logotipo. O azul, o verde e o vermelho da marca são do desenho, e só dele. Um matiz da marca aparecendo fora do lockup é o sistema quebrado, não estendido.
- **Don't** acrescentar uma terceira família tipográfica, nem substituir a pilha de fonte: Söhne já é a primeira da pilha, e Geist entra como fallback dentro dela.
- **Don't** acrescentar um segundo momento de movimento por rolagem. A revogação da Regra do Movimento Fechado comprou **um**, no trilho, e a segunda seção que o pedir é a que devolve a regra inteira.
- **Don't** criar parallax, scroll-jacking, loader longo, contador animado, carrossel automático ou `scroll-behavior: smooth`. A revogação não os alcançou.
- **Don't** desenhar botão preenchido. Toda ação é link; os dois `<button>` do site não navegam, e só um deles preenche — no `hover`, e é o envio do formulário.
- **Don't** numerar seções que não são sequência. O número empresta autoridade de documento a um índice, e `/quem-somos` perdeu o dele junto com a história que ele ordenava.
- **Don't** centralizar o único gráfico de uma página, nem qualquer bloco de conteúdo, para "preencher" tela larga.
- **Don't** apresentar imagem mock como foto real de produto, fábrica ou projeto entregue — nem em copy, nem em `alt`, nem em legenda.
- **Don't** escrever nome próprio, frase ou legenda em mono versal, **nem quando são curtos**. Quando a saída for "baixar a caixa e manter o elemento", o elemento é que estava errado.
- **Don't** tirar de uma célula o prefixo que a descreve só porque o cabeçalho da coluna repete a palavra. No telefone o cabeçalho está `hidden` e a célula precisa se descrever sozinha — "2026" solto não diz o que é.
- **Don't** nomear uma marca numa seta apontando para fotografia gerada. A chamada nomeia a função; a legenda, fora do desenho, é que atribui.
- **Don't** desenhar sobre o próprio desenho. Moldura, carimbo, graticula e escala gráfica só entram onde o quadro é requisito do gráfico — foi por isso que a prancha de território virou mapa.
- **Don't** preencher campo vazio com dado plausível. O que não existe fica ausente.
- **Don't** acrescentar campo ao formulário de proposta pelo painel. A lista é fixa em código, e um campo a mais é PR, não clique.
