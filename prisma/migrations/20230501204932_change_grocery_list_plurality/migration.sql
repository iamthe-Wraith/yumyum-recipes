/*
  Warnings:

  - You are about to drop the `grocery_list_item` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "grocery_list_item" DROP CONSTRAINT "grocery_list_item_grocery_list_id_fkey";

-- DropTable
DROP TABLE "grocery_list_item";

-- CreateTable
CREATE TABLE "grocery_list_items" (
    "id" SERIAL NOT NULL,
    "grocery_list_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "kelevens" DOUBLE PRECISION NOT NULL,
    "type" "IngredientType" NOT NULL,
    "status" "GroceryListItemStatus" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grocery_list_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "grocery_list_items" ADD CONSTRAINT "grocery_list_items_grocery_list_id_fkey" FOREIGN KEY ("grocery_list_id") REFERENCES "grocery_lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
