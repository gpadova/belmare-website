import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { pt } from "@payloadcms/translations/languages/pt";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Acabamentos } from "@/collections/acabamentos";
import { Arquivos } from "@/collections/arquivos";
import { Arquivos3d } from "@/collections/arquivos3d";
import { Imagens } from "@/collections/imagens";
import { Paginas } from "@/collections/paginas";
import { Pecas } from "@/collections/pecas";
import { Projetos } from "@/collections/projetos";
import { Representadas } from "@/collections/representadas";
import { Usuarios } from "@/collections/usuarios";
import { Empresa } from "@/globals/empresa";
import { Home } from "@/globals/home";
import { Prancha } from "@/globals/prancha";
import { QuemSomos } from "@/globals/quem-somos";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * As credenciais do Cloudflare R2. Enquanto não estiverem todas presentes o
 * plugin fica desligado e os uploads caem em disco local — é o que permite
 * rodar o painel numa máquina nova sem conta de nuvem nenhuma.
 */
const R2 = {
  bucket: process.env.R2_BUCKET,
  contaId: process.env.R2_ACCOUNT_ID,
  chave: process.env.R2_ACCESS_KEY_ID,
  segredo: process.env.R2_SECRET_ACCESS_KEY,
  urlPublica: process.env.R2_PUBLIC_URL,
};

const r2Configurado = Object.values(R2).every(
  (valor) => typeof valor === "string" && valor !== "",
);

/**
 * A URL pública de um arquivo no bucket.
 *
 * ⚠️ O adaptador S3, sozinho, devolveria o endpoint da API
 * (`https://<conta>.r2.cloudflarestorage.com/<bucket>/<arquivo>`), que exige
 * assinatura e devolve 401 para o visitante. `R2_PUBLIC_URL` é o domínio de
 * leitura pública do bucket — subdomínio `r2.dev` ou domínio próprio. Sem esta
 * troca o catálogo sobe e não desce.
 */
const urlPublicaDoArquivo = ({
  filename,
  prefix,
}: {
  filename: string;
  prefix?: string;
}): string => {
  const base = (R2.urlPublica ?? "").replace(/\/+$/, "");
  const caminho = [prefix, encodeURIComponent(filename)]
    .filter((parte) => parte !== undefined && parte !== "")
    .join("/");

  return `${base}/${caminho}`;
};

/**
 * O armazenamento dos binários no Cloudflare R2.
 *
 * ⚠️ `clientUploads: true` é a razão de ser deste ticket, não uma otimização.
 * A função serverless da Vercel recusa corpo de requisição acima de 4,5 MB, e
 * os catálogos têm 24 MB. Com ele ligado, o servidor só assina uma URL e o
 * navegador faz o PUT direto no bucket — o arquivo nunca passa pela função.
 * Isso exige CORS liberado no bucket para o método PUT a partir da origem do
 * site; ver `.env.example`.
 *
 * ⚠️ O R2 também não cobra egresso. Este site existe para entregar arquivo
 * pesado, então o egresso é o custo recorrente — é o segundo motivo, e não o
 * menor.
 */
const armazenamentoR2 = s3Storage({
  enabled: r2Configurado,

  collections: {
    imagens: {
      // O visitante busca o arquivo direto no bucket, não pela função.
      disablePayloadAccessControl: true,
      generateFileURL: urlPublicaDoArquivo,
    },
    arquivos: {
      disablePayloadAccessControl: true,
      generateFileURL: urlPublicaDoArquivo,
    },
  },

  bucket: R2.bucket ?? "",
  clientUploads: true,

  config: {
    // O R2 não tem regiões; o SDK da AWS exige o campo assim mesmo.
    region: "auto",
    endpoint: `https://${R2.contaId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2.chave ?? "",
      secretAccessKey: R2.segredo ?? "",
    },

    /* ⚠️ ISTO NÃO É AJUSTE FINO — sem isto o upload grande falha.
       A partir da versão 3.729 o SDK da AWS calcula um checksum CRC32 por
       padrão e o embute na URL assinada. Na assinatura o corpo ainda não
       existe, então o valor gravado é o CRC32 de um arquivo VAZIO; o navegador
       manda 24 MB contra uma URL que jura que o corpo é vazio, e o bucket
       recusa. `WHEN_REQUIRED` tira o parâmetro da assinatura. */
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  },
});

export default buildConfig({
  admin: {
    user: Usuarios.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: " — Painel Belmare",
    },
  },

  /**
   * ⚠️ `Paginas` (PRA-124) é a única coleção que não guarda uma COISA do acervo:
   * ela guarda a COMPOSIÇÃO de três rotas — `/arquitetos`, `/contato` e
   * `/politica-de-privacidade`. As três nunca foram escritas em código, então
   * não há argumento de desenho a proteger nelas. A home, `/quem-somos` e
   * `/representadas/[marca]` continuam de espinha fixa e não entram aqui: a
   * sequência daquelas páginas É o argumento delas, e o que é editável dentro
   * delas já são os globais `Home` e `QuemSomos`.
   */
  collections: [
    Representadas,
    Pecas,
    Arquivos3d,
    Acabamentos,
    Projetos,
    Paginas,
    Imagens,
    Arquivos,
    Usuarios,
  ],

  /**
   * ⚠️ Os globais são o conteúdo que não pende de nenhuma coleção — a decisão
   * 10 da spec. `Empresa` é o que destrava o lançamento: o WhatsApp e o e-mail
   * comercial estavam mockados em `lib/site.ts` e saíram do código inteiramente
   * em PRA-122. `Home` e `QuemSomos` guardam a prosa DENTRO da espinha fixa —
   * nunca a ordem das seções, nunca os títulos.
   *
   * ⚠️ `Prancha` (PRA-123) é o quarto, e é de outra natureza: não guarda prosa,
   * guarda uma fotografia e a geometria das chamadas que apontam para dentro
   * dela. Entrou como global pela mesma regra dos outros — é conteúdo de UMA
   * página (`/representadas`) e não pende de fábrica nenhuma. A prancha do
   * TERRITÓRIO, de `/quem-somos`, continua fora do painel: é malha do IBGE,
   * regerada da fonte.
   */
  globals: [Empresa, Home, QuemSomos, Prancha],

  /**
   * ⚠️ O painel é para UMA pessoa não técnica na Belmare, que o abre uma vez
   * por mês. Português é a única língua oferecida — não há seletor de idioma
   * para ela errar, e não há inglês de reserva atrás de um rótulo traduzido
   * pela metade. Rótulo, ajuda e mensagem de recusa de cada campo são escritos
   * à mão em pt-BR nas coleções; isto aqui traduz o resto do painel.
   */
  i18n: {
    fallbackLanguage: "pt",
    supportedLanguages: { pt },
  },

  editor: lexicalEditor(),

  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI ?? "" },
  }),

  /* Necessário para o Payload ler dimensão e orientação de imagem. */
  sharp,

  secret: process.env.PAYLOAD_SECRET ?? "",

  /**
   * ⚠️ Estes tipos são para o Payload e para as coleções, NÃO para os
   * componentes. `src/lib` é a camada de tradução do projeto: componente
   * importa tipo de domínio de lá e nunca daqui, porque o tipo gerado não
   * consegue expressar as invariantes de que o desenho depende — ver a nota
   * sobre as duas escritas do catálogo em `lib/representadas.ts`.
   */
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  plugins: [armazenamentoR2],
});
