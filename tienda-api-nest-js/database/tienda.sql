-- Adminer 4.8.1 PostgreSQL 12.17 dump
-- 2023-11-15 09:53:41.23703+00

SELECT 'CREATE DATABASE nombre_de_la_base_de_datos'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'tienda');

DROP TABLE IF EXISTS "productos";
DROP TABLE IF EXISTS "user_roles";
DROP TABLE IF EXISTS "usuarios";
DROP TABLE IF EXISTS "categorias";


DROP TABLE IF EXISTS "categorias";
CREATE TABLE "public"."categorias" (
                                       "is_deleted" boolean DEFAULT false NOT NULL,
                                       "created_at" timestamp DEFAULT now() NOT NULL,
                                       "updated_at" timestamp DEFAULT now() NOT NULL,
                                       "id" uuid NOT NULL,
                                       "nombre" character varying(255) NOT NULL,
                                       CONSTRAINT "categorias_nombre_key" UNIQUE ("nombre"),
                                       CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "categorias" ("is_deleted", "created_at", "updated_at", "id", "nombre") VALUES
                                                                                        ('f',	'2023-11-02 11:43:24.717712',	'2023-11-02 11:43:24.717712',	'd69cf3db-b77d-4181-b3cd-5ca8107fb6a9',	'DEPORTES'),
                                                                                        ('f',	'2023-11-02 11:43:24.717712',	'2023-11-02 11:43:24.717712',	'6dbcbf5e-8e1c-47cc-8578-7b0a33ebc154',	'COMIDA'),
                                                                                        ('f',	'2023-11-02 11:43:24.717712',	'2023-11-02 11:43:24.717712',	'9def16db-362b-44c4-9fc9-77117758b5b0',	'BEBIDA'),
                                                                                        ('f',	'2023-11-02 11:43:24.717712',	'2023-11-02 11:43:24.717712',	'8c5c06ba-49d6-46b6-85cc-8246c0f362bc',	'COMPLEMENTOS'),
                                                                                        ('f',	'2023-11-02 11:43:24.717712',	'2023-11-02 11:43:24.717712',	'bb51d00d-13fb-4b09-acc9-948185636f79',	'OTROS');

DROP TABLE IF EXISTS "productos";
DROP SEQUENCE IF EXISTS productos_id_seq;
CREATE SEQUENCE productos_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1;

CREATE TABLE "public"."productos" (
                                      "is_deleted" boolean DEFAULT false NOT NULL,
                                      "precio" double precision DEFAULT '0' NOT NULL,
                                      "stock" integer DEFAULT '0' NOT NULL,
                                      "created_at" timestamp DEFAULT now() NOT NULL,
                                      "id" bigint DEFAULT nextval('productos_id_seq') NOT NULL,
                                      "updated_at" timestamp DEFAULT now() NOT NULL,
                                      "categoria_id" uuid,
                                      "uuid" uuid NOT NULL,
                                      "descripcion" character varying(255),
                                      "imagen" text DEFAULT 'https://via.placeholder.com/150' NOT NULL,
                                      "marca" character varying(255) NOT NULL,
                                      "modelo" character varying(255) NOT NULL,
                                      CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "productos" ("is_deleted", "precio", "stock", "created_at", "id", "updated_at", "categoria_id", "uuid", "descripcion", "imagen", "marca", "modelo") VALUES
                                                                                                                                                                    ('f',	10.99,	5,	'2023-11-02 11:43:24.722473',	1,	'2023-11-02 11:43:24.722473',	'd69cf3db-b77d-4181-b3cd-5ca8107fb6a9',	'19135792-b778-441f-871e-d6e6096e0ddc',	'Descripción1',	'https://via.placeholder.com/150',	'Nike',	'Modelo1'),
                                                                                                                                                                    ('f',	19.99,	10,	'2023-11-02 11:43:24.722473',	2,	'2023-11-02 11:43:24.722473',	'6dbcbf5e-8e1c-47cc-8578-7b0a33ebc154',	'662ed342-de99-45c6-8463-446989aab9c8',	'Descripción2',	'https://via.placeholder.com/150',	'Adidas',	'Modelo2'),
                                                                                                                                                                    ('f',	15.99,	2,	'2023-11-02 11:43:24.722473',	3,	'2023-11-02 11:43:24.722473',	'd69cf3db-b77d-4181-b3cd-5ca8107fb6a9',	'b79182ad-91c3-46e8-90b9-268164596a72',	'Descripción3',	'https://via.placeholder.com/150',	'Nike',	'Modelo3'),
                                                                                                                                                                    ('f',	25.99,	8,	'2023-11-02 11:43:24.722473',	4,	'2023-11-02 11:43:24.722473',	'6dbcbf5e-8e1c-47cc-8578-7b0a33ebc154',	'4fa72b3f-dca2-4fd8-b803-dffacf148c10',	'Descripción4',	'https://via.placeholder.com/150',	'Nike',	'Modelo4'),
                                                                                                                                                                    ('f',	12.99,	3,	'2023-11-02 11:43:24.722473',	5,	'2023-11-02 11:43:24.722473',	'6dbcbf5e-8e1c-47cc-8578-7b0a33ebc154',	'1e2584d8-db52-45da-b2d6-4203637ea78e',	'Descripción5',	'https://via.placeholder.com/150',	'Adidas',	'Modelo5');

DROP TABLE IF EXISTS "user_roles";
DROP SEQUENCE IF EXISTS user_roles_id_seq;
CREATE SEQUENCE user_roles_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 5 CACHE 1;

CREATE TABLE "public"."user_roles" (
                                       "user_id" bigint,
                                       "role" character varying(50) DEFAULT 'USER' NOT NULL,
                                       "id" integer DEFAULT nextval('user_roles_id_seq') NOT NULL,
                                       CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "user_roles" ("user_id", "role", "id") VALUES
                                                       (1,	'USER',	1),
                                                       (1,	'ADMIN',	2),
                                                       (2,	'USER',	3),
                                                       (2,	'USER',	4),
                                                       (3,	'USER',	5);

DROP TABLE IF EXISTS "usuarios";
DROP SEQUENCE IF EXISTS usuarios_id_seq;
CREATE SEQUENCE usuarios_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1;

CREATE TABLE "public"."usuarios" (
                                     "is_deleted" boolean DEFAULT false NOT NULL,
                                     "created_at" timestamp DEFAULT now() NOT NULL,
                                     "id" bigint DEFAULT nextval('usuarios_id_seq') NOT NULL,
                                     "updated_at" timestamp DEFAULT now() NOT NULL,
                                     "apellidos" character varying(255) NOT NULL,
                                     "email" character varying(255) NOT NULL,
                                     "nombre" character varying(255) NOT NULL,
                                     "password" character varying(255) NOT NULL,
                                     "username" character varying(255) NOT NULL,
                                     CONSTRAINT "usuarios_email_key" UNIQUE ("email"),
                                     CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id"),
                                     CONSTRAINT "usuarios_username_key" UNIQUE ("username")
) WITH (oids = false);

INSERT INTO "usuarios" ("is_deleted", "created_at", "id", "updated_at", "apellidos", "email", "nombre", "password", "username") VALUES
                                                                                                                                    ('f',	'2023-11-02 11:43:24.724871',	1,	'2023-11-02 11:43:24.724871',	'Admin Admin',	'admin@prueba.net',	'Admin',	'$2a$10$vPaqZvZkz6jhb7U7k/V/v.5vprfNdOnh4sxi/qpPRkYTzPmFlI9p2',	'admin'),
                                                                                                                                    ('f',	'2023-11-02 11:43:24.730431',	2,	'2023-11-02 11:43:24.730431',	'User User',	'user@prueba.net',	'User',	'$2a$12$RUq2ScW1Kiizu5K4gKoK4OTz80.DWaruhdyfi2lZCB.KeuXTBh0S.',	'user'),
                                                                                                                                    ('f',	'2023-11-02 11:43:24.733552',	3,	'2023-11-02 11:43:24.733552',	'Test Test',	'test@prueba.net',	'Test',	'$2a$10$Pd1yyq2NowcsDf4Cpf/ZXObYFkcycswqHAqBndE1wWJvYwRxlb.Pu',	'test'),
                                                                                                                                    ('f',	'2023-11-02 11:43:24.736674',	4,	'2023-11-02 11:43:24.736674',	'Otro Otro',	'otro@prueba.net',	'otro',	'$2a$12$3Q4.UZbvBMBEvIwwjGEjae/zrIr6S50NusUlBcCNmBd2382eyU0bS',	'otro');

ALTER TABLE ONLY "public"."productos" ADD CONSTRAINT "FK_5aaee6054b643e7c778477193a3" FOREIGN KEY (categoria_id) REFERENCES categorias(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY (user_id) REFERENCES usuarios(id) NOT DEFERRABLE;

-- 2023-11-15 09:53:41.23703+00
