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
THESIS: A primeira linha diz o RAMO, com o nome que o ramo usa, porque quem
lê já é do ramo. Recusa o herói de categoria pura ("móveis para área externa",
que descreve uma fábrica), o grid de logos, o jargão de contar fábricas e
interlocutores (30/07/2026) e a promessa de posicionamento sem verbo
(05/08/2026). O que sobra no h1 é o que um lojista precisa saber em dois
segundos: é uma representação, e o produto é área externa.
OWN-WORLD: Papel #F5F3F0, tinta #17171A, grafite #3D3D40, fio #C9C6C0. Raio 0,
sombra 0. A interface é acromática; o matiz existe em um único objeto, o
logotipo (azul #00339A, verde #009A34, vermelho #FE0100), e não sai dele —
não vira acento, nem estado, nem fio, nem fundo. A interface é invisível: a
fotografia carrega a página. A mono é rótulo, não linguagem. Nenhuma textura,
nenhum padrão de fundo — a identidade é tipografia, grade e o fio de 1px.
STORY: O visitante se reconhece — especifica ou revende —, descobre que uma só
empresa responde pelas quatro fábricas que montam a área externa inteira, e
escolhe uma das duas portas. O site fala com loja e com escritório, nunca com
consumidor final.
FIRST VIEWPORT: cabeçalho 72px em papel; fotografia sangrando na altura da
tela; sobre o pé da imagem, "Representação comercial de móveis para área
externa." e a linha que nomeia Marê, GDA, Bux e Trisol, o território e o tempo
de casa. Nada define a categoria nem nomeia o leitor de volta para ele — o
comprador de loja já sabe as duas coisas. WhatsApp persistente no topo.
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
        <BalaoWhatsapp />
      </body>
    </html>
  );
}
