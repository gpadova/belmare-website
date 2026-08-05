import { Ficha, FichaLinha } from "@/components/ficha";
import { Secao } from "@/components/quem-somos/secao";
import { textosDeQuemSomos } from "@/lib/quem-somos-consulta";

/**
 * O que a Belmare faz.
 *
 * ⚠️ **É A SEÇÃO QUE FALTAVA, E É A MAIS ÚTIL DA PÁGINA.** A rota anterior
 * gastava seis blocos contando de onde a empresa veio e nenhum dizendo o que
 * ela faz por quem chega. Quem abre "Quem somos" numa representação comercial
 * está decidindo se vale a conversa, e a decisão depende disto: o que acontece
 * entre o primeiro contato e a peça instalada, e quem responde em cada etapa.
 *
 * ⚠️ **AS ETAPAS SÃO DESCRIÇÃO DE TRABALHO, NÃO PROMESSA DE SERVIÇO,** e a
 * ajuda do campo repete isso para quem for editar. Nenhuma linha afirma prazo,
 * exclusividade, condição comercial ou qualidade de atendimento — são as coisas
 * que a empresa de fato faz, e cada uma já está publicada em outro lugar deste
 * site (o catálogo e os arquivos 3D têm rota própria; a venda por loja está nas
 * duas portas da home). Superlativo e adjetivo de autoelogio ficam fora, como
 * em toda a página.
 *
 * ⚠️ **AS ETAPAS ERAM QUATRO LINHAS EM CÓDIGO E VIRARAM LISTA DO PAINEL.** Elas
 * descrevem uma operação comercial que muda sem que o site mude — no dia em que
 * a Belmare parar de acompanhar pedido, ou passar a fazer projeto, a linha
 * errada fica no ar esperando alguém abrir um editor. Lista vazia não desenha
 * ficha nenhuma, e a seção continua de pé com o parágrafo.
 */
export async function Atuacao() {
  const { atuacaoTitulo, atuacao, atuacaoLinhas } = await textosDeQuemSomos();

  return (
    <Secao titulo={atuacaoTitulo}>
      {atuacao !== undefined && (
        <p className="text-body mt-6 max-w-[64ch] text-pretty text-graphite">
          {atuacao}
        </p>
      )}

      {atuacaoLinhas.length > 0 && (
        <Ficha className="mt-10 md:mt-14">
          {atuacaoLinhas.map((linha) => (
            <FichaLinha key={linha.rotulo} rotulo={linha.rotulo}>
              {linha.texto}
            </FichaLinha>
          ))}
        </Ficha>
      )}
    </Secao>
  );
}
