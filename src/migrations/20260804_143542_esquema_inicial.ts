import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_representadas_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__representadas_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pecas_ambiente" AS ENUM('externo', 'interno');
  CREATE TYPE "public"."enum_pecas_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pecas_v_version_ambiente" AS ENUM('externo', 'interno');
  CREATE TYPE "public"."enum__pecas_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_arquivos3d_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__arquivos3d_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_acabamentos_tipo" AS ENUM('tecido', 'pintura');
  CREATE TYPE "public"."enum_acabamentos_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__acabamentos_v_version_tipo" AS ENUM('tecido', 'pintura');
  CREATE TYPE "public"."enum__acabamentos_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_projetos_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projetos_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_paginas_blocks_caminhos_itens_destino" AS ENUM('rota', 'whatsapp', 'formulario');
  CREATE TYPE "public"."enum_paginas_blocks_caminhos_itens_rota" AS ENUM('/representadas', '/catalogos', '/arquivos-3d', '/quem-somos', '/arquitetos', '/contato', '/politica-de-privacidade');
  CREATE TYPE "public"."enum_paginas_slug" AS ENUM('arquitetos', 'contato', 'politica-de-privacidade');
  CREATE TYPE "public"."enum_paginas_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__paginas_v_blocks_caminhos_itens_destino" AS ENUM('rota', 'whatsapp', 'formulario');
  CREATE TYPE "public"."enum__paginas_v_blocks_caminhos_itens_rota" AS ENUM('/representadas', '/catalogos', '/arquivos-3d', '/quem-somos', '/arquitetos', '/contato', '/politica-de-privacidade');
  CREATE TYPE "public"."enum__paginas_v_version_slug" AS ENUM('arquitetos', 'contato', 'politica-de-privacidade');
  CREATE TYPE "public"."enum__paginas_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_usuarios_papel" AS ENUM('operador', 'administrador');
  CREATE TYPE "public"."enum_empresa_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__empresa_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_home_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_quem_somos_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__quem_somos_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_prancha_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__prancha_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pacote_3d_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pacote_3d_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "representadas_declaracoes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rotulo" varchar,
  	"valor" varchar
  );
  
  CREATE TABLE "representadas_designers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nome" varchar,
  	"nota" varchar
  );
  
  CREATE TABLE "representadas_vocabulario_grupos_itens" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nome" varchar,
  	"nota" varchar
  );
  
  CREATE TABLE "representadas_vocabulario_grupos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nome" varchar,
  	"slug" varchar
  );
  
  CREATE TABLE "representadas_catalogos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"ano" numeric,
  	"arquivo_id" integer
  );
  
  CREATE TABLE "representadas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar,
  	"slug" varchar,
  	"ordem" numeric,
  	"resolve" varchar,
  	"parte" varchar,
  	"base" varchar,
  	"fato" varchar,
  	"imagem_id" integer,
  	"imagem_larga_id" integer,
  	"vocabulario_eixo" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_representadas_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "representadas_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_representadas_v_version_declaracoes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rotulo" varchar,
  	"valor" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_representadas_v_version_designers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar,
  	"nota" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_representadas_v_version_vocabulario_grupos_itens" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar,
  	"nota" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_representadas_v_version_vocabulario_grupos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar,
  	"slug" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_representadas_v_version_catalogos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"ano" numeric,
  	"arquivo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_representadas_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_nome" varchar,
  	"version_slug" varchar,
  	"version_ordem" numeric,
  	"version_resolve" varchar,
  	"version_parte" varchar,
  	"version_base" varchar,
  	"version_fato" varchar,
  	"version_imagem_id" integer,
  	"version_imagem_larga_id" integer,
  	"version_vocabulario_eixo" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__representadas_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_representadas_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pecas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"representada_id" integer,
  	"nome" varchar,
  	"categoria" varchar,
  	"foto_id" integer,
  	"ambiente" "enum_pecas_ambiente",
  	"materiais" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pecas_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pecas_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_representada_id" integer,
  	"version_nome" varchar,
  	"version_categoria" varchar,
  	"version_foto_id" integer,
  	"version_ambiente" "enum__pecas_v_version_ambiente",
  	"version_materiais" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pecas_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "arquivos3d" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"representada_id" integer,
  	"nome" varchar,
  	"arquivo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_arquivos3d_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_arquivos3d_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_representada_id" integer,
  	"version_nome" varchar,
  	"version_arquivo_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__arquivos3d_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "acabamentos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"representada_id" integer,
  	"nome" varchar,
  	"tipo" "enum_acabamentos_tipo",
  	"amostra_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_acabamentos_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_acabamentos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_representada_id" integer,
  	"version_nome" varchar,
  	"version_tipo" "enum__acabamentos_v_version_tipo",
  	"version_amostra_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__acabamentos_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "projetos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"obra" varchar,
  	"cidade" varchar,
  	"uf" varchar,
  	"ano" numeric,
  	"foto_id" integer,
  	"credito_arquiteto" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projetos_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projetos_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"representadas_id" integer
  );
  
  CREATE TABLE "_projetos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_obra" varchar,
  	"version_cidade" varchar,
  	"version_uf" varchar,
  	"version_ano" numeric,
  	"version_foto_id" integer,
  	"version_credito_arquiteto" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projetos_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_projetos_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"representadas_id" integer
  );
  
  CREATE TABLE "paginas_blocks_prosa" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"corpo" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "paginas_blocks_caminhos_itens" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rotulo" varchar,
  	"apoio" varchar,
  	"destino" "enum_paginas_blocks_caminhos_itens_destino" DEFAULT 'rota',
  	"rota" "enum_paginas_blocks_caminhos_itens_rota",
  	"contexto" varchar
  );
  
  CREATE TABLE "paginas_blocks_caminhos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "paginas_blocks_ficha" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "paginas_blocks_fecho" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rotulo" varchar,
  	"contexto" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "paginas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" "enum_paginas_slug",
  	"titulo" varchar,
  	"resumo" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_paginas_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_paginas_v_blocks_prosa" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"corpo" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_paginas_v_blocks_caminhos_itens" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rotulo" varchar,
  	"apoio" varchar,
  	"destino" "enum__paginas_v_blocks_caminhos_itens_destino" DEFAULT 'rota',
  	"rota" "enum__paginas_v_blocks_caminhos_itens_rota",
  	"contexto" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_paginas_v_blocks_caminhos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_paginas_v_blocks_ficha" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_paginas_v_blocks_fecho" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rotulo" varchar,
  	"contexto" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_paginas_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" "enum__paginas_v_version_slug",
  	"version_titulo" varchar,
  	"version_resumo" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__paginas_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "imagens" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"descricao" varchar NOT NULL,
  	"mock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "_imagens_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_descricao" varchar NOT NULL,
  	"version_mock" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_url" varchar,
  	"version_thumbnail_u_r_l" varchar,
  	"version_filename" varchar,
  	"version_mime_type" varchar,
  	"version_filesize" numeric,
  	"version_width" numeric,
  	"version_height" numeric,
  	"version_focal_x" numeric,
  	"version_focal_y" numeric,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "arquivos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "_arquivos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titulo" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_url" varchar,
  	"version_thumbnail_u_r_l" varchar,
  	"version_filename" varchar,
  	"version_mime_type" varchar,
  	"version_filesize" numeric,
  	"version_width" numeric,
  	"version_height" numeric,
  	"version_focal_x" numeric,
  	"version_focal_y" numeric,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"cidade" varchar NOT NULL,
  	"escritorio" varchar NOT NULL,
  	"consentimento_marketing" boolean DEFAULT false,
  	"origem_pagina" varchar NOT NULL,
  	"origem_marca" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "usuarios_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "usuarios" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar NOT NULL,
  	"papel" "enum_usuarios_papel",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"representadas_id" integer,
  	"pecas_id" integer,
  	"arquivos3d_id" integer,
  	"acabamentos_id" integer,
  	"projetos_id" integer,
  	"paginas_id" integer,
  	"imagens_id" integer,
  	"arquivos_id" integer,
  	"leads_id" integer,
  	"usuarios_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"usuarios_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "empresa_telefones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"numero" varchar
  );
  
  CREATE TABLE "empresa" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"whatsapp" varchar,
  	"email" varchar,
  	"instagram" varchar,
  	"nome_completo" varchar,
  	"razao_social" varchar,
  	"cnpj" varchar,
  	"abertura" timestamp(3) with time zone,
  	"porte" varchar,
  	"endereco_logradouro" varchar,
  	"endereco_bairro" varchar,
  	"endereco_cidade" varchar,
  	"endereco_uf" varchar,
  	"endereco_cep" varchar,
  	"_status" "enum_empresa_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_empresa_v_version_telefones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"numero" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_empresa_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_whatsapp" varchar,
  	"version_email" varchar,
  	"version_instagram" varchar,
  	"version_nome_completo" varchar,
  	"version_razao_social" varchar,
  	"version_cnpj" varchar,
  	"version_abertura" timestamp(3) with time zone,
  	"version_porte" varchar,
  	"version_endereco_logradouro" varchar,
  	"version_endereco_bairro" varchar,
  	"version_endereco_cidade" varchar,
  	"version_endereco_uf" varchar,
  	"version_endereco_cep" varchar,
  	"version__status" "enum__empresa_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"galeria" varchar,
  	"_status" "enum_home_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_home_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_galeria" varchar,
  	"version__status" "enum__home_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "quem_somos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"registro" varchar,
  	"atividades" varchar,
  	"nome" varchar,
  	"acervo" varchar,
  	"interlocutor" varchar,
  	"_status" "enum_quem_somos_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_quem_somos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_registro" varchar,
  	"version_atividades" varchar,
  	"version_nome" varchar,
  	"version_acervo" varchar,
  	"version_interlocutor" varchar,
  	"version__status" "enum__quem_somos_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "prancha_chamadas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"representada_id" integer,
  	"rotulo_x" numeric DEFAULT 12,
  	"rotulo_y" numeric DEFAULT 20,
  	"alvo_x" numeric DEFAULT 20,
  	"alvo_y" numeric DEFAULT 46
  );
  
  CREATE TABLE "prancha" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"foto_id" integer,
  	"_status" "enum_prancha_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_prancha_v_version_chamadas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"representada_id" integer,
  	"rotulo_x" numeric DEFAULT 12,
  	"rotulo_y" numeric DEFAULT 20,
  	"alvo_x" numeric DEFAULT 20,
  	"alvo_y" numeric DEFAULT 46,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_prancha_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_foto_id" integer,
  	"version__status" "enum__prancha_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "pacote_3d" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"pacote_id" integer,
  	"_status" "enum_pacote_3d_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_pacote_3d_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_pacote_id" integer,
  	"version__status" "enum__pacote_3d_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "representadas_declaracoes" ADD CONSTRAINT "representadas_declaracoes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."representadas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "representadas_designers" ADD CONSTRAINT "representadas_designers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."representadas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "representadas_vocabulario_grupos_itens" ADD CONSTRAINT "representadas_vocabulario_grupos_itens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."representadas_vocabulario_grupos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "representadas_vocabulario_grupos" ADD CONSTRAINT "representadas_vocabulario_grupos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."representadas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "representadas_catalogos" ADD CONSTRAINT "representadas_catalogos_arquivo_id_arquivos_id_fk" FOREIGN KEY ("arquivo_id") REFERENCES "public"."arquivos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "representadas_catalogos" ADD CONSTRAINT "representadas_catalogos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."representadas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "representadas" ADD CONSTRAINT "representadas_imagem_id_imagens_id_fk" FOREIGN KEY ("imagem_id") REFERENCES "public"."imagens"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "representadas" ADD CONSTRAINT "representadas_imagem_larga_id_imagens_id_fk" FOREIGN KEY ("imagem_larga_id") REFERENCES "public"."imagens"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "representadas_texts" ADD CONSTRAINT "representadas_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."representadas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_representadas_v_version_declaracoes" ADD CONSTRAINT "_representadas_v_version_declaracoes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_representadas_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_representadas_v_version_designers" ADD CONSTRAINT "_representadas_v_version_designers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_representadas_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_representadas_v_version_vocabulario_grupos_itens" ADD CONSTRAINT "_representadas_v_version_vocabulario_grupos_itens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_representadas_v_version_vocabulario_grupos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_representadas_v_version_vocabulario_grupos" ADD CONSTRAINT "_representadas_v_version_vocabulario_grupos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_representadas_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_representadas_v_version_catalogos" ADD CONSTRAINT "_representadas_v_version_catalogos_arquivo_id_arquivos_id_fk" FOREIGN KEY ("arquivo_id") REFERENCES "public"."arquivos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_representadas_v_version_catalogos" ADD CONSTRAINT "_representadas_v_version_catalogos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_representadas_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_representadas_v" ADD CONSTRAINT "_representadas_v_parent_id_representadas_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."representadas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_representadas_v" ADD CONSTRAINT "_representadas_v_version_imagem_id_imagens_id_fk" FOREIGN KEY ("version_imagem_id") REFERENCES "public"."imagens"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_representadas_v" ADD CONSTRAINT "_representadas_v_version_imagem_larga_id_imagens_id_fk" FOREIGN KEY ("version_imagem_larga_id") REFERENCES "public"."imagens"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_representadas_v_texts" ADD CONSTRAINT "_representadas_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_representadas_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pecas" ADD CONSTRAINT "pecas_representada_id_representadas_id_fk" FOREIGN KEY ("representada_id") REFERENCES "public"."representadas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pecas" ADD CONSTRAINT "pecas_foto_id_imagens_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."imagens"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pecas_v" ADD CONSTRAINT "_pecas_v_parent_id_pecas_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pecas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pecas_v" ADD CONSTRAINT "_pecas_v_version_representada_id_representadas_id_fk" FOREIGN KEY ("version_representada_id") REFERENCES "public"."representadas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pecas_v" ADD CONSTRAINT "_pecas_v_version_foto_id_imagens_id_fk" FOREIGN KEY ("version_foto_id") REFERENCES "public"."imagens"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "arquivos3d" ADD CONSTRAINT "arquivos3d_representada_id_representadas_id_fk" FOREIGN KEY ("representada_id") REFERENCES "public"."representadas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "arquivos3d" ADD CONSTRAINT "arquivos3d_arquivo_id_arquivos_id_fk" FOREIGN KEY ("arquivo_id") REFERENCES "public"."arquivos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_arquivos3d_v" ADD CONSTRAINT "_arquivos3d_v_parent_id_arquivos3d_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."arquivos3d"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_arquivos3d_v" ADD CONSTRAINT "_arquivos3d_v_version_representada_id_representadas_id_fk" FOREIGN KEY ("version_representada_id") REFERENCES "public"."representadas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_arquivos3d_v" ADD CONSTRAINT "_arquivos3d_v_version_arquivo_id_arquivos_id_fk" FOREIGN KEY ("version_arquivo_id") REFERENCES "public"."arquivos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "acabamentos" ADD CONSTRAINT "acabamentos_representada_id_representadas_id_fk" FOREIGN KEY ("representada_id") REFERENCES "public"."representadas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "acabamentos" ADD CONSTRAINT "acabamentos_amostra_id_imagens_id_fk" FOREIGN KEY ("amostra_id") REFERENCES "public"."imagens"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_acabamentos_v" ADD CONSTRAINT "_acabamentos_v_parent_id_acabamentos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."acabamentos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_acabamentos_v" ADD CONSTRAINT "_acabamentos_v_version_representada_id_representadas_id_fk" FOREIGN KEY ("version_representada_id") REFERENCES "public"."representadas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_acabamentos_v" ADD CONSTRAINT "_acabamentos_v_version_amostra_id_imagens_id_fk" FOREIGN KEY ("version_amostra_id") REFERENCES "public"."imagens"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projetos" ADD CONSTRAINT "projetos_foto_id_imagens_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."imagens"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projetos_rels" ADD CONSTRAINT "projetos_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projetos_rels" ADD CONSTRAINT "projetos_rels_representadas_fk" FOREIGN KEY ("representadas_id") REFERENCES "public"."representadas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projetos_v" ADD CONSTRAINT "_projetos_v_parent_id_projetos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projetos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projetos_v" ADD CONSTRAINT "_projetos_v_version_foto_id_imagens_id_fk" FOREIGN KEY ("version_foto_id") REFERENCES "public"."imagens"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projetos_v_rels" ADD CONSTRAINT "_projetos_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projetos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projetos_v_rels" ADD CONSTRAINT "_projetos_v_rels_representadas_fk" FOREIGN KEY ("representadas_id") REFERENCES "public"."representadas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "paginas_blocks_prosa" ADD CONSTRAINT "paginas_blocks_prosa_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."paginas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "paginas_blocks_caminhos_itens" ADD CONSTRAINT "paginas_blocks_caminhos_itens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."paginas_blocks_caminhos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "paginas_blocks_caminhos" ADD CONSTRAINT "paginas_blocks_caminhos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."paginas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "paginas_blocks_ficha" ADD CONSTRAINT "paginas_blocks_ficha_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."paginas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "paginas_blocks_fecho" ADD CONSTRAINT "paginas_blocks_fecho_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."paginas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_paginas_v_blocks_prosa" ADD CONSTRAINT "_paginas_v_blocks_prosa_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_paginas_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_paginas_v_blocks_caminhos_itens" ADD CONSTRAINT "_paginas_v_blocks_caminhos_itens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_paginas_v_blocks_caminhos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_paginas_v_blocks_caminhos" ADD CONSTRAINT "_paginas_v_blocks_caminhos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_paginas_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_paginas_v_blocks_ficha" ADD CONSTRAINT "_paginas_v_blocks_ficha_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_paginas_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_paginas_v_blocks_fecho" ADD CONSTRAINT "_paginas_v_blocks_fecho_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_paginas_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_paginas_v" ADD CONSTRAINT "_paginas_v_parent_id_paginas_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."paginas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_imagens_v" ADD CONSTRAINT "_imagens_v_parent_id_imagens_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."imagens"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_arquivos_v" ADD CONSTRAINT "_arquivos_v_parent_id_arquivos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."arquivos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "usuarios_sessions" ADD CONSTRAINT "usuarios_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_representadas_fk" FOREIGN KEY ("representadas_id") REFERENCES "public"."representadas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pecas_fk" FOREIGN KEY ("pecas_id") REFERENCES "public"."pecas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_arquivos3d_fk" FOREIGN KEY ("arquivos3d_id") REFERENCES "public"."arquivos3d"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_acabamentos_fk" FOREIGN KEY ("acabamentos_id") REFERENCES "public"."acabamentos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projetos_fk" FOREIGN KEY ("projetos_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_paginas_fk" FOREIGN KEY ("paginas_id") REFERENCES "public"."paginas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_imagens_fk" FOREIGN KEY ("imagens_id") REFERENCES "public"."imagens"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_arquivos_fk" FOREIGN KEY ("arquivos_id") REFERENCES "public"."arquivos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_usuarios_fk" FOREIGN KEY ("usuarios_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_usuarios_fk" FOREIGN KEY ("usuarios_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "empresa_telefones" ADD CONSTRAINT "empresa_telefones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."empresa"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_empresa_v_version_telefones" ADD CONSTRAINT "_empresa_v_version_telefones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_empresa_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prancha_chamadas" ADD CONSTRAINT "prancha_chamadas_representada_id_representadas_id_fk" FOREIGN KEY ("representada_id") REFERENCES "public"."representadas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "prancha_chamadas" ADD CONSTRAINT "prancha_chamadas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prancha"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prancha" ADD CONSTRAINT "prancha_foto_id_imagens_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."imagens"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_prancha_v_version_chamadas" ADD CONSTRAINT "_prancha_v_version_chamadas_representada_id_representadas_id_fk" FOREIGN KEY ("representada_id") REFERENCES "public"."representadas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_prancha_v_version_chamadas" ADD CONSTRAINT "_prancha_v_version_chamadas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_prancha_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prancha_v" ADD CONSTRAINT "_prancha_v_version_foto_id_imagens_id_fk" FOREIGN KEY ("version_foto_id") REFERENCES "public"."imagens"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pacote_3d" ADD CONSTRAINT "pacote_3d_pacote_id_arquivos_id_fk" FOREIGN KEY ("pacote_id") REFERENCES "public"."arquivos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pacote_3d_v" ADD CONSTRAINT "_pacote_3d_v_version_pacote_id_arquivos_id_fk" FOREIGN KEY ("version_pacote_id") REFERENCES "public"."arquivos"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "representadas_declaracoes_order_idx" ON "representadas_declaracoes" USING btree ("_order");
  CREATE INDEX "representadas_declaracoes_parent_id_idx" ON "representadas_declaracoes" USING btree ("_parent_id");
  CREATE INDEX "representadas_designers_order_idx" ON "representadas_designers" USING btree ("_order");
  CREATE INDEX "representadas_designers_parent_id_idx" ON "representadas_designers" USING btree ("_parent_id");
  CREATE INDEX "representadas_vocabulario_grupos_itens_order_idx" ON "representadas_vocabulario_grupos_itens" USING btree ("_order");
  CREATE INDEX "representadas_vocabulario_grupos_itens_parent_id_idx" ON "representadas_vocabulario_grupos_itens" USING btree ("_parent_id");
  CREATE INDEX "representadas_vocabulario_grupos_order_idx" ON "representadas_vocabulario_grupos" USING btree ("_order");
  CREATE INDEX "representadas_vocabulario_grupos_parent_id_idx" ON "representadas_vocabulario_grupos" USING btree ("_parent_id");
  CREATE INDEX "representadas_catalogos_order_idx" ON "representadas_catalogos" USING btree ("_order");
  CREATE INDEX "representadas_catalogos_parent_id_idx" ON "representadas_catalogos" USING btree ("_parent_id");
  CREATE INDEX "representadas_catalogos_arquivo_idx" ON "representadas_catalogos" USING btree ("arquivo_id");
  CREATE UNIQUE INDEX "representadas_slug_idx" ON "representadas" USING btree ("slug");
  CREATE INDEX "representadas_imagem_idx" ON "representadas" USING btree ("imagem_id");
  CREATE INDEX "representadas_imagem_larga_idx" ON "representadas" USING btree ("imagem_larga_id");
  CREATE INDEX "representadas_updated_at_idx" ON "representadas" USING btree ("updated_at");
  CREATE INDEX "representadas_created_at_idx" ON "representadas" USING btree ("created_at");
  CREATE INDEX "representadas__status_idx" ON "representadas" USING btree ("_status");
  CREATE INDEX "representadas_texts_order_parent" ON "representadas_texts" USING btree ("order","parent_id");
  CREATE INDEX "_representadas_v_version_declaracoes_order_idx" ON "_representadas_v_version_declaracoes" USING btree ("_order");
  CREATE INDEX "_representadas_v_version_declaracoes_parent_id_idx" ON "_representadas_v_version_declaracoes" USING btree ("_parent_id");
  CREATE INDEX "_representadas_v_version_designers_order_idx" ON "_representadas_v_version_designers" USING btree ("_order");
  CREATE INDEX "_representadas_v_version_designers_parent_id_idx" ON "_representadas_v_version_designers" USING btree ("_parent_id");
  CREATE INDEX "_representadas_v_version_vocabulario_grupos_itens_order_idx" ON "_representadas_v_version_vocabulario_grupos_itens" USING btree ("_order");
  CREATE INDEX "_representadas_v_version_vocabulario_grupos_itens_parent_id_idx" ON "_representadas_v_version_vocabulario_grupos_itens" USING btree ("_parent_id");
  CREATE INDEX "_representadas_v_version_vocabulario_grupos_order_idx" ON "_representadas_v_version_vocabulario_grupos" USING btree ("_order");
  CREATE INDEX "_representadas_v_version_vocabulario_grupos_parent_id_idx" ON "_representadas_v_version_vocabulario_grupos" USING btree ("_parent_id");
  CREATE INDEX "_representadas_v_version_catalogos_order_idx" ON "_representadas_v_version_catalogos" USING btree ("_order");
  CREATE INDEX "_representadas_v_version_catalogos_parent_id_idx" ON "_representadas_v_version_catalogos" USING btree ("_parent_id");
  CREATE INDEX "_representadas_v_version_catalogos_arquivo_idx" ON "_representadas_v_version_catalogos" USING btree ("arquivo_id");
  CREATE INDEX "_representadas_v_parent_idx" ON "_representadas_v" USING btree ("parent_id");
  CREATE INDEX "_representadas_v_version_version_slug_idx" ON "_representadas_v" USING btree ("version_slug");
  CREATE INDEX "_representadas_v_version_version_imagem_idx" ON "_representadas_v" USING btree ("version_imagem_id");
  CREATE INDEX "_representadas_v_version_version_imagem_larga_idx" ON "_representadas_v" USING btree ("version_imagem_larga_id");
  CREATE INDEX "_representadas_v_version_version_updated_at_idx" ON "_representadas_v" USING btree ("version_updated_at");
  CREATE INDEX "_representadas_v_version_version_created_at_idx" ON "_representadas_v" USING btree ("version_created_at");
  CREATE INDEX "_representadas_v_version_version__status_idx" ON "_representadas_v" USING btree ("version__status");
  CREATE INDEX "_representadas_v_created_at_idx" ON "_representadas_v" USING btree ("created_at");
  CREATE INDEX "_representadas_v_updated_at_idx" ON "_representadas_v" USING btree ("updated_at");
  CREATE INDEX "_representadas_v_latest_idx" ON "_representadas_v" USING btree ("latest");
  CREATE INDEX "_representadas_v_texts_order_parent" ON "_representadas_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "pecas_representada_idx" ON "pecas" USING btree ("representada_id");
  CREATE INDEX "pecas_foto_idx" ON "pecas" USING btree ("foto_id");
  CREATE INDEX "pecas_updated_at_idx" ON "pecas" USING btree ("updated_at");
  CREATE INDEX "pecas_created_at_idx" ON "pecas" USING btree ("created_at");
  CREATE INDEX "pecas__status_idx" ON "pecas" USING btree ("_status");
  CREATE INDEX "_pecas_v_parent_idx" ON "_pecas_v" USING btree ("parent_id");
  CREATE INDEX "_pecas_v_version_version_representada_idx" ON "_pecas_v" USING btree ("version_representada_id");
  CREATE INDEX "_pecas_v_version_version_foto_idx" ON "_pecas_v" USING btree ("version_foto_id");
  CREATE INDEX "_pecas_v_version_version_updated_at_idx" ON "_pecas_v" USING btree ("version_updated_at");
  CREATE INDEX "_pecas_v_version_version_created_at_idx" ON "_pecas_v" USING btree ("version_created_at");
  CREATE INDEX "_pecas_v_version_version__status_idx" ON "_pecas_v" USING btree ("version__status");
  CREATE INDEX "_pecas_v_created_at_idx" ON "_pecas_v" USING btree ("created_at");
  CREATE INDEX "_pecas_v_updated_at_idx" ON "_pecas_v" USING btree ("updated_at");
  CREATE INDEX "_pecas_v_latest_idx" ON "_pecas_v" USING btree ("latest");
  CREATE INDEX "arquivos3d_representada_idx" ON "arquivos3d" USING btree ("representada_id");
  CREATE INDEX "arquivos3d_arquivo_idx" ON "arquivos3d" USING btree ("arquivo_id");
  CREATE INDEX "arquivos3d_updated_at_idx" ON "arquivos3d" USING btree ("updated_at");
  CREATE INDEX "arquivos3d_created_at_idx" ON "arquivos3d" USING btree ("created_at");
  CREATE INDEX "arquivos3d__status_idx" ON "arquivos3d" USING btree ("_status");
  CREATE INDEX "_arquivos3d_v_parent_idx" ON "_arquivos3d_v" USING btree ("parent_id");
  CREATE INDEX "_arquivos3d_v_version_version_representada_idx" ON "_arquivos3d_v" USING btree ("version_representada_id");
  CREATE INDEX "_arquivos3d_v_version_version_arquivo_idx" ON "_arquivos3d_v" USING btree ("version_arquivo_id");
  CREATE INDEX "_arquivos3d_v_version_version_updated_at_idx" ON "_arquivos3d_v" USING btree ("version_updated_at");
  CREATE INDEX "_arquivos3d_v_version_version_created_at_idx" ON "_arquivos3d_v" USING btree ("version_created_at");
  CREATE INDEX "_arquivos3d_v_version_version__status_idx" ON "_arquivos3d_v" USING btree ("version__status");
  CREATE INDEX "_arquivos3d_v_created_at_idx" ON "_arquivos3d_v" USING btree ("created_at");
  CREATE INDEX "_arquivos3d_v_updated_at_idx" ON "_arquivos3d_v" USING btree ("updated_at");
  CREATE INDEX "_arquivos3d_v_latest_idx" ON "_arquivos3d_v" USING btree ("latest");
  CREATE INDEX "acabamentos_representada_idx" ON "acabamentos" USING btree ("representada_id");
  CREATE INDEX "acabamentos_amostra_idx" ON "acabamentos" USING btree ("amostra_id");
  CREATE INDEX "acabamentos_updated_at_idx" ON "acabamentos" USING btree ("updated_at");
  CREATE INDEX "acabamentos_created_at_idx" ON "acabamentos" USING btree ("created_at");
  CREATE INDEX "acabamentos__status_idx" ON "acabamentos" USING btree ("_status");
  CREATE INDEX "_acabamentos_v_parent_idx" ON "_acabamentos_v" USING btree ("parent_id");
  CREATE INDEX "_acabamentos_v_version_version_representada_idx" ON "_acabamentos_v" USING btree ("version_representada_id");
  CREATE INDEX "_acabamentos_v_version_version_amostra_idx" ON "_acabamentos_v" USING btree ("version_amostra_id");
  CREATE INDEX "_acabamentos_v_version_version_updated_at_idx" ON "_acabamentos_v" USING btree ("version_updated_at");
  CREATE INDEX "_acabamentos_v_version_version_created_at_idx" ON "_acabamentos_v" USING btree ("version_created_at");
  CREATE INDEX "_acabamentos_v_version_version__status_idx" ON "_acabamentos_v" USING btree ("version__status");
  CREATE INDEX "_acabamentos_v_created_at_idx" ON "_acabamentos_v" USING btree ("created_at");
  CREATE INDEX "_acabamentos_v_updated_at_idx" ON "_acabamentos_v" USING btree ("updated_at");
  CREATE INDEX "_acabamentos_v_latest_idx" ON "_acabamentos_v" USING btree ("latest");
  CREATE INDEX "projetos_foto_idx" ON "projetos" USING btree ("foto_id");
  CREATE INDEX "projetos_updated_at_idx" ON "projetos" USING btree ("updated_at");
  CREATE INDEX "projetos_created_at_idx" ON "projetos" USING btree ("created_at");
  CREATE INDEX "projetos__status_idx" ON "projetos" USING btree ("_status");
  CREATE INDEX "projetos_rels_order_idx" ON "projetos_rels" USING btree ("order");
  CREATE INDEX "projetos_rels_parent_idx" ON "projetos_rels" USING btree ("parent_id");
  CREATE INDEX "projetos_rels_path_idx" ON "projetos_rels" USING btree ("path");
  CREATE INDEX "projetos_rels_representadas_id_idx" ON "projetos_rels" USING btree ("representadas_id");
  CREATE INDEX "_projetos_v_parent_idx" ON "_projetos_v" USING btree ("parent_id");
  CREATE INDEX "_projetos_v_version_version_foto_idx" ON "_projetos_v" USING btree ("version_foto_id");
  CREATE INDEX "_projetos_v_version_version_updated_at_idx" ON "_projetos_v" USING btree ("version_updated_at");
  CREATE INDEX "_projetos_v_version_version_created_at_idx" ON "_projetos_v" USING btree ("version_created_at");
  CREATE INDEX "_projetos_v_version_version__status_idx" ON "_projetos_v" USING btree ("version__status");
  CREATE INDEX "_projetos_v_created_at_idx" ON "_projetos_v" USING btree ("created_at");
  CREATE INDEX "_projetos_v_updated_at_idx" ON "_projetos_v" USING btree ("updated_at");
  CREATE INDEX "_projetos_v_latest_idx" ON "_projetos_v" USING btree ("latest");
  CREATE INDEX "_projetos_v_rels_order_idx" ON "_projetos_v_rels" USING btree ("order");
  CREATE INDEX "_projetos_v_rels_parent_idx" ON "_projetos_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projetos_v_rels_path_idx" ON "_projetos_v_rels" USING btree ("path");
  CREATE INDEX "_projetos_v_rels_representadas_id_idx" ON "_projetos_v_rels" USING btree ("representadas_id");
  CREATE INDEX "paginas_blocks_prosa_order_idx" ON "paginas_blocks_prosa" USING btree ("_order");
  CREATE INDEX "paginas_blocks_prosa_parent_id_idx" ON "paginas_blocks_prosa" USING btree ("_parent_id");
  CREATE INDEX "paginas_blocks_prosa_path_idx" ON "paginas_blocks_prosa" USING btree ("_path");
  CREATE INDEX "paginas_blocks_caminhos_itens_order_idx" ON "paginas_blocks_caminhos_itens" USING btree ("_order");
  CREATE INDEX "paginas_blocks_caminhos_itens_parent_id_idx" ON "paginas_blocks_caminhos_itens" USING btree ("_parent_id");
  CREATE INDEX "paginas_blocks_caminhos_order_idx" ON "paginas_blocks_caminhos" USING btree ("_order");
  CREATE INDEX "paginas_blocks_caminhos_parent_id_idx" ON "paginas_blocks_caminhos" USING btree ("_parent_id");
  CREATE INDEX "paginas_blocks_caminhos_path_idx" ON "paginas_blocks_caminhos" USING btree ("_path");
  CREATE INDEX "paginas_blocks_ficha_order_idx" ON "paginas_blocks_ficha" USING btree ("_order");
  CREATE INDEX "paginas_blocks_ficha_parent_id_idx" ON "paginas_blocks_ficha" USING btree ("_parent_id");
  CREATE INDEX "paginas_blocks_ficha_path_idx" ON "paginas_blocks_ficha" USING btree ("_path");
  CREATE INDEX "paginas_blocks_fecho_order_idx" ON "paginas_blocks_fecho" USING btree ("_order");
  CREATE INDEX "paginas_blocks_fecho_parent_id_idx" ON "paginas_blocks_fecho" USING btree ("_parent_id");
  CREATE INDEX "paginas_blocks_fecho_path_idx" ON "paginas_blocks_fecho" USING btree ("_path");
  CREATE UNIQUE INDEX "paginas_slug_idx" ON "paginas" USING btree ("slug");
  CREATE INDEX "paginas_updated_at_idx" ON "paginas" USING btree ("updated_at");
  CREATE INDEX "paginas_created_at_idx" ON "paginas" USING btree ("created_at");
  CREATE INDEX "paginas__status_idx" ON "paginas" USING btree ("_status");
  CREATE INDEX "_paginas_v_blocks_prosa_order_idx" ON "_paginas_v_blocks_prosa" USING btree ("_order");
  CREATE INDEX "_paginas_v_blocks_prosa_parent_id_idx" ON "_paginas_v_blocks_prosa" USING btree ("_parent_id");
  CREATE INDEX "_paginas_v_blocks_prosa_path_idx" ON "_paginas_v_blocks_prosa" USING btree ("_path");
  CREATE INDEX "_paginas_v_blocks_caminhos_itens_order_idx" ON "_paginas_v_blocks_caminhos_itens" USING btree ("_order");
  CREATE INDEX "_paginas_v_blocks_caminhos_itens_parent_id_idx" ON "_paginas_v_blocks_caminhos_itens" USING btree ("_parent_id");
  CREATE INDEX "_paginas_v_blocks_caminhos_order_idx" ON "_paginas_v_blocks_caminhos" USING btree ("_order");
  CREATE INDEX "_paginas_v_blocks_caminhos_parent_id_idx" ON "_paginas_v_blocks_caminhos" USING btree ("_parent_id");
  CREATE INDEX "_paginas_v_blocks_caminhos_path_idx" ON "_paginas_v_blocks_caminhos" USING btree ("_path");
  CREATE INDEX "_paginas_v_blocks_ficha_order_idx" ON "_paginas_v_blocks_ficha" USING btree ("_order");
  CREATE INDEX "_paginas_v_blocks_ficha_parent_id_idx" ON "_paginas_v_blocks_ficha" USING btree ("_parent_id");
  CREATE INDEX "_paginas_v_blocks_ficha_path_idx" ON "_paginas_v_blocks_ficha" USING btree ("_path");
  CREATE INDEX "_paginas_v_blocks_fecho_order_idx" ON "_paginas_v_blocks_fecho" USING btree ("_order");
  CREATE INDEX "_paginas_v_blocks_fecho_parent_id_idx" ON "_paginas_v_blocks_fecho" USING btree ("_parent_id");
  CREATE INDEX "_paginas_v_blocks_fecho_path_idx" ON "_paginas_v_blocks_fecho" USING btree ("_path");
  CREATE INDEX "_paginas_v_parent_idx" ON "_paginas_v" USING btree ("parent_id");
  CREATE INDEX "_paginas_v_version_version_slug_idx" ON "_paginas_v" USING btree ("version_slug");
  CREATE INDEX "_paginas_v_version_version_updated_at_idx" ON "_paginas_v" USING btree ("version_updated_at");
  CREATE INDEX "_paginas_v_version_version_created_at_idx" ON "_paginas_v" USING btree ("version_created_at");
  CREATE INDEX "_paginas_v_version_version__status_idx" ON "_paginas_v" USING btree ("version__status");
  CREATE INDEX "_paginas_v_created_at_idx" ON "_paginas_v" USING btree ("created_at");
  CREATE INDEX "_paginas_v_updated_at_idx" ON "_paginas_v" USING btree ("updated_at");
  CREATE INDEX "_paginas_v_latest_idx" ON "_paginas_v" USING btree ("latest");
  CREATE INDEX "imagens_updated_at_idx" ON "imagens" USING btree ("updated_at");
  CREATE INDEX "imagens_created_at_idx" ON "imagens" USING btree ("created_at");
  CREATE UNIQUE INDEX "imagens_filename_idx" ON "imagens" USING btree ("filename");
  CREATE INDEX "_imagens_v_parent_idx" ON "_imagens_v" USING btree ("parent_id");
  CREATE INDEX "_imagens_v_version_version_updated_at_idx" ON "_imagens_v" USING btree ("version_updated_at");
  CREATE INDEX "_imagens_v_version_version_created_at_idx" ON "_imagens_v" USING btree ("version_created_at");
  CREATE INDEX "_imagens_v_version_version_filename_idx" ON "_imagens_v" USING btree ("version_filename");
  CREATE INDEX "_imagens_v_created_at_idx" ON "_imagens_v" USING btree ("created_at");
  CREATE INDEX "_imagens_v_updated_at_idx" ON "_imagens_v" USING btree ("updated_at");
  CREATE INDEX "arquivos_updated_at_idx" ON "arquivos" USING btree ("updated_at");
  CREATE INDEX "arquivos_created_at_idx" ON "arquivos" USING btree ("created_at");
  CREATE UNIQUE INDEX "arquivos_filename_idx" ON "arquivos" USING btree ("filename");
  CREATE INDEX "_arquivos_v_parent_idx" ON "_arquivos_v" USING btree ("parent_id");
  CREATE INDEX "_arquivos_v_version_version_updated_at_idx" ON "_arquivos_v" USING btree ("version_updated_at");
  CREATE INDEX "_arquivos_v_version_version_created_at_idx" ON "_arquivos_v" USING btree ("version_created_at");
  CREATE INDEX "_arquivos_v_version_version_filename_idx" ON "_arquivos_v" USING btree ("version_filename");
  CREATE INDEX "_arquivos_v_created_at_idx" ON "_arquivos_v" USING btree ("created_at");
  CREATE INDEX "_arquivos_v_updated_at_idx" ON "_arquivos_v" USING btree ("updated_at");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "usuarios_sessions_order_idx" ON "usuarios_sessions" USING btree ("_order");
  CREATE INDEX "usuarios_sessions_parent_id_idx" ON "usuarios_sessions" USING btree ("_parent_id");
  CREATE INDEX "usuarios_updated_at_idx" ON "usuarios" USING btree ("updated_at");
  CREATE INDEX "usuarios_created_at_idx" ON "usuarios" USING btree ("created_at");
  CREATE UNIQUE INDEX "usuarios_email_idx" ON "usuarios" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_representadas_id_idx" ON "payload_locked_documents_rels" USING btree ("representadas_id");
  CREATE INDEX "payload_locked_documents_rels_pecas_id_idx" ON "payload_locked_documents_rels" USING btree ("pecas_id");
  CREATE INDEX "payload_locked_documents_rels_arquivos3d_id_idx" ON "payload_locked_documents_rels" USING btree ("arquivos3d_id");
  CREATE INDEX "payload_locked_documents_rels_acabamentos_id_idx" ON "payload_locked_documents_rels" USING btree ("acabamentos_id");
  CREATE INDEX "payload_locked_documents_rels_projetos_id_idx" ON "payload_locked_documents_rels" USING btree ("projetos_id");
  CREATE INDEX "payload_locked_documents_rels_paginas_id_idx" ON "payload_locked_documents_rels" USING btree ("paginas_id");
  CREATE INDEX "payload_locked_documents_rels_imagens_id_idx" ON "payload_locked_documents_rels" USING btree ("imagens_id");
  CREATE INDEX "payload_locked_documents_rels_arquivos_id_idx" ON "payload_locked_documents_rels" USING btree ("arquivos_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_usuarios_id_idx" ON "payload_locked_documents_rels" USING btree ("usuarios_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_usuarios_id_idx" ON "payload_preferences_rels" USING btree ("usuarios_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "empresa_telefones_order_idx" ON "empresa_telefones" USING btree ("_order");
  CREATE INDEX "empresa_telefones_parent_id_idx" ON "empresa_telefones" USING btree ("_parent_id");
  CREATE INDEX "empresa__status_idx" ON "empresa" USING btree ("_status");
  CREATE INDEX "_empresa_v_version_telefones_order_idx" ON "_empresa_v_version_telefones" USING btree ("_order");
  CREATE INDEX "_empresa_v_version_telefones_parent_id_idx" ON "_empresa_v_version_telefones" USING btree ("_parent_id");
  CREATE INDEX "_empresa_v_version_version__status_idx" ON "_empresa_v" USING btree ("version__status");
  CREATE INDEX "_empresa_v_created_at_idx" ON "_empresa_v" USING btree ("created_at");
  CREATE INDEX "_empresa_v_updated_at_idx" ON "_empresa_v" USING btree ("updated_at");
  CREATE INDEX "_empresa_v_latest_idx" ON "_empresa_v" USING btree ("latest");
  CREATE INDEX "home__status_idx" ON "home" USING btree ("_status");
  CREATE INDEX "_home_v_version_version__status_idx" ON "_home_v" USING btree ("version__status");
  CREATE INDEX "_home_v_created_at_idx" ON "_home_v" USING btree ("created_at");
  CREATE INDEX "_home_v_updated_at_idx" ON "_home_v" USING btree ("updated_at");
  CREATE INDEX "_home_v_latest_idx" ON "_home_v" USING btree ("latest");
  CREATE INDEX "quem_somos__status_idx" ON "quem_somos" USING btree ("_status");
  CREATE INDEX "_quem_somos_v_version_version__status_idx" ON "_quem_somos_v" USING btree ("version__status");
  CREATE INDEX "_quem_somos_v_created_at_idx" ON "_quem_somos_v" USING btree ("created_at");
  CREATE INDEX "_quem_somos_v_updated_at_idx" ON "_quem_somos_v" USING btree ("updated_at");
  CREATE INDEX "_quem_somos_v_latest_idx" ON "_quem_somos_v" USING btree ("latest");
  CREATE INDEX "prancha_chamadas_order_idx" ON "prancha_chamadas" USING btree ("_order");
  CREATE INDEX "prancha_chamadas_parent_id_idx" ON "prancha_chamadas" USING btree ("_parent_id");
  CREATE INDEX "prancha_chamadas_representada_idx" ON "prancha_chamadas" USING btree ("representada_id");
  CREATE INDEX "prancha_foto_idx" ON "prancha" USING btree ("foto_id");
  CREATE INDEX "prancha__status_idx" ON "prancha" USING btree ("_status");
  CREATE INDEX "_prancha_v_version_chamadas_order_idx" ON "_prancha_v_version_chamadas" USING btree ("_order");
  CREATE INDEX "_prancha_v_version_chamadas_parent_id_idx" ON "_prancha_v_version_chamadas" USING btree ("_parent_id");
  CREATE INDEX "_prancha_v_version_chamadas_representada_idx" ON "_prancha_v_version_chamadas" USING btree ("representada_id");
  CREATE INDEX "_prancha_v_version_version_foto_idx" ON "_prancha_v" USING btree ("version_foto_id");
  CREATE INDEX "_prancha_v_version_version__status_idx" ON "_prancha_v" USING btree ("version__status");
  CREATE INDEX "_prancha_v_created_at_idx" ON "_prancha_v" USING btree ("created_at");
  CREATE INDEX "_prancha_v_updated_at_idx" ON "_prancha_v" USING btree ("updated_at");
  CREATE INDEX "_prancha_v_latest_idx" ON "_prancha_v" USING btree ("latest");
  CREATE INDEX "pacote_3d_pacote_idx" ON "pacote_3d" USING btree ("pacote_id");
  CREATE INDEX "pacote_3d__status_idx" ON "pacote_3d" USING btree ("_status");
  CREATE INDEX "_pacote_3d_v_version_version_pacote_idx" ON "_pacote_3d_v" USING btree ("version_pacote_id");
  CREATE INDEX "_pacote_3d_v_version_version__status_idx" ON "_pacote_3d_v" USING btree ("version__status");
  CREATE INDEX "_pacote_3d_v_created_at_idx" ON "_pacote_3d_v" USING btree ("created_at");
  CREATE INDEX "_pacote_3d_v_updated_at_idx" ON "_pacote_3d_v" USING btree ("updated_at");
  CREATE INDEX "_pacote_3d_v_latest_idx" ON "_pacote_3d_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "representadas_declaracoes" CASCADE;
  DROP TABLE "representadas_designers" CASCADE;
  DROP TABLE "representadas_vocabulario_grupos_itens" CASCADE;
  DROP TABLE "representadas_vocabulario_grupos" CASCADE;
  DROP TABLE "representadas_catalogos" CASCADE;
  DROP TABLE "representadas" CASCADE;
  DROP TABLE "representadas_texts" CASCADE;
  DROP TABLE "_representadas_v_version_declaracoes" CASCADE;
  DROP TABLE "_representadas_v_version_designers" CASCADE;
  DROP TABLE "_representadas_v_version_vocabulario_grupos_itens" CASCADE;
  DROP TABLE "_representadas_v_version_vocabulario_grupos" CASCADE;
  DROP TABLE "_representadas_v_version_catalogos" CASCADE;
  DROP TABLE "_representadas_v" CASCADE;
  DROP TABLE "_representadas_v_texts" CASCADE;
  DROP TABLE "pecas" CASCADE;
  DROP TABLE "_pecas_v" CASCADE;
  DROP TABLE "arquivos3d" CASCADE;
  DROP TABLE "_arquivos3d_v" CASCADE;
  DROP TABLE "acabamentos" CASCADE;
  DROP TABLE "_acabamentos_v" CASCADE;
  DROP TABLE "projetos" CASCADE;
  DROP TABLE "projetos_rels" CASCADE;
  DROP TABLE "_projetos_v" CASCADE;
  DROP TABLE "_projetos_v_rels" CASCADE;
  DROP TABLE "paginas_blocks_prosa" CASCADE;
  DROP TABLE "paginas_blocks_caminhos_itens" CASCADE;
  DROP TABLE "paginas_blocks_caminhos" CASCADE;
  DROP TABLE "paginas_blocks_ficha" CASCADE;
  DROP TABLE "paginas_blocks_fecho" CASCADE;
  DROP TABLE "paginas" CASCADE;
  DROP TABLE "_paginas_v_blocks_prosa" CASCADE;
  DROP TABLE "_paginas_v_blocks_caminhos_itens" CASCADE;
  DROP TABLE "_paginas_v_blocks_caminhos" CASCADE;
  DROP TABLE "_paginas_v_blocks_ficha" CASCADE;
  DROP TABLE "_paginas_v_blocks_fecho" CASCADE;
  DROP TABLE "_paginas_v" CASCADE;
  DROP TABLE "imagens" CASCADE;
  DROP TABLE "_imagens_v" CASCADE;
  DROP TABLE "arquivos" CASCADE;
  DROP TABLE "_arquivos_v" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "usuarios_sessions" CASCADE;
  DROP TABLE "usuarios" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "empresa_telefones" CASCADE;
  DROP TABLE "empresa" CASCADE;
  DROP TABLE "_empresa_v_version_telefones" CASCADE;
  DROP TABLE "_empresa_v" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "_home_v" CASCADE;
  DROP TABLE "quem_somos" CASCADE;
  DROP TABLE "_quem_somos_v" CASCADE;
  DROP TABLE "prancha_chamadas" CASCADE;
  DROP TABLE "prancha" CASCADE;
  DROP TABLE "_prancha_v_version_chamadas" CASCADE;
  DROP TABLE "_prancha_v" CASCADE;
  DROP TABLE "pacote_3d" CASCADE;
  DROP TABLE "_pacote_3d_v" CASCADE;
  DROP TYPE "public"."enum_representadas_status";
  DROP TYPE "public"."enum__representadas_v_version_status";
  DROP TYPE "public"."enum_pecas_ambiente";
  DROP TYPE "public"."enum_pecas_status";
  DROP TYPE "public"."enum__pecas_v_version_ambiente";
  DROP TYPE "public"."enum__pecas_v_version_status";
  DROP TYPE "public"."enum_arquivos3d_status";
  DROP TYPE "public"."enum__arquivos3d_v_version_status";
  DROP TYPE "public"."enum_acabamentos_tipo";
  DROP TYPE "public"."enum_acabamentos_status";
  DROP TYPE "public"."enum__acabamentos_v_version_tipo";
  DROP TYPE "public"."enum__acabamentos_v_version_status";
  DROP TYPE "public"."enum_projetos_status";
  DROP TYPE "public"."enum__projetos_v_version_status";
  DROP TYPE "public"."enum_paginas_blocks_caminhos_itens_destino";
  DROP TYPE "public"."enum_paginas_blocks_caminhos_itens_rota";
  DROP TYPE "public"."enum_paginas_slug";
  DROP TYPE "public"."enum_paginas_status";
  DROP TYPE "public"."enum__paginas_v_blocks_caminhos_itens_destino";
  DROP TYPE "public"."enum__paginas_v_blocks_caminhos_itens_rota";
  DROP TYPE "public"."enum__paginas_v_version_slug";
  DROP TYPE "public"."enum__paginas_v_version_status";
  DROP TYPE "public"."enum_usuarios_papel";
  DROP TYPE "public"."enum_empresa_status";
  DROP TYPE "public"."enum__empresa_v_version_status";
  DROP TYPE "public"."enum_home_status";
  DROP TYPE "public"."enum__home_v_version_status";
  DROP TYPE "public"."enum_quem_somos_status";
  DROP TYPE "public"."enum__quem_somos_v_version_status";
  DROP TYPE "public"."enum_prancha_status";
  DROP TYPE "public"."enum__prancha_v_version_status";
  DROP TYPE "public"."enum_pacote_3d_status";
  DROP TYPE "public"."enum__pacote_3d_v_version_status";`)
}
