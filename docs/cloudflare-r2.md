# Cloudflare R2 — as duas configurações do painel

Os binários pesados — catálogos de 24 MB, arquivos 3D de 8 MB — vão para o R2,
e o navegador os envia **direto para o bucket**, sem passar pela função
serverless da Vercel, que recusa corpo de requisição acima de 4,5 MB.

Duas configurações precisam ser feitas no painel da Cloudflare, e o upload
falha sem qualquer uma delas.

## 1. CORS: liberar o PUT assinado

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

## 2. Leitura pública: para o catálogo descer

O `PUT` é assinado, mas o `GET` de quem baixa não é — e o endpoint da API S3
recusa requisição sem assinatura. O bucket precisa de leitura pública, em
**Settings → Public access**, e o domínio que sair de lá é o `R2_PUBLIC_URL`:

- **Domínio próprio** (`arquivos.belmare.com.br`) — o certo para produção.
- **Subdomínio `r2.dev`** — resolve para testar, mas é limitado por taxa e a
  própria Cloudflare desaconselha em produção.

Sem as variáveis do R2 o painel continua funcionando: os uploads caem em
`.uploads/`, no disco. A prova de que o envio direto funciona está em
[`upload-de-24-mb.md`](upload-de-24-mb.md).
