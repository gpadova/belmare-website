import { describe, expect, test } from "vitest";

import {
  MINIMO_PARA_PUBLICAR,
  projetoDoPainel,
  projetosPublicaveis,
  type Projeto,
} from "@/lib/projetos";
import type {
  Imagen as ImagemGerada,
  Projeto as ProjetoGerado,
  Representada as RepresentadaGerada,
} from "@/payload-types";

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

/**
 * O mapper de Projeto, sobre as formas que o Payload de fato gera — mesmo
 * motivo de `lib/pecas.test.ts`/`lib/arquivos3d.test.ts`: um banco daria só os
 * casos fáceis e esconderia justamente o relacionamento que voltou como
 * identificador solto, ou a fotografia marcada como mock que este ticket
 * existe para nunca deixar passar por obra entregue.
 */
const AGORA = "2026-07-31T00:00:00.000Z";

function imagem(campos: Partial<ImagemGerada> = {}): ImagemGerada {
  return {
    id: 1,
    descricao: "Área externa entregue com sofá modular e ombrelone lateral",
    mock: false,
    url: "/api/imagens/file/projeto-fake.jpg",
    updatedAt: AGORA,
    createdAt: AGORA,
    ...campos,
  };
}

function representada(campos: Partial<RepresentadaGerada> = {}): RepresentadaGerada {
  return {
    id: 1,
    nome: "Trisol",
    slug: "trisol",
    resolve: "a sombra",
    parte: "Estrutura",
    fato: "Perfil extrudado de alumínio 6063-T5",
    imagem: 1,
    imagemLarga: 2,
    updatedAt: AGORA,
    createdAt: AGORA,
    ...campos,
  };
}

function documento(campos: Partial<ProjetoGerado> = {}): ProjetoGerado {
  return {
    id: 1,
    obra: "Residência Costa",
    cidade: "Florianópolis",
    uf: "SC",
    ano: 2025,
    marcas: [representada()],
    foto: imagem(),
    creditoArquiteto: "Estúdio Fake Arquitetura",
    updatedAt: AGORA,
    createdAt: AGORA,
    ...campos,
  };
}

describe("projetoDoPainel", () => {
  test("obra completa mapeia, e as marcas chegam como slugs — não como documento inteiro", () => {
    const trisol = representada({ id: 1, slug: "trisol", nome: "Trisol" });
    const gda = representada({ id: 2, slug: "gda-moveis", nome: "GDA Móveis" });

    const projeto = projetoDoPainel(documento({ marcas: [trisol, gda] }));

    expect(projeto).toEqual({
      obra: "Residência Costa",
      cidade: "Florianópolis",
      uf: "SC",
      ano: 2025,
      marcas: ["trisol", "gda-moveis"],
      foto: {
        src: "/api/imagens/file/projeto-fake.jpg",
        alt: "Área externa entregue com sofá modular e ombrelone lateral",
      },
      creditoArquiteto: "Estúdio Fake Arquitetura",
    });
  });

  test("marca que veio só como identificador (profundidade errada) cai fora, nunca vira slug inventado", () => {
    const trisol = representada({ id: 1, slug: "trisol" });

    const projeto = projetoDoPainel(documento({ marcas: [1, trisol] }));

    expect(projeto?.marcas).toEqual(["trisol"]);
  });

  test("nenhuma marca resolvida: o projeto inteiro fica ausente, não um projeto sem marcas", () => {
    expect(projetoDoPainel(documento({ marcas: [1, 2] }))).toBeUndefined();
  });

  test("fotografia marcada como mock exclui o projeto inteiro — nunca é apresentado como obra entregue", () => {
    // O critério de aceite mais delicado deste ticket: uma imagem de
    // referência não pode virar "projeto entregue" só porque o documento do
    // projeto foi salvo. A exclusão é recalculada aqui, na leitura — não
    // depende de ninguém ter revalidado o projeto depois de marcar a foto.
    expect(
      projetoDoPainel(documento({ foto: imagem({ mock: true }) })),
    ).toBeUndefined();
  });

  test("fotografia que veio só como identificador (profundidade errada) também exclui o projeto", () => {
    expect(projetoDoPainel(documento({ foto: 9 }))).toBeUndefined();
  });

  test("sem crédito do arquiteto, o projeto inteiro fica ausente — o campo não tem meio-termo", () => {
    expect(projetoDoPainel(documento({ creditoArquiteto: "" }))).toBeUndefined();
    expect(projetoDoPainel(documento({ creditoArquiteto: "   " }))).toBeUndefined();
  });
});
