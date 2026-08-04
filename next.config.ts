import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

/* O Next não exporta este tipo pelo pacote raiz; derivá-lo da própria
   configuração evita um import de caminho interno, que quebra em atualização. */
type PadraoRemoto = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

/**
 * O host de onde o otimizador do Next aceita buscar imagem.
 *
 * ⚠️ **SEM ISTO, TODA IMAGEM DO PAINEL QUEBRA — e quebra em silêncio.** O
 * `next/image` não busca o arquivo direto: ele aponta para
 * `/_next/image?url=…`, e o otimizador recusa host que não esteja nesta lista
 * com `400 "url" parameter is not allowed`. O arquivo no R2 está perfeito; quem
 * diz não é o Next. Enquanto as fotografias moravam em `/public` o problema não
 * existia, porque origem própria não passa por allowlist — ele nasceu junto com
 * o primeiro upload que foi para o bucket.
 *
 * ⚠️ **O HOST É DERIVADO DE `R2_PUBLIC_URL`, NUNCA ESCRITO À MÃO.** É o mesmo
 * endereço que o `payload.config.ts` usa para montar a URL pública do arquivo —
 * escrever `pub-xxxx.r2.dev` aqui criaria uma segunda cópia do endereço, e no
 * dia de trocar para `arquivos.belmare.com.br` uma das duas ficaria para trás.
 * O caminho entra no padrão porque um S3 compatível endereça por caminho
 * (`localhost:9000/belmare`), que é o caso do MinIO da prova local.
 *
 * Com a variável vazia a lista fica vazia, e é o correto: sem R2 os uploads
 * caem em `.uploads/` e são servidos pela própria origem, que não precisa de
 * autorização nenhuma.
 */
function hostsDeImagem(): PadraoRemoto[] {
  const publico = process.env.R2_PUBLIC_URL?.trim().replace(/^["']|["']$/g, "");
  if (!publico) return [];

  let endereco: URL;
  try {
    endereco = new URL(publico);
  } catch {
    throw new Error(
      `R2_PUBLIC_URL não é uma URL válida: ${JSON.stringify(publico)}. ` +
        "Ela é o domínio de leitura pública do bucket, com esquema e sem barra " +
        "no fim — por exemplo https://pub-xxxx.r2.dev.",
    );
  }

  return [
    {
      protocol: endereco.protocol.replace(":", "") as "http" | "https",
      hostname: endereco.hostname,
      ...(endereco.port ? { port: endereco.port } : {}),
      pathname: `${endereco.pathname.replace(/\/+$/, "")}/**`,
    },
  ];
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: { remotePatterns: hostsDeImagem() },
};

/* `withPayload` liga o painel ao build do Next: externaliza as dependências de
   servidor do Payload e mantém o `sharp` fora do bundle do cliente. */
export default withPayload(nextConfig);
