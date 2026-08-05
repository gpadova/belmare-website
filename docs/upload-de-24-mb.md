# A prova local do upload de 24 MB

O `clientUploads` é a suposição de que o projeto inteiro depende, e
`payload.config.test.ts` prova só metade dela: que a configuração montada TEM as
duas peças do envio direto. A outra metade é uma medida, não uma leitura — 24 MB
de verdade atravessando —, e ela precisa de um bucket. O `docker-compose.yml`
põe um **MinIO** no lugar do R2 e um Postgres no lugar do Neon, para que a
medida caiba numa máquina sem conta de nuvem nenhuma.

MinIO e R2 falam a mesma API S3, então o caminho de código exercitado é o mesmo:
o painel chama `POST /api/storage-s3-generate-signed-url`, recebe uma URL
assinada e o navegador faz o `PUT` direto no bucket. **Leia antes de comemorar o
verde**: o que isto não prova está no fim deste documento.

A configuração do bucket de verdade está em [`cloudflare-r2.md`](cloudflare-r2.md).

## Subir a pilha

```bash
docker compose up -d --wait
```

Sobem três coisas: Postgres em **55432** (deslocado do 5432 do desenvolvimento,
com banco próprio `belmare_prova`), MinIO em **9000** (painel em 9001), e um
contêiner de um passo só que cria o bucket e o abre para leitura anônima — o
equivalente local do "Public access" do R2. Nada disto toca `belmare_dev` nem
`belmare_teste`.

## Apontar o painel para ela

`prova-local.env` é lido **por cima** do `.env`, só na sessão que roda a prova.
Variável já posta no processo ganha da que está no `.env`, então o seu ambiente
de desenvolvimento continua intacto e fechar o terminal desfaz tudo:

```bash
set -a && . ./prova-local.env && set +a
pnpm dev
```

O painel fica em <http://localhost:3000/admin> e pede para criar a conta inicial,
porque o banco é novo.

## Rodar a prova

```bash
pnpm test:prova
```

⚠️ Este comando **não** entra em `pnpm test`, e é de propósito: ele exige Docker
de pé, e um teste que falha por falta de ambiente ensina a suíte inteira a ser
ignorada. Ele mora em `vitest.prova.config.ts`, num arquivo de configuração
próprio que `vitest run` nunca lê.

O que ele afirma, em ordem: o catálogo de prova tem os 24 MB; o bucket libera o
`PUT` no preflight; **a URL assinada aponta para fora da origem da aplicação** —
é esta a linha que decide o ticket; e os 24 MB sobem e descem com o mesmo
resumo SHA-256.

O catálogo é **gerado**, não versionado — 24 MB no repositório para sempre seria
caro e inútil. `src/test/catalogo-de-24-mb.ts` o monta de forma determinística
(mesmo arquivo, mesmo resumo, toda vez); para tê-lo em disco e arrastá-lo para o
painel à mão:

```bash
node src/test/catalogo-de-24-mb.ts .uploads/prova/catalogo-de-24-mb.pdf
```

## Medir que o arquivo não passou pela aplicação

`pnpm test:prova` prova que o `PUT` sai para outra origem. Para medir o outro
lado da frase — quantos bytes a aplicação REALMENTE recebeu —, há
`src/test/medidor-de-bytes.ts`: um repasse de TCP que se põe entre o navegador e
o Next e conta o que atravessa.

```bash
set -a && . ./prova-local.env && set +a
pnpm exec next dev -p 3210 &                 # o Next sai da frente
node src/test/medidor-de-bytes.ts &          # e o medidor atende em 3000
# use o painel normalmente em http://localhost:3000/admin
kill -USR2 $(pgrep -f medidor-de-bytes)      # imprime o placar sem derrubar nada
```

O veredito é uma comparação: o total que subiu para a aplicação durante a sessão
inteira, contra os 25.165.824 bytes que o bucket recebeu num `PUT` só. Se o
primeiro for menor, o arquivo não passou pela função — não há onde ele caberia.

## Derrubar

```bash
docker compose down -v      # o -v leva junto o banco e o bucket
```

## ⚠️ O que o MinIO NÃO prova sobre o R2

O verde daqui mede o **caminho**, não o **fornecedor**. Continua sem prova, e
só a produção resolve:

- **A política de CORS do bucket de verdade.** Aqui a liberação é uma variável
  de ambiente do servidor inteiro (`MINIO_API_CORS_ALLOW_ORIGIN`); no R2 é um
  JSON por bucket, com as três armadilhas listadas em `cloudflare-r2.md` — sem
  curinga de subdomínio, sem `"*"` em `AllowedHeaders`, e a origem é a do site.
  Nenhuma delas pode falhar aqui, porque nenhuma delas existe aqui.
- **A leitura pública do R2.** `mc anonymous set download` não é o mesmo botão
  que "Public access", e o domínio que sai de lá (`r2.dev` ou próprio) tem
  limite de taxa e comportamento de cache que o `localhost:9000` não tem.
- **A rede.** Aqui os 24 MB andam por loopback em 338 ms. Numa conexão de
  escritório o `PUT` leva minutos, e é aí que aparecem tempo limite de
  navegador, expiração da URL assinada (600 s) e reconexão — nada disso é
  exercitado por um cabo que não existe.
- **Os limites da Vercel e da Cloudflare.** O cap de 4,5 MB de corpo de
  requisição é da função serverless da Vercel, e não há função serverless
  nenhuma nesta prova: o `pnpm dev` é um servidor Node comum. O que se mediu foi
  que o arquivo **não passa pela aplicação** — o que torna o cap irrelevante —,
  não que a Vercel se comporte como se espera.
- **O checksum do SDK.** O `requestChecksumCalculation: "WHEN_REQUIRED"` de
  `payload.config.ts` existe por causa de uma recusa do R2. O MinIO aceita os
  dois modos, então esta prova passaria mesmo com a linha errada.

## ⚠️ O servidor busca o arquivo de volta depois do envio

Uma coisa que a prova mediu e que não estava no desenho: terminado o `PUT` do
navegador, ao salvar o documento **o servidor faz `HeadObject` e `GetObject` e lê
os 24 MB de volta do bucket** (`getFile` do adaptador S3). Reproduzido duas
vezes, pelo painel.

Isso **não** invalida o envio direto — o cap de 4,5 MB é de CORPO DE REQUISIÇÃO
que entra na função, e uma busca que a função faz para fora não é isso. Mas quer
dizer que a função ainda move 24 MB por upload, em memória e em tempo, e que o
custo do envio direto não é zero do lado do servidor. Vale medir na Vercel antes
de tratar o assunto como encerrado.
