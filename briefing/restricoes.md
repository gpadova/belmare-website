# Restrições — prazo, orçamento, LGPD, manutenção

`✅` verificado · `🟡` inferência · `❓` pergunta aberta

---

## 1. Prazo ❓ **não informado**

> ❓ **P53 — Qual a data-alvo, e ela está amarrada a algo?** Feira do setor, lançamento de coleção, temporada de verão (o pico de área externa no Sul é set–dez — se o alvo for esse, o relógio já está correndo), reunião com alguma fábrica.
> ❓ **P54 — Existe algo que pode ir ao ar antes do site completo?** Uma página institucional de uma página resolve a ausência atual (`belmare.com.br` está em **404** ✅) enquanto o projeto real é construído.

### O que realmente controla o prazo

Não é o desenvolvimento. É **conteúdo** — nesta ordem:

| Dependência | Situação | Bloqueia |
|---|---|---|
| **Fotos em alta** | ❌ | tudo que é visual — **gargalo principal** |
| Logos vetoriais + autorização | ❌ | home e marcas |
| ~~Lista de lojas~~ | ✅ movido para fase 2 | — |
| Os 4 catálogos PDF atualizados | 🟡 Trisol 2026 ✅; demais a coletar | páginas de catálogo |
| Fotos de projetos realizados | ❌ | "Quem somos" |
| Arquivos 3D | ❌ | a seção que prende o arquiteto |
| Taxonomia da Bux Garden | ❌ "a definir com a fábrica" | catálogo da Bux |
| ~~Identificar a Trisol~~ | ✅ resolvido 30/07 | — |
| ~~Matriz produto × material × medida~~ | ✅ eliminado pela decisão "somente PDFs" | — |

> A lista encurtou bastante com as decisões de 30/07. **Sobrou fotografia** — que continua sendo o que separa um bom site de um site premiado. Ver `acervo/inventario.md` §2 e §6.

---

## 2. Orçamento ❓ **não informado**

> ❓ **P55 — Qual a faixa de orçamento?**
> ❓ **P56 — O que está incluído: só o site, ou também rebranding e fotografia?**

Itens que costumam ficar fora da conta inicial e não deveriam:

| Item | Ordem de grandeza 🟡 | Observação |
|---|---|---|
| Ensaio fotográfico | R$ 8–25k | **maior alavanca de qualidade do projeto** — ver `acervo/inventario.md` §2 |
| Rebranding Belmare | R$ 15–60k | ✅ decidido: acontece **antes** das telas |
| Produção de conteúdo | ✅ muito reduzido | Sem fichas técnicas. Sobra ~20 peças em destaque por marca, lojas e projetos |
| Redação institucional | médio | as fábricas não publicam história utilizável |
| CMS | baixo–médio | ✅ haverá CMS — modelo em `estrutura.md` §5 (P67) |
| Hospedagem e domínio | ~R$ 0–100/mês | Vercel free/pro cobre bem |
| Manutenção contínua | recorrente | ver §5 |

---

## 3. LGPD

O site vai coletar dado pessoal em pelo menos três pontos: formulário de lead, cadastro para baixar arquivo 3D (recomendado — `audiencias.md` P11) e newsletter.

### Obrigatório

| Item | Detalhe |
|---|---|
| **Política de Privacidade** | Quem é o controlador (Bello Mare Mercantil Ltda, CNPJ 03.133.708/0001-09 ✅), que dados coleta, finalidade, base legal, prazo de retenção, com quem compartilha |
| **Base legal explícita** | Lead comercial normalmente se apoia em legítimo interesse ou consentimento — **precisa estar escrito**, não presumido |
| ⚠️ **Compartilhamento com as fábricas** | Se o lead for repassado às representadas (`empresa.md` P5), **isso é transferência de dado pessoal a terceiro e precisa estar declarado na política e no aviso do formulário** |
| **Consentimento de marketing separado** | Checkbox à parte para "quero receber novidades". Não pode vir marcado por padrão, nem embutido no envio do formulário |
| **Banner de cookies** | Só se houver analytics/pixel. Se usarmos analytics sem cookie (Plausible, Vercel Analytics), o banner deixa de ser necessário — **menos atrito e mais elegante** |
| **Canal de titular** | E-mail para pedidos de acesso, correção e exclusão |
| **Minimização** | Pedir só o necessário. Nome, e-mail, cidade e escritório bastam para qualificar um arquiteto. CPF não. Telefone, opcional |

> ❓ **P57 — Existe advogado ou contador que revise a Política de Privacidade?** Posso redigir a minuta, mas quem assina o risco é a empresa.
> ❓ **P58 — Onde os leads ficam armazenados?** Planilha, CRM, e-mail? Define o desenho técnico e a resposta ao titular.
> ❓ **P59 — Por quanto tempo guardar um lead?**

### Recomendação
Analytics sem cookie (Vercel Analytics ou Plausible) + consentimento explícito só no formulário. Cumpre a LGPD **sem** banner de cookie — que é feio, atrapalha a primeira impressão e é a primeira coisa que um júri de premiação vê.

---

## 4. Técnico ✅

Estado atual do repositório, verificado:

| Item | Versão |
|---|---|
| Next.js | 16.2.12 (App Router) |
| React | 19.2.4 |
| React Compiler | **habilitado** (`reactCompiler: true`) |
| Tailwind CSS | v4 (via `@tailwindcss/postcss`) |
| TypeScript | 5 |
| Gerenciador | pnpm |
| Estado | scaffold `create-next-app` limpo — `src/app/{layout,page,globals.css}` |
| Git | ✅ inicializado nesta sessão (sem commits) |

Stack adequada. Nada a trocar.

### Metas de performance
Site de mobiliário é site de imagem — e imagem é onde a performance morre. Metas:

- **LCP < 2,5s** em 4G. Exige `next/image` com AVIF/WebP, `sizes` correto e `priority` só no hero
- **CLS < 0,1** — toda imagem com dimensão declarada
- **INP < 200ms** — cuidado com filtro que re-renderiza 150 cards
- Fontes: `next/font` com `display: swap` e subset latino. **No máximo duas famílias**

> ❓ **P60 — Onde hospedar?** Recomendo **Vercel** (é o caminho natural do Next e resolve imagem, cache e deploy sem trabalho). Precisa saber onde o domínio `belmare.com.br` está registrado hoje ✅ (o domínio existe — retorna 404, então há DNS ativo apontando para algum lugar).
> ❓ **P61 — Quem controla o DNS e o e-mail `@belmare.com.br`?** Trocar DNS sem cuidado derruba o e-mail da empresa. Precisa ser mapeado antes do go-live.

### Acessibilidade
Meta: **WCAG 2.1 AA**. Não é burocracia — é o que separa este site dos das fábricas, onde **nenhuma imagem tem `alt`** ✅. Contraste, foco visível, navegação por teclado no filtro, `alt` real em toda foto de produto (que também é SEO de imagem — e arquiteto busca imagem no Google).

---

## 5. Manutenção

A pergunta que decide a arquitetura: **quem mexe no site depois que ele estiver no ar?**

| Cenário | Consequência |
|---|---|
| **A. A Belmare atualiza sozinha** | Precisa de CMS de verdade (Sanity, Payload). Custo maior na construção, autonomia depois |
| **B. Nós atualizamos sob demanda** | Conteúdo em arquivo no repositório. Muito mais simples e rápido de construir, mas cria dependência permanente |
| **C. Quase não muda** | Se o catálogo muda uma ou duas vezes por ano, CMS é over-engineering |

> ❓ **P62 — Com que frequência o catálogo muda de verdade?** Lançamento por temporada? Peça nova por mês?
> ❓ **P63 — Há alguém na Belmare com disposição para alimentar um CMS?** Resposta honesta, não otimista. CMS que ninguém usa é dinheiro jogado fora — e o site desatualiza em seis meses.
> ❓ **P64 — Existe verba de manutenção mensal, ou o projeto é entrega única?**

### Binários grandes ⚠️
Fotos em alta, catálogos PDF e arquivos 3D (`.skp`, `.rvt`, `.dwg`) **não podem ir para o git** — estouram o repositório e tornam o clone inviável. Precisam de storage (Vercel Blob, S3, Cloudinary) ou Git LFS. Decidir **antes** de receber o primeiro lote, não depois.

---

## 6. Riscos do projeto

| # | Risco | Impacto | Mitigação |
|---|---|---|---|
| 1 | **Fotografia insuficiente** | 🔴 alto — inviabiliza o objetivo de design | **Único risco alto que restou.** Pedir originais às fábricas (barato) → ensaio próprio (caro, melhor) |
| 2 | ~~Lista de lojas~~ | ✅ fase 2 | Belmare roteia por WhatsApp na v1 |
| 3 | Bux Garden com taxonomia "a definir" | 🟡 médio | Propor nós a taxonomia e pedir validação, em vez de esperar |
| 4 | Rebranding alonga o cronograma | 🟡 médio | Já decidido que vem antes; amarrar data-alvo contando com ele |
| 5 | ~~Trisol não identificada~~ | ✅ resolvido 30/07 | `marcas/trisol.md` |
| 6 | ~~Conteúdo de produto não existe~~ | ✅ eliminado | Decisão "somente PDFs" |
| 7 | ~~Lead vai direto pra fábrica~~ | ✅ eliminado | Decisão "Belmare, sempre" |
| 7 | Fábrica veta uso do logo em monocromia | 🟡 médio | Autorização por escrito na fase de coleta |
| 8 | Site fica melhor que o das representadas | 🟢 baixo | É oportunidade, não risco |
| 9 | Casoca já entrega os 3D da GDA | 🟡 médio | Diferenciar: quatro marcas juntas + acabamentos + atendimento |

---

## Perguntas abertas deste documento

P53 prazo · P54 no-ar antecipado · P55 orçamento · P56 escopo do orçamento · P57 jurídico · P58 armazenamento de leads · P59 retenção · P60 hospedagem · P61 DNS e e-mail · P62 frequência de mudança · P63 quem alimenta o CMS · P64 verba de manutenção
