-- CreateEnum
CREATE TYPE "IngredientUnitOfMeasure" AS ENUM ('PINCH', 'TEASPOON', 'TABLESPOON', 'CUP', 'PINT', 'QUART', 'GALLON', 'POUND', 'MILLILITER', 'LITER', 'GRAM', 'OUNCE', 'FLUID_OUNCE', 'KILOGRAM');

-- CreateEnum
CREATE TYPE "IngredientType" AS ENUM ('DRY', 'LIQUID');

-- CreateTable
CREATE TABLE "recipes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT,
    "ownerId" INTEGER NOT NULL,
    "prepTime" INTEGER NOT NULL,
    "cookTime" INTEGER NOT NULL,
    "servings" INTEGER NOT NULL,
    "steps" TEXT[],
    "description" VARCHAR(300) NOT NULL DEFAULT '',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT NOT NULL DEFAULT '',
    "origRecipeId" INTEGER,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredients" (
    "id" SERIAL NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "unit" "IngredientUnitOfMeasure" NOT NULL,
    "kelevens" DOUBLE PRECISION NOT NULL,
    "type" "IngredientType" NOT NULL,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_origRecipeId_fkey" FOREIGN KEY ("origRecipeId") REFERENCES "recipes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
