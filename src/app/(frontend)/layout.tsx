import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { draftMode } from "next/headers";

import { BalaoWhatsapp } from "@/components/balao-whatsapp";
import { Cabecalho } from "@/components/cabecalho";
import { FaixaDeRascunho } from "@/components/faixa-de-rascunho";
import { Rodape } from "@/components/rodape";
import { buscarEmpresa } from "@/lib/empresa-consulta";
import "./globals.css";

/* Geist é o fallback declarado na pilha de globals.css, não a fonte do projeto.
   A tipografia é Söhne; ver a nota no topo daquele arquivo. */
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

/**
 * ⚠️ O RODAPÉ MOSTRA `anosDeMercado()`, E ELE MORA AQUI — em toda rota do
 * site, inclusive a 404. `/` e `/quem-somos` já declaravam este mesmo piso
 * diário porque também mostram o tempo de casa no corpo da página; sem esta
 * linha, `/representadas`, a página de marca e `/catalogos` não declaram
 * nada, e o Next as trata como estáticas para sempre — o número do rodapé
 * congela no aniversário e só volta a virar no próximo deploy. É a mesma
 * falha "silenciosa, anual" documentada em `lib/site.ts`, e ela vale para toda
 * rota que tenha rodapé, não só para as duas que já se protegiam sozinhas.
 *
 * O Next usa o MENOR `revalidate` entre layout e página numa mesma rota, e
 * aqui os dois já concordam em 86400 — nenhuma dessas duas declarações fica
 * redundante ao ponto de poder sair.
 */
export const revalidate = 86400;

/**
 * ⚠️ Gerada, e não constante, por causa de uma linha só: `siteName` é o nome
 * público da empresa, e ele é campo do painel desde PRA-122. Uma constante aqui
 * voltaria a ser um nome escrito à mão que ninguém lembra de trocar no dia em
 * que a empresa mudar de nome — e esta empresa já mudou uma vez.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { nomeCompleto } = await buscarEmpresa();

  return {
    title: {
      /* ⚠️ "conforto e sombra" saiu: é benefício, e benefício é a linguagem que
         `resolve` já teve de desaprender no ledger das representadas. O título
         nomeia o que a empresa É para quem compra dela — representação, para
         loja e para projeto. */
      default:
        /* ⚠️ "móveis DE área externa" aqui, e "móveis PARA área externa" no h1
           e na descrição: a troca de 05/08/2026 encostou dois "para" na mesma
           linha ("móveis para área externa para lojas e arquitetos"). As duas
           regências são corretas e correntes no setor; nesta linha a primeira
           some para o público ficar com a única preposição que importa. */
        "Belmare Representações: móveis de área externa para lojas e arquitetos",
      template: "%s · Belmare Representações",
    },
    /* ⚠️ Duas correções nesta linha, e as duas valem para o site inteiro.
       Primeira: cada estado pede a sua preposição ("no Paraná", "em Santa
       Catarina", "no Rio Grande do Sul") — a forma antiga, "no Paraná, Santa
       Catarina e Rio Grande do Sul", não era português. Aqui eles vão escritos
       à mão, um a um, porque é a linha que o buscador mostra; na home visível a
       frase diz "no Sul do país" e evita a regência.

       Segunda: a descrição nomeia o PÚBLICO (lojas e escritórios), e não uma
       lista de peças. O cliente de uma representação comercial não é o
       consumidor final — ver a nota longa em `components/abertura.tsx`. */
    description:
      "Representação comercial de móveis para área externa de alto padrão. A Belmare representa Marê Mobília, GDA Móveis, Bux Garden e Trisol, e atende lojas e escritórios de arquitetura no Paraná, em Santa Catarina e no Rio Grande do Sul desde 1999.",
    openGraph: {
      type: "website",
      locale: "pt_BR",
      ...(nomeCompleto === undefined ? {} : { siteName: nomeCompleto }),
    },
  };
}

const CONTRATO_DE_DIRECAO = `<!--
THESIS: A convenção é o compromisso. Esta home é o padrão da categoria
executado no teto do segmento — o que a separa dos sites das concorrentes não é
a estrutura, é o acabamento. Recusa o gesto de autor: nada de instrumento, de
diagrama, de trilho conceitual contrabandeado. A escolha foi do cliente, na
página de decisão, com as alternativas à vista.
OWN-WORLD: Off-white quente #F5F3F0, tinta #17171A, grafite #3D3D40, fio
#C9C6C0. Raio 0. A fotografia carrega toda a cor; o matiz de interface continua
zero, e o único matiz do projeto segue dentro de um logotipo. Söhne em peso
leve na escala grande, e a mono recua para medida real — formato, peso, CNPJ.
Elevação por tom, nunca por sombra dura.
STORY: O visitante entende em segundos que isto é uma representação, vê as
quatro fábricas lado a lado, e escolhe uma das duas portas.
FIRST VIEWPORT: cabeçalho fino em papel; fotografia sangrando de ponta a ponta
por 100svh; no pé dela, sob véu, o h1 em duas linhas e a linha que nomeia as
marcas, o território e o tempo de casa.
FORM: a saída permanente — o padrão da categoria —, escolhida na página de
decisão sobre a semente b95c2020. Barra de qualidade: Gandiablasco, Tribù,
Paola Lenti, Kettal, Artefacto, Breton, Sollos, Micasa.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /* ⚠️ Lido uma vez, no layout raiz — que já está em toda rota do site,
     inclusive a 404 — para a faixa de aviso aparecer em qualquer página que
     o operador esteja pré-visualizando, e não só na de uma coleção. */
  const { isEnabled: emModoDeRascunho } = await draftMode();

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <div hidden dangerouslySetInnerHTML={{ __html: CONTRATO_DE_DIRECAO }} />
        <a
          href="#conteudo"
          className="mono sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
        >
          Ir para o conteúdo
        </a>
        {emModoDeRascunho && <FaixaDeRascunho />}
        <Cabecalho />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Rodape />
        <BalaoWhatsapp />
      </body>
    </html>
  );
}
