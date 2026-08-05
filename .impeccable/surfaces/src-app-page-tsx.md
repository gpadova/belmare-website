---
version: 2
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/layout.tsx"]
---

## Escopo e modo

Home `/` do site da Belmare. Modo **Persuade** — o visitante decide e age; o design é o produto.

> ⚠️ **v2, 30/07/2026.** A v1 desta superfície descrevia uma home governada por uma **anatomia de etiqueta de amostra**, com bandeja de oito chips de matéria, campo de textura no hero e o clique levando a `/catalogos?material=`. **Está cancelada** junto com o eixo de material — ver `briefing/estrutura.md` §4. O que segue descreve o que está construído.

## Público, trabalho, ação

Arquiteto e designer de interiores do Sul, entre projetos, procurando quem resolve a área externa inteira. Secundários: consumidor final, lojista e — silenciosamente — o diretor comercial de uma quinta fábrica avaliando se entrega o Sul para a Belmare.

Ação primária: **escolher uma das duas portas** (`/arquitetos` · `/contato`). Persistente: WhatsApp no topo.

Prova publicável nesta superfície, e nada além: `1999 · 26 anos` · `PR · SC · RS` · quatro fábricas e o que cada uma resolve · Florianópolis/SC · CNPJ.

## Direção — "a foto carrega, a tipografia mede"

Direção A, editorial/arquivo. A identidade da página vem de **três coisas apenas**: fotografia grande, grade rigorosa e mono para dado técnico. Sem textura, sem padrão de fundo, sem ornamento — o fio de 1px `#C9C6C0` é o único, e é estrutural.

Duas decisões que governam o resultado e não devem ser desfeitas:

1. **A foto sangra e o texto vive sobre ela.** Nada de painel regrado ao lado, nada de campo de matéria: num site de mobiliário o herói é a peça, e a interface some para deixá-la falar. O véu escuro no pé da imagem é legibilidade, não ornamento.
2. **O título diz o ramo, com o nome que o ramo usa.** *"Representação comercial de móveis para área externa."* — e a linha de apoio nomeia as marcas, o território e o tempo de casa, e nada além disso.

   > ⚠️ **Revisado em 05/08/2026.** As duas versões anteriores desta decisão diziam "o título nomeia objetos" (*"Sofá, mesa, espreguiçadeira e ombrelone."*) e "o título nomeia o público" (*"A área externa inteira, para quem especifica e para quem revende."*). As duas caíram.

   Quatro formulações estão **proibidas de voltar**: a categoria pura ("Móveis para área externa"), que descreve uma fábrica e a Belmare não é fábrica; o jargão de estrutura ("Quatro fábricas. Um interlocutor."), que conta o organograma a quem não perguntou; a enumeração de peças, que promete varejo numa empresa que não vende direto; e a promessa de posicionamento sem verbo, que diz o resultado e esconde o ramo.

   **O teste mudou junto com o título.** Era *"a frase põe um objeto na cabeça de quem lê?"* — e essa regra vale para copy escrita ao consumidor final, que não é quem lê esta tela. O leitor daqui é o lojista e o escritório de arquitetura: ele já sabe o que é móvel de área externa, e a pergunta dele é outra. O teste de agora: **em dois segundos, a frase diz se isto é uma fábrica, uma loja ou uma representação?**

O argumento de que uma empresa só resolve a área externa inteira **não é afirmado em lugar nenhum da página** — é feito por demonstração, na sequência: a abertura diz que a empresa é uma representação de mobiliário de área externa, a seção seguinte mostra as quatro fábricas lado a lado, e o visitante conclui sozinho que elas cobrem o mesmo terreno. Não vira mecanismo de interface nem slogan — as três tentativas caíram.

**Sequência:** abertura (100svh) → as quatro marcas em linhas regradas → as duas portas → rodapé. Três telas e o pé.

As quatro marcas são **linhas, não grid de quatro colunas** — P18 está aberto e um grid de 4 quebra com 3 ou 6. Linha escala para N.

## Inventário de fidelidade

| Ingrediente | Meio | Nota |
|---|---|---|
| Wordmark BELMARE + faixa + descritor | SVG/CSS autoral | Logotipo **fixo**. A faixa é uma hachura invariável e não sai do lockup |
| Nav mono caps + WHATSAPP + hairline | HTML/CSS | `<nav>` semântico, hairline como `border` |
| **Foto de abertura, full-bleed** | **Raster gerado** | Área externa resolvida — móvel, estrutura, sombra na mesma imagem. 2880px, AVIF/WebP, `priority`. Mock fal.ai até a foto real |
| Véu de legibilidade no pé da foto | CSS gradient | Só onde o texto cai; não escurece a imagem inteira |
| Display 96/88 light, duas linhas | HTML/CSS | Söhne com fallback Geist na mesma pilha |
| Prova em mono (território, 1999) | HTML/CSS | Numerais tabulares |
| As 4 marcas em linhas regradas | HTML/CSS + raster | Lockup tipográfico Belmare. **Não desenhar logos das fábricas**. Cada linha com uma foto de referência, declarada como tal |
| As 2 portas | HTML/CSS | Dois campos de igual peso — não um botão e um link |
| Rodapé | HTML/CSS | CNPJ, endereço, telefones, território, marcas, Instagram, política |

**Compromissos de composição:** header 72px · abertura sangra até a altura da tela · hairline como único ornamento · raio 0, sombra 0, gradiente 0 (exceto o véu), cor 0.

**Mobile:** display ~48px, foto recortada com `object-position` deslocado para preservar o assunto, marcas empilhadas em linhas. Nunca escondida atrás de menu.

## Restrições que o builder não pode inventar

- Söhne construída desde já via `@font-face` com Geist como fallback na mesma pilha; `.woff2` ausente cai para Geist sem quebrar build. Na licença, migrar para `next/font/local` e calibrar `size-adjust`.
- Nenhum logo vetorial das representadas existe. Lockup tipográfico, decisão confirmada.
- WhatsApp e e-mail mockados, num único arquivo de config.
- Toda imagem é mock fal.ai, centralizada e trocável num só lugar (`src/lib/acervo.ts`), `alt` honesto, nunca legendada como foto de produto.
- LCP < 2,5s em 4G · CLS < 0,1 · INP < 200ms. A foto de abertura é o LCP.
- Anti-metas: carrossel, depoimento, newsletter, contador animado, "nossos parceiros", scroll-jacking, parallax, loader, sombra, gradiente, raio, terceira família tipográfica, qualquer cor, **qualquer padrão de textura**.

## Decisões em aberto

P41 fotos originais em alta (teto de qualidade) · P18 o portfólio cresce (por isso linhas, não grid) · P52 quem aprova a marca · P53/P55 prazo e orçamento · P46b peças em destaque por marca.
