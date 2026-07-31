# Marca Belmare — território

Decisões de 30/07/2026. Direção **A — editorial / arquivo**.

`✅` decidido · `🟡` proposta minha, derivada das decisões · `❓` pendente

> ⚠️ **Correção de rumo — 30/07/2026, tarde.** Este documento descrevia uma **marca-sistema baseada em matéria**: sem símbolo fixo, com o logotipo vestindo a cada contexto a matéria daquele contexto, e oito matérias como taxonomia do site.
>
> **Está cancelado.** A marca-sistema dependia de saber a matéria de cada página, e essa informação **não existe**: a matriz marca × material tem 4 de 32 células preenchidas, e a Marê não declara material em lugar nenhum. Uma identidade generativa que não sabe o que vestir em 88% dos casos não é um sistema — é um buraco.
>
> O que ficou no lugar está escrito abaixo, e é mais simples: **um logotipo fixo, sempre igual.** O raciocínio numérico completo está em [`estrutura.md`](estrutura.md) §4.

---

## 1. A ideia

> **A Belmare não vende móvel. Ela resolve a área externa.**

Quatro fábricas que não falam entre si, três estados, **um interlocutor**. O portfólio fecha um raciocínio completo, e nenhuma das quatro pode oferecer o conjunto:

| Marca | Resolve |
|---|---|
| Marê Mobília | o móvel de autor |
| GDA Móveis | a estrutura |
| Bux Garden | o conforto |
| Trisol | a sombra |

A identidade não tenta traduzir isso em mecanismo. Ela faz o que uma casa de curadoria faz: **fica quieta e deixa o acervo falar.** Tipografia, grade e silêncio. A energia cromática inteira vem da fotografia.

Isso é uma correção deliberada. A versão anterior tentava provar o "atravessa as quatro marcas" **dentro da interface**, e para isso precisava de um dado que as fábricas não têm. O argumento continua verdadeiro e continua sendo o centro do posicionamento — ele só volta para onde sempre esteve: **o texto e o atendimento.**

---

## 2. Marca ✅ — logotipo fixo

**Um desenho. Sempre o mesmo.**

```
BELMARE
▨▨▨▨▨▨▨          ← faixa, hachura fixa
REPRESENTAÇÕES
```

Três elementos na **mesma largura exata** — é o alinhamento que segura o lockup; sem ele, viram três coisas empilhadas. A faixa é **uma só hachura, invariável**, em qualquer página, qualquer peça, qualquer tamanho. Não muda por contexto, não representa material, não tem irmãs.

### ✅ Logotipo definido (30/07/2026)

Wordmark gerado externamente e **aprovado**. Estrutura de três elementos confirmada: wordmark / faixa / descritor.

**Duas correções aplicadas na integração:**
1. **Faixa desinvertida.** A geração trouxe um bloco preto sólido com riscos brancos vazados — pesado, virava mancha em tamanho pequeno. Trocada por hachura preta sobre o papel.
2. **Hachura regularizada.** O risco original era irregular, quase pincelado — lia como grunge, não como marca. A versão regular lê como fio de amostrário, que é o registro certo.

**Três aplicações montadas** em `Belmare — Design System`, artboard `01 — Marca e Sistema`:

| Versão | Uso |
|---|---|
| **Vertical** | principal — wordmark, faixa, descritor |
| **Compacta** | topo do site — wordmark e faixa fina, sem descritor |
| **Símbolo** | a faixa sozinha, em 72 / 32 / 16 px — favicon, adesivo, etiqueta |

⚠️ **O que mudou na prática:** as três aplicações continuam válidas — o desenho não muda. O que sai é a **regra generativa** por trás delas. Onde o manual dizia "a faixa carrega a matéria do contexto", passa a dizer "a faixa é esta, e é sempre esta". Um logotipo a documentar em vez de um sistema a policiar.

### Nome ✅
**Belmare Representações.** O descritor entra em **mono, caixa alta, tracking aberto**, subordinado ao logotipo — onde ele lê como classificação técnica, não como razão social. É assim que "Representações" deixa de diminuir a marca e passa a fazer parte do sistema.

---

## 3. Tipografia ✅

**Söhne + Söhne Mono** — Klim Type Foundry. Licença paga (~US$ 300–600, web + desktop, pagamento único).

> ⚠️ **Söhne não está disponível no Paper** (verificado 30/07/2026). O design system foi montado em **Geist + Geist Mono** — mesma família, grotesca contemporânea, pesos 100–900 completos, e o substituto mais próximo do que a Söhne ocuparia. Ao licenciar a Söhne, é troca de token: `--font-sans` e `--font-mono`.
>
> ✅ **Decidido 30/07/2026 — o site é construído em Söhne desde já.** A licença será adquirida antes do lançamento. No código, `@font-face` declara Söhne com Geist como fallback na mesma pilha: enquanto os `.woff2` não existirem em `public/fonts/`, o navegador cai silenciosamente para Geist; quando existirem, vira Söhne sem tocar em código. Na licença, migrar para `next/font/local` para ganhar preload e calibrar `size-adjust` com as métricas reais. O Paper segue em Geist — a limitação é da ferramenta, não da decisão.

Suíça, quente, sem afetação. A mono é das melhores que existem para dado técnico — e este site é feito de dado técnico.

| Papel | Fonte |
|---|---|
| Display e títulos | Söhne, pesos Leicht / Buch |
| Texto corrido | Söhne Buch |
| **Todo dado técnico** | Söhne Mono — formato de arquivo, medida, peso, contador, código, ano |

A divisão é o coração do sistema: **a grotesca fala, a mono mede.**

### Escala 🟡

| Papel | Tamanho | Entrelinha | Tracking |
|---|---|---|---|
| Display | 88–120px, Leicht | 0.92 | −0.02em |
| H1 | 48–64px, Buch | 1.05 | −0.01em |
| H2 | 32px | 1.15 | — |
| H3 | 22px | 1.25 | — |
| Corpo | 17px | 1.55 | — |
| Apoio | 14px | 1.45 | — |
| **Mono técnico** | 11–12px, caixa alta | 1.3 | **+0.06em** |

Numerais **tabulares** em toda tabela, contador e ficha. Detalhe pequeno que faz o catálogo parecer instrumento em vez de página.

---

## 4. Paleta ✅ — acromática, zero acento

Toda a energia cromática vem **da fotografia**. Uma cor de marca competiria com a foto do móvel — e num site de mobiliário quem tem que ganhar essa disputa é a foto.

| Papel | Valor 🟡 |
|---|---|
| Papel (fundo) | `#F5F3F0` — **nunca branco puro** |
| Tinta (texto) | `#17171A` |
| Grafite (UI secundária) | `#3D3D40` |
| Cinza (divisores, bordas) | `#C9C6C0` |
| Branco (superfície de card) | `#FFFFFF` — usado com parcimônia |

O off-white é decisão da Diabla e está certa: branco puro endurece a fotografia e cansa numa navegação longa. E o card em branco puro sobre o papel cria elevação **sem sombra nenhuma** — coerente com raio 0 e zero sombra.

---

## 5. Elemento gráfico ✅ — a grade e o fio

**Não existe sistema de textura. Existe rigor de grade.**

> ⚠️ **Esta seção substitui o "sistema de matéria".** Ele passou por duas correções e caiu na terceira. Vale registrar a sequência, porque é a lição do projeto:
>
> 1. Primeiro a matéria era **superfície** — grandes campos de textura em hero e aberturas. Errado: contradizia *"a fotografia carrega toda a energia cromática"*, e textura em campo grande briga com a foto do móvel.
> 2. Depois virou **legenda** — swatches de 10–12px ao lado do nome. Melhor, mas ainda dependia de saber a matéria de cada peça.
> 3. Agora está **fora**, porque o problema nunca foi a escala: era o **dado**. Não há como legendar a matéria de uma peça cuja matéria a fábrica não informa. Ver [`estrutura.md`](estrutura.md) §4.

O que dá identidade a esta marca, então:

| Recurso | Papel |
|---|---|
| **A grade** | Alinhamento visível e sem exceção. Rigor de amostrário de arquitetura — é ele que separa "contido" de "vazio" |
| **O fio** | Divisor de 1px em cinza `#C9C6C0`. O único ornamento que existe, e ele é estrutural |
| **A mono** | Todo dado técnico em caixa alta, tracking aberto, numerais tabulares. É o que faz a página parecer instrumento |
| **A foto** | Grande, calorosa, e a única cor da página |
| **O branco** | Card branco puro sobre o papel off-white cria elevação **sem sombra nenhuma** — coerente com raio 0 |
| **A faixa do logotipo** | Uma hachura fixa, e só dentro do logotipo. Não sai dele, não se repete pela página, não vira padrão de fundo |

O teste é direto: **tire tudo menos tipografia, fio e foto — o site ainda tem que ficar bom.** Se ficar, não faltava nada. Foi essa a pergunta que derrubou as duas versões anteriores desta seção.

### Consequência para a fotografia

Não há mais macro de matéria no escopo. As oito diárias de amostra saem da lista, e o orçamento de fotografia vai **inteiro** para o que carrega a página: **móvel em ambiente** e **projeto entregue** — `acervo/inventario.md` §2 e §6.

---

## 6. Voz ✅ — técnica e direta

Frases curtas. Dado antes de adjetivo. Zero bajulação.

> **GDA MÓVEIS**
> Alumínio fundido 100% reciclado.
> Cláudio, MG — maior polo de fundição artesanal da América Latina.
> Personalizados em 30 dias.
> Design de Sérgio Matos e Guto Indio da Costa.

Arquiteto reconhece respeito, e reconhece bajulação à distância. Esta voz também diferencia de todo concorrente do segmento, que escreve em superlativo genérico.

⚠️ **A voz exige dado real.** Sem número e sem fato, este tom vira seco e vazio. É o tom que mais depende de coletar informação das fábricas.

⚠️ **Mas dado real não basta: tem que dar imagem.** "Quatro fábricas, um interlocutor, três estados" era verdade e era específico, e foi **rejeitada como copy em 30/07/2026** — descreve o organograma da empresa para quem chegou procurando um móvel. Números que contam a própria estrutura não são dado técnico; são jargão interno com cara de dado.

**O teste:** a frase põe um objeto na cabeça de quem lê? "Inox 304" põe. "Vento até 80 km/h" põe. "Alumínio fundido 100% reciclado" põe. "Quatro fábricas" não põe nada. A abertura do site hoje começa nomeando peças — *sofá, mesa, espreguiçadeira, ombrelone* — e é assim que a voz técnica se cumpre já na primeira linha.

---

## 7. Movimento ✅ — contido e funcional

Movimento revela estrutura; não decora.

- Transição que **preserva a foto** entre listagem e página
- Filtro que **reordena o grid** com transição, para o olho não perder o lugar
- Revelação suave ao rolar, sem exagero
- Sem scroll-jacking, sem loader longo, sem parallax gratuito
- `prefers-reduced-motion` respeitado

Razão: o arquiteto volta ao site **muitas vezes**. Animação que encanta na primeira visita irrita na décima. E cada animação paga em LCP.

---

## 8. Aplicações ❓ **pendente**

Não respondido. Proposta padrão, a confirmar:

| Prioridade | Peça | Por quê |
|---|---|---|
| 1 | **Apresentação comercial (deck/PDF)** | Peça mais usada no dia a dia depois do WhatsApp; serve arquiteto, lojista **e** a conquista de novas fábricas |
| 2 | **Cartão e papelaria** | Representação vive de visitar escritório |
| 3 | **Instagram + assinatura de e-mail** | Baixo custo, altíssima frequência |
| 4 | **Mostruário e feira** | Onde a peça real está na mão do cliente |

> ❓ Confirmar quais entram no escopo.

---

## 9. Próximos passos

1. **Licenciar Söhne + Söhne Mono** (Klim) — bloqueia qualquer execução tipográfica
2. ✅ **Logotipo e lockup** — feito; três aplicações montadas (§2)
3. **Escrever o manual** — proporção do lockup, área de respiro, o que nunca fazer. Curto: é um logotipo fixo, não um sistema generativo
4. **Fixar a grade e a escala tipográfica** (§3), que é o que carrega a identidade agora (§5)
5. Só então: **as telas**

~~Desenhar as quatro famílias de vetor de matéria~~ e ~~produzir as oito macros~~ saíram do escopo com o §5.

> ❓ **P52 — Quem aprova a nova marca além do João Padova?** Continua sendo o maior risco de cronograma. Rebranding trava em rodada de aprovação muito mais do que em criação.
