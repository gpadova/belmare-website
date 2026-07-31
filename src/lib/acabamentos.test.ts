import { describe, expect, test } from "vitest";

import { acabamentoDoPainel } from "@/lib/acabamentos";
import type {
  Acabamento as AcabamentoGerado,
  Imagen as ImagemGerada,
} from "@/payload-types";

const AGORA = "2026-07-31T00:00:00.000Z";

function imagem(campos: Partial<ImagemGerada> = {}): ImagemGerada {
  return {
    id: 1,
    descricao: "Amostra de tecido de performance, close-up da trama",
    mock: true,
    url: "/api/imagens/file/amostra.jpg",
    updatedAt: AGORA,
    createdAt: AGORA,
    ...campos,
  };
}

function documento(campos: Partial<AcabamentoGerado> = {}): AcabamentoGerado {
  return {
    id: 1,
    representada: 1,
    nome: "Olefina Areia",
    tipo: "tecido",
    amostra: imagem(),
    updatedAt: AGORA,
    createdAt: AGORA,
    ...campos,
  };
}

describe("o acabamento, do painel para a página", () => {
  test("nome e tipo atravessam como estão", () => {
    const acabamento = acabamentoDoPainel(documento());

    expect(acabamento.nome).toBe("Olefina Areia");
    expect(acabamento.tipo).toBe("tecido");
  });

  test("pintura é o outro tipo possível — não há um terceiro", () => {
    expect(acabamentoDoPainel(documento({ tipo: "pintura" })).tipo).toBe(
      "pintura",
    );
  });

  test("amostra que veio só como identificador não vira imagem quebrada", () => {
    expect(
      acabamentoDoPainel(documento({ amostra: 5 })).amostra,
    ).toBeUndefined();
  });
});
