CREATE TABLE IF NOT EXISTS "users" (
	"id" serial NOT NULL,
	"username" varchar(1024) NOT NULL UNIQUE,
	"password" varchar(1024) NOT NULL,
	"email" varchar(1024) NOT NULL,
	"password_hint" varchar(8192),
	CONSTRAINT users_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
