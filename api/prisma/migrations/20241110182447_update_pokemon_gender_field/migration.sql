/*
  Warnings:

  - You are about to drop the column `gender` on the `pokemons` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "pokemon_genders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gender" TEXT NOT NULL,
    "pokemonId" TEXT NOT NULL,
    CONSTRAINT "pokemon_genders_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "pokemons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pokemons" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "height" REAL,
    "weight" REAL,
    "category" TEXT,
    "sprite" TEXT,
    "userId" TEXT,
    CONSTRAINT "pokemons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_pokemons" ("category", "height", "id", "name", "sprite", "userId", "weight") SELECT "category", "height", "id", "name", "sprite", "userId", "weight" FROM "pokemons";
DROP TABLE "pokemons";
ALTER TABLE "new_pokemons" RENAME TO "pokemons";
CREATE UNIQUE INDEX "pokemons_id_key" ON "pokemons"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
