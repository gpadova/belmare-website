import { Ficha, FichaLinha } from "@/components/ficha";
import { Secao } from "@/components/quem-somos/secao";
import { buscarQuemSomos } from "@/lib/espinha-consulta";
import { porExtenso } from "@/lib/frase";
import { representadasDaPagina } from "@/lib/representadas-consulta";

/**
 * O que a Belmare faz.
 *
 * ⚠️ **É A SEÇÃO QUE FALTAVA, E É A MAIS ÚTIL DA PÁGINA.** A rota anterior
 * gastava seis blocos contando de onde a empresa veio e nenhum dizendo o que
 * ela faz por quem chega. Quem abre "Quem somos" numa representação comercial
 * está decidindo se vale a conversa, e a decisão depende disto: o que acontece
 * entre o primeiro contato e a peça instalada, e quem responde em cada etapa.
 *
 * ⚠️ **AS QUATRO LINHAS SÃO DESCRIÇÃO DE TRABALHO, NÃO PROMESSA DE SERVIÇO.**
 * Nenhuma delas afirma prazo, exclusividade, condição comercial ou qualidade de
 * atendimento — são as coisas que a empresa de fato faz, e cada uma já está
 * publicada em outro lugar deste site (o catálogo e os arquivos 3D têm rota
 * própria; a venda por loja está na ficha do fecho). Superlativo e adjetivo de
 * autoelogio ficam fora, como em toda a página.
 */
export async function Atuacao() {
  const representadas = await representadasDaPagina();
  const { atuacao } = await buscarQuemSomos();

  const quantas = porExtenso(representadas.length);

  return (
    <Secao titulo="O que a Belmare faz.">
      {atuacao !== undefined && (
        <p className="text-body mt-6 max-w-[64ch] text-pretty text-graphite">
          {atuacao}
        </p>
      )}

      <Ficha className="mt-10 md:mt-14">
        <FichaLinha rotulo="Representação">
          Apresenta as linhas das {quantas} fábricas às lojas e aos escritórios
          de arquitetura do Sul, e responde por todas elas na mesma conversa.
        </FichaLinha>
        <FichaLinha rotulo="Especificação">
          Responde medida, material, acabamento e prazo, e reúne num lugar só os
          catálogos e os arquivos 3D das {quantas} fábricas.
        </FichaLinha>
        <FichaLinha rotulo="Pedido">
          Acompanha o pedido junto com a loja que fecha a venda, da proposta até
          a entrega.
        </FichaLinha>
        <FichaLinha rotulo="Pós-venda">
          Resolve a assistência depois da entrega, para qualquer uma das marcas
          representadas.
        </FichaLinha>
      </Ficha>
    </Secao>
  );
}
