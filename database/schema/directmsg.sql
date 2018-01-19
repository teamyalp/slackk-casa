-- DROP TABLE IF EXISTS directmsg;
-- adds user(s) to specific workspace
CREATE TABLE IF NOT EXISTS "directmsg" (
	"id" serial NOT NULL,
	"username" varchar(1024) NOT NULL UNIQUE,
	"workspacename" varchar(1024) NOT NULL,
	CONSTRAINT duser_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
