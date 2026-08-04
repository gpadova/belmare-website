import { Bloco } from "@/components/quem-somos/bloco";
import { anoDeFundacao, anosDeMercado } from "@/lib/empresa";
import { buscarEmpresa } from "@/lib/empresa-consulta";
import { buscarQuemSomos } from "@/lib/espinha-consulta";

/**
 * 01 — O começo.
 *
 * Sem foto, de propósito. Todo site de representação abre com "26 anos de
 * tradição e excelência" sobre uma imagem de banco. Aqui o primeiro fato é o
 * tempo, e por isso o único elemento em escala de display na página inteira é
 * um número de quatro dígitos.
 *
 * ⚠️ **A FAIXA DE IDENTIFICAÇÃO SAIU — RAZÃO SOCIAL, CNPJ, ABERTURA E PORTE.**
 * Ela ocupava a primeira coisa que se lia numa página que precisa vender, e as
 * quatro linhas trabalhavam contra: "Empresa de pequeno porte" é o registro
 * dizendo ao arquiteto que a empresa é pequena; CNPJ e razão social já estão no
 * rodapé, que é onde a face legal do site mora; e "Abertura 22.04.1999" repetia
 * em ficha o que o "1999" em display diz melhor três centímetros abaixo.
 * Registro público se confere pelo CNPJ do rodapé — ele não é o cabeçalho de
 * uma página de venda.
 *
 * ⚠️ O LCP desta página é tipográfico. Nada aqui deve virar imagem.
 *
 * ⚠️ O contador de anos NUNCA é escrito à mão, e **não existe campo para ele em
 * lugar nenhum do painel**. `anosDeMercado` conta a partir da data de abertura
 * cadastrada, com dia e mês; a diferença simples de anos erra por um durante
 * quatro meses todo ano, e um site que abre com o próprio tempo de casa não
 * pode errar o primeiro número dele. O ano em display e a contagem saem da
 * MESMA data — nenhum dos dois é um segundo campo que possa discordar do outro.
 *
 * ⚠️ **O H1 NÃO NARRA INTENÇÃO.** "A Belmare começou com móveis de jardim" é o
 * que o nome público anterior registra, produto a produto, e o bloco 02 mostra
 * o documento logo abaixo. Nada aqui conta por que a empresa foi fundada, o que
 * alguém sonhou ou em que a família acreditava: disso não existe documento
 * nenhum, e é exatamente onde uma página institucional começa a inventar.
 *
 * ⚠️ **FRASE INTEIRA, COM SUJEITO E COM PLURAL.** A primeira versão deste h1 era
 * "Começou com móvel de jardim." — sem sujeito, e com o substantivo no singular
 * sem artigo. É a voz de catálogo de design, não a de um site brasileiro:
 * ninguém diz "móvel de jardim", diz "móveis de jardim". A referência do
 * registro certo é como as fábricas do próprio setor escrevem a história delas
 * (a Butzke, de Timbó, abre com "Foi no ano de 1899 que Emil Butzke produziu as
 * primeiras peças em madeira") — cronologia em frase inteira, substantivo
 * concreto no plural, zero aforismo. O polo oposto, também a evitar, é o
 * "somos mais do que uma representação comercial: somos parceiros estratégicos"
 * que a categoria escreve — e que a lista vinculante desta página já proíbe.
 */
export async function RegistroAbertura() {
  const empresa = await buscarEmpresa();
  const { registro } = await buscarQuemSomos();

  const anos = anosDeMercado(empresa.abertura);
  const fundacao = anoDeFundacao(empresa.abertura);
  const cidade = empresa.endereco?.cidade;

  /* "Florianópolis · 27 anos" — as duas coordenadas da história, as duas
     geradas. Uma linha sem valor some da lista em vez de deixar um separador
     pendurado no nada. */
  const COORDENADAS = [
    cidade,
    anos === undefined ? undefined : `${anos} anos`,
  ].filter((parte) => parte !== undefined);

  return (
    <Bloco numero="01">
      {fundacao !== undefined && (
        <p className="text-display font-normal tabular-nums">{fundacao}</p>
      )}
      {COORDENADAS.length > 0 && (
        <p className="mono uppercase mt-3 text-graphite">
          {COORDENADAS.join(" · ")}
        </p>
      )}

      <div className="mt-10 border-t border-line pt-10 md:mt-14 md:pt-14">
        <h1 className="text-h1 max-w-[20ch] font-normal text-balance">
          A Belmare começou com móveis de jardim.
        </h1>
        {registro !== undefined && (
          <p className="text-body mt-6 max-w-[64ch] text-pretty text-graphite">
            {registro}
          </p>
        )}
      </div>
    </Bloco>
  );
}
