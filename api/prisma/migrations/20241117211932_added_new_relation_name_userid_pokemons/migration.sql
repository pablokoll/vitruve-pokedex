/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `pokemons` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "pokemons_name_userId_key" ON "pokemons"("name", "userId");
