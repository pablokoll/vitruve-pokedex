/*
  Warnings:

  - You are about to drop the column `evolutionId` on the `pokemon_evolutions` table. All the data in the column will be lost.
  - Added the required column `name` to the `pokemon_evolutions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pokemon_evolutions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "pokemonId" TEXT NOT NULL,
    CONSTRAINT "pokemon_evolutions_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "pokemons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_pokemon_evolutions" ("id", "pokemonId") SELECT "id", "pokemonId" FROM "pokemon_evolutions";
DROP TABLE "pokemon_evolutions";
ALTER TABLE "new_pokemon_evolutions" RENAME TO "pokemon_evolutions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
