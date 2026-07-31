# Referências e anti-referências

`✅` inspecionada nesta pesquisa · `🟡` conhecida do setor, ainda não auditada nesta sessão

---

## 1. O alvo, dito honestamente

A ambição declarada é **nível Awwwards**. Vale registrar o que isso exige de fato, porque é uma decisão de recursos, não de talento:

1. **Fotografia impecável, em alta resolução.** Site premiado de mobiliário é 70% imagem. Hoje o material disponível não sustenta isso — ver `acervo/inventario.md` §2. **Este é o gargalo real.**
2. **Um sistema tipográfico com opinião.** Uma ou duas famílias, escolhidas, com escala consistente.
3. **Movimento com intenção.** Transições que revelam estrutura, não enfeite.
4. **Uma ideia.** Prêmio não vai para "bem feito" — vai para sites que resolvem algo de um jeito que ninguém tinha resolvido.

Não confundir prêmio com objetivo comercial. **Se conflitarem, ganha o comercial.** Um site premiado que não gera lead falhou no que a Belmare está pagando. A boa notícia: neste segmento os dois quase sempre andam juntos — o arquiteto que a Belmare quer atrair é exatamente quem valoriza design excelente.

### A ideia candidata

A Belmare não vende móvel — vende **a área externa inteira resolvida**. Quatro fábricas, um interlocutor, um território.

A primeira leitura disso foi um site organizado por **material atravessando as marcas**, e ela chegou a virar decisão. **Foi revertida em 30/07/2026** — o dado de material não existe no acervo das fábricas, e um eixo de navegação sem dado é uma promessa quebrada em público. O raciocínio completo está em [`estrutura.md`](estrutura.md) §4.

A ideia continua de pé; muda **onde ela vive**. É um argumento de **posicionamento e de atendimento**, não de arquitetura de informação — não precisava virar mecanismo de interface para ser verdade, e virou frágil quando virou.

⚠️ **E também não vira slogan.** A formulação "quatro fábricas, um interlocutor, três estados" foi rejeitada como copy na mesma data: contar a própria estrutura é jargão interno, não dado técnico. O argumento se prova por **demonstração** — a abertura nomeia as peças que uma área externa pede, e a seção seguinte mostra qual fábrica resolve cada uma. O visitante conclui sozinho.

---

## 2. Referências de sistema visual

Fonte: [styles.refero.design](https://styles.refero.design) — sistemas extraídos de sites reais, com tokens.

### ⭐ [70Materia](https://styles.refero.design/style/f22a5ad1-2770-48d5-aff4-d1aaf0b789b8) ✅ — a mais alinhada
"Architectural sample board" — paleta acromática (preto, branco, grafite `#1e1e1e`, cinza `#bababa`), Matter + Matter Mono, raio 0px, sem sombra, sem gradiente, peso 400 exclusivo, **numerais tabulares**.

**Por quê:** o princípio declarado — *"photography carries all chromatic energy"* — é exatamente o que este projeto precisa. Interface neutra, cor só na foto do móvel. Resolve de uma vez o problema dos quatro logos coloridos e devolve protagonismo ao produto. O mono para dados técnicos (medidas, códigos, formatos de arquivo) é perfeito para a ficha do arquiteto.

### ⭐ [Diabla](https://styles.refero.design/style/5528d10f-2e7d-4502-aa49-7bde290e8fe2) ✅ — concorrente direto
Marca espanhola de mobiliário externo. Vermillion `#ed2e38` racionado, fundo `#fcf0f3` (**nunca branco puro**), Helvetica Neue Light a 80–110px com line-height 0.88, **botões só em outline, nunca preenchidos**, zero sombra.

**Por quê:** prova que dá para fazer mobiliário externo com energia cromática **sem** cair no clichê tropical/beach. A regra "um acento cromático, racionado ao extremo, sobre neutro quente" é diretamente aplicável — e o acento poderia vir da marca Belmare renovada.

### [Freitag](https://styles.refero.design/style/d75a643b-a518-4550-b430-679cd989a447) · [teenage engineering](https://styles.refero.design/style/aecf9dda-5cba-4dc7-9e73-59b65d895cdf) ✅ — catálogo industrial
Ambos resolvem **muitos SKUs sem virar e-commerce genérico**. Rigor de catálogo tratado como objeto de design.

**Por quê:** o problema central de "Catálogos de produtos" é densidade — 80 a 150 peças, quatro marcas, dois eixos de filtro. Estes mostram que catálogo denso pode ser bonito.

### [B—Line](https://styles.refero.design/style/3b9ed801-511c-48b6-b516-68b1aa8a36ea) · [Resident](https://styles.refero.design/style/f451c085-f048-4c9c-ae3b-03acc88320ab) · [Ashton Bespoke](https://styles.refero.design/style/34534515-c044-4d37-940d-44352d62ee44) ✅ — registro editorial
"Monospaced editorial museum", "architecture monograph on cream", "stone cathedral of craftsmanship".

**Por quê:** para "Quem somos" e para as páginas institucionais das fábricas. Tom de monografia de arquitetura — que é como o arquiteto gosta de ser tratado.

### [Faire](https://styles.refero.design/style/6fb648be-cc69-4a84-a798-9f0f006922a0) ✅ — B2B
"Warm cream wholesale catalog". Relevante para a porta "quero revender": mostra atacado sem estética de planilha.

---

## 3. Referências de arquitetura e interação

Fonte: Mobbin.

### ⭐⭐ In Common With — **a referência mais importante do projeto** ✅
Marca de iluminação de alto padrão, americana. Tem **exatamente a estrutura que a Belmare precisa**:

- [**Catálogo por categoria**](https://mobbin.com/sites/sections/07c2b97f-3827-4887-b5dc-03e14b017fdb) — categorias como cards fotográficos grandes com contador ("Sconces⁵³", "Pendants²⁹"). Resolve a página de abertura de catálogo com elegância, sem menu-lista.
- [**Listagem com sidebar**](https://mobbin.com/sites/sections/791c6c1a-758c-4c97-aaa0-b90bfdaa1eb0) — navegação de categorias fixa à esquerda, "+ Filter" discreto, **alternador de densidade de grid (S / M / L)** e contador total. O alternador S/M/L é um detalhe pequeno de enorme valor para arquiteto: ele quer varrer muitos itens rápido, depois olhar um de perto.
- [**Ficha técnica + downloads**](https://mobbin.com/sites/sections/6c5ddd6d-bd8e-4cbf-9616-8016064f2bdc) — tabela de specs (dimensões, peso, materiais, certificações) ao lado de uma coluna limpa de downloads: *Tear Sheet · Assembly Guide · 2D Drawing · 3D Drawing*.
- **E um link "Trade" no menu principal** — exatamente a porta "sou arquiteto ou designer" do briefing, validada por uma marca que vive desse público.

> **Recomendação:** adotar o modelo de ficha da In Common With como base da página de produto. Ele resolve, num só lugar, a especificação e o download — e o download é o gatilho de captura de lead.

### [SIGMA — downloads por produto](https://mobbin.com/sites/sections/108e8c19-67bc-463b-9aad-813249b0528f) ✅
Lista em acordeão por produto, cada arquivo com **formato e tamanho declarados** ("PDF 13.7MB"). Modelo direto para a seção "Arquivos 3D" organizada por marca e formato.

**Por quê:** declarar peso e formato antes do clique é respeito com quem tem internet de obra. Detalhe pequeno, confiança grande.

### [Cosmos — grid editorial](https://mobbin.com/sites/sections/57934ff2-ce19-430d-911f-d6c7fb1c8ae0) ✅
Grid de alturas variadas, filtros como texto simples no topo. Como fazer um grid de produtos respirar como galeria, não como marketplace.

### [Programa](https://mobbin.com/sites/sections/5540ec8c-df54-4b4e-9a59-f503d100ba87) ✅
Software feito para designers de interiores. Útil para calibrar **tom de voz com o público arquiteto** — direto, técnico, sem bajulação.

---

## 4. Benchmarks de categoria 🟡

Marcas internacionais de mobiliário externo de alto padrão, para calibrar o teto do segmento. **Não auditadas nesta sessão** — vale revisar antes de citar como decisão:

**Kettal · Gandia Blasco · Tribù · Dedon · Paola Lenti · RODA · Ethimo**

E, em mobiliário de design em geral: **Vitra · Cassina · Minotti · Molteni**.

O que interessa observar em cada uma: como tratam ficha técnica, carta de acabamentos, área "trade/professional" e biblioteca de arquivos — os quatro pontos onde este projeto vai viver ou morrer.

> ❓ **P50 — Há alguma marca ou site que o cliente já admira?** Uma referência que ele escolheu vale mais que dez que eu escolhi.

---

## 5. Anti-referências — o que evitar, e por quê

### 5.1 Os sites atuais das próprias representadas ✅
Levantamento direto (`marcas/*.md`):

| Marca | Problema medido |
|---|---|
| **Marê** | WordPress, 3 famílias tipográficas sem hierarquia, fotos a 1300×866, **zero `alt` em qualquer imagem** |
| **GDA** | WordPress 7.0.2, **5 famílias simultâneas** (Poppins, Open Sans, Exo, Roboto, system-ui), 6 erros de console na home |

**O padrão:** tema de prateleira, tipografia acumulada em vez de escolhida, imagem comprimida, nenhuma acessibilidade. É o piso do segmento — e é uma oportunidade. **Um site sério aqui não compete: destoa.**

⚠️ Isso também significa que o site da Belmare vai ficar **visivelmente melhor que o das fábricas que ela representa**. Politicamente delicado; comercialmente ótimo (vira argumento para conquistar novas marcas — ver `audiencias.md` §4).

### 5.2 Estética "beach club"
Turquesa, gradiente pôr-do-sol, palmeira, fonte manuscrita. Área externa premium se comunica com **contenção** — Diabla e Gandia Blasco provam. O calor vem da fotografia e do material, nunca da paleta da interface.

### 5.3 Grid de logos coloridos
Quatro logotipos de estúdios diferentes, cada um com sua paleta, lado a lado = diretório de fornecedores. O cliente já autorizou monocromia — decisão correta, manter. Ver `marcas/manuais/README.md`.

### 5.4 [Filtro estilo marketplace](https://mobbin.com/sites/sections/c39270b0-f69d-4ab5-9991-b3669ee6ded0) ✅
A sidebar da Klarna (faixa de preço, checkbox de varejista, contadores, badges de desconto) é excelente **para e-commerce de massa** e completamente errada aqui. O arquiteto procura a peça que resolve um vão, não o maior desconto. O único filtro do site é **categoria dentro da marca** (`estrutura.md` §4), e ele deve ser silencioso e tipográfico — In Common With, não Klarna.

### 5.5 Carrossel de banner na home
O que a Marê usa hoje (7 slides). Ninguém vê o slide 4. O briefing pede home enxuta — "banner, quatro marcas, duas portas. Nada mais." **Essa contenção está certa e deve ser defendida** contra a tentação de encher.

### 5.6 Scroll-jacking e loader de 4 segundos
Padrão comum em site "premiado" de 2015. Hoje pesa contra em júri e afunda Core Web Vitals. Movimento sim; sequestro de scroll não.

---

## 6. Direção proposta para a marca Belmare

O cliente autorizou rebranding e não quer ficar preso ao trabalho anterior.

**Ponto de partida conceitual:** *bello mare* — mar bonito. Florianópolis, 26 anos, litoral, área externa. O nome já entrega território, natureza e permanência. É um bom nome — **o problema nunca foi o nome.**

Três direções para explorar:

| Direção | Ideia | Risco |
|---|---|---|
| ✅ **A. Editorial / arquivo** | A Belmare como curadoria. Tipografia protagonista, mono para dado técnico, acromático, foto como única cor. Base: 70Materia + B—Line. | Pode ficar frio — compensar com fotografia calorosa |
| **B. Neutro quente com um acento** | Base areia/off-white (nunca branco puro), um acento cromático racionado ao extremo. Base: Diabla. | O acento precisa ser bem escolhido, não óbvio |
| ~~**C. Material**~~ | ~~A marca como matéria — a identidade nasce do filtro de materiais. O sistema visual é o índice do catálogo.~~ | ❌ **escolhida e revertida em 30/07/2026** — dependia de dado que o acervo não tem. Ver abaixo |

### ✅ DECIDIDO (30/07/2026) — **Direção A: editorial / arquivo**

> ⚠️ **Correção de rumo, mesma data.** A escolha foi primeiro pela **Direção C — Material**, e ela foi **revertida**. O que segue vale; o que estiver em qualquer documento sob "direção C", "sistema de matéria" ou "eixo transversal de material" está cancelado. O motivo, com os números, está em [`estrutura.md`](estrutura.md) §4.
>
> Resumo do porquê: a direção C transformava em sistema de design um dado que **não existe**. A matriz marca × material tem 4 de 32 células preenchidas, e a Marê — a marca com mais peças — não declara material em lugar nenhum. Uma identidade que depende de conhecer a matéria de cada contexto não sabe o que vestir quando a matéria é desconhecida, que é o caso em 88% do acervo. E o custo de fechar o dado recaía sobre uma pessoa na Belmare que ainda nem foi designada (❓ P62/P63).

A Belmare como **curadoria**. Tipografia protagonista, mono para dado técnico, acromático, **a fotografia é a única cor da página**.

**Por que esta:** é a que sobrevive ao acervo real. Não pede dado que as fábricas não têm, não pede foto que ainda não existe, e não trava a publicação de uma marca na lacuna de outra. O rigor vem de tipografia, grade e contenção — três coisas que dependem só de execução, e execução nós controlamos.

#### O que isso significa na prática

| Camada | Decisão |
|---|---|
| **Conceito** | A Belmare como curadoria e interlocutor único. O argumento "quatro fábricas, um interlocutor" é feito **em texto e em atendimento**, não em mecanismo de interface |
| **Base cromática** | Acromática: papel off-white, tinta, grafite, cinza. Zero cor na interface |
| **Cor real** | Vem **da fotografia**, e só dela |
| **Tipografia** | Duas famílias: uma grotesca para texto e display, uma mono para dado técnico (formato de arquivo, medida, contador, ano). Peso e escala fazem a hierarquia, não cor |
| **Elemento gráfico próprio** | **A grade e o fio.** Nenhum ornamento, nenhuma textura de fundo. O que dá identidade é o rigor do alinhamento e o silêncio ao redor da foto |
| **Navegação** | Estritamente hierárquica: marca → peças, PDF e 3D dela. Nenhum eixo transversal |
| **Geometria** | Raio 0, sem sombra, sem gradiente. Rigor de amostrário de arquitetura |
| **Logos das representadas** | Monocromia sobre neutro — subordinados à Belmare, unificados entre si |

#### Riscos assumidos

⚠️ **Pode ficar frio.** É o risco registrado desta direção desde a tabela acima, e a compensação é uma só: **fotografia calorosa e grande**. Isso reforça — não substitui — a prioridade de `acervo/inventario.md` §2 e §6: **foto de móvel em ambiente e foto de projeto entregue**. São as duas que carregam a página inteira.

> Se o orçamento de fotografia for limitado, ele vai **inteiro** para ambientação e projetos entregues. Não há mais macro de textura no escopo — ela existia para sustentar a direção C.

#### Próxima entrega

Território de marca da Belmare sob a direção A: logotipo fixo, tipografia, grade, aplicações. **Antes das telas.**

> ❓ **P52 — Quem aprova a nova marca? Só o João Padova, ou há mais sócios/família?** Continua sendo o maior risco de cronograma do rebranding.

### ✅ DECIDIDO (30/07/2026) — **rebranding primeiro, telas depois**

A marca é fechada **antes** do desenho das telas. É a ordem correta: o sistema visual do site nasce da identidade, não o contrário.

O que isso implica na prática:
- **A próxima entrega não é layout de home — é território de marca.** Naming permanece ("Belmare" é um bom nome; o problema nunca foi o nome), símbolo, tipografia, paleta e princípios
- Das três direções acima, ✅ **A (editorial/arquivo)** é a escolhida; C foi escolhida e revertida no mesmo dia
- O **manual de marca da Belmare** passa a ser entregável do projeto, e vira a base do design system do site
- ⚠️ Alonga o cronograma. Vale amarrar a data-alvo do site já contando com essa etapa — ver `restricoes.md` P53
- Reforça a prioridade de **P39/P40** (onde a marca atual está aplicada, e se existe vetor): define o custo de troca fora do site

> ❓ **P52 — Quem aprova a nova marca? Só o João Padova, ou há mais sócios/família?** Agora é bloqueio de cronograma, não detalhe — rebranding trava em rodada de aprovação com mais frequência do que em criação.

---

## 7. Movimento

Princípio: **movimento revela estrutura, não decora.**

- Transições de página que preservam a imagem do produto entre listagem e ficha
- Filtro que reordena o grid com transição, para o olho não perder o lugar
- Nada de parallax por parallax
- `prefers-reduced-motion` respeitado
- Cada animação paga seu custo em performance — ver `restricoes.md` §4
