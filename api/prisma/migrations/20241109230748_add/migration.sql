/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `pokemons` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "pokemons" ADD COLUMN "sprite" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "pokemons_id_key" ON "pokemons"("id");
