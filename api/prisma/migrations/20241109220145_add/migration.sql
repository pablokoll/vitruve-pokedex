/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateTable
CREATE TABLE "pokemons" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "height" REAL,
    "weight" REAL,
    "category" TEXT,
    "gender" TEXT,
    "userId" TEXT,
    CONSTRAINT "pokemons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pokemon_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "pokemonId" TEXT NOT NULL,
    CONSTRAINT "pokemon_types_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "pokemons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pokemon_abilities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ability" TEXT NOT NULL,
    "pokemonId" TEXT NOT NULL,
    CONSTRAINT "pokemon_abilities_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "pokemons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pokemon_evolutions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "evolutionId" TEXT NOT NULL,
    "pokemonId" TEXT NOT NULL,
    CONSTRAINT "pokemon_evolutions_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "pokemons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pokemon_stats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "statName" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "pokemonId" TEXT NOT NULL,
    CONSTRAINT "pokemon_stats_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "pokemons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "pokemonId" TEXT NOT NULL,
    CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Favorite_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "pokemons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("id", "password", "username") SELECT "id", "password", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_pokemonId_key" ON "Favorite"("userId", "pokemonId");
