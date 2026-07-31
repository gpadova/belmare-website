# Estrutura do site

Arquitetura de informação, página a página, já refletindo as decisões de 30/07/2026.

`✅` decidido · `🟡` proposta minha, a validar · `❓` pergunta aberta

---

## 1. Princípio organizador

> **A Belmare não representa quatro marcas. Ela resolve a área externa inteira de um projeto.**

Quatro fábricas, um interlocutor, três estados. É a única coisa que a Belmare oferece e que **nenhuma das quatro fábricas pode oferecer sozinha** — e por isso deve ser o eixo do site, não uma frase na página "Quem somos".

Com a Trisol identificada, o portfólio fecha um raciocínio completo:

| Marca | Resolve |
|---|---|
| **Marê Mobília** | O mobiliário de autor |
| **GDA Móveis** | A estrutura em alumínio — externo e interno |
| **Bux Garden** | O conforto e o têxtil de performance |
| **Trisol** | A sombra |

Isso não é uma lista de fornecedores. É uma **área externa inteira**. O site deve deixar isso óbvio em dez segundos.

---

## 2. Sitemap

```
/                              Home
│
├── /quem-somos                A empresa, a história, projetos realizados
│
├── /representadas             Índice das marcas
│   └── /representadas/[marca] A marca inteira: sobre, designers, peças em
│                              destaque, catálogo em PDF, arquivos 3D dela
│
├── /catalogos                 Os PDFs — um por marca. Lista plana, sem subpágina
│
├── /arquivos-3d               Biblioteca, agrupada por marca e formato
│
├── /arquitetos                Porta A — o hub de quem especifica
├── /contato                   Porta B — comprar (via Belmare) ou revender
│
└── /politica-de-privacidade
```

**9 rotas.** Enxuto o suficiente para ser feito com excelência, completo o suficiente para servir os três públicos.

### ✅ DECIDIDO (30/07/2026) — **uma marca, uma página**

`/catalogos/[marca]` saiu. Ele era um **segundo índice das mesmas quatro marcas**: quem chegava por `/representadas` via a lista, escolhia a Marê, e para ver as peças dela tinha que voltar e descer de novo pelo outro ramo. Duas árvores para o mesmo conteúdo.

Agora existe **um lugar por marca**, e ele carrega tudo o que a marca tem: quem é, quem assina, o que ela resolve, as peças em destaque, o PDF e os arquivos 3D. `/catalogos` continua existindo porque "catálogo" é a palavra que o arquiteto procura — mas vira o que ele de fato é: **a lista dos PDFs**, com marca, ano e peso, sem subpágina.

Ganho direto no CMS: o catálogo deixa de ser uma coleção e vira **um campo da marca**. Ver §5.

### ✅ DECIDIDO (30/07/2026) — **sem "Onde comprar" na v1**

Lista de lojas é conteúdo volátil demais para a primeira fase — muda o tempo todo e desatualiza sozinha. Fica para a **fase 2**.

⚠️ **Isso deixa a porta "quero comprar" sem destino**, já que a Belmare não vende direto. A solução é fazer da própria Belmare o roteador: o consumidor fala com ela pelo WhatsApp e **ela indica a loja**.

Na prática isso simplifica a arquitetura em vez de complicá-la — as duas metades da porta B convergem para o mesmo lugar (`/contato`), mudando apenas o caminho e a mensagem:

```
/contato
  ├── "Quero comprar"    → WhatsApp · a Belmare indica a loja mais próxima
  └── "Quero revender"   → formulário de proposta comercial
```

Ganho colateral: **todo consumidor vira conversa**, não clique perdido num mapa. Para uma operação de representação, isso é melhor do que um localizador de lojas — e é honesto com a decisão "nunca vender direto".

---

## 3. Página a página

### 3.1 Home `/`

O briefing é explícito: **"banner, as quatro marcas em destaque com logo, e duas portas de entrada. Nada mais."**

**Essa contenção está certa e deve ser defendida.** É o que separa esta home de qualquer site de representante — e é uma decisão de design forte o bastante para sustentar o resto.

```
┌──────────────────────────────────────────────┐
│                                              │
│              [ banner / vídeo ]              │
│      Móveis, sombra e conforto para a        │
│         área externa. Sul do Brasil.         │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│   MARÊ      GDA      BUX      TRISOL         │  ← logos em monocromia
│                                              │
├──────────────────────────────────────────────┤
│  ┌────────────────────┬────────────────────┐ │
│  │ Sou arquiteto      │ Quero comprar      │ │
│  │ ou designer     →  │ ou revender     →  │ │
│  └────────────────────┴────────────────────┘ │
└──────────────────────────────────────────────┘
```

- **Banner** — a peça que define o site. Depende inteiramente da fotografia (ver `acervo/inventario.md` §2). Se houver material em alta, é aqui que ele vai
- **As quatro marcas** — logos monocromáticos, tamanho óptico equalizado. Cada um leva a `/representadas/[marca]`
- **As duas portas** — a promessa precisa ser cumprida: o que está atrás de cada uma tem que ser realmente diferente

> 🟡 **Sobre a segunda porta:** ela ainda junta consumidor e lojista, que agora têm destinos opostos (loja vs. proposta comercial). Recomendo **manter as duas portas na home** — a simetria "eu especifico / eu compro" é boa — e **bifurcar no clique**: a porta B abre uma página curta com dois caminhos claros. Preserva a home enxuta e resolve o conflito uma camada abaixo.

### 3.2 Quem somos `/quem-somos`

Objetivo: dar lastro. 26 anos, três estados, quatro marcas.

- A empresa e a história — 1999, Florianópolis, o que mudou em 26 anos
- **Projetos realizados** — o conteúdo mais valioso do site, porque é o único exclusivamente da Belmare
- Território: PR · SC · RS

> ⚠️ Sem fotos de projeto, esta página vira texto institucional vazio. É a página que mais depende de material que ainda não temos (**P43**).

### 3.3 Representadas `/representadas` → `/representadas/[marca]`

Índice com as quatro marcas. Cada uma tem **uma página, e essa página é tudo o que a marca tem**:

```
/representadas/mare-mobilia

  Marê Mobília                     [ Baixar catálogo · PDF 24 MB ]
  o móvel de autor · Cambé/PR

  Sobre a fábrica · Designers que assinam · Materiais e tecnologia

  Peças em destaque          Categoria ▾            24 peças  ▪▪ ▪▪▪
  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
  │      │ │      │ │      │ │      │
  └──────┘ └──────┘ └──────┘ └──────┘
   Saara    Jubarte   Ypê      Manacá

  Arquivos 3D da Marê →      Falar com a Belmare →
```

- Sobre a fábrica, designers que assinam, materiais e tecnologia **quando a fábrica declara** — é texto institucional, não campo estruturado
- **Grid de peças em destaque** com filtro **de categoria, dentro da marca** (ver §4)
- **Download do catálogo em PDF** — ação principal, sempre visível
- Alternador de densidade do grid (varrer muitas peças / olhar uma de perto) — padrão da In Common With, ver `referencias.md`
- Sem página de produto individual ✅
- ~~E-mail comercial direto~~ → ✅ **substituído por WhatsApp + formulário da Belmare**

**Esta é a página que também vende a Belmare para as fábricas.** Um diretor comercial de uma quinta marca vai olhá-la para decidir se entrega o Sul do Brasil para ela. Vale tratamento editorial — não logo num grid.

Matéria-prima já levantada: Marê tem **8 designers**, GDA tem **Sérgio Matos e Guto Indio da Costa**, Bux tem **Hugo Evandro**, Trisol tem especificação técnica de performance.

**Categorias — o vocabulário é de cada marca, e não se normaliza:**

| Marca | Primeiro nível | Segundo nível |
|---|---|---|
| **Marê** | — | sofás, chaises, poltronas, bancos, mesas (centro/lateral/jantar/apoio), cadeiras, banquetas, bistrô, aparadores, espreguiçadeiras, puffs, recamier, carrinho bar, luminárias, acessórios |
| **GDA** | externo · interno | sofás, poltronas, cadeiras, banquetas, espreguiçadeiras, mesas |
| **Bux** | ❓ a definir com a fábrica | |
| **Trisol** ✅ | laterais · centrais | 5 modelos: Zuri, Solene · Vitta, Pub, Brisa |

Como o filtro nunca sai da marca, **cada fábrica pode usar as próprias palavras**. Não é preciso reconciliar "espreguiçadeira" da Marê com "chaise" da Bux, nem esperar a Bux definir a taxonomia dela para publicar as outras três. Isso destrava a publicação marca a marca.

### 3.4 Catálogos `/catalogos`

Uma página, uma lista. Os PDFs, em mono, com o que se precisa saber antes do clique:

```
/catalogos

  MARÊ MOBÍLIA     Catálogo geral        PDF · 24,0 MB · 2025
  GDA MÓVEIS       Catálogo geral        PDF · 18,2 MB · 2025
  BUX GARDEN       ❓
  TRISOL           Ombrelones 2026       PDF ·  6,4 MB · 2026
```

Mesmo padrão de `/arquivos-3d`: **formato e peso declarados antes do clique**. Sem subpágina, sem grid, sem filtro — as peças vivem na página da marca (§3.3), e o detalhe vive dentro do PDF.

### 3.5 Arquivos 3D `/arquivos-3d`

Biblioteca por formato (SketchUp, DWG, Revit, 3ds), organizada por marca. Mais acabamentos e tecidos.

**É o ativo que prende o arquiteto** — e o gatilho natural de captura de lead.

Modelo: lista por marca, cada arquivo com **formato e tamanho declarados antes do clique** ("SKP · 8,4 MB") — padrão SIGMA, ver `referencias.md`. Respeito com quem está em obra com internet ruim.

> ⚠️ A **GDA já está na Casoca**, plataforma gratuita e dominante. A biblioteca da Belmare só se justifica se entregar o que a Casoca não entrega: **as quatro marcas juntas, com acabamentos e tecidos, e uma pessoa do outro lado**. Ver `audiencias.md` §2.

### 3.6 Arquitetos `/arquitetos`

Destino da porta A. Não é uma página de venda — é um **hub de trabalho**: catálogos, arquivos 3D, acabamentos, e o canal direto com a Belmare.

Tom: direto e técnico. Arquiteto reconhece bajulação à distância.

### 3.7 Contato `/contato` — destino da porta B

Uma página, dois caminhos:

| Caminho | Ação | O que a Belmare faz |
|---|---|---|
| **Quero comprar** | WhatsApp | Indica a loja mais próxima, ou atende diretamente a dúvida |
| **Quero revender** | Formulário | Recebe a proposta e responde com condições |

Mais o básico: endereço em Florianópolis, telefones, território (PR · SC · RS), CNPJ.

> ❓ **P16 — Há cidades ou regiões abertas para novos revendedores hoje?** Vira a chamada do caminho "quero revender". Sem isso, ele é genérico.

---

## 4. ✅ DECIDIDO (30/07/2026) — **o site é uma árvore, e a raiz é a marca**

> **Cada coisa no site tem exatamente um pai. Nada atravessa.**

Esta decisão substitui o eixo transversal de material, que estruturava as versões anteriores deste documento, de `marca.md` e de `referencias.md`. **O eixo de material está cancelado** — como taxonomia, como filtro, como navegação e como sistema de identidade.

### Por que ele caiu

Não foi por gosto. Foi por dado.

| Motivo | Fato |
|---|---|
| **O dado não existe** | A matriz marca × material tem **4 de 32 células preenchidas** — Trisol declara metal e têxtil, GDA declara metal, Bux declara têxtil. A **Marê não declara material em lugar nenhum**, e é a marca com mais peças. Um filtro com 12% de cobertura não filtra: mente para quem confia nele |
| **Preencher é trabalho oculto sem dono** | As 28 células restantes só se preenchem **peça a peça, à mão**, por alguém da Belmare ou das fábricas. Ninguém se comprometeu com isso — e ❓ P62/P63 registram que não se sabe sequer se há quem alimente o CMS |
| **Exigia um acordo entre quem não se fala** | O filtro transversal só funciona com **vocabulário compartilhado** entre quatro fábricas que não se falam. Basta uma chamar de "tecido náutico" o que a outra chama de "corda" para o filtro quebrar em silêncio |
| **Travava a publicação inteira** | Enquanto a matriz não fechasse, **nenhuma marca podia ir ao ar completa**. A parte mais fraca do dado segurava a parte mais forte |
| **No CMS, custa caro** | Taxonomia global + relação n:n + normalização entre fábricas. Cadastrar uma peça virava um ato de classificação. Na árvore, é digitar o que a fábrica já diz |

### O que se perde, e onde volta

Perde-se o argumento "atravessar as quatro marcas por material" **como interface**. Ele volta onde sempre esteve de verdade: **em texto e em pessoa.** Quatro fábricas, um interlocutor, três estados — a Belmare atravessa as marcas porque **alguém atende**, não porque existe um filtro. Isso é verificável hoje, não depende de dado que não temos, e continua sendo o §1 deste documento.

### A árvore

```
Marca ─────────────┬── Peça em destaque      (pertence a 1 marca)
                   ├── Arquivo 3D            (pertence a 1 marca)
                   ├── Acabamento            (pertence a 1 marca)
                   └── Catálogo PDF          (campo da marca, não coleção)

Projeto ──────────── cita marcas; não pertence a nenhuma
Página ───────────── textos fixos
```

E a navegação é a descida por ela:

```
Home → Representadas → uma marca → suas peças · seu PDF · seus arquivos 3D → Contato
```

### A peça em destaque, agora

```
Peça (destaque)
├── nome
├── marca        → uma, obrigatória
├── categoria    → do vocabulário DA PRÓPRIA MARCA
├── foto
├── ambiente     → externo | interno   (só a GDA usa)
└── materiais    → TEXTO LIVRE, opcional. "Alumínio fundido e corda náutica"
```

O campo `materiais` sobrevive porque o arquiteto pergunta do que a peça é feita — mas ele é **legenda descritiva, não estrutura**: não é lista fechada, não filtra, não navega, não vira `/catalogos?material=`. Se a fábrica não informou, fica vazio, e nada quebra.

Filtro no site: **categoria, dentro da marca.** Só isso.

**Cinco campos e meio.** Uma peça se cadastra em dois minutos, sem consultar tabela de vocabulário. Vinte peças por marca = 80 registros — trabalho de dias.

O que isso preserva:
- ✅ Um catálogo navegável e indexável pelo Google
- ✅ O PDF como destino de quem quer o detalhe
- ✅ Publicação **marca a marca** — a Trisol pode ir ao ar completa enquanto a Bux ainda nem respondeu

> ~~❓ P66 — o filtro de materiais ganha "olefina" e "poliéster"?~~ ✅ **Morta.** Não há filtro de materiais.
> ~~❓ P21 — quem informa o material de cada produto da Marê?~~ ✅ **Morta.** Ninguém precisa informar.
> ~~❓ P26 — confirmar a matriz material × produto da GDA?~~ ✅ **Morta.** Não há matriz.

---

## 5. Modelo de conteúdo do CMS 🟡

Cinco coleções. Cada uma com **um pai só** — a coluna "aponta para" nunca tem duas setas.

```
Marca              nome · slug · logo · o que resolve · base (cidade/UF) ·
                   texto institucional · designers[] · catálogo PDF ·
                   ano do catálogo · ordem

Peça               nome · MARCA → · categoria · foto · ambiente ·
(destaque)         materiais (texto livre, opcional)

Arquivo3D          nome · MARCA → · formato · arquivo · tamanho

Acabamento         nome · MARCA → · tipo (tecido/pintura) · amostra

Projeto            nome · local · ano · arquiteto · marcas citadas[] ·
                   fotos · publicável (sim/não)

Página             textos de home, quem somos, arquitetos, contato
```

`Loja` fica para a fase 2, junto com "Onde comprar".

**Três consequências que valem o documento inteiro:**

1. **O catálogo virou campo, não coleção.** Uma marca tem um PDF. Não precisa de coleção, de página própria nem de relação — precisa de um upload e um número de MB.
2. **Nenhuma coleção aponta para duas.** É o que torna o painel navegável por quem não é técnico: abre a marca, e tudo dela está ali dentro.
3. **O schema aceita N marcas, não exatamente quatro** (❓ P18). Nada no modelo assume o número quatro — nem no CMS, nem nas rotas, nem no layout.

### ✅ DECIDIDO (30/07/2026) — CMS gratuito

**Recomendação: [Payload CMS 3](https://payloadcms.com)** — open source (MIT), gratuito para sempre, **roda dentro do próprio app Next.js** (sem serviço externo nem assinatura). Painel de edição excelente e em português. Precisa de um banco Postgres, que sai de graça no Neon ou Supabase, e de storage para os binários (Vercel Blob no plano gratuito).

Custo real: **R$ 0** até um volume muito acima do que este site vai ter.

| Alternativa | Avaliação |
|---|---|
| **Sanity** | Menos trabalho de infraestrutura (é hospedado), editor ótimo. Mas é *plano gratuito* de um produto pago — as regras podem mudar, e há limite de banda de assets |
| **Keystatic / Tina** (git-based) | Os mais "gratuitos" de todos, sem banco. ⚠️ Mas guardam conteúdo no repositório — péssimo para os PDFs de catálogo, fotos em alta e arquivos 3D deste projeto. Ver `restricoes.md` §5 |
| **Directus / Strapi** | Bons, mas exigem servidor próprio para rodar — mais manutenção do que Payload embutido no Next |

Payload ganha porque é **genuinamente gratuito** (não é tier de produto pago), não adiciona serviço para manter, e lida bem com upload pesado — que é justamente o que este site tem.

---

## 6. Navegação

**Topo:** `Quem somos · Representadas · Catálogos · Arquivos 3D` + WhatsApp

**Rodapé:** as quatro marcas · contato e endereço · território (PR/SC/RS) · Instagram · política de privacidade · CNPJ

🟡 `/arquitetos` fica **fora do menu** — é destino da porta da home, não item de navegação. Isso mantém o topo curto (quatro itens) e preserva o peso das portas.

---

## 7. Fluxo de lead ✅

```
        Home / marca / catálogo / 3D
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
   WhatsApp                Formulário
   mensagem                     │
   pré-preenchida               ▼
   por contexto            E-mail Belmare
        │                       +
        ▼                  cópia registrada
   Belmare responde             │
        │                       ▼
        └──────────────►  Belmare responde
                                │
                                ▼
                       aciona a fábrica
```

- WhatsApp com texto pré-preenchido por página — qualifica o contato sem pedir nada a mais
- Formulário via serviço de envio confiável (Resend ou similar); `mailto:` perde lead
- Campo oculto de origem: qual página, qual marca
- **Guardar cópia** além do e-mail — é o embrião da base de dados da empresa

> ✅ **Número e e-mail ficam mockados por enquanto** (30/07/2026) — irrelevantes para desenhar e construir. Centralizar num único arquivo de configuração para trocar num só lugar depois.

---

## 8. URLs e SEO

```
/representadas/mare-mobilia
/representadas/gda-moveis
/representadas/bux-garden
/representadas/trisol
```

Uma URL por marca — não duas. Um endereço canônico por assunto é a versão SEO da mesma decisão do §4: quando o mesmo conteúdo mora em dois ramos, os dois competem entre si na busca e nenhum dos dois ganha.

Slugs estáveis, em português, sem acento. Cada página de marca é uma porta de entrada orgânica para quem busca "Marê Mobília Florianópolis" ou "ombrelone Trisol Porto Alegre" — busca que hoje **não leva a lugar nenhum**, já que a Trisol não aparece em nenhum resultado e a Belmare está em 404.

`alt` real em toda foto — as quatro fábricas têm zero. Arquiteto busca imagem no Google.

---

## 9. Fora da v1

Registrado para não voltar como surpresa:

**Fase 2 declarada:** ✅ "Onde comprar" com lista de lojas · página por produto (catálogo nativo).

**Sem previsão:** login e tabela de preços · e-commerce · área do arquiteto com histórico · inglês · blog.

---

## 10. O que decidir para seguir

| # | Pergunta | Status |
|---|---|---|
| **P46b** | Quantas peças em destaque por marca | aberto |
| **P16** | Regiões abertas para novos revendedores | aberto |
| **P41** | Fotos originais em alta | adiado pelo cliente |
| **P62/P63** | Há quem alimente o CMS na Belmare, e com que verba | aberto — **dimensiona o painel** |
| ~~P15~~ | ~~Lojas~~ | ✅ fase 2 |
| ~~P67~~ | ~~Qual CMS~~ | ✅ Payload |
| ~~P21/P26/P66~~ | ~~Material por peça, matriz da GDA, lonas no filtro~~ | ✅ **mortas com o eixo de material** — §4 |
| ~~Linha de design~~ | ~~qual das três direções~~ | ✅ **A — editorial/arquivo**, `referencias.md` §6 |
| ~~P6b~~ | ~~WhatsApp e e-mail~~ | ✅ mockados |
