-- AlterTable: Add isAlert column to Afspraak
ALTER TABLE "Afspraak" ADD COLUMN "isAlert" BOOLEAN NOT NULL DEFAULT false;
