  CREATE TABLE IF NOT EXISTS "workspaces" (
	"id" serial NOT NULL,
	"name" varchar(1024) NOT NULL UNIQUE,
  "db_name" varchar(1024) NOT NULL UNIQUE,
	CONSTRAINT workspaces_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);