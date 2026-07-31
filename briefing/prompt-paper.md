# Prompts para o Paper

Derivados de `marca.md` e `estrutura.md`. Use na ordem — um artboard por vez rende muito mais que um prompt gigante.

> ⚠️ **Reescritos em 30/07/2026** com a reversão da Direção C. Se você tiver artboards antigos com padrões de matéria, faixas de textura ou filtro de material, eles estão fora — ver `estrutura.md` §4.

---

## Prompt 1 — Identidade

```
Contexto
Belmare Representações — representação comercial de mobiliário de alto padrão
para área externa. Florianópolis/SC, fundada em 1999, atende Paraná, Santa
Catarina e Rio Grande do Sul. Representa quatro fábricas: Marê Mobília (móvel
de autor), GDA Móveis (estrutura em alumínio fundido), Bux Garden (conforto e
têxtil de performance) e Trisol (ombrelones — a sombra).

A ideia central
A Belmare não vende móvel: ela resolve a área externa inteira. Quatro
fábricas que não falam entre si, três estados, UM INTERLOCUTOR. Ela é uma
casa de curadoria — e uma casa de curadoria fica quieta para o acervo falar.

Referência de registro: amostrário de arquitetura. Rigor de catálogo técnico,
não de marca de decoração. Pense 70Materia, Freitag, teenage engineering,
Dezeen. NÃO pense em marca de praia.

A identidade vem de tipografia, grade e silêncio. Não existe sistema de
textura, não existe padrão de fundo, não existe ornamento. A única cor da
página é a fotografia.

O logotipo é FIXO — um desenho, sempre o mesmo

    BELMARE
    ▓▓▓▓▓▓▓▓        ← faixa: uma hachura regular, invariável
    REPRESENTAÇÕES  ← mono, caixa alta, tracking aberto, subordinado

Os três elementos têm EXATAMENTE a mesma largura — é o alinhamento que segura
o lockup. O descritor é distribuído de ponta a ponta, não centralizado: em
mono e na largura do wordmark ele lê como classificação técnica, e é assim que
"Representações" deixa de diminuir a marca.

A faixa não muda por contexto, não representa material e não sai do logotipo.
Ela nunca vira padrão de fundo nem textura de seção.

Tipografia
Söhne + Söhne Mono, da Klim. Se não estiverem disponíveis, use a neo-grotesca
mais próxima que existir (Inter, Geist, Instrument Sans ou Archivo) e uma mono
de mesma família ou compatível (Geist Mono, JetBrains Mono, IBM Plex Mono).
Duas famílias no total, nunca três.

Regra que estrutura tudo: A GROTESCA FALA, A MONO MEDE.
Todo dado técnico — formato de arquivo, peso, medida, contador, ano, código —
vive na mono, caixa alta, tracking +0.06em, numerais tabulares.

Escala
  Display   96px  peso light   entrelinha 0.92  tracking -0.02em
  H1        56px  peso regular entrelinha 1.05  tracking -0.01em
  H2        32px  entrelinha 1.15
  H3        22px  entrelinha 1.25
  Corpo     17px  entrelinha 1.55
  Apoio     14px  entrelinha 1.45
  Mono      11px  caixa alta   entrelinha 1.3   tracking +0.06em

Cor — acromática, zero acento
  Papel (fundo)      #F5F3F0   nunca branco puro
  Tinta (texto)      #17171A
  Grafite (UI)       #3D3D40
  Cinza (divisores)  #C9C6C0
  Branco (cards)     #FFFFFF   com parcimônia

Não existe cor de marca. Card em branco puro sobre o papel cria elevação
SEM SOMBRA. O fio de 1px em #C9C6C0 é o único ornamento, e ele é estrutural.

Produza, num artboard de 1600 de largura
1. O logotipo em três aplicações: vertical (nome / faixa / descritor),
   compacta (nome e faixa fina, sem descritor) e símbolo (a faixa sozinha,
   em 72 / 32 / 16 px)
2. A escala tipográfica aplicada, com um exemplo real de linha em mono:
   "SKP · 8,4 MB" e "PARANÁ · SANTA CATARINA · RIO GRANDE DO SUL"
3. Os swatches de cor com os hex
4. A grade e o fio demonstrados: uma faixa de conteúdo com colunas visíveis
   e divisores, mostrando o rigor de alinhamento que carrega a identidade

Nunca faça
- Sombra, gradiente, glow, brilho ou elevação falsa
- Raio de canto — tudo em 0
- Qualquer cor além dos cinco hex acima
- Turquesa, gradiente de pôr do sol, palmeira, onda, fonte manuscrita
- Padrão de textura, hachura ou trama fora do logotipo
- Mais de duas famílias tipográficas
- Peso bold em display; a hierarquia vem de tamanho e espaço
```

---

## Prompt 2 — Home

```
Continuando o sistema Belmare do artboard anterior, desenhe a HOME em 1600x1200.

O briefing do cliente é explícito e essa contenção é uma decisão de design que
deve ser defendida: "banner, as quatro marcas em destaque com logo, e duas
portas de entrada. Nada mais."

Estrutura, de cima para baixo
1. Topo: logotipo à esquerda; navegação em mono caixa alta —
   Quem somos · Representadas · Catálogos · Arquivos 3D; WhatsApp à direita
2. Banner full-bleed. Use um placeholder cinza com marcação clara de que é
   fotografia. Sobreposto, em display 96px light:
   "Sofá, mesa, espreguiçadeira e ombrelone."
   E em mono: "PARANÁ · SANTA CATARINA · RIO GRANDE DO SUL — DESDE 1999"
   Não substitua por "Móveis para área externa" (descreve uma fábrica) nem por
   contagem de fábricas e interlocutores (jargão interno). O título nomeia
   objetos.
3. As quatro marcas: MARÊ MOBÍLIA · GDA MÓVEIS · BUX GARDEN · TRISOL
   Logos em MONOCROMIA, tamanho óptico equalizado. Sob cada uma, em mono,
   o que ela resolve: "o móvel de autor" / "a estrutura" / "o conforto" /
   "a sombra". Use placeholders tipográficos para os logos.
4. As duas portas, lado a lado, ocupando a largura inteira:
   "Sou arquiteto ou designer →"  |  "Quero comprar ou revender →"
   Devem parecer duas escolhas de igual peso, não um botão e um link.

Nada além disso. Sem seção de depoimento, sem newsletter, sem números,
sem carrossel, sem faixa de textura.
```

---

## Prompt 3 — A página de uma marca

```
Continuando o sistema Belmare, desenhe /representadas/mare-mobilia
em 1600x1400.

Esta é a página mais importante do site depois da home, e ela tem dois
leitores: o arquiteto que procura uma peça, e o diretor comercial de uma
QUINTA fábrica decidindo se entrega o Sul do Brasil para a Belmare. Vale
tratamento editorial.

Regra de estrutura: uma marca, uma página. Tudo o que é da Marê está aqui —
não há segunda página de catálogo.

Estrutura
- Topo do conteúdo: "Marê Mobília" em H1; abaixo, em mono,
  "O MÓVEL DE AUTOR · CAMBÉ/PR". À direita, um botão outline em mono:
  "BAIXAR CATÁLOGO · PDF 24,0 MB"
- Bloco editorial: sobre a fábrica, e os designers que assinam, tratados
  como nomes próprios com peso — não como lista de bullets
- Peças em destaque: um único filtro, "Categoria", como texto tipográfico
  simples — NÃO sidebar de e-commerce com checkbox, faixa de preço ou badge.
  Filtro deve ser silencioso. À direita, contador "24 PEÇAS" em mono e um
  alternador de densidade do grid (S / M / L)
- Grid de peças, 4 colunas. Cada card: foto (placeholder cinza), nome da peça
  na grotesca, categoria em mono. Sem página de produto individual —
  o card não clica para lugar nenhum além da foto ampliada
- Ao pé, duas ações lado a lado: "ARQUIVOS 3D DA MARÊ →" e
  "FALAR COM A BELMARE →". Nunca o e-mail da fábrica.

Peças reais da Marê para usar: Poltrona Saara, Mesa Bistrô Caraúna,
Banco Petit, Aparador Batuíra, Espreguiçadeira Jubarte, Poltrona Manacá.
Designers reais: Daniela Ferro, Fabrício Roncca, Pepê Lima, Fernando Zanardi.

Não invente medida, preço, prazo ou material de peça nenhuma.
```

---

## Prompt 4 — Arquivos 3D

```
Continuando o sistema Belmare, desenhe /arquivos-3d em 1600x1200.

É o ativo que prende o arquiteto — e o gatilho de captura de lead. Deve
parecer instrumento de trabalho, não página de marketing.

Estrutura
- Título em H1 e uma linha de apoio direta, sem adjetivo
- Organização por marca, cada uma com sua lista de arquivos
- Cada linha de arquivo mostra, em mono: nome da peça, formato e TAMANHO
  antes do clique — "POLTRONA SAARA    SKP · 8,4 MB    DWG · 1,1 MB
  RVT · 3,2 MB    3DS · 5,6 MB"
- Filtro por formato no topo: SKETCHUP · DWG · REVIT · 3DS
- Uma seção de acabamentos e tecidos, também agrupada por marca: são as
  cartas que cada fábrica fornece, não uma taxonomia da Belmare
- Use numerais tabulares em tudo — as colunas de tamanho precisam alinhar

Declarar peso e formato antes do clique é respeito com quem está em obra
com internet ruim. Detalhe pequeno, confiança grande.
```
