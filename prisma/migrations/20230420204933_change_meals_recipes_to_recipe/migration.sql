/*
  Warnings:

  - You are about to drop the `_mealsTorecipes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `recipe_id` to the `meals` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_mealsTorecipes" DROP CONSTRAINT "_mealsTorecipes_A_fkey";

-- DropForeignKey
ALTER TABLE "_mealsTorecipes" DROP CONSTRAINT "_mealsTorecipes_B_fkey";

-- AlterTable
ALTER TABLE "meals" ADD COLUMN     "recipe_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_mealsTorecipes";

-- AddForeignKey
ALTER TABLE "meals" ADD CONSTRAINT "meals_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
