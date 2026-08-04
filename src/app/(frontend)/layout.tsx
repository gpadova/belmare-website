import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { draftMode } from "next/headers";

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
 * que a empresa mudar de nome — que é literalmente o assunto do bloco 03 de
 * `/quem-somos`.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { nomeCompleto } = await buscarEmpresa();

  return {
    title: {
      default:
        "Belmare Representações — móveis, estrutura, conforto e sombra para a área externa",
      template: "%s — Belmare Representações",
    },
    description:
      "Sofá, mesa, espreguiçadeira e ombrelone para área externa de alto padrão. A Belmare representa Marê Mobília, GDA Móveis, Bux Garden e Trisol no Paraná, Santa Catarina e Rio Grande do Sul, desde 1999.",
    openGraph: {
      type: "website",
      locale: "pt_BR",
      ...(nomeCompleto === undefined ? {} : { siteName: nomeCompleto }),
    },
  };
}

const CONTRATO_DE_DIRECAO = `<!--
THESIS: A primeira linha nomeia OBJETOS, não o organograma. Recusa o herói de
categoria ("móveis para área externa"), o grid de logos e — desde 30/07/2026 —
o jargão de contar fábricas e interlocutores, que descreve como a empresa se
organiza para quem não perguntou.
OWN-WORLD: Papel #F5F3F0, tinta #17171A, grafite #3D3D40, fio #C9C6C0. Raio 0,
sombra 0. A interface é acromática; o matiz existe em um único objeto, o
logotipo (azul #00339A, verde #009A34, vermelho #FE0100), e não sai dele —
não vira acento, nem estado, nem fio, nem fundo. A interface é invisível: a
fotografia carrega a página. A mono é rótulo, não linguagem. Nenhuma textura,
nenhum padrão de fundo — a identidade é tipografia, grade e o fio de 1px.
STORY: O visitante vê nomeadas as peças que resolvem uma área externa, descobre
que uma só empresa dá conta das quatro, e escolhe uma das duas portas.
FIRST VIEWPORT: cabeçalho 72px em papel; fotografia sangrando na altura da
tela; sobre o pé da imagem, "Sofá, mesa, espreguiçadeira e ombrelone." e a
linha que nomeia Marê, GDA, Bux e Trisol, o território e o tempo de casa.
WhatsApp persistente no topo.
FORM: Direção A — editorial/arquivo. Revisado em 30/07/2026: o eixo de
material foi cancelado por falta de dado (4 de 32 células), e com ele saíram a
marca-sistema generativa e a anatomia de etiqueta. Ver briefing/estrutura.md §4.
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
      </body>
    </html>
  );
}
