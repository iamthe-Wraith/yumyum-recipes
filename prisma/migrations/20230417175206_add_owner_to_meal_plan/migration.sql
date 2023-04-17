/*
  Warnings:

  - Added the required column `owner_id` to the `meal_plans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "meal_plans" ADD COLUMN     "owner_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "meal_plans" ADD CONSTRAINT "meal_plans_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
