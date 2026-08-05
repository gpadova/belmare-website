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
    fontSize: "clamp(2.125rem, 3.4vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-0.035em"
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
  secao: "4rem"
  secao-desktop: "6rem"
  coluna-numero: "5rem"
  coluna-rotulo: "9rem"
  coluna-medida: "13rem"
  coluna-medida-3d: "10rem"
  coluna-marca: "11rem"
  coluna-eixo: "6rem"
  teto-lista: "64rem"
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
  porta:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    typography: "{typography.h1}"
    rounded: "{rounded.none}"
    padding: "1.5rem"
  porta-desktop:
    padding: "2.5rem"
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
    borderColor: "{colors.ink}"
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
  pular-conteudo:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.mono}"
    padding: "0.5rem 0.75rem"
---

# Design System: Belmare Representações

## Overview

**Creative North Star: "A Prancha de Arquivo"**

O sistema é uma folha técnica, não uma peça de campanha. Fundo de papel off-white, tinta quase preta, um fio de 1px como único ornamento, e duas famílias tipográficas dividindo o trabalho: a grotesca fala, a mono mede. Não há cor de acento em lugar nenhum do código — a energia cromática inteira vem da fotografia, e o resto da página sai da frente para deixá-la falar.

A densidade é de amostrário: alinhamento visível e sem exceção, números de bloco na margem, fichas de rótulo e valor, tabelas regradas, um ledger de quatro linhas e uma prancha de território desenhada sobre malha oficial do IBGE. O que dá identidade é a grade, não a decoração. O teste que o projeto aplica em si mesmo: tire tudo menos tipografia, fio e foto — o site ainda tem que ficar de pé.

O sistema recusa, em código e não só em intenção: raio, sombra, gradiente (exceto o véu de legibilidade sobre foto), matiz fora do logotipo, terceira família tipográfica, textura de fundo, movimento por rolagem, botão. Seis superfícies existem hoje — `/`, `/quem-somos`, `/representadas`, o template `/representadas/[marca]`, `/catalogos` e `/arquivos-3d`. A segunda introduziu os padrões de composição de arquivo; a terceira os estendeu para a prancha chaveada sobre fotografia; a quarta acrescentou o único elemento fixo do sistema além do cabeçalho, a faixa de índice, mais o padrão de **seção anulável com numeração calculada** — a seção some quando o dado não existe, e a numeração fecha sem buraco; a quinta acrescentou a **linha de documento**, primeira linha do sistema com duas escritas dentro de um markup só; e a sexta acrescentou o **recorte**, primeiro controle do sistema — e o único `<button>` dele, porque é a única coisa que muda a tela sem sair dela.

`/catalogos` é a primeira superfície **sem uma única imagem**, e isso é direção, não falta de acervo: numa rota em que o visitante veio buscar um arquivo, fotografia de ambiente é ruído entre ele e o arquivo. O teste que o parágrafo acima declara passa a ter uma página que o cumpre com dois dos três elementos — ela fica de pé só com tipografia e fio, sem foto, sem prancha e sem gráfico: uma coluna de largura total, fila de recortes, cabeçalho de colunas em mono e linhas regradas com a medida à direita. Não é licença para o resto do site. Onde há fotografia, ela continua sendo a única cor.

`/arquivos-3d` é a segunda, e desde 05/08/2026 é a **mesma** página — mesma sequência, mesma gramática de linha, um eixo de recorte a mais. As duas colunas partidas por fio vertical que ambas tinham saíram: a coluna da esquerda era argumento sobre como a indústria funciona, escrito para quem monta o site e não para quem veio buscar um arquivo.

**Key Characteristics:**
- Acromático na interface: cinco valores neutros; o matiz existe em um objeto só, o logotipo
- Fio de 1px `#C9C6C0` como único ornamento, e estrutural
- Raio 0 e sombra 0 impostos por deleção de namespace, não por convenção
- Duas famílias: grotesca para fala, mono para medida
- Elevação só por tom: `#FFFFFF` sobre `#F5F3F0`
- Vocabulário de movimento fechado em quatro gestos, todos por ponteiro
- Toda ação é link; não existe botão no sistema
- Dado ausente é declarado por extenso, nunca inventado nem travessão
- A fotografia é a única cor das superfícies — e não é requisito: `/catalogos` fica de pé sem nenhuma
- Formato, peso e edição declarados antes do clique, formatados por uma função só

## Colors

Paleta acromática de cinco valores. Nenhum acento, nenhuma cor de estado. O único matiz do projeto está dentro do logotipo, e não sai dele — ver **Logotipo** em Elementos gráficos.

### Neutral

- **Papel** (`{colors.paper}`): o fundo de todo o site — `body`, cabeçalho fixo, faixa de índice, rodapé e blocos. Nunca branco puro: branco endurece a fotografia e cansa em navegação longa. Também é a cor do recorte que abre a linha sob os rótulos da prancha e do trilho da barra de rolagem, e do **encamisamento de 3px sob a linha de chamada** na PRANCHA 02.
- **Tinta** (`{colors.ink}`): texto principal, contorno dos estados na prancha, linha de chamada sobre fotografia, traço da seta, a palavra dentro do logotipo, fundo do skip link, fundo de todo contêiner que espera imagem (`bg-ink` atrás de `next/image`, para não haver flash claro), e a borda da ação de fecho. É também o fundo de `::selection`.
- **Grafite** (`{colors.graphite}`): UI secundária — texto de apoio, rótulo em mono, número de bloco, itens de navegação em repouso, polegar da barra de rolagem e a escala gráfica da prancha. É o cinza que lê como instrumento sem competir com a tinta.
- **Fio** (`{colors.line}`): divisores, bordas de tabela e de ficha, moldura e graticula da prancha, sublinhado em repouso dos links de título, e o polegar da barra fina. Único ornamento do sistema.
- **Superfície** (`{colors.surface}`): branco puro, usado com parcimônia e só como elevação — fundo de linha de ledger e da ação de fecho no `hover`. Nunca como fundo de página.

### Sobre fotografia

Sobre imagem, e **somente** sobre imagem, o sistema usa branco puro no texto (`#FFFFFF`, e `#FFFFFF` a 85% na linha de apoio) e um véu preto em gradiente. Na abertura o véu cobre os dois terços inferiores (`from-black/70 via-black/30 to-transparent`); nas portas cobre a superfície inteira (`from-black/85 via-black/45 to-black/15`). Não é ornamento: é a única razão de o texto claro ser legível sobre deck iluminado.

### Named Rules

**A Regra da Cromia Zero.** Nenhum matiz entra em nenhuma superfície. Não há cor primária, não há cor de estado, não há verde de sucesso nem vermelho de erro. Estado se comunica por tom (grafite → tinta), por peso de fio e por posição. Atenção: diferente de raio e sombra, o namespace de cor padrão do Tailwind **não** foi deletado — `text-red-500` ainda compila. A disciplina aqui é convenção, e a única guarda é a revisão.

**A Regra do Papel.** `#F5F3F0` é fundo; `#FFFFFF` é superfície. Inverter os dois quebra a única forma de elevação que o sistema tem.

## Typography

**Fonte de texto e título:** Söhne (Klim), com fallback Geist na mesma pilha
**Fonte de dado técnico:** Söhne Mono, com fallback Geist Mono na mesma pilha

Os `@font-face` de Söhne estão **comentados** em `src/app/globals.css` até a licença ser comprada: declarados sem os `.woff2` em `public/fonts/`, produziriam quatro 404 no console a cada visita, e o projeto trata erro de console como defeito. A pilha já nomeia Söhne em primeiro lugar — soltar os arquivos e descomentar o bloco basta para a fonte valer, sem tocar em nenhum componente. Geist entra por `next/font/google` como variável (`--font-geist-sans`, `--font-geist-mono`) referenciada de dentro da própria pilha; por isso a troca é de arquivo, não de código.

**Character:** grotesca suíça sem afetação, tracking negativo firme nos títulos, mono de corpo pequeno e tracking aberto para tudo que é medida. Nenhuma família de exibição, nenhum peso ultraleve em corpo grande — a display desceu de 88px para 56px e subiu de 300 para 400 justamente para a página ler como voz editorial calma, e não como pôster brutalista.

### Hierarchy

- **Display** (400, `clamp(2.125rem, 3.4vw, 3.5rem)`, 1.06, −0.035em): usada duas vezes no site inteiro — o h1 da abertura da home sobre a foto, e o ano `1999` no bloco 01 de `/quem-somos`, com `tabular-nums`. É gesto de abertura, não de seção.
- **H1** (400, `clamp(1.75rem, 2.6vw, 2.625rem)`, 1.12, −0.025em): título de seção e rótulo das portas. Sempre com teto de medida em `ch` (14–22ch) e `text-balance` quando tem duas linhas.
- **H2** (400, `clamp(1.375rem, 1.9vw, 1.875rem)`, 1.2, −0.02em): usada uma vez, no rótulo da ação de fecho ("Falar pelo WhatsApp"). É o tamanho que faz um link de contato pesar sem virar botão.
- **H3** (400, 1.375rem, 1.25): nome de representada na galeria e na linha de ledger. Sempre sublinhado no fio.
- **Body** (400, 1.0625rem, 1.55): parágrafo corrido, com teto de 44–64ch e `text-pretty`.
- **Support** (400, 0.875rem, 1.45): dado longo em caixa baixa — razão social, porte, endereço, descrição de CNAE, valor de ficha, legenda de figura, nota de fonte.
- **Mono** (400, 0.6875rem, 1.35, +0.06em, `tabular-nums`): rótulo, código, sigla, número de bloco, ano, medida, navegação e nome de canal. Nunca frase inteira.

A entrelinha da mono na utilidade `mono` é 1.35 — e não o 1.3 do token `--text-mono--line-height`, que não é consumido por nada. Onde mono e grotesca convivem na mesma faixa (bloco 01), as duas recebem `leading-5` para assentar na mesma linha de base; sem isso a ficha desalinha, e numa ficha o alinhamento é o argumento.

### Named Rules

**A Regra da Divisão de Trabalho.** A grotesca fala, a mono mede. Material, formato, contador, código, ano, medida e sigla vão em mono. Frase inteira não é medida — vai na grotesca.

**A Regra da Caixa Alta.** Versal é aplicada **explicitamente**, item a item. O teste é de **classe da string, não de tamanho**: medida, código, sigla, rótulo de campo e estado de campo declarado vão em versal (`PDF · 24,0 MB · 2026`, `EDIÇÃO NÃO DECLARADA`, `NÃO DECLARADA`); nome próprio, frase e legenda ficam fora **mesmo curtos** — razão social, porte, endereço, descrição de CNAE, nome de coleção e nome de fábrica vão na grotesca em caixa baixa. A utilidade `mono` deliberadamente **não** carrega `text-transform`. A regra sobreviveu a uma violação real neste build: a primeira linha de documento punha o nome da fábrica em mono versal numa linha própria sob o título. A correção não foi trocar a caixa — foi **apagar a linha**, e a atribuição entrou dentro do título, em h3 caixa baixa ("Catálogo Trisol"). Se a solução for baixar a caixa e manter o elemento, quase sempre o elemento é que estava errado.

**A Regra das Duas Famílias.** Duas, e só duas. Uma terceira família é o primeiro sintoma de que alguém tentou resolver hierarquia com fonte em vez de com grade.

> ⚠️ Divergência com `briefing/marca.md` §3. A tabela do briefing pede Display 88–120px em peso Leicht (300), H1 48–64px, H2 32px, entrelinha de display 0.92 e tracking −0.02em. O código construído é bem menor e mais pesado: display 34–56px em 400, H1 28–42px, H2 22–30px, entrelinha 1.06, tracking −0.035em. **O código vence** — a redução está justificada em comentário no próprio `globals.css`. O briefing também descreve a mono como "caixa alta" sem exceção; o código restringe a versal a rótulo e código.

## Layout

Sem contêiner centralizado. O conteúdo pendura na margem esquerda e a margem direita fica aberta — é o que separa uma folha de arquivo de um texto esticado de ponta a ponta em telas largas.

**Margem lateral:** `1.25rem` no telefone, `2rem` a partir de `md`. Vale para cabeçalho, rodapé, todas as seções, a legenda do fecho e a prancha. Nenhum elemento tem margem própria.

**Ritmo vertical:** seções da home usam `4rem` no telefone e `6rem` a partir de `md`. O bloco numerado de `/quem-somos` usa `3rem`/`3.5rem` (topo/base) no telefone e `4rem`/`6rem` a partir de `md`, sempre aberto por um fio de 1px no topo.

**Breakpoints:** três, e só três — `sm` 40rem (640px), `md` 48rem (768px), `lg` 64rem (1024px). `md` carrega o sistema (75 dos 89 usos): é onde o cabeçalho passa de duas faixas para uma, a navegação sai da segunda linha, e o bloco ganha a coluna de número na margem.

**Cabeçalho:** fixo no topo (`sticky`, z-20), em papel. No telefone são duas faixas — `3.5rem` com marca e WhatsApp, mais `2.5rem` de navegação rolável na horizontal, cada uma fechada por um fio. A partir de `md` é uma faixa só de `4.5rem`, com a navegação no centro e o WhatsApp separado por um fio vertical.

**Abertura:** `calc(100svh − 9rem)` no telefone com piso de `30rem`, e `calc(100svh − 4.5rem)` a partir de `md` — ou seja, no desktop desconta exatamente o cabeçalho.

**Grade de bloco (`/quem-somos`):** `grid-cols-[5rem_minmax(0,64rem)]` com `2rem` de calha a partir de `md`. A coluna de 5rem carrega o número em mono; a de conteúdo tem teto de 64rem. Abaixo de `md` o número empilha acima do conteúdo, na mesma margem.

**Medida de texto:** teto sempre em `ch`, nunca em px. Título 14–24ch, corpo 44–68ch. É o que mantém a medida entre 65 e 75 caracteres sem centralizar nada.

**Grades internas observadas:** galeria de representadas `sm:2` → `lg:4` colunas, com calha `1.5rem`/`2rem` e vão vertical de `2.5rem`; portas em duas colunas a partir de `md`, separadas por fio; rodapé em quatro colunas a partir de `md`; ledger em quatro colunas (`18rem` / `10rem` / `1fr` / `2rem`) a partir de `md` e em duas abaixo. As duas rotas de índice de arquivo — `/catalogos` e `/arquivos-3d` — são **uma coluna de largura total**, sem grade de página: a coluna de argumento que ambas tinham foi deletada, e com ela o fio vertical de altura total. A linha de documento é quatro colunas a partir de `md` (`minmax(0,11rem)` fábrica / `minmax(0,1fr)` título / `minmax(0,13rem)` medida / `2rem` seta, calha `2rem`) e duas abaixo (`minmax(0,1fr)` / `2rem`, calha `1rem`); a linha de arquivo 3D é a mesma com a medida em `minmax(0,10rem)`. Teto de `64rem` nas duas. A fila de recortes é `minmax(0,6rem)` rótulo / `minmax(0,1fr)` opções a partir de `md`, empilhada abaixo.

**Ordem de empilhamento.** As duas rotas de índice de arquivo resolveram por deleção o que antes se resolvia com `flex`/`order-last`: enquanto havia coluna de argumento, a saída secundária morava dentro dela e, em grid nas duas larguras, linearizava **antes** da lista — quem abria no telefone encontrava o link para fora da página antes do primeiro documento. Sem coluna, a ordem do markup já é a ordem da leitura, em qualquer largura, e a saída de `/arquivos-3d` fica onde de fato pertence: depois da lista. **Quando a correção de uma ordem de empilhamento exige `order-*`, quase sempre a coluna é que estava errada.**

**Separação por distância.** Empilhado no telefone, o bloco da saída secundária cai logo abaixo da nota de ausência, nos mesmos support e grafite — dois parágrafos cinzentos a duas entrelinhas de distância lêem como um bloco só. O que separa ali é `4rem` de afastamento, não um fio: fio alinhado a nada é o que a Regra do Fio Estrutural proíbe.

**Proporção de imagem:** a galeria troca de retrato para paisagem ao encolher (`aspect-3/2` no telefone, `sm:aspect-4/5`) — quatro retratos empilhados viravam rolo interminável. A foto de fecho vai de `aspect-16/9` para `sm:aspect-21/9`.

### Named Rules

**A Regra da Margem Única.** Tudo pendura na mesma margem esquerda — fio, rótulo, parágrafo, tabela e a prancha. A prancha em particular **não** leva `mx-auto`: numa página em que a grade é o argumento, o único gráfico centralizado seria a única coisa fora do lugar.

**A Regra do Teto de 64rem.** A coluna de conteúdo tem teto; a margem direita fica aberta. Nada é centralizado para "preencher" tela larga.

## Elevation & Depth

**Não existe sombra neste sistema.** `--shadow-*` e `--drop-shadow-*` estão definidos como `initial` no `@theme`, o que **apaga os namespaces inteiros**: `shadow-md`, `shadow-lg`, `drop-shadow-*` não são utilidades desencorajadas, elas simplesmente não compilam. O CSS servido não contém uma única regra de `box-shadow` autoral.

A profundidade vem de duas fontes, ambas planas:

1. **Tom.** `#FFFFFF` sobre `#F5F3F0`. É a elevação inteira do sistema, e ela aparece exatamente em dois lugares — linha de ledger em `hover` e ação de fecho em `hover`. Um card branco sobre papel off-white lê como elevado sem sombra nenhuma, que é o que torna raio 0 e sombra 0 sustentáveis.
2. **Fio.** O divisor de 1px em `#C9C6C0` separa faixas, abre blocos, fecha linhas de tabela e desenha a moldura da prancha. Ele não decora: ele é a estrutura visível.

O único gradiente do sistema é o véu de legibilidade sobre fotografia, descrito em Colors. Ele não é elevação e não deve ser reaproveitado como tal.

### Named Rules

**A Regra da Elevação por Tom.** Se algo precisa parecer acima do papel, ele fica branco. Não existe segunda opção — e quem tentar acrescentar uma vai descobrir que a utilidade não existe.

**A Regra do Fio Estrutural.** Um fio de 1px em `{colors.line}` só entra onde há separação real de conteúdo. Fio decorativo, fio duplo e fio alinhado a nada estão fora: no bloco numerado, o fio sob o número foi removido justamente porque caía 27px acima do primeiro fio de conteúdo e lia como pendência.

## Shapes

**Raio 0, sem exceção.** `--radius-*` é `initial` no `@theme`: o namespace foi deletado e `rounded-md`, `rounded-lg`, `rounded-full` não existem como utilidades. Não há um único canto arredondado no site — nem em imagem, nem em campo, nem no polegar da barra de rolagem.

O vocabulário de forma é retangular e ortogonal:

- **Fio de 1px.** Reto, sem raio, sempre em `{colors.line}` — exceto a borda da ação de fecho, que é o único fio em `{colors.ink}` do sistema, e é assim que aquele link ganha peso de ação primária sem virar botão.
- **Ícone.** Um só: a seta, em `viewBox 0 0 32 12`, traço de 1px com `vector-effect="non-scaling-stroke"`, ponta reta, sem preenchimento. Mesma espessura do fio. Glifo tipográfico fazendo papel de ícone está fora.
- **Registro de sede.** Círculo com quatro braços de cruz, traço de 1,5 na legenda e de 1px na prancha — a marca de registro de desenho técnico.
- **Logotipo.** O vetor original da Belmare, em dois lockups servidos de `public/marca/`: horizontal (proporção 5,379 — símbolo à esquerda, palavra e descritor à direita) no cabeçalho, a 24px no telefone e 32px a partir de `md`; e vertical (proporção 0,969) a 112px no rodapé e no bloco 02 de `/quem-somos`. É **o único objeto com matiz do projeto** — azul `#00339A`, verde `#009A34` e vermelho `#FE0100` —, e o matiz não sai dele: não vira acento, nem estado, nem fio, nem fundo. O símbolo sozinho (`public/marca/simbolo.svg`) só aparece no favicon e nas marcas do painel. **O "b" é vazado, não pintado:** quem dá a cor da letra é o que estiver atrás do SVG, então a marca não vai sobre fundo escuro sem uma versão própria — e é por isso que a cópia do símbolo leva um disco de papel embutido. Substituiu, em 04/08/2026, a imitação tipográfica que compunha BELMARE em Söhne com uma faixa de hachura no lugar do símbolo; a hachura saiu junto, porque só existia para ela.
- **Registro de canto.** Uma cruz simples de 1px em `{colors.line}`, centrada nas quatro quinas da moldura de uma prancha. É a marca de esquadro de folha desenhada, e é irmã do registro de sede — mesma família, sem o círculo, porque marca de esquadro não é ponto de coordenada. Só entra em moldura de prancha.
- **Barra de rolagem.** Também é do sistema: calha de 12px, trilho em papel com fio de 1px à esquerda, polegar de grafite reduzido a 4px visíveis por uma borda de 4px em cor de papel, e tinta no `hover`. Duas variantes utilitárias existem — `barra-fio` (3px, cor de fio, sem trilho, grafite no `hover`, para bandeja de rolagem horizontal que precisa ser descoberta) e `sem-barra` (oculta, para a navegação de 40px do telefone, onde qualquer barra comeria a linha).

### Named Rules

**A Regra do Raio Zero.** Não é preferência, é ausência de utilidade. Quem precisar de canto arredondado terá que reabrir o `@theme` — e essa é exatamente a conversa que a deleção do namespace existe para forçar.

## Components

Não existe botão neste sistema. Toda **ação** é um link — `<a>` ou `<Link>` — e o peso vem de tipografia, fio e área, nunca de preenchimento. Documentar um "botão primário" aqui seria inventar.

A única exceção é o **recorte**, e ela não é uma frouxidão da regra: a regra fala de ação, e o que recorta uma lista sem sair da página não navega, não envia e não baixa. Ele é `<button>` porque o teclado precisa alcançá-lo e porque `<a href="#">` mentiria sobre um destino que não existe — e continua sem preenchimento, sem raio e sem sombra. Ver "Recorte", abaixo.

### Navegação

- **Estilo:** itens em mono, caixa alta, grafite em repouso, tinta no `hover` (`transition-colors`, 150ms). Sem sublinhado, sem estado ativo por rota — o cabeçalho é do layout e aparece em todas as rotas, então nenhum item é marcado.
- **Desktop:** faixa única de `4.5rem`, quatro itens com `2rem` de espaço entre eles, WhatsApp à direita em tinta, separado por fio vertical e `2rem` de recuo.
- **Telefone:** segunda faixa de `2.5rem`, rolável na horizontal com `sem-barra` e `whitespace-nowrap`. Os itens cortados na borda são o indicador — nunca vira menu escondido.
- **Fora da navegação:** rotas de destino de porta (`/arquitetos`, `/contato`) ficam de fora, para preservar o peso das portas.

### Links de ação (o par mono + seta)

- **Estilo:** mono em caixa alta, tinta, `inline-flex` com `0.75rem` até a seta.
- **Movimento:** a seta avança `0.375rem` em 300ms `ease-out` no `hover` do grupo (200ms e `0.25rem` na lista do 404). O texto não se move.
- **Uso:** fecho de seção, lista de saída do 404, e o link de ledger — sempre como saída, nunca como ação de formulário.

### Cards de imagem (galeria e portas)

- **Corner Style:** raio 0.
- **Fundo:** `{colors.ink}` sob a imagem, para não haver flash claro antes do carregamento.
- **Sombra:** nenhuma; ver Elevation & Depth.
- **Borda:** só entre as duas portas — fio horizontal no telefone, vertical a partir de `md`.
- **Padding interno:** portas `1.5rem` / `2.5rem` a partir de `md`; a galeria não tem padding, o texto assenta abaixo da imagem.
- **Estado:** a imagem escala para 1.03 em 700ms `ease-out` no `hover` do grupo, com `overflow-hidden` recortando. Nas linhas da galeria, o sublinhado do nome troca de `{colors.line}` para `{colors.ink}` no mesmo gesto.

### Ficha (rótulo / valor)

`components/ficha.tsx` — compartilhada por `/quem-somos` e pelas páginas de marca. O componente que faz a página parecer registro em vez de texto sobre a empresa.

- **Estrutura:** `<dl>` com fio no topo; cada linha é um `<div>` com fio na base.
- **Rótulo:** mono, caixa alta, grafite, largura fixa de `9rem` a partir de `sm` — sem essa largura fixa a coluna da direita não alinha entre linhas, e ficha desalinhada vira lista.
- **Valor:** support, tinta, `min-w-0`.
- **Empilhamento:** coluna com `0.25rem` de vão abaixo de `sm`, linha com `2rem` de calha acima.
- **Variante em faixa:** no bloco 01 a mesma ideia vira grade de 2 colunas no telefone e 4 a partir de `md`, com fios verticais entre colunas e horizontal só enquanto houver duas fileiras.

### Linha de ledger

- **Estilo:** `<li>` com fio na base; a linha inteira é link. Nome em h3 sublinhado no fio, origem em mono caixa alta, o que resolve em support grafite, seta à direita.
- **Grade:** `18rem / 10rem / 1fr / 2rem` a partir de `md`; abaixo disso os três campos empilham na coluna 1 e a seta ocupa a coluna 2 da primeira linha.
- **Hover:** fundo vai a `{colors.surface}`, sublinhado vai a tinta, seta avança `0.375rem` e vira tinta. Três sinais, um gesto.

### Linha de documento

`components/linha-de-catalogo.tsx` — a linha do arquivo, compartilhada por `/catalogos` e pela seção "Para levar" das páginas de marca. É a irmã da linha de ledger: mesma anatomia, outro assunto. Ali a entrada é a marca; aqui é o documento, e a marca só qualifica o título dele.

- **Estilo:** `<li>` com fio na base; a linha inteira é link. Título em h3 sublinhado no fio, medida em mono versal na segunda coluna, seta à direita, `1.25rem` de altura interna.
- **Grade e teto são exportados**, não reescritos: `GRADE_DA_LINHA` e `TETO_DA_LISTA` saem do próprio componente porque o cabeçalho de colunas de `/catalogos` tem que assentar exatamente sobre a linha. Escrita duas vezes, a grade desalinha na primeira mudança.
- **Teto de `52rem`.** Sem ele a coluna da direita estica até a margem e abre centenas de pixels de vão entre o título e a medida em 1440px. Isso não contraria a margem direita aberta: aquilo é regra de página, isto é buraco dentro de uma linha.
- **Duas escritas, um markup.** Publicado (`arquivo` + `mb` preenchidos) aponta para o arquivo e escreve `PDF · 24,0 MB · 2026`, com a seta já em tinta. A pedir aponta para o WhatsApp com o documento e a fábrica no contexto, escreve `EDIÇÃO 2026` ou `EDIÇÃO NÃO DECLARADA`, acrescenta "Envio pela Belmare" em support grafite caixa baixa, e deixa a seta em grafite até o `hover`. Mesma grade, mesma altura: preencher dois campos vira uma na outra sem tocar em layout.
- **Só o estado que exige explicação escreve uma.** A linha publicada fica com a medida sozinha, e é assim que ela lê como resolvida.
- **A marca entra dentro do título** (`Catálogo Trisol`) quando a página não é dela, e sai na página da própria marca, onde a atribuição é ruído. Ela nunca é linha própria em mono versal — ver a Regra da Caixa Alta.
- **Hover:** fundo vai a `{colors.surface}`, sublinhado vai a tinta, seta avança `0.375rem`. O mesmo gesto da linha de ledger.
- **Leitor de tela:** um `sr-only` no fim da linha diz "(abre o PDF)" ou "(abre o WhatsApp)". As duas escritas são o mesmo markup e o mesmo gesto — quem não enxerga a diferença precisa ouvi-la.
- **Alvo externo em toda linha.** As duas escritas saem do site, e as duas levam `target="_blank"` com `rel="noopener noreferrer"`. O `download` da linha publicada é **ignorado em URL de outra origem**, e `arquivo` é URL de storage; ele fica porque volta a valer no dia em que o arquivo for servido da mesma origem, mas quem sustenta o comportamento é o `target`. A copy da página segue o mesmo fato: "abre daqui", não "baixa daqui".

**A Regra do Cabeçalho de Coluna.** Um cabeçalho de coluna assenta sobre a coluna que nomeia — por isso a grade é importada, não redigitada — e nomeia o que a coluna **de fato carrega hoje**: enquanto nenhum documento está publicado ela leva edição e estado de entrega, e se chama `EDIÇÃO`; vira `ARQUIVO` sozinha no dia em que houver arquivo. Na largura em que a coluna não existe, o rótulo dela também não existe: no telefone as duas listas empilham e sobra `DOCUMENTO` numa e `ARQUIVO` na outra, sem `FÁBRICA` nem `FORMATO E PESO`. Cabeçalho que promete coluna inexistente é pior que cabeçalho nenhum.

### Linha de arquivo 3D

`components/arquivos-3d/linha-de-arquivo.tsx` — a terceira da família, e a mais curta na medida: `SKP · 8,4 MB` e acabou. Herda a anatomia da linha de documento (fábrica em support grafite, nome em h3 sublinhado no fio, medida em mono versal, seta na ponta, o mesmo `hover` de três sinais), e **não importa a grade dela**: a coluna da medida da linha de catálogo é larga porque a edição cabe ali, e um arquivo 3D não tem ano. Acoplar as duas larguras faria uma se mexer quando a outra fosse apertada.

- **A coluna da fábrica é obrigatória aqui**, e opcional na linha de catálogo. Aquela também serve a seção "Para levar" da página da própria marca, onde a atribuição é a página inteira; esta só existe em `/arquivos-3d`, que atravessa as quatro fábricas sempre — um parâmetro opcional seria um ramo que nenhuma tela alcança.
- **No telefone a linha empilha nome, fábrica e medida, nessa ordem**, com a seta alinhada ao nome. É a colocação da linha de catálogo, copiada com o argumento: em leitura linear a fábrica vem primeiro ("Trisol, Cadeira Zuri, SKP 8,4 MB"), mas na tela empilhada é o nome da peça que sobe, porque uma seta centrada num rótulo de onze pixels lê como se apontasse para a fábrica em vez de para o arquivo.

- **Uma escrita só, e sempre a que baixa.** A linha de documento tem duas (publicada e a pedir) porque um catálogo pode existir sem estar em disco. Um `Arquivo3D` **é** o arquivo: sem peso medido e sem extensão legível ele não vira item nenhum (`lib/arquivos3d.ts`), então não existe estado em que esta linha desenhe um download mudo.
- **Nenhuma delas pede cadastro** — ver a Regra do Portão, abaixo.
- **Alvo externo**, `target="_blank"` com `download`, pela mesma razão medida na linha de documento: `download` é ignorado em URL de outra origem.

**A Regra do Portão.** `/arquivos-3d` gateia **exatamente uma coisa**: o pacote com as quatro fábricas juntas. Todo arquivo avulso baixa aberto. A regra não é de generosidade — é de economia: a Casoca é gratuita, dominante e já distribui a GDA, então um formulário na frente de um arquivo que ela entrega de graça não captura o lead, **doa** o lead. O portão só se sustenta sobre o que o concorrente estruturalmente não tem. E ele não compra o direito de esconder a medida: `ZIP · 62,4 MB` aparece **acima** dos campos, nunca depois do envio — descobrir o peso já tendo pago é a mesma quebra de promessa na versão pior. Sem pacote publicado, a seção e o formulário somem juntos: o site nunca pede dado pessoal em troca de um arquivo que não existe.

### Índice de biblioteca (`/arquivos-3d`)

A segunda superfície **sem uma única imagem**, e irmã declarada de `/catalogos`. Desde 05/08/2026 elas são a **mesma página**: uma coluna de largura total, rótulo em mono, h1 de uma linha, fila de recortes, cabeçalho de colunas em mono, linhas regradas com a medida à direita e a contagem gerada no pé. Um arquiteto que aprendeu a ler uma não reaprende nada na outra — e agora isso é literal, não aproximado.

> ⚠️ **A reforma reverteu o agrupamento e o veto ao filtro por formato, que esta seção declarava.** O texto anterior dizia "aqui o grupo é necessário: 'Cadeira Zuri' não diz de quem é" e "não há filtro por formato". A primeira metade continua verdadeira e passou a ser respondida por uma **coluna** `FÁBRICA` na linha, que atribui em toda linha e não só na primeira depois do cabeçalho. A segunda caiu: o veto valia contra um filtro que exigiria consulta sem pai e desenharia botões sobre zero arquivo, e o filtro construído não faz nem uma coisa nem outra. **O código vence**; a demonstração por extenso está em `lib/arquivos3d.ts#recortesDeFormato`.

- **A lista é plana e a fábrica é uma coluna.** Mesma decisão de `/catalogos`, e pela mesma razão: blocos empilhados não se deixam recortar, e uma fábrica com um arquivo ao lado de outra com seis vira uma página que se lê descendo em vez de escolhendo.
- **Dois eixos de recorte, lado a lado e nunca aninhados: fábrica e formato.** É o eixo que só uma biblioteca de arquivo tem — a mesma peça vem em `.skp` e em `.dwg`, e quem só abre SketchUp quer os `.skp` **das quatro fábricas**, que é justamente o que agrupar por formato dentro da marca nunca deu. A sigla do formato entra como rótulo do recorte na caixa em que `formatoDoArquivo` a gerou (`SKP`), e não é violação da Regra da Caixa Alta: sigla é uma das classes que a regra reserva para versal.
- **Ordem da lista: fábrica (ordem do painel), peça, formato.** O desempate por formato é o que põe `Cadeira Zuri · DWG` e `Cadeira Zuri · SKP` em linhas **encostadas**, que era o problema que o agrupamento existia para resolver.
- **A grade da linha é a de `/catalogos` com a coluna da medida mais estreita** — `11rem / 1fr / 10rem / 2rem` contra `11rem / 1fr / 13rem / 2rem`, porque `SKP · 8,4 MB` não carrega o ano que `PDF · 24,0 MB · 2026` carrega. O teto passou a ser o mesmo `64rem`, e a grade continua **não sendo importada** da linha de catálogo: ver "Linha de arquivo 3D".

**A Regra do Eixo que Pode Mudar a Tela.** Um eixo de filtro só é desenhado quando tem mais de uma opção, e cada opção só existe se devolve pelo menos uma linha. Uma biblioteca inteira em `.skp` desenharia `TODOS 12 · SKP 12` — dois controles que fazem a mesma coisa, que é nada. É a regra que apagou as linhas sem PDF de `/catalogos` aplicada um degrau acima: se um controle que não leva a lugar nenhum é um botão morto, um eixo que não pode mudar a tela é uma fileira deles.

**A Regra da Contagem no Recorte.** O número ao lado de cada opção é **quantas linhas sobram se você clicar nela** — contado sobre a lista já recortada pelo outro eixo, nunca sobre o acervo inteiro. É o `SKP · 8,4 MB` aplicado a um controle: declarar o custo do clique antes do clique. Contadas sobre o total, as duas facetas ofereceriam combinações que zeram a tela.

- **Rótulo de eixo em mono versal, à esquerda da fila**, em coluna de `6rem` a partir de `md` e empilhado abaixo dela. Ele só aparece onde há mais de um eixo: `/catalogos` filtra por uma coisa e a fila sob um h1 chamado "catálogos" se explica. O **nome acessível** do grupo existe nas duas rotas, com ou sem rótulo visível.
- **A fila rola na horizontal no telefone**, com `barra-fio`, em vez de embrulhar: um filtro que quebra em duas alturas de linha empurra a lista para baixo da dobra na tela onde ela mais importa. O recorte ativo é tinta mais fio de 1px embaixo; o inativo é grafite. Nunca preenchimento, nunca raio.
- **Biblioteca vazia escreve o estado**, como `/catalogos`: sem arquivo em disco não há filtro, não há cabeçalho de colunas e não há tabela — a página diz que a Belmare manda o bloco, nunca "em breve".
- **A saída para `/catalogos` mora abaixo da lista**, não numa coluna ao lado dela. É o resto da antiga coluna de argumento, e é a única razão pela qual a sequência das duas rotas não é idêntica: só uma delas manda o leitor para a outra, e mandar antes da lista é oferecer a saída a quem ainda não viu o que veio ver.

### Recorte (a opção de filtro)

`components/recorte.tsx` — `Recorte` e `FilaDeRecortes`, compartilhados por `/catalogos` e `/arquivos-3d`. Nasceu privado dentro da lista de catálogos e saiu de lá quando a segunda lista apareceu, **antes de existir a segunda cópia**: o controle carrega uma contagem, que é dado, e dado desenhado em dois lugares diverge na primeira vez que alguém apertar um dos dois — a mesma razão pela qual a linha de documento é compartilhada.

- **Estilo:** rótulo em grotesca caixa baixa, contagem em mono grafite ao lado, `0.5rem` entre os dois, `0.25rem` de altura interna, fio de 1px na base. Ativo é tinta com o fio em tinta; inativo é grafite com o fio transparente, indo a tinta no `hover`.
- **É `<button>`, e isso não fura a Regra do Link.** A regra fala de **ação** — o que navega, envia ou baixa é link. O que muda o que já está na tela sem sair dela não é ação, e um `<a href="#">` mentiria para o leitor de tela sobre um destino que não existe. `aria-pressed` carrega o estado; não há preenchimento, raio nem sombra.
- **A caixa do rótulo é de quem chama.** "Trisol" chega em caixa baixa e "SKP" em versal, porque só quem chama sabe se a string é nome próprio ou sigla. O componente não impõe `text-transform` — a mesma disciplina da utilidade `mono`.
- **A fila anuncia o eixo mesmo quando não o mostra.** `aria-label="Filtrar por fábrica"` existe nas duas rotas; o rótulo visível em mono versal só entra onde há mais de um eixo, e leva `aria-hidden` para o leitor de tela não ouvir "Fábrica, Filtrar por fábrica".
- **O resultado é anunciado.** A `<ul>` recebe o recorte no `aria-label` e a linha de contagem é `aria-live="polite"`. Sem isso o filtro é um efeito puramente visual para quem navega por landmarks.

### Bloco numerado

A espinha de `/quem-somos`, e o padrão reutilizável para qualquer rota de arquivo.

- **Estilo:** `<section>` aberta por fio de 1px no topo, número em mono grafite na coluna de `5rem`, conteúdo na coluna de teto `64rem`.
- **Acessibilidade:** o número é `aria-hidden` — quem navega por títulos não precisa ouvir "zero um" antes de cada um.
- **Numeração:** é a sequência do documento, não do arquivo. Existem duas semânticas, e a diferença é deliberada:
  - **Reservada** (`quem-somos/bloco.tsx`): uma seção que ainda não renderiza guarda o número dela, e o bloco seguinte recebe o número calculado. É o certo quando a seção ausente é conhecida e vai chegar — projetos realizados.
  - **Calculada** (`marca/secao.tsx`): a numeração corre sobre o que de fato renderizou, e a seção ausente não deixa vão. É o certo quando a ausência é a norma e varia por registro: as quatro fábricas têm quantidades muito diferentes de material declarado, e reservar números daria buracos diferentes em cada página.

### Seção anulável

O padrão que sustenta as páginas de marca, e a razão de nenhuma delas precisar de estado vazio.

- Seção sem dado renderiza `null` — sem markup vazio, sem título órfão, sem "em breve", sem célula em branco.
- **A condição é o dado declarado, não o ativo em mãos.** "Para levar" ficou em zero pixels em todas as marcas enquanto *ter catálogo* e *ter o arquivo* eram a mesma condição — e não são: a Trisol publica a edição 2026 e a Belmare ainda não recebeu o PDF. Hoje a seção some só quando a fábrica **não declara documento nenhum**, e renderiza em três das quatro páginas de marca. Uma superfície declarando um fato em público enquanto a outra o esconde é o site sabendo de algo num lugar e fingindo ignorá-lo no outro, e quem paga é o leitor que abre as duas telas em sequência.
- Campo com dado ausente e conhecido é escrito **por extenso** ("Origem não declarada"), nunca travessão.
- O sumário da página é derivado da mesma função que monta as seções, o que torna impossível apontar para uma âncora que não existe.
- A assimetria entre registros deixa de ser problema de layout: ela vira o conteúdo do sumário.

### Ação de fecho

`components/acao-de-fecho.tsx`, compartilhada.

- **Estilo:** link de largura total com fio **em tinta** acima e abaixo, `1.75rem` de altura interna, rótulo em h2 à esquerda e seta à direita.
- **Hover:** fundo `{colors.surface}` e seta avançando `0.375rem`.
- **Papel:** é o mais próximo de um botão primário que o sistema tem — e ainda assim é um fio, não um preenchimento.
- **Contexto obrigatório:** o `href` sai de `whatsapp(contexto)`, e o contexto diz de qual página o lead veio. É a única qualificação de lead que o site tem enquanto não há formulário.

### Logotipo

O vetor original da Belmare, em três aplicações. Símbolo, palavra e descritor são desenho, não composição tipográfica: o site não remonta mais o lockup em Söhne.

- **Compacta** (`MarcaCompacta`, cabeçalho): lockup horizontal, `h-6` no telefone e `md:h-8` — 129px e 172px de largura.
- **Vertical** (`MarcaVertical`, rodapé e bloco 02 de `/quem-somos`): lockup vertical a `h-28` (112px). A altura é do componente, não de quem chama; `className` ali é para espaçamento.
- **Símbolo** (`public/marca/simbolo.svg`): quadrado, só no favicon e nas duas marcas do painel.

- **Construção:** os dois lockups são **arquivo, não SVG em linha**. Juntos são ~10 KB comprimidos e moram no layout, ou seja saem em toda rota — em linha, esse peso entraria no HTML e outra vez na carga do RSC, a cada navegação. O preço é que a palavra não herda `currentColor`: ela está gravada em `{colors.ink}` dentro do arquivo. `width` e `height` são a proporção intrínseca, não o tamanho na tela — sem eles o cabeçalho salta na primeira pintura.
- **Acessibilidade:** o lockup do cabeçalho vai com `alt=""` porque o link que o embrulha já tem `aria-label`; o vertical carrega o nome no `alt`.

> ⚠️ **O "b" do símbolo é vazado.** No traço original ele é um buraco no disco azul, não um caminho pintado — quem dá a cor da letra é o que estiver atrás do SVG. Sobre papel isso é o desejado; sobre fundo escuro a letra some dentro do azul. Por isso a marca não vai em superfície escura sem uma versão própria, e por isso a cópia usada no favicon e no painel leva um disco de papel embutido atrás do azul.

> ⚠️ Divergência com `briefing/marca.md` §2 resolvida em 04/08/2026: as três aplicações do briefing agora existem, e o favicon deixou de ser o do scaffold do Next. `favicon.ico` (16/32/48), `icon.svg` e `apple-icon.png` saem todos do mesmo símbolo. **`favicon.ico` só vale na raiz de `app/`** — dentro de `app/(frontend)/` o Next o ignora em silêncio, que é onde ele estava e por que o site passou a existência inteira sem favicon.

### Prancha técnica (componente de assinatura)

`prancha-territorio.tsx` + `lib/territorio.ts`. **PRANCHA 01**, e o padrão a reutilizar em qualquer desenho de dado.

- **Dado, não decoração.** O contorno dos três estados é a malha territorial oficial do IBGE, reprojetada em Mercator e simplificada por Douglas-Peucker com tolerância de 0,022° — ~8 KB de vetor, nenhuma requisição extra. Mexer no desenho significa regerar a partir do IBGE, nunca editar coordenada à mão.
- **Duas camadas.** Geometria em SVG, rótulo em HTML posicionado por porcentagem por cima. Rótulo dentro do `viewBox` escalaria com o desenho — daria mono de 22px no desktop e 7px no telefone. Fora dele, a mono tem 11px em qualquer largura.
- **Recorte de rótulo.** Cada rótulo sobre a graticula leva `bg-paper` e `px-1.5`, que abre a linha para a palavra. É o gesto de toda prancha desenhada, e sem ele o meridiano passa no meio da sigla.
- **Escala declarada.** A barra gráfica é calculada a partir da projeção (400 km em `111,32 × cos(latitude)`), não medida no olho, e a legenda declara o paralelo em que ela é válida — em Mercator a escala varia com a latitude, e uma barra sem essa nota seria medida falsa numa página cujo argumento é que tudo é conferível. A barra sai em `{colors.graphite}`, não no fio, para não sumir no mesmo peso da graticula que ela mede.
- **Hierarquia de traço:** moldura, carimbo e graticula em `{colors.line}`; escala em `{colors.graphite}`; contorno dos estados e marca de sede em `{colors.ink}`. Todos com `vector-effect="non-scaling-stroke"`, para o fio ter 1px em qualquer escala.
- **Honestidade cartográfica:** a prancha nomeia estados, não cidades. Só a sede é marcada, porque é o único endereço verificado.

### Prancha chaveada sobre fotografia

`representadas/prancha-area-externa.tsx` + `lib/prancha-area-externa.ts`. **PRANCHA 02** — a segunda da série, e a que estende a gramática da primeira para cima de uma foto. Mesma moldura em fio, mesmo carimbo no pé, mesmo recorte de rótulo em papel; o que muda é o fundo e, com ele, três exigências novas:

- **A linha de chamada é traçada duas vezes.** Encamisamento de 3px em `{colors.paper}` por baixo, traço de 1px em `{colors.ink}` por cima. É como se chama um objeto numa prancha impressa sobre meio-tom, e aqui é requisito: traço único em papel media 1,09:1 a 1,9:1 contra fotografia clara, e a WCAG 1.4.11 pede 3:1 para objeto gráfico necessário à compreensão. **Nunca traçar uma chamada com um traço só.**
- **A prancha não recorta.** O aspecto da caixa é o aspecto do arquivo, em toda largura. As chamadas estão em porcentagem da caixa; `object-cover` num aspecto diferente recorta por dentro e a seta passa a apontar para o lugar errado — 3/2 sobre um arquivo 16/9 corta 7,8% de cada lado e tira a primeira chamada do objeto dela.
- **Sem véu.** A legibilidade vem do recorte em papel do rótulo. Escurecer a foto é o gesto da abertura da home; numa prancha o desenho não se apaga para o rótulo caber.
- **Coordenada pertence ao desenho, não ao dado.** Como em `territorio.ts`: trocar a fotografia recalcula só o arquivo de coordenadas, e nenhum campo de cadastro se mexe.

**A Regra da Chamada.** A seta nomeia a **função**, nunca o produto — e é a legenda, fora do desenho, que atribui a função à fábrica. Sobre fotografia gerada, uma seta com nome de marca afirma que aquele objeto é produto daquela marca. Efeito colateral que vale o desenho inteiro: como a chave é a função, o mesmo desenho aceita N marcas.

### Faixa de índice

`marca/faixa-indice.tsx`. O segundo e último elemento fixo do sistema, abaixo do cabeçalho: `3.5rem`+`2.5rem` de recuo no telefone, `4.5rem` a partir de `md`, altura de `2.5rem`, fechada por fio, `z-10` sob o cabeçalho.

- **Ela lista só o que renderizou.** Entradas e conteúdo saem da mesma função (`secoesDaRepresentada()`), o que torna estruturalmente impossível apontar para uma âncora que não existe.
- **Contagem antes do clique** — `QUEM ASSINA 8` — e ela conta itens **distintos**. É a regra do `SKP · 8,4 MB` aplicada à navegação da própria página, e um contador que soma duplicatas derruba a regra que a faixa existe para cumprir.
- **Contagem só onde há custo a declarar.** "Para levar" recebe o peso quando há exatamente um documento publicado (`PDF 8,4 MB`), a quantidade quando há mais de um, e **nada** quando não há nenhum — a faixa existe para dizer o que custa o clique, e "1" não é custo de nada. Hoje, sem arquivo em disco, essa entrada aparece sem contagem.
- **Estado por tom, não por movimento.** Grafite → tinta, `aria-current`. Nada entra, nada desliza: a Regra do Movimento Fechado segue inteira, e não há `scroll-behavior: smooth` — âncora que anima é movimento que ninguém pediu.
- **`barra-fio`, não `sem-barra`.** A navegação do cabeçalho pode esconder a barra porque transborda com um item cortado ao meio, e o corte é o indicador; a faixa de índice não transborda assim, e sem indicador ela declara três seções numa marca que tem cinco.
- **Sem JavaScript, nada é marcado** — em vez de marcar a primeira e afirmar um "você está aqui" errado. A altura da pilha fixa é **medida**, não escrita: 138px no telefone, 113px a partir de `md`.

### Movimento

O vocabulário é fechado em quatro gestos, e todos disparam por ponteiro:

| Gesto | Valor | Onde |
|---|---|---|
| Escala de imagem | `scale(1.03)`, 700ms `ease-out` | galeria e portas |
| Avanço da seta | `translateX(0.375rem)`, 300ms `ease-out` (0.25rem/200ms no 404) | todo link com seta |
| Troca de cor | 150ms, `cubic-bezier(.4, 0, .2, 1)` | navegação, telefone, links de rodapé, fundo de ledger |
| Cor de sublinhado | mesma transição de cor | nome de representada |

`motion-reduce:transition-none` acompanha **todas** as oito transições de transformação. O foco é `outline: 2px solid {colors.ink}` com `2px` de recuo, global, via `:focus-visible`.

### Named Rules

**A Regra do Movimento Fechado.** Não existe movimento por rolagem em lugar nenhum do código — nem revelação suave, nem parallax, nem traço que se desenha. Isso é regra, não omissão: o arquiteto volta muitas vezes, e o que encanta na primeira visita irrita na décima. Movimento novo entra só se couber na tabela acima.

**A Regra do Link.** Toda ação é link. Se algo precisar de mais peso, ganha fio em tinta e corpo maior — nunca preenchimento e canto.

> ⚠️ Divergência com `briefing/marca.md` §7. O briefing prevê "revelação suave ao rolar" e "filtro que reordena o grid com transição". Nenhuma das duas existe no código, e a superfície `/quem-somos` registra "sem movimento por rolagem" como restrição explícita. **O código vence.**

## Do's and Don'ts

### Do:

- **Do** construir profundidade com `{colors.surface}` sobre `{colors.paper}` e com o fio de 1px. É a elevação inteira do sistema.
- **Do** aplicar caixa alta explicitamente, e só em medida, código, sigla, rótulo de campo e estado de campo declarado. Nome próprio e frase vão na grotesca em caixa baixa por curtos que sejam — razão social, endereço, porte, descrição de CNAE, nome de fábrica.
- **Do** limitar medida de texto em `ch` (título 14–24ch, corpo 44–68ch) e deixar a margem direita aberta.
- **Do** pendurar todo elemento novo na margem única (`1.25rem` / `2rem`), inclusive gráficos.
- **Do** usar `tabular-nums` em qualquer coluna, ficha, tabela ou contador. Já vem embutido na utilidade `mono`.
- **Do** acompanhar toda transição de transformação com `motion-reduce:transition-none`.
- **Do** terminar o `alt` de toda imagem mock em "imagem de referência", e centralizar as referências em `src/lib/acervo.ts` — trocar o acervo não pode virar caça a URL espalhada.
- **Do** acrescentar **legenda visível** quando a posição da imagem sugerir obra entregue. `alt` não resolve: ninguém que enxerga lê `alt`. É o que a foto de fecho de `/quem-somos` faz, e é a única legenda visível de foto do site.
- **Do** escrever campo sem dado por extenso — "não declarada" — em vez de travessão, que o leitor confunde com erro de digitação.
- **Do** manter seção sem conteúdo real renderizando `null`. `projetos-realizados.tsx` está construída inteira e no ar em zero pixels até existirem três projetos completos: sem markup vazio, sem título órfão, sem "em breve".
- **Do** traçar toda linha de chamada sobre fotografia **duas vezes** — encamisamento de 3px em papel sob o traço de 1px em tinta. Um traço só não passa dos 3:1 que a WCAG pede para objeto gráfico, e a chamada vira decoração.
- **Do** dar à prancha o mesmo aspecto do arquivo em toda largura. Qualquer outro aspecto recorta por dentro e move a chamada para fora do objeto.
- **Do** derivar contagem de sumário de itens **distintos**, e derivar o próprio sumário da mesma função que monta as seções.
- **Do** formatar toda medida por **uma função só**, nunca inline. `pesoEmMB()` fixa uma casa decimal para `PDF · 24,0 MB` assentar embaixo de `SKP · 8,4 MB` numa coluna de numeral tabular; `toLocaleString` solto em cada chamada devolve "24" num lugar e "8,4" no outro, e a coluna deixa de ler como medida.
- **Do** compartilhar o componente de linha entre as superfícies que declaram o mesmo documento, **desde a primeira linha escrita**. Peso e edição são a promessa que a linha faz antes do clique, e promessa formatada em dois lugares diverge. O componente exporta a própria grade e o próprio teto, para o cabeçalho de colunas cair exatamente sobre ela. Vale igual para o controle: o recorte saiu de dentro de `/catalogos` no dia em que a segunda lista apareceu, não no dia em que as duas cópias começaram a divergir.
- **Do** desenhar um eixo de filtro só quando ele pode mudar a tela, e uma opção só quando ela devolve pelo menos uma linha. A contagem ao lado da opção é o resultado do clique — contada sobre a lista já recortada pelos outros eixos —, nunca um total de acervo que promete mais do que entrega.
- **Do** derivar o rótulo de um cabeçalho de coluna do dado que a coluna **carrega hoje** — `EDIÇÃO` enquanto nada está publicado, `ARQUIVO` quando houver arquivo — e esconder o rótulo na largura em que a coluna não existe.
- **Do** dar `target="_blank"` a todo link de arquivo. O atributo `download` é **ignorado em URL de outra origem**, e os arquivos são servidos de storage: sem o `target`, o dia em que o primeiro PDF chegar o clique deixa de baixar e leva o visitante para fora da página, sem sintoma nenhum em revisão porque hoje não há arquivo para testar. A copy acompanha o fato — "abre", não "baixa".
- **Do** derivar número exibido de função, nunca de literal. `anosDeMercado()` conta com dia e mês, e a rota declara `revalidate = 86400` para o número não congelar entre builds.

### Don't:

- **Don't** reabrir `--radius-*`, `--shadow-*` ou `--drop-shadow-*`. Eles estão em `initial` de propósito: as utilidades não existem, e essa impossibilidade é o sistema.
- **Don't** introduzir matiz. Sem cor primária, sem cor de acento, sem verde de sucesso, sem vermelho de erro. O namespace de cor padrão do Tailwind continua compilando — a disciplina é sua.
- **Don't** usar branco puro como fundo de página, nem papel como superfície elevada.
- **Don't** tirar as cores de dentro do logotipo. O azul, o verde e o vermelho da marca são do desenho, e só dele: não viram acento, estado, fio nem fundo. Um matiz da marca aparecendo fora do lockup é o sistema quebrado, não estendido.
- **Don't** acrescentar uma terceira família tipográfica, nem substituir a pilha de fonte: Söhne já é a primeira da pilha, e Geist entra como fallback dentro dela.
- **Don't** criar movimento disparado por rolagem, parallax, scroll-jacking, loader longo ou contador animado.
- **Don't** desenhar botão preenchido. Toda ação é link — e o recorte, que é `<button>`, não é ação: ele muda o que já está na tela sem sair dela, e mesmo assim não ganha preenchimento nem canto.
- **Don't** centralizar o único gráfico de uma página, nem qualquer bloco de conteúdo, para "preencher" tela larga.
- **Don't** apresentar imagem mock como foto real de produto, fábrica ou projeto entregue — nem em copy, nem em `alt`, nem em legenda.
- **Don't** escrever nome próprio, frase ou legenda em mono versal, **nem quando são curtos**. Versal é medida, código, sigla, rótulo de campo e estado de campo declarado; nome de fábrica, nome de coleção, nota de modelo e legenda de figura vão na grotesca em caixa baixa. Quando a saída for "baixar a caixa e manter o elemento", o elemento é que estava errado.
- **Don't** tirar de uma célula o prefixo que a descreve só porque o cabeçalho da coluna repete a palavra. `EDIÇÃO` sobre três células que começam com `EDIÇÃO` repete a palavra quatro vezes, e a correção óbvia quebra o telefone: ali o cabeçalho está `hidden` e a célula precisa se descrever sozinha — "2026" solto não diz o que é. A repetição custa menos que uma máquina de prefixo condicional por breakpoint.
- **Don't** nomear uma marca numa seta apontando para fotografia gerada. A chamada nomeia a função; a legenda, fora do desenho, é que atribui.
- **Don't** preencher campo vazio com dado plausível. O que não existe fica ausente.
