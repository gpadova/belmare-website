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
| `pnpm db:local`          | Recria o banco de desenvolvimento do zero          |
| `pnpm generate:types`    | Regera `src/payload-types.ts` a partir do esquema  |
| `pnpm generate:importmap`| Regera o import map do painel                      |

Rode `generate:types` sempre que mexer numa coleção. `generate:importmap` só
quando entrar ou sair um componente de painel — o handler de upload do
navegador está lá, e sem ele o upload direto para o bucket não acontece.

## Cloudflare R2

Os binários pesados — catálogos de 24 MB, arquivos 3D de 8 MB — vão para o R2,
e o navegador os envia **direto para o bucket**, sem passar pela função
serverless da Vercel, que recusa corpo de requisição acima de 4,5 MB.

Duas configurações precisam ser feitas no painel da Cloudflare, e o upload
falha sem qualquer uma delas.

### 1. CORS: liberar o PUT assinado

O navegador faz um preflight `OPTIONS` antes do `PUT`. Sem a política abaixo em
**R2 → o bucket → Settings → CORS Policy**, o upload morre no preflight e o
painel só mostra um erro de rede.

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://belmare.com.br",
      "https://www.belmare.com.br"
    ],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["content-type", "content-length"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

Três detalhes que custam uma tarde cada:

- **`AllowedOrigins` não aceita curinga de subdomínio.** `https://*.vercel.app`
  não vale; cada domínio de preview que precisar subir arquivo entra na lista
  pela URL inteira, sem barra no fim e sem caminho.
- **`AllowedHeaders` não aceita `"*"`.** Funciona na AWS, não funciona no R2.
  `content-type` é o único que o navegador realmente pede no preflight — o
  `content-length` é posto pelo próprio navegador e vai na lista por garantia.
- **A origem é a do site, não a do bucket.** É de `localhost:3000` e do domínio
  de produção que o `PUT` parte.

### 2. Leitura pública: para o catálogo descer

O `PUT` é assinado, mas o `GET` de quem baixa não é — e o endpoint da API S3
recusa requisição sem assinatura. O bucket precisa de leitura pública, em
**Settings → Public access**, e o domínio que sair de lá é o `R2_PUBLIC_URL`:

- **Domínio próprio** (`arquivos.belmare.com.br`) — o certo para produção.
- **Subdomínio `r2.dev`** — resolve para testar, mas é limitado por taxa e a
  própria Cloudflare desaconselha em produção.

## Custo mensal

| Item                     | Custo         | Por quê                                     |
| ------------------------ | ------------- | ------------------------------------------- |
| Vercel Pro               | US$ 20/mês    | O plano Hobby proíbe uso comercial          |
| Neon (free)              | US$ 0         | O conteúdo são algumas centenas de linhas   |
| Cloudflare R2 (free)     | US$ 0         | 10 GB e egresso zero cobrem o acervo        |
| **Total**                | **US$ 20/mês**|                                             |

⚠️ Isto corrige `briefing/estrutura.md` §5, que diz "Custo real: R$ 0". Não
sobrevive à cláusula de uso comercial do plano Hobby da Vercel.
