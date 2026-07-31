import { describe, expect, test } from "vitest";

import {
  MINIMO_PARA_PUBLICAR,
  projetosPublicaveis,
  type Projeto,
} from "@/lib/projetos";

function projetoFake(obra: string): Projeto {
  return {
    obra,
    cidade: "Florianópolis",
    uf: "SC",
    ano: 2025,
    marcas: ["mare-mobilia"],
    foto: { src: "/acervo/projeto-fake.jpg", alt: "Imagem de referência." },
    creditoArquiteto: "Estúdio Fake",
  };
}

function projetosFakes(quantos: number): Projeto[] {
  return Array.from({ length: quantos }, (_, i) => projetoFake(`Obra ${i + 1}`));
}

describe("projetosPublicaveis", () => {
  test("menos de três projetos não publica nenhum — dois leem como exceção", () => {
    const poucos = projetosFakes(MINIMO_PARA_PUBLICAR - 1);
    expect(projetosPublicaveis(poucos)).toEqual([]);
  });

  test("três projetos ou mais publica todos eles", () => {
    const minimo = projetosFakes(MINIMO_PARA_PUBLICAR);
    expect(projetosPublicaveis(minimo)).toEqual(minimo);

    const acima = projetosFakes(MINIMO_PARA_PUBLICAR + 1);
    expect(projetosPublicaveis(acima)).toEqual(acima);
  });
});
