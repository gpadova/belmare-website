# Belmare — site institucional

Next 16 + Payload 3. O site público e o painel de edição moram na mesma
aplicação: `src/app/(frontend)` é o site, `src/app/(payload)` é o painel.

Vocabulário do projeto em `CONTEXT.md` — os termos são vinculantes.

## Rodar localmente

```bash
pnpm install
cp .env.example .env   # e preencha (ver abaixo)
pnpm db:local          # cria o banco de desenvolvimento do zero
pnpm dev
```

- Site: <http://localhost:3000>
- Painel: <http://localhost:3000/admin>

Na primeira visita ao painel ele pede para criar a conta inicial. O esquema do
banco é criado sozinho na primeira requisição.

### O banco de desenvolvimento

Postgres local, descartável, **nunca o do Neon de produção**. Um comando o
recria do zero:

```bash
pnpm db:local     # dropdb --if-exists belmare_dev && createdb belmare_dev
```

Precisa do Postgres rodando: `brew services start postgresql@14`.

Recriar o banco apaga tudo, inclusive a conta do painel — é para isso que ele
serve. O `DATABASE_URI` do `.env` aponta para ele.

### Variáveis de ambiente

Estão listadas e explicadas em `.env.example`, que é versionado justamente
para não virar memória de uma pessoa só. Sem as variáveis do R2 o painel
continua funcionando: os uploads caem em `.uploads/`, no disco.

## Comandos

| Comando                  | O que faz                                          |
| ------------------------ | -------------------------------------------------- |
| `pnpm dev`               | Site e painel em desenvolvimento                   |
| `pnpm build`             | Build de produção                                  |
| `pnpm test`              | Testes (Vitest) sobre a superfície de `src/lib`    |
| `pnpm test:prova`        | O upload de 24 MB contra a pilha do Docker         |
| `pnpm db:local`          | Recria o banco de desenvolvimento do zero          |
| `pnpm generate:types`    | Regera `src/payload-types.ts` a partir do esquema  |
| `pnpm generate:importmap`| Regera o import map do painel                      |

Rode `generate:types` sempre que mexer numa coleção. `generate:importmap` só
quando entrar ou sair um componente de painel — o handler de upload do
navegador está lá, e sem ele o upload direto para o bucket não acontece.

### Os testes

Um seam só: a superfície pública de `src/lib`. Componente e rota ficam de fora
porque são finos, e o que eles fazem é consequência do que o seam devolve.

`pnpm test` roda dois projetos:

- **puro** — mappers e ajudantes, sem banco e sem framework. É onde cabem os
  estados que um banco esconderia: um upload que voltou só como identificador,
  um arquivo sem tamanho gravado.
- **integração** — as consultas contra um Payload de verdade, semeado pela API
  local. É também onde a recusa de validação é provada: gravar entrada inválida
  pela API local é a mesma porta por onde o operador salva.

⚠️ O projeto de integração **cria e apaga o próprio banco** (`belmare_teste`) a
cada execução — nunca o de desenvolvimento e nunca o de produção. Não há passo
manual, mas o Postgres local precisa estar de pé, o mesmo do desenvolvimento.
Rodar só a parte rápida: `pnpm vitest run --project puro`.

## Documentação

| Onde | O quê |
| --- | --- |
| [`CONTEXT.md`](CONTEXT.md) | O glossário. Os termos são vinculantes |
| [`PRODUCT.md`](PRODUCT.md) | Verdade de produto: público, território, canal, escopo |
| [`DESIGN.md`](DESIGN.md) | O sistema de design — tokens no frontmatter, componentes na prosa |
| [`docs/cloudflare-r2.md`](docs/cloudflare-r2.md) | As duas configurações do bucket, sem as quais o upload falha |
| [`docs/contas-do-painel.md`](docs/contas-do-painel.md) | Como as duas contas de produção nascem, e o que cada papel alcança |
| [`docs/upload-de-24-mb.md`](docs/upload-de-24-mb.md) | A prova local do envio direto, e o que ela não prova |
| [`docs/classificacao-de-texto.md`](docs/classificacao-de-texto.md) | Campo a campo: o que é gerado, o que é fixo, o que o operador edita |
| [`docs/prazo-de-guarda-de-leads.md`](docs/prazo-de-guarda-de-leads.md) | Material para o cliente decidir a retenção — PRA-129, em aberto |
| [`briefing/`](briefing/) | O levantamento de 30/07/2026. Histórico: o código vence onde divergirem |

## Custo mensal

| Item                     | Custo         | Por quê                                     |
| ------------------------ | ------------- | ------------------------------------------- |
| Vercel Pro               | US$ 20/mês    | O plano Hobby proíbe uso comercial          |
| Neon (free)              | US$ 0         | O conteúdo são algumas centenas de linhas   |
| Cloudflare R2 (free)     | US$ 0         | 10 GB e egresso zero cobrem o acervo        |
| **Total**                | **US$ 20/mês**|                                             |

⚠️ Isto corrige `briefing/estrutura.md` §5, que diz "Custo real: R$ 0". Não
sobrevive à cláusula de uso comercial do plano Hobby da Vercel.
