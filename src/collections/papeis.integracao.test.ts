import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vitest";

import {
  criarImagem,
  criarRepresentadaPublicada,
  representadaMinima,
} from "@/test/apoio-de-integracao";

/**
 * A fronteira operador × administrador contra um Payload de verdade — PRA-125.
 *
 * ⚠️ **`overrideAccess: false` EM TODA CHAMADA DESTE ARQUIVO.** É o que faz
 * este teste provar a mesma coisa que um pedido de fora do painel (REST,
 * GraphQL, um script sem sessão) encontraria — não um botão escondido na
 * tela, mas a recusa na própria API. Sem isto, a Local API do Payload ignora
 * `access` por padrão (é assim que todo OUTRO teste de integração deste
 * projeto semeia dado sem precisar logar), e este arquivo estaria só
 * confirmando que os dados batem, não que a fronteira existe.
 */

let payload: Payload;
let fotoDaGaleria: number;
let fotoDeAbertura: number;

let operador: { id: number };
let administrador: { id: number };

beforeAll(async () => {
  payload = await getPayload({ config });

  fotoDaGaleria = await criarImagem(
    payload,
    "Sofá modular estofado em corda náutica",
    "galeria-papeis.jpg",
  );
  fotoDeAbertura = await criarImagem(
    payload,
    "Sofá modular encostado numa parede de concreto",
    "abertura-papeis.jpg",
  );

  // Criadas pela API local SEM `overrideAccess: false`: aqui é só preparo de
  // cenário (o padrão da Local API já pula `access`, como em todo outro
  // teste de integração deste projeto), nunca o que está sendo provado.
  operador = await payload.create({
    collection: "usuarios",
    data: {
      nome: "Operadora de Teste",
      email: "papeis-operadora@teste.com",
      password: "senha-forte-123",
      papel: "operador",
    },
  });
  administrador = await payload.create({
    collection: "usuarios",
    data: {
      nome: "Administrador de Teste",
      email: "papeis-administrador@teste.com",
      password: "senha-forte-123",
      papel: "administrador",
    },
  });
});

afterAll(async () => {
  await payload.delete({ collection: "representadas", where: {} });
  await payload.delete({ collection: "imagens", where: {} });
  await payload.delete({ collection: "usuarios", where: {} });
  await payload.destroy();
});

beforeEach(async () => {
  // Só representadas — apagar `usuarios` aqui apagaria os dois fixtures
  // acima no meio da suíte.
  await payload.delete({ collection: "representadas", where: {} });
});

describe("criar e apagar representada — só administrador, na API (decisão 14)", () => {
  test("operador é recusado ao criar", async () => {
    await expect(
      payload.create({
        collection: "representadas",
        overrideAccess: false,
        user: operador,
        data: representadaMinima(
          "marca-operador-cria",
          "Marca Operador Cria",
          fotoDaGaleria,
          fotoDeAbertura,
        ),
      }),
    ).rejects.toThrow();

    const { totalDocs } = await payload.find({
      collection: "representadas",
      where: { slug: { equals: "marca-operador-cria" } },
    });
    expect(totalDocs).toBe(0);
  });

  test("sem sessão nenhuma, criar também é recusado", async () => {
    await expect(
      payload.create({
        collection: "representadas",
        overrideAccess: false,
        data: representadaMinima(
          "marca-anonima-cria",
          "Marca Anônima Cria",
          fotoDaGaleria,
          fotoDeAbertura,
        ),
      }),
    ).rejects.toThrow();
  });

  test("administrador consegue criar", async () => {
    const criada = await payload.create({
      collection: "representadas",
      overrideAccess: false,
      user: administrador,
      data: representadaMinima(
        "marca-admin-cria",
        "Marca Admin Cria",
        fotoDaGaleria,
        fotoDeAbertura,
      ),
    });

    expect(criada.slug).toBe("marca-admin-cria");
  });

  test("operador é recusado ao apagar", async () => {
    const marca = await criarRepresentadaPublicada(
      payload,
      representadaMinima(
        "marca-operador-apaga",
        "Marca Operador Apaga",
        fotoDaGaleria,
        fotoDeAbertura,
      ),
    );

    await expect(
      payload.delete({
        collection: "representadas",
        id: marca.id,
        overrideAccess: false,
        user: operador,
      }),
    ).rejects.toThrow();

    // A marca continua existindo — a recusa não é só de resposta, é de fato.
    await expect(
      payload.findByID({ collection: "representadas", id: marca.id }),
    ).resolves.toBeTruthy();
  });

  test("administrador consegue apagar", async () => {
    const marca = await criarRepresentadaPublicada(
      payload,
      representadaMinima(
        "marca-admin-apaga",
        "Marca Admin Apaga",
        fotoDaGaleria,
        fotoDeAbertura,
      ),
    );

    await payload.delete({
      collection: "representadas",
      id: marca.id,
      overrideAccess: false,
      user: administrador,
    });

    await expect(
      payload.findByID({ collection: "representadas", id: marca.id }),
    ).rejects.toThrow();
  });
});

describe("editar o slug — só administrador, na API (decisão 14)", () => {
  test("operador edita a prosa da marca, mas o slug não muda", async () => {
    const marca = await criarRepresentadaPublicada(
      payload,
      representadaMinima("marca-slug-operador", "Marca Slug", fotoDaGaleria, fotoDeAbertura),
    );

    const resultado = await payload.update({
      collection: "representadas",
      id: marca.id,
      overrideAccess: false,
      user: operador,
      data: { slug: "slug-invadido-pelo-operador", fato: "Fato editado pelo operador" },
    });

    // O slug permanece o original — a guarda de campo recusou só ele.
    expect(resultado.slug).toBe("marca-slug-operador");
    // O resto do documento gravou normalmente: o operador não fica travado
    // fora da própria edição por causa de um campo que não é dele.
    expect(resultado.fato).toBe("Fato editado pelo operador");
  });

  test("administrador edita o slug", async () => {
    const marca = await criarRepresentadaPublicada(
      payload,
      representadaMinima("marca-slug-admin", "Marca Slug Admin", fotoDaGaleria, fotoDeAbertura),
    );

    const resultado = await payload.update({
      collection: "representadas",
      id: marca.id,
      overrideAccess: false,
      user: administrador,
      data: { slug: "slug-trocado-pelo-admin" },
    });

    expect(resultado.slug).toBe("slug-trocado-pelo-admin");
  });
});

describe("usuários — só administrador cria conta e troca papel", () => {
  test("operador é recusado ao criar outra conta", async () => {
    await expect(
      payload.create({
        collection: "usuarios",
        overrideAccess: false,
        user: operador,
        data: {
          nome: "Conta Indevida",
          email: "papeis-conta-indevida@teste.com",
          password: "senha-forte-123",
        },
      }),
    ).rejects.toThrow();
  });

  test("operador não consegue se promover a administrador editando a própria conta", async () => {
    const resultado = await payload.update({
      collection: "usuarios",
      id: operador.id,
      overrideAccess: false,
      user: operador,
      data: { papel: "administrador", nome: "Operadora Renomeada" },
    });

    // O papel não mudou — só o campo `papel` foi recusado.
    expect(resultado.papel).toBe("operador");
    // O resto do próprio cadastro (o nome) grava normalmente.
    expect(resultado.nome).toBe("Operadora Renomeada");
  });

  test("administrador cria conta nova (nasce operador) e depois promove", async () => {
    const criada = await payload.create({
      collection: "usuarios",
      overrideAccess: false,
      user: administrador,
      data: {
        nome: "Conta Nova Pelo Admin",
        email: "papeis-conta-nova-admin@teste.com",
        password: "senha-forte-123",
      },
    });
    expect(criada.papel).toBe("operador"); // defaultValue do campo

    const promovida = await payload.update({
      collection: "usuarios",
      id: criada.id,
      overrideAccess: false,
      user: administrador,
      data: { papel: "administrador" },
    });
    expect(promovida.papel).toBe("administrador");
  });
});

describe("conta anterior a este ticket — sem papel gravado — conta como administradora", () => {
  test("consegue criar e apagar representada, exatamente como um administrador explícito", async () => {
    /* ⚠️ **NÃO É `payload.create` — DE PROPÓSITO.** Uma conta "de antes deste
       ticket" nunca passou pelo hook de `beforeValidate` que este ticket
       acrescenta (ele só existe a partir de agora, e só roda em `create`);
       ela é uma linha que já estava no banco quando a coluna `papel` nasceu
       sem `DEFAULT` (comportamento confirmado empiricamente durante este
       ticket — ver a nota em `collections/usuarios.ts`). `payload.create`
       simula uma conta NASCENDO agora, que é exatamente o caso que o hook
       cobre; inserir a linha direto pelo `pool` é o que de fato reproduz uma
       conta anterior, sem o hook no meio para "corrigir" o cenário que este
       teste quer provar. */
    await payload.db.pool.query(
      `INSERT INTO usuarios (nome, email, hash, salt, updated_at, created_at)
       VALUES ($1, $2, 'x', 'y', now(), now())`,
      ["Conta Anterior ao Papel", "papeis-conta-legado@teste.com"],
    );
    const { rows } = await payload.db.pool.query(
      "SELECT id, papel FROM usuarios WHERE email = $1",
      ["papeis-conta-legado@teste.com"],
    );
    const legado = rows[0] as { id: number; papel: string | null };
    expect(legado.papel).toBeNull(); // confirma a premissa do teste

    const criada = await payload.create({
      collection: "representadas",
      overrideAccess: false,
      user: legado,
      data: representadaMinima(
        "marca-conta-legado",
        "Marca Conta Legado",
        fotoDaGaleria,
        fotoDeAbertura,
      ),
    });
    expect(criada.slug).toBe("marca-conta-legado");

    await payload.delete({
      collection: "representadas",
      id: criada.id,
      overrideAccess: false,
      user: legado,
    });
    await expect(
      payload.findByID({ collection: "representadas", id: criada.id }),
    ).rejects.toThrow();

    await payload.delete({ collection: "usuarios", id: legado.id });
  });
});
