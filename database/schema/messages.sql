  CREATE TABLE IF NOT EXISTS "messages" (
	"id" serial NOT NULL,
	"text" varchar(1024) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT messages_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);