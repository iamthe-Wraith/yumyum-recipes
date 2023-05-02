/*
  Warnings:

  - You are about to drop the `grocery_list` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "grocery_list" DROP CONSTRAINT "grocery_list_meal_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "grocery_list" DROP CONSTRAINT "grocery_list_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "grocery_list_item" DROP CONSTRAINT "grocery_list_item_grocery_list_id_fkey";

-- DropTable
DROP TABLE "grocery_list";

-- CreateTable
CREATE TABLE "grocery_lists" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "meal_plan_id" INTEGER NOT NULL,
    "status" "GroceryListStatus" NOT NULL,

    CONSTRAINT "grocery_lists_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "grocery_list_item" ADD CONSTRAINT "grocery_list_item_grocery_list_id_fkey" FOREIGN KEY ("grocery_list_id") REFERENCES "grocery_lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grocery_lists" ADD CONSTRAINT "grocery_lists_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grocery_lists" ADD CONSTRAINT "grocery_lists_meal_plan_id_fkey" FOREIGN KEY ("meal_plan_id") REFERENCES "meal_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
