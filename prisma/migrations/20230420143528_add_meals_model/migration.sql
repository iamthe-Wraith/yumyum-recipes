/*
  Warnings:

  - You are about to drop the `_meal_plansTorecipes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_meal_plansTorecipes" DROP CONSTRAINT "_meal_plansTorecipes_A_fkey";

-- DropForeignKey
ALTER TABLE "_meal_plansTorecipes" DROP CONSTRAINT "_meal_plansTorecipes_B_fkey";

-- DropTable
DROP TABLE "_meal_plansTorecipes";

-- CreateTable
CREATE TABLE "meals" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "meal_plan_id" INTEGER NOT NULL,
    "serving" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_mealsTorecipes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_mealsTorecipes_AB_unique" ON "_mealsTorecipes"("A", "B");

-- CreateIndex
CREATE INDEX "_mealsTorecipes_B_index" ON "_mealsTorecipes"("B");

-- AddForeignKey
ALTER TABLE "meals" ADD CONSTRAINT "meals_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meals" ADD CONSTRAINT "meals_meal_plan_id_fkey" FOREIGN KEY ("meal_plan_id") REFERENCES "meal_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_mealsTorecipes" ADD CONSTRAINT "_mealsTorecipes_A_fkey" FOREIGN KEY ("A") REFERENCES "meals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_mealsTorecipes" ADD CONSTRAINT "_mealsTorecipes_B_fkey" FOREIGN KEY ("B") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
