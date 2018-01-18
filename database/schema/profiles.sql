CREATE TABLE IF NOT EXISTS "profiles" (
	"id" serial NOT NULL,
	"username" varchar(1024) NOT NULL UNIQUE,
	"fullname" varchar(1024),
	"status" varchar(1024),
	"bio" varchar(1024),
	"phone" varchar(8192),
	"image" varchar(1024),
	CONSTRAINT profiles_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);