# Briefing — Site Belmare

Levantamento para o novo site da **Belmare** (Bello Mare Mercantil Ltda), representação comercial de mobiliário de alto padrão para área externa, Florianópolis/SC, 26 anos de mercado.

**Data do levantamento:** 30/07/2026

---

## Documentos

| Arquivo | Conteúdo |
|---|---|
| [`empresa.md`](empresa.md) | Negócio, território, funil, o que acontece após o lead |
| [`audiencias.md`](audiencias.md) | As duas portas, perguntas e objeções reais |
| [`marcas/`](marcas/) | Um documento por marca + manuais em PDF |
| [`acervo/inventario.md`](acervo/inventario.md) | Inventário e o que existe de fato |
| [`referencias.md`](referencias.md) | Referências e anti-referências, com motivo |
| [`restricoes.md`](restricoes.md) | Prazo, orçamento, LGPD, manutenção |
| ⭐ [`estrutura.md`](estrutura.md) | **Como o site vai ser** — sitemap, página a página e o **modelo de conteúdo do CMS** (§4 e §5) |
| ⭐ [`marca.md`](marca.md) | **Território de marca** — logotipo, tipografia, grade, voz |

**Legenda:** `✅` verificado em fonte pública · `🟡` inferência a confirmar · `❓` pergunta aberta

---

## ✅ Decisões tomadas — 30/07/2026

| Decisão | Escolha | Detalhe |
|---|---|---|
| **Destino do lead** | **Belmare, sempre** | E-mail da fábrica não é exposto. → [`empresa.md`](empresa.md) §6 |
| **Canais de contato** | **WhatsApp + formulário por e-mail** | Sem CRM nesta fase. → [`empresa.md`](empresa.md) §6 |
| **Canal de venda** | **Sempre via loja** | O site nunca vende; a Belmare indica a loja pelo WhatsApp. → [`audiencias.md`](audiencias.md) §3 |
| **Catálogo** | **Somente PDFs, conteúdo em CMS** | Sem página por produto. → [`acervo/inventario.md`](acervo/inventario.md) §3 |
| **Território** | **Toda a Região Sul** — PR · SC · RS | Igual para as quatro marcas. → [`empresa.md`](empresa.md) §3 |
| **CMS** | **Payload 3** | Open source, gratuito de verdade, roda dentro do Next. → [`estrutura.md`](estrutura.md) §5 |
| **"Onde comprar"** | **Fase 2** | Lista de lojas é volátil demais para a v1. → [`estrutura.md`](estrutura.md) §2 |
| **Rebranding** | **No escopo, antes das telas** | Próxima entrega é território de marca, não layout. → [`referencias.md`](referencias.md) §6 |
| ⭐ **Linha de design** | **Direção A — editorial / arquivo** | Tipografia, grade e fotografia. Sem sistema de textura. → [`referencias.md`](referencias.md) §6 |
| ⭐ **Estrutura do site** | **Árvore, raiz na marca** | Cada coisa tem um pai só. **O eixo de material está cancelado.** → [`estrutura.md`](estrutura.md) §4 |

### ⚠️ Reversão registrada — 30/07/2026, tarde

A **Direção C — Material** foi escolhida e revertida no mesmo dia, e com ela caíram a marca-sistema generativa, as oito matérias como taxonomia e o filtro transversal `/catalogos?material=`.

**Motivo, em um número:** a matriz marca × material tem **4 de 32 células preenchidas**, e a Marê — a marca com mais peças — não declara material em lugar nenhum. Estruturar o site e a identidade sobre um dado com 12% de cobertura era construir sobre o que não existe.

Onde procurar, se encontrar resíduo em algum documento: [`estrutura.md`](estrutura.md) §4 tem o raciocínio completo e o modelo que ficou no lugar.

### Marca — decidido em 30/07/2026 → [`marca.md`](marca.md)

| | |
|---|---|
| **Tipo de marca** | **Logotipo fixo** — wordmark, faixa de hachura invariável e descritor, na mesma largura |
| **Nome** | **Belmare Representações** — descritor em mono, subordinado ao logotipo |
| **Tipografia** | **Söhne + Söhne Mono** (Klim, licença paga). A grotesca fala, a mono mede |
| **Elemento gráfico** | **A grade e o fio.** Zero textura, zero ornamento. A foto é a única cor |
| **Paleta** | **Acromática, zero acento.** Fundo off-white `#F5F3F0`, nunca branco puro |
| **Voz** | **Técnica e direta** — dado antes de adjetivo |
| **Movimento** | **Contido e funcional** — revela estrutura, não decora |
| **Aplicações** | ❓ pendente — proposta em [`marca.md`](marca.md) §8 |

---

## O que o levantamento descobriu

1. **Trisol identificada** ✅ — `trisolombrelones.com.br`, ombrelones técnicos, 5 modelos, catálogo 2026. Com ela o portfólio fecha um raciocínio: Marê é o móvel de autor, GDA a estrutura, Bux o conforto, **Trisol a sombra**. Não é uma lista de fornecedores — é uma área externa inteira. → [`estrutura.md`](estrutura.md) §1

2. **A fotografia disponível não sustenta o objetivo de design.** As fotos das fábricas estão a 1300×866 px; um hero em retina pede 2880. É limitação física, não de layout — **e é o único gargalo que sobrou**. → [`acervo/inventario.md`](acervo/inventario.md) §2

3. **O maior risco do projeto desapareceu.** A decisão "somente PDFs" elimina os ~1.000–2.000 campos de ficha técnica. O caminho crítico deixa de ser conteúdo e volta a ser design e construção.

4. **O dado de material não existe — e isso mudou o projeto.** Atravessar as quatro marcas por material parecia a ideia mais original do briefing, até a matriz ser medida: **4 células de 32**. O site passou a ser uma árvore com raiz na marca, e o argumento do interlocutor único voltou para o texto, onde é verdade sem depender de dado. → [`estrutura.md`](estrutura.md) §4

5. **Os sites das quatro representadas são o piso do segmento** — WordPress, até 5 famílias tipográficas simultâneas, zero `alt` em qualquer imagem. Um site sério aqui não compete: destoa. → [`referencias.md`](referencias.md) §5

---

## O que ainda trava

| # | Pergunta | Trava |
|---|---|---|
| **P53/P55** | Prazo e orçamento | Viabilidade de tudo — **única resposta que falta para começar** |
| **P52** | Quem aprova a nova marca? | Cronograma do rebranding |
| **P43** | Existem fotos de projetos entregues? | "Quem somos" e prova social |
| **P46b** | Quantas peças em destaque por marca | Catálogo |
| **P62/P63** | Há quem alimente o CMS, e com que verba? | Dimensiona o painel |
| **P41** | Fotos originais em alta | 🟡 adiado pelo cliente — segue como o teto de qualidade |

~~**P21 · P26 · P66**~~ — material por peça da Marê, matriz material × produto da GDA, lonas no filtro. ✅ **Mortas com o eixo de material.**

Lista completa: P1–P67, ao pé de cada documento.

**Próxima entrega:** manual curto do logotipo, grade e escala tipográfica sob a Direção A. Antes das telas.

---

## Estado do repositório

Scaffold `create-next-app` limpo: Next.js 16.2.12 (App Router), React 19.2.4 com React Compiler ativo, Tailwind v4, TypeScript, pnpm. Git inicializado, sem commits. Nada a trocar na stack. → [`restricoes.md`](restricoes.md) §4
