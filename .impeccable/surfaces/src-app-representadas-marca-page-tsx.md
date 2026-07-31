---
version: 1
slug: "src-app-representadas-marca-page-tsx"
primary_target: "src/app/representadas/[marca]/page.tsx"
related_targets: ["src/components/marca/faixa-indice.tsx","src/components/marca/abertura.tsx","src/lib/representadas.ts"]
---

## Escopo e modo

Template `/representadas/[marca]` — uma marca, uma página, e ela carrega tudo o que é da marca. Modo **Operate**, e a frase que decide isso está em PRODUCT.md: *"o site é ferramenta de trabalho, não peça de campanha… nada que encante na primeira visita e irrite na décima."* O modo de falha real da rota não é ser sem graça — é o arquiteto rolar três telas de história de fábrica para achar o que veio buscar.

Superfície nova dentro do mundo estabelecido. O sistema visual não se toca.

## Público, trabalho, ação

O mesmo arquiteto, agora dentro de uma fábrica, com um vão para resolver. Volta muitas vezes. Leitor silencioso: a própria fábrica, olhando como a Belmare a apresenta.

Ação primária: **falar com a Belmare**, com contexto pré-preenchido por marca. Quando os PDFs chegarem, ela passa a ser **baixar o catálogo**.

## O problema que a direção resolve

As quatro têm quantidades absurdamente diferentes de material declarado. A Marê tem 8 assinaturas e 19 categorias e **não declara um único material**; a Trisol declara a linha técnica inteira e **não tem designer nem cidade**; a Bux tem um designer e desempenho têxtil e **taxonomia em aberto** (P30). Um template rígido ou fica vazio na Trisol ou fica raso na Marê.

## Direção — **"o índice da prancha"** (sorteio `f587693a`, índice 6 de 7; comp aprovado `marca-c-faixa-horizontal`)

Uma faixa fixa de sumário sob o cabeçalho, fotografia sangrando de ponta a ponta, e seções abertas por fio com número em mono na margem — a espinha de `/quem-somos` com a numeração **calculada** em vez de reservada.

**A virtude que decide a direção:** o índice lista **só o que renderizou**. `secoesDaRepresentada()` é a mesma função que a página usa para montar as seções e que a faixa usa para se montar, e é isso que impede o defeito clássico de sumário — apontar para âncora que não existe. Abra a Trisol: quatro entradas. Abra a Marê: cinco. **A maior fragilidade de conteúdo do projeto vira o dispositivo de navegação**, e nenhuma seção precisa de estado vazio, de "em breve" ou de célula em branco.

**A contagem antes do clique** — `QUEM ASSINA 8`, `VOCABULÁRIO 19` — é a regra do "SKP · 8,4 MB" aplicada à navegação da própria página. Ela conta itens **distintos**: na GDA os dois ambientes repetem as mesmas seis categorias, e somar dava 12, fazendo o leitor concluir que a GDA tem o dobro do que tem. Num sumário cujo argumento é a contagem honesta, um contador que conta duas vezes derruba a própria regra.

**Realce por tom, e não movimento por rolagem.** Nada entra, nada desliza: um rótulo troca de grafite para tinta. Custa a primeira ilha cliente do projeto (`IntersectionObserver`); a página segue Server Component e estática nas quatro. O `rootMargin` é **medido** do próprio elemento, não escrito — a pilha fixa tem 138px no telefone e 113px a partir de `md`. Sem JS nada é marcado, em vez de marcar errado.

**No telefone a faixa usa `barra-fio`, não `sem-barra`.** A navegação do cabeçalho pode esconder a barra porque transborda com um item cortado ao meio, e o corte é o indicador; aqui o item seguinte começa exatamente na borda, com nada cortado — e uma faixa que declara três seções numa marca que tem cinco falha exatamente no que ela existe para fazer.

## Sequência (as que existirem)

`Identificação` (foto larga + registro) · `O que declara` · `Quem assina` · `Vocabulário` · `Para levar` · `Falar`.

**A foto abre em `3/1` a partir de `sm`.** A 21/9 ela pedia 612px de 1440 e, num notebook de 1440×800, a primeira tela era só fotografia e a legenda do mock — com o nome da fábrica abaixo da dobra.

**A legenda visível da foto de abertura é obrigatória**, e em grotesca caixa baixa: a imagem cai imediatamente acima do nome da fábrica, e nessa posição é lida como peça dela. É a declaração que separa o site de apresentar imagem gerada como foto de produto, e não pode ser o texto menos legível da página.

## Regras de dado

- **Nas palavras da fábrica, e só o que ela publica.** Nada completado por simetria: a Marê declara duas coisas, e são duas. Os limites da Trisol saem como **faixa** ("de 30 a 80 km/h, conforme o modelo"), porque é assim que ela publica — quebrar em número por modelo daria uma tabela mais bonita e inventada.
- **Designers: nome e coleção, nada além.** Sem retrato, sem bio. São pessoas reais, e gerar rosto de pessoa real é falsificação; e a autorização de nome, bio e imagem não foi confirmada (P23). Coleção só onde a atribuição é pública: a Marê liga designer a coleção, a GDA não — as cinco dela saem sem atribuição, no vocabulário.
- **Sem filtro de categoria na v1.** `estrutura.md` §3.3 o pede, mas para a grade de 12–20 **peças**, que não existe (P46b). Aqui os conjuntos têm 19, 6 e 5 itens, e um controle que reduz 5 a 2 é teatro — mesmo critério que tirou o alternador de densidade. Quando as peças chegarem, o filtro entra nelas e entra como **link** (`?grupo=` em `searchParams`): Server Component intacto, zero JavaScript, teclado por definição, URL indexável. Este sistema não tem botão.
- **`Para levar` está construída e no ar em zero pixels.** Nenhuma marca tem `catalogo` preenchido porque nenhum arquivo foi recebido — nem da Trisol, cuja edição 2026 existe e está publicada, mas que ninguém baixou nem mediu. Preencher o campo publica a seção e a faixa ganha a entrada sozinha. Peso e formato saem do arquivo medido, nunca estimados.
- Todo lead passa pela Belmare. Nenhum e-mail de fábrica em lugar nenhum.

## Estados e rotas

`generateStaticParams` sobre o array + `dynamicParams = false` — as quatro pré-renderizadas, slug desconhecido vira 404 estático · seção sem dado renderiza `null` · `scroll-mt` recua as âncoras da pilha de fixos.

**Anti-metas:** história de fábrica que nenhuma delas publicou · retrato ou bio de designer · e-mail de fábrica · território ou exclusividade por marca · medida, preço ou prazo de peça · peça mock nomeada como produto real · template que finge simetria entre as quatro.

## Decisões em aberto

P11 o download de 3D exige cadastro (construir para o gate ligar depois sem refazer) · P46b peças por marca · P30 taxonomia da Bux — trava só a página dela · P22 formato do catálogo da Marê · P23 autorização dos designers · P65 base da Trisol · P41 fotos em alta.

## Dívida registrada

`SecaoDaMarca` e `quem-somos/Bloco` são o mesmo bloco numerado com semânticas de numeração diferentes (calculada × reservada). `Ficha` já foi promovida para `components/ficha.tsx` e é compartilhada. Vale um `extract` quando a terceira rota de arquivo aparecer — não antes, porque duas ocorrências ainda não definem o formato da abstração.
