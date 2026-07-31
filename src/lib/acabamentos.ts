import type { Imagem } from "@/lib/acervo";
import { opcional } from "@/lib/campo-opcional";
import { imagemDoPainel } from "@/lib/representadas-traducao";
import type { Acabamento as AcabamentoGerado } from "@/payload-types";

/** Tecido ou pintura — não há um terceiro tipo hoje (ver `collections/acabamentos.ts`). */
export type TipoDeAcabamento = "tecido" | "pintura";

export type Acabamento = {
  nome: string;
  tipo: TipoDeAcabamento;
  /** Ausente só na leitura em profundidade errada — obrigatória no painel. */
  amostra?: Imagem;
};

export function acabamentoDoPainel(doc: AcabamentoGerado): Acabamento {
  return {
    nome: doc.nome,
    tipo: doc.tipo,
    ...opcional("amostra", imagemDoPainel(doc.amostra)),
  };
}
