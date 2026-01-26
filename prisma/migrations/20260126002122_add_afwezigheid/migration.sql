-- CreateTable: Afwezigheid
CREATE TABLE "Afwezigheid" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startDatum" DATETIME NOT NULL,
    "eindDatum" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "reden" TEXT,
    "aangemaakt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "laatstGewijzigd" DATETIME NOT NULL,
    "zorgverlenerId" INTEGER NOT NULL,
    CONSTRAINT "Afwezigheid_zorgverlenerId_fkey" FOREIGN KEY ("zorgverlenerId") REFERENCES "Teamlid" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
