# Product

<!-- impeccable:product-schema 1 -->

> Este arquivo guarda a **verdade de produto** durável — público, território, canal, escopo. O como está construído é `README.md`; o que as palavras significam é `CONTEXT.md`; como o site se parece é `DESIGN.md`.
>
> **Legenda:** `✅` confirmado pelo cliente ou verificado em fonte pública · `🟡` inferido, ainda não confirmado por resposta direta · `❓` decisão em aberto — **não inventar**.

## Platform

web

## Stack

**Next.js 16.2.12** (App Router), **React 19.2.4** com React Compiler ativo, **Tailwind CSS v4**, **TypeScript 5**, **pnpm**.

- ✅ **CMS: Payload 3.86** — open source (MIT), roda dentro do próprio app Next, sem serviço externo. Site e painel na mesma aplicação: `src/app/(frontend)` e `src/app/(payload)`.
- ✅ **Banco Postgres no Neon**, plano gratuito — o conteúdo são algumas centenas de linhas.
- ✅ **Binários no Cloudflare R2**, com envio direto do navegador para o bucket: a função serverless da Vercel recusa corpo acima de 4,5 MB e o catálogo tem 24 MB. Nenhum binário pesado vai para o git.
- ✅ Hospedagem **Vercel Pro** (US$ 20/mês — o plano Hobby proíbe uso comercial). ❓ P61: quem controla DNS e e-mail `@belmare.com.br`; trocar sem cuidado derruba o e-mail da empresa.

## Users

### Primário — arquiteto e designer de interiores do Sul ✅
Projeta residências de alto padrão, casas de praia, coberturas, condomínios, pousadas e restaurantes em PR, SC e RS. **Não compra: especifica.** O cliente dele paga. É multiplicador — um arquiteto bom coloca a marca em 5–20 projetos por ano.

Seu trabalho, em ordem: encontrar a peça que resolve um vão e um uso; especificar com segurança (medida, material, acabamento, comportamento ao sol/chuva/maresia); **desenhar com ela hoje** — precisa do bloco 3D agora, não numa resposta de e-mail amanhã; defender a escolha para o cliente; e não se queimar. Seu maior medo não é preço — é **atraso e peça errada na obra**, porque a reputação em jogo é a dele.

Perguntas reais que ele faz: medida exata e ficha cotada · esse tecido aguenta maresia, desbota, como limpa · a corda náutica solta cor, mofa em Floripa · prazo, e se eu precisar de 12 cadeiras · faz em outra cor, tem carta de acabamentos · tem bloco 3D, em qual formato · onde meu cliente vê pessoalmente · entregam e montam, tem assistência · quanto custa mais ou menos (**faixa**, não tabela).

### Secundário — consumidor final ✅
Quer uma peça, decide por desejo, pergunta preço e prazo, teme "vai chegar diferente da foto". **A Belmare nunca vende para ele diretamente** — roteia para a loja.

### Secundário — lojista e revendedor ✅
Quer uma linha inteira, decide por rentabilidade, pergunta margem, pedido mínimo e exclusividade, teme "vou estocar e encalhar". Ciclo de meses, ticket de dezenas de peças.

⚠️ Consumidor e lojista têm economias **opostas** e não podem ser atendidos pelo mesmo conteúdo. A home mantém duas portas ("eu especifico" / "eu compro"); a segunda **bifurca no clique**, uma camada abaixo.

### Terciário — as próprias fábricas ✅
Público real e não citado no briefing original: as quatro representadas e as próximas. Uma fábrica escolhe representante por percepção de profissionalismo. A página de representadas é, na prática, a peça de vendas da Belmare **para conquistar e reter marcas**. Custo marginal disso é quase zero — basta tratamento editorial.

> ⚠️ **Revisado em 05/08/2026.** Esta frase terminava em "basta tratamento editorial **em vez de logo num grid**", e a segunda metade caiu por decisão de produto: o logotipo da fábrica passou a ser campo do painel (`Representada.logotipo`, coleção `Logotipos`) e encabeça o cartão dela na galeria da home e a ficha dela nos registros de `/representadas`. **O que a frase de fato protegia continua de pé, e é o grid, não o logo:** uma fileira de marcas soltas é diretório de fornecedor e não diz o que fábrica nenhuma faz. Aqui a marca sempre encabeça um objeto que diz — a fotografia da linha, a frase do `resolve`, o fato técnico. Três regras vinculantes nasceram com a reversão: o site **não transforma a marca de terceiro** (sem recolorir, sem filtro, sem recorte); a marca **nunca encosta no nome escrito** da fábrica; e o vetor é publicado por `<img>`, nunca em linha. Ver `DESIGN.md → Logotipo` e `collections/logotipos.ts`.

## Product Purpose

Site institucional e de geração de lead da **Belmare** (Bello Mare Mercantil Ltda), representação comercial de mobiliário de alto padrão para área externa, Florianópolis/SC, **aberta em 22/04/1999** ✅.

> ⚠️ **O tempo de casa não é escrito neste arquivo, nem em lugar nenhum.** Este documento dizia "26 anos", contagem correta em 2025 e errada desde 22/04/2026. A única fonte é `anosDeMercado()` em `src/lib/site.ts`, que conta anos completos a partir da data de abertura com `date-fns`. Toda página que exibe o número declara `revalidate`, porque a contagem é avaliada no build. **Não reescrever o número aqui.**

Hoje a empresa **não tem site** — `belmare.com.br` retorna 404 ✅. O ativo real da Belmare não é estoque, é **relacionamento e território**: mais de duas décadas de rede de arquitetos, lojistas e obras no Sul. O site existe para converter esse ativo invisível em algo demonstrável.

Objetivo comercial, em ordem 🟡 (❓ P9 — ordem proposta, não confirmada):

1. **Capturar e qualificar o arquiteto** via biblioteca 3D.
2. **Recrutar lojistas** nos pontos cegos de PR/SC/RS.
3. **Rotear o consumidor final** para a loja — sem canibalizar o revendedor.
4. **Reposicionar a Belmare** de "representante" para *a* curadoria de área externa do Sul.

Como saberemos que funcionou 🟡: downloads de 3D/mês · leads qualificados/mês por porta · cadastros de arquiteto na base própria · **tempo até a primeira resposta** · pedidos com origem declarada "site". ❓ P8 — não existe baseline de contatos/mês. ❓ P10 — não se sabe se a Belmare consegue marcar "origem: site" no pedido; sem isso o site nunca prova o próprio ROI.

## Positioning

> **A Belmare não representa quatro marcas. Ela resolve a área externa inteira de um projeto.**

Quatro fábricas que não falam entre si, três estados, **um interlocutor**. O portfólio fecha um raciocínio completo — não é uma lista de fornecedores:

| Marca | Resolve |
|---|---|
| **Marê Mobília** | o móvel de autor |
| **GDA Móveis** | a estrutura em alumínio |
| **Bux Garden** | o conforto e o têxtil de performance |
| **Trisol** | a sombra |

O que nenhuma vizinha pode copiar: **um interlocutor único para as quatro**. Isso se prova em texto e em atendimento — na abertura, em "quem somos", no tom de cada página de marca e na pessoa que responde o WhatsApp em minutos.

> ⚠️ **Reversão registrada — 30/07/2026.** Houve uma decisão anterior de transformar esse argumento em mecanismo de interface: um **eixo transversal de material** atravessando as quatro marcas, servindo ao mesmo tempo de taxonomia, de filtro e de sistema de identidade. **Foi revertida no mesmo dia.**
>
> A matriz marca × material tem **4 de 32 células preenchidas** — e a Marê, a marca com mais peças, não declara material em lugar nenhum. Um eixo de navegação com 12% de cobertura não organiza o acervo: mente sobre ele. O raciocínio completo, e o modelo que ficou no lugar, estão em [`briefing/estrutura.md`](briefing/estrutura.md) §4.

Contexto competitivo ✅: os sites das quatro representadas são o piso do segmento — WordPress, até 5 famílias tipográficas simultâneas, **zero `alt` em qualquer imagem**. Um site sério aqui não compete: destoa.

## Operating Context

### Território ✅
**Toda a Região Sul — PR · SC · RS**, igual para as quatro marcas. O site fala "Sul do Brasil" como promessa única, sem qualificar território por marca.
⚠️ O site da Marê lista "Belrame Representações" no Paraná com o celular da Belmare — erro de digitação deles, vale pedir correção.

### Canal de venda ✅
**A Belmare nunca vende direto ao consumidor. Sempre através de loja.** O site **não vende e não dá preço**. Isso resolve o conflito de canal: quem revende não aceita ser subcotado por quem o abastece.

### Destino do lead ✅ — zona mais crítica do projeto
**Todo lead passa pela Belmare.** O e-mail comercial das fábricas **não é exposto** em lugar nenhum. Um representante que se desintermedia do próprio funil está construindo o site do concorrente: perde a comissão, perde o dado, e entrega o cliente de graça.

Consequência: cada página de marca termina em contato da Belmare, não em `mailto:` da fábrica. E o tempo de resposta vira crítico — lead exclusivo não tem plano B.

### Canais de contato ✅ — dois, sem CRM nesta fase
| Canal | Uso |
|---|---|
| **WhatsApp** | Contato imediato. Presente nas páginas de marca, no rodapé e como ação persistente |
| **Formulário → e-mail** | Contato estruturado, via serviço de envio confiável (Resend ou similar). `mailto:` puro perde lead |

- WhatsApp com **mensagem pré-preenchida por contexto** (`wa.me/…?text=…`): quem clica na página da Trisol chega dizendo de onde veio. Custo zero, ganho grande de qualificação.
- **Campo oculto de origem** (qual página, qual marca) no formulário.
- **Guardar cópia dos envios** além do e-mail — é o embrião da primeira base de dados da empresa.
- ✅ **Número de WhatsApp e e-mail ficam mockados por enquanto**, centralizados num único arquivo de configuração para trocar num só lugar depois. ❓ P6b — valores reais pendentes.
- ❓ P58/P59 — onde os leads ficam armazenados e por quanto tempo.

### Arquitetura do site ✅ — 9 rotas, uma árvore
```
/                              Home
├── /quem-somos                Empresa, história, projetos realizados
├── /representadas             Índice das marcas
│   └── /representadas/[marca] A marca inteira: sobre, designers, peças em
│                              destaque, catálogo PDF, arquivos 3D dela
├── /catalogos                 Os PDFs — lista plana, sem subpágina
├── /arquivos-3d               Biblioteca por marca e formato + acabamentos
├── /arquitetos                Porta A — hub de quem especifica
├── /contato                   Porta B — comprar ou revender
└── /politica-de-privacidade
```

**Regra estrutural ✅ — cada coisa tem exatamente um pai, e nada atravessa.** `/catalogos/[marca]` foi eliminado: era um segundo índice das mesmas marcas, e obrigava quem já estava na Marê a voltar e descer pelo outro ramo para ver as peças dela. Agora existe **uma marca, uma página**, e ela carrega tudo. `/catalogos` permanece porque "catálogo" é a palavra que o arquiteto procura, e vira o que de fato é: a lista dos PDFs com marca, ano e peso.

- **Navegação:** topo com `Quem somos · Representadas · Catálogos · Arquivos 3D · Contato` + WhatsApp. Rodapé com as quatro marcas, contato e endereço, território, Instagram, política de privacidade, CNPJ.
- ✅ `/arquitetos` fica **fora do menu** — é destino da porta da home, não item de navegação.
- ✅ **`/contato` ENTROU no menu em 06/08/2026, por decisão do cliente.** Esta linha dizia, em 🟡, que as duas portas ficavam fora "para preservar o peso das portas". A metade que sobrou virou ✅ no mesmo dia, porque a assimetria é o argumento: `/arquitetos` é um hub de material e não pede dado de ninguém, enquanto `/contato` passou a carregar o **formulário de proposta comercial** — o único lugar do site onde um lead se cadastra, e a razão de o objetivo 2 ("recrutar lojistas") ter uma superfície própria. Uma página de captura alcançável só pela porta da home e pelo rodapé está escondida de quem chegou por qualquer uma das outras oito rotas.
- Slugs estáveis, em português, sem acento: `/representadas/mare-mobilia`. **Uma URL canônica por marca**, não duas.
- ✅ A home é deliberadamente contida: banner, as quatro marcas, duas portas. **Nada mais.** Essa contenção é decisão do cliente e deve ser defendida.
- ✅ Sem "Onde comprar" na v1 — lista de lojas é volátil demais. A Belmare vira o roteador: o consumidor fala pelo WhatsApp e **ela indica a loja**. As duas metades da porta B convergem para `/contato`.

## Capabilities and Constraints

### As quatro representadas ✅

| Marca | Base | Categoria | Ativo editorial |
|---|---|---|---|
| **Marê Mobília** | Cambé/PR | Mobiliário externo de autor | **30+ coleções, 8 designers assinantes** — Daniela Ferro, Fabrício Roncca, Pepê Lima, Fernando Zanardi, Claudia Mazzieri, Camila Forbeck, Estúdio Galho, Estúdio Marê. Nomes de coleção vindos da natureza brasileira (Jubarte, Manacá, Ypê, Marumbi, Saara). A página deve ser organizada **por designer**, não só por categoria |
| **GDA Móveis** | Cláudio/MG | Alumínio fundido e tubular, externo + interno | **Sérgio Matos e Guto Indio da Costa**. Alumínio fundido **100% reciclado**; Cláudio/MG é o maior polo de fundição artesanal da América Latina; personalizados em **30 dias**. Fundição artesanal + reciclado + 30 dias é a história mais vendável do portfólio |
| **Bux Garden** | Birigui/SP | Luxo para área externa | **Hugo Evandro**, designer interno — repertório escandinavo e japonês com toque brasileiro. BUX = "Best User Experience". Única das quatro com site bilíngue. Diferencial declarado é **performance têxtil**: repelência, UVA/UVB, antimofo, pet friendly |
| **Trisol** | ❓ (DDD 48) | Ombrelones de alta performance — **a sombra** | 5 modelos em taxonomia pronta em dois níveis. Laterais: **Zuri**, **Solene**. Centrais: **Vitta**, **Pub**, **Brisa**. Alumínio, ferragem **inox 304**, lonas olefina ou poliéster pro, resistência a vento 30–80 km/h, garantia 6–36 meses. **Catálogo 2026 pronto** — a marca mais fácil de publicar |

- ❓ P18 — **não se sabe se o portfólio vai crescer.** Sem resposta, o modelo de dados e as rotas devem suportar **N marcas**, não exatamente quatro; a decisão de projetar layouts para quatro é reversível, a de travar o schema não é.
- ❓ P65 — relação da Trisol com a Belmare (mesmo DDD de Florianópolis).

### Catálogo ✅ — somente PDFs
**Não haverá página de produto individual.** O detalhamento (medidas, acabamentos, especificação) vive no PDF de catálogo de cada marca. O site não replica o catálogo — **ele o distribui**. Essa decisão eliminou ~1.000–2.000 campos de ficha técnica e o maior risco de prazo do projeto.

O CMS guarda **peças em destaque** com campos leves 🟡:

```
Peça (destaque)
├── nome
├── marca       → uma, obrigatória
├── categoria   → do vocabulário DA PRÓPRIA MARCA
├── foto
├── ambiente    → externo | interno   (só a GDA usa)
└── materiais   → TEXTO LIVRE, opcional
```

`materiais` sobrevive porque o arquiteto pergunta do que a peça é feita, mas é **legenda descritiva, não estrutura**: lista aberta, não filtra, não navega, e vazio não quebra nada. ❓ P46b — quantas peças por marca (sugestão: 12–20; a Trisol resolve com 5, que é a linha inteira).

### Modelo de conteúdo do CMS ✅ — cinco coleções, uma árvore
`Marca` é a raiz. `Peça` · `Arquivo3D` · `Acabamento` pendem dela, cada uma com **um pai só**. `Projeto` cita marcas sem pertencer a nenhuma. `Página` guarda os textos fixos. `Loja` fica para a fase 2.

Três consequências que valem o modelo inteiro:
1. **O catálogo é campo da marca, não coleção** — um upload e um número de MB.
2. **Nenhuma coleção aponta para duas.** É o que torna o painel navegável por quem não é técnico: abre a marca, e tudo dela está ali dentro.
3. **Publicação marca a marca** — a Trisol vai ao ar completa sem esperar a Bux responder.

Detalhe completo em [`briefing/estrutura.md`](briefing/estrutura.md) §5.

### Taxonomia de categorias — de cada marca, e não se normaliza
| Marca | Nível 1 | Nível 2 |
|---|---|---|
| **Marê** ✅ | — | sofás, chaises, poltronas, bancos, mesas (centro/lateral/jantar/apoio), bases de mesa, cadeiras, banquetas, bistrô, aparadores, espreguiçadeiras, puffs, recamier, carrinho bar, luminárias, acessórios |
| **GDA** ✅ | externo · interno | sofás, poltronas, cadeiras, banquetas, espreguiçadeiras, mesas |
| **Bux** ❓ | a definir com a fábrica (P30) | — |
| **Trisol** ✅ | laterais · centrais | Zuri, Solene · Vitta, Pub, Brisa |

✅ Como o filtro **nunca sai da marca**, cada fábrica usa as próprias palavras. Não é preciso reconciliar "espreguiçadeira" com "chaise", nem esperar a Bux para publicar as outras três. ~~❓ P66~~ e ~~❓ P21/P26~~ morreram com o eixo de material.

### Biblioteca 3D
Por formato (SketchUp, DWG, Revit, 3ds) e por marca, mais acabamentos e tecidos. **É o ativo que prende o arquiteto.** Cada arquivo declara **formato e tamanho antes do clique** ("SKP · 8,4 MB") — respeito com quem está em obra com internet ruim.

⚠️ Alerta competitivo ✅: a **Casoca** (`casoca.com.br`) é a plataforma dominante e gratuita de blocos 3D no Brasil, e a **GDA já está lá**. A biblioteca própria só vence se entregar o que a Casoca não entrega: **as quatro marcas juntas, com acabamentos e tecidos, curadas para o Sul, e uma pessoa do outro lado**.

❓ **P11 — o download exige cadastro?** Não respondido. Recomendação do briefing: cadastro leve (nome, e-mail, escritório, cidade) com **download imediato**, sem aprovação manual. Construir a biblioteca de modo que o gate possa ser ligado depois sem refazer a seção.

### Idioma
🟡 **PT-BR apenas na v1.** Público 100% brasileiro; inglês dobra o custo de conteúdo e não serve o objetivo comercial (❓ P19).

### Metas de performance ✅
Site de mobiliário é site de imagem, e imagem é onde a performance morre.
- **LCP < 2,5s** em 4G — `next/image` com AVIF/WebP, `sizes` correto, `priority` só no hero
- **CLS < 0,1** — toda imagem com dimensão declarada
- **INP < 200ms** — cuidado com filtro que re-renderiza 150 cards
- Fontes via `next/font`, `display: swap`, subset latino, **no máximo duas famílias**

### LGPD ✅
O site coleta dado pessoal em pelo menos dois pontos (formulário de lead, cadastro de 3D). Obrigatórios: Política de Privacidade nomeando o controlador (Bello Mare Mercantil Ltda, CNPJ 03.133.708/0001-09); base legal explícita e escrita; **declaração de compartilhamento com as fábricas** se o lead for repassado; consentimento de marketing em checkbox separado e nunca pré-marcado; canal de titular; minimização (nome, e-mail, cidade e escritório bastam — CPF não).

Recomendação: **analytics sem cookie** (Vercel Analytics ou Plausible) + consentimento explícito só no formulário. Cumpre a LGPD **sem banner de cookie** — menos atrito e melhor primeira impressão.
❓ P57 — não há advogado ou contador designado para revisar a política. A minuta pode ser redigida, mas quem assina o risco é a empresa.

### Manutenção
❓ P62/P63/P64 — não se sabe com que frequência o catálogo muda de verdade, **se há alguém na Belmare disposto a alimentar o CMS**, nem se existe verba de manutenção. ⚠️ CMS que ninguém usa é dinheiro jogado fora e o site desatualiza em seis meses. Vale confirmar antes de dimensionar o painel.

### Prazo e orçamento
❓ P53/P55 — **nenhum dos dois foi informado.** É a lacuna de projeto mais relevante que restou. Registrado como pendência, não estimado.

## Brand Commitments

### Identidade legal ✅
| | |
|---|---|
| Nome fantasia | **Belmare** |
| Razão social | Bello Mare Mercantil Ltda |
| CNPJ | 03.133.708/0001-09 |
| Fundação | 22/04/1999 — tempo de casa calculado, nunca escrito à mão |
| Endereço | Rua Zanzibar do Nascimento Lins, 81 — Trindade, Florianópolis/SC, 88.036-225 |
| Telefones | (48) 3234-6004 · (48) 99137-5030 |
| Sócio | João Padova, desde a fundação |
| Porte | EPP |

### Rebranding ✅ — no escopo, **antes das telas**
O território de marca foi decidido em 30/07/2026 sob a **Direção A — editorial / arquivo**, e está documentado em [`briefing/marca.md`](briefing/marca.md). Registrado aqui como **compromisso vinculante**, sem expansão — as decisões visuais pertencem ao documento de design, não a este arquivo:

| Item | Compromisso |
|---|---|
| **Nome** | **Belmare Representações** — descritor em mono, subordinado ao logotipo |
| **Tipo de marca** | **Logotipo fixo** — wordmark, faixa de hachura invariável e descritor, os três na mesma largura. Um desenho, sempre o mesmo |
| **Tipografia** | **Söhne + Söhne Mono** (Klim Type Foundry) — a grotesca fala, a mono mede. ✅ **Decidido 30/07/2026: construir em Söhne desde já**; licença paga (~US$ 300–600, único) será adquirida **antes do lançamento**. Até os `.woff2` chegarem, `@font-face` declara Söhne com Geist como fallback na própria pilha — arquivo ausente cai para Geist, e a chegada dos licenciados em `public/fonts/` não toca em código. Na licença: migrar para `next/font/local` (preload) e calibrar `size-adjust` com as métricas reais |
| **Paleta** | **Acromática, zero acento.** Fundo off-white `#F5F3F0`, **nunca branco puro** |
| **Elemento gráfico** | **A grade e o fio.** Zero textura, zero ornamento, zero padrão de fundo. A fotografia é a única cor da página |
| **Voz** | **Técnica e direta.** Frases curtas, dado antes de adjetivo, zero bajulação |
| **Movimento** | **Contido e funcional** — revela estrutura, não decora. Sem scroll-jacking, sem parallax gratuito, `prefers-reduced-motion` respeitado |

⚠️ **A voz exige dado real.** Sem número e sem fato, este tom vira seco e vazio.

⚠️ **E dado real não é a mesma coisa que dado interessante.** "Quatro fábricas, um interlocutor, três estados" era verdade, era específico, e mesmo assim foi **rejeitada como copy em 30/07/2026**: contar fábricas e contar interlocutores descreve o **organograma da Belmare**, e ninguém chega a um site de mobiliário querendo saber como o fornecedor se organiza. Era abstrata — não dá imagem, não dá objeto, não responde nada.

**O teste que a substituiu: a frase dá um objeto para o leitor imaginar?** A abertura hoje começa por *"Sofá, mesa, espreguiçadeira e ombrelone."* — quatro objetos que cobrem, por verdade, o que cada representada resolve. O argumento do interlocutor único continua verdadeiro e continua no site; ele vive em **demonstração** (a seção seguinte mostra qual fábrica resolve cada peça) e no atendimento, não em slogan.

❓ **P52 — quem aprova a nova marca além do João Padova?** Maior risco de cronograma: rebranding trava em rodada de aprovação muito mais do que em criação.
❓ Aplicações de marca fora do site (deck comercial, papelaria, Instagram, mostruário) — proposta em `marca.md` §8, escopo não confirmado.

### Presença atual ✅
Facebook `/belmarerepresentacoes`, sob o nome antigo "Bello Mare — Móveis para Jardim, Ombrellones, Móveis de Design e Tapetes". Nenhum site. 🟡 Tapetes aparecem na descrição pública mas não no portfólio das quatro marcas (❓ P2) — o site é a chance de corrigir o posicionamento.

## Evidence on Hand

### O teto fotográfico — a restrição mais séria do projeto ✅
Medições reais nos sites das fábricas:

| Fonte | Dimensão | Uso possível |
|---|---|---|
| Marê — produto | **1300 × 866 px** | card em grid, no máximo meia-tela |
| Marê — banner de home | **1920 × 980 px** | hero a 1× em 1440px; **borra a 2×** |
| GDA — home | 4 imagens no total, a maior é o logo (636 × 89) | nada aproveitável |

Um hero full-bleed a 1440px com DPR 2 pede **2880 px**. A foto de produto da Marê entrega **45%** disso. Não é limitação de layout, código ou talento — é limitação física de pixel.

- ❓ **P41 — fotos originais em alta:** adiado pelo cliente. Segue como o teto de qualidade do projeto. As fotos foram feitas por fotógrafo profissional e os originais em 4000–6000 px quase sempre existem; **um e-mail às fábricas resolve ~80% do problema** e é o pedido de melhor retorno em todo o projeto.
- ❓ **P43 — fotos de projetos entregues pela Belmare:** desconhecido. **É o conteúdo mais valioso que pode existir** — a única prova exclusivamente dela, e o que `/quem-somos → Projetos realizados` exige. Sem isso a página vira texto institucional vazio. **Não inventar projetos, clientes ou obras para preencher.**
- ❓ P47/P48/P49 — direitos de uso das fotos das fábricas, autorização de publicação dos clientes finais e crédito aos arquitetos. Projeto residencial de alto padrão costuma ter cláusula de confidencialidade.

### ✅ DECIDIDO (30/07/2026) — imagens mock via **fal.ai** na fase de construção
Enquanto a fotografia real não chega, o site é construído com **imagens geradas por fal.ai** como placeholder.

Regras que isso impõe:
- Imagem mock **nunca é apresentada como foto real** de produto, fábrica ou projeto entregue — nem em copy, nem em `alt`, nem em legenda.
- As referências ficam **centralizadas e trocáveis num só lugar**, como o WhatsApp e o e-mail mockados. Substituir o acervo não pode virar caça a URLs espalhadas.
- Os mocks são gerados **nas dimensões reais que o layout precisa** (hero em 2880px, card no tamanho do card). O objetivo é projetar contra o teto de qualidade desejado, não normalizar o teto atual.
- Nenhum mock vai para produção sem substituição ou marcação explícita.

### Ordem de coleta ✅
O que pedir ao cliente, em ordem de retorno: 1. fotos originais em alta · 2. fotos de projetos da Belmare · 3. logos vetoriais + autorização de uso · 4. os quatro catálogos PDF atualizados · 5. arquivos 3D · 6. peças em destaque por marca (12–20) · 7. textos institucionais.

⚠️ O que já chegou de cada item não se registra aqui — vira estado velho em uma semana. O painel é a fonte: o que está no CMS, chegou.

## Product Principles

1. **A Belmare resolve a área externa inteira, não representa quatro marcas.** Móvel de autor, estrutura, conforto e sombra sob um interlocutor em três estados. Isso deve ficar óbvio em dez segundos e ser o eixo do site, não uma frase em "Quem somos".

2. **O site é uma árvore com raiz na marca. Nada atravessa.** Cada peça, arquivo 3D e acabamento tem exatamente um pai, e o filtro nunca sai da marca. Isso é o que mantém o CMS cadastrável por quem não é técnico, deixa cada fábrica usar o próprio vocabulário e permite publicar marca a marca. **Nenhuma estrutura do site deve depender de dado que as fábricas não têm** — foi assim que o eixo de material caiu.

3. **O lead é da Belmare, sempre.** Nenhum caminho no site desintermedia o próprio funil. O site nunca vende, nunca dá preço, e roteia o consumidor para a loja — protegendo integralmente o revendedor.

4. **Dado antes de adjetivo.** Toda afirmação é fato verificável: aberta em 22/04/1999, três estados, quatro marcas, alumínio 100% reciclado, 30 dias, inox 304, vento até 80 km/h. Número derivado — como o tempo de casa — sai de função, nunca de literal. **Nada de depoimento, cliente, obra, prêmio, prazo ou número inventado** — o que não existe fica ausente, não é preenchido.

5. **O arquiteto é o público que decide a arquitetura.** Ele volta muitas vezes: o site é ferramenta de trabalho, não peça de campanha. Ficha aberta sem cadastro, arquivo com formato e peso declarados antes do clique, e nada que encante na primeira visita e irrite na décima.

## Accessibility & Inclusion

Meta: **WCAG 2.1 AA** ✅.

Não é burocracia — é diferencial competitivo verificado: **nenhuma imagem em nenhum dos quatro sites das fábricas tem `alt`**. Exigências concretas: contraste suficiente, foco visível, navegação por teclado no filtro do catálogo, e **`alt` real e descritivo em toda foto de produto** — que também é SEO de imagem, e arquiteto busca imagem no Google.

`prefers-reduced-motion` respeitado em todo movimento, por decisão de marca e por acessibilidade.
