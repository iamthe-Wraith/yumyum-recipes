-- CreateEnum
CREATE TYPE "GroceryListStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "GroceryListItemStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "grocery_list_item" (
    "id" SERIAL NOT NULL,
    "grocery_list_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "kelevens" DOUBLE PRECISION NOT NULL,
    "type" "IngredientType" NOT NULL,
    "status" "GroceryListItemStatus" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grocery_list_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grocery_list" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "meal_plan_id" INTEGER NOT NULL,
    "status" "GroceryListStatus" NOT NULL,

    CONSTRAINT "grocery_list_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "grocery_list_item" ADD CONSTRAINT "grocery_list_item_grocery_list_id_fkey" FOREIGN KEY ("grocery_list_id") REFERENCES "grocery_list"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grocery_list" ADD CONSTRAINT "grocery_list_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grocery_list" ADD CONSTRAINT "grocery_list_meal_plan_id_fkey" FOREIGN KEY ("meal_plan_id") REFERENCES "meal_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
