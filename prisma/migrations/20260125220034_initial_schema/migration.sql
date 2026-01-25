-- CreateTable
CREATE TABLE "Patient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rijksregisternummer" TEXT NOT NULL,
    "voornaam" TEXT NOT NULL,
    "achternaam" TEXT NOT NULL,
    "geboortedatum" DATETIME NOT NULL,
    "telefoonnummer" TEXT NOT NULL,
    "email" TEXT,
    "straat" TEXT,
    "huisnummer" TEXT,
    "postcode" TEXT,
    "gemeente" TEXT,
    "contactpersoon" TEXT,
    "contactpersoonTelefoon" TEXT,
    "aangemaakt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "laatstGewijzigd" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Teamlid" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "voornaam" TEXT NOT NULL,
    "achternaam" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "wachtwoord" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'ZORGVERLENER',
    "discipline" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "actief" BOOLEAN NOT NULL DEFAULT true,
    "foto" TEXT,
    "bio" TEXT,
    "aangemaakt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "laatstGewijzigd" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Afspraak" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "datum" DATETIME NOT NULL,
    "duur" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "roc" TEXT,
    "adminTitel" TEXT,
    "status" TEXT NOT NULL DEFAULT 'TE_BEVESTIGEN',
    "locatieStraat" TEXT,
    "locatieHuisnummer" TEXT,
    "locatiePostcode" TEXT,
    "locatieGemeente" TEXT,
    "reistijdMinuten" INTEGER,
    "notities" TEXT,
    "aangemaakt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "laatstGewijzigd" DATETIME NOT NULL,
    "patientId" INTEGER,
    "zorgverlenerId" INTEGER NOT NULL,
    "ingeboektDoorId" INTEGER NOT NULL,
    "herhalendeReeksId" INTEGER,
    CONSTRAINT "Afspraak_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Afspraak_zorgverlenerId_fkey" FOREIGN KEY ("zorgverlenerId") REFERENCES "Teamlid" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Afspraak_ingeboektDoorId_fkey" FOREIGN KEY ("ingeboektDoorId") REFERENCES "Teamlid" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Afspraak_herhalendeReeksId_fkey" FOREIGN KEY ("herhalendeReeksId") REFERENCES "HerhalendeReeks" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HerhalendeReeks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "totaalSessies" INTEGER NOT NULL,
    "frequentie" TEXT NOT NULL,
    "aangemaakt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patientId" INTEGER NOT NULL,
    "zorgverlenerId" INTEGER NOT NULL,
    CONSTRAINT "HerhalendeReeks_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HerhalendeReeks_zorgverlenerId_fkey" FOREIGN KEY ("zorgverlenerId") REFERENCES "Teamlid" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_rijksregisternummer_key" ON "Patient"("rijksregisternummer");

-- CreateIndex
CREATE UNIQUE INDEX "Teamlid_email_key" ON "Teamlid"("email");
