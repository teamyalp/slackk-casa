  DROP TABLE IF EXISTS dmessages;
  
  CREATE TABLE IF NOT EXISTS "dmessages" (
	"id" serial NOT NULL,
	"text" varchar(1024) NOT NULL,
  "username" varchar(1024) NOT NULL,
  "workspacename" varchar(1024) NOT NULL DEFAULT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT dmsg_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);