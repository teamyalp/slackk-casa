CREATE TABLE IF NOT EXISTS "users" (
	"id" serial NOT NULL,
	"username" varchar(1024) NOT NULL UNIQUE,
	"password" varchar(1024) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT users_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
