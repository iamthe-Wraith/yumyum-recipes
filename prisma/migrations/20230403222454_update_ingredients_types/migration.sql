/*
  Warnings:

  - The values [DRY,LIQUID] on the enum `IngredientType` will be removed. If these variants are still used in the database, this will fail.
  - The values [COUNT] on the enum `IngredientUnitOfMeasure` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "IngredientType_new" AS ENUM ('VOLUME', 'WEIGHT', 'COUNT');
ALTER TABLE "ingredients" ALTER COLUMN "type" TYPE "IngredientType_new" USING ("type"::text::"IngredientType_new");
ALTER TYPE "IngredientType" RENAME TO "IngredientType_old";
ALTER TYPE "IngredientType_new" RENAME TO "IngredientType";
DROP TYPE "IngredientType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "IngredientUnitOfMeasure_new" AS ENUM ('PINCH', 'TEASPOON', 'TABLESPOON', 'CUP', 'PINT', 'QUART', 'GALLON', 'POUND', 'MILLILITER', 'LITER', 'GRAM', 'OUNCE', 'FLUID_OUNCE', 'KILOGRAM');
ALTER TABLE "ingredients" ALTER COLUMN "unit" TYPE "IngredientUnitOfMeasure_new" USING ("unit"::text::"IngredientUnitOfMeasure_new");
ALTER TYPE "IngredientUnitOfMeasure" RENAME TO "IngredientUnitOfMeasure_old";
ALTER TYPE "IngredientUnitOfMeasure_new" RENAME TO "IngredientUnitOfMeasure";
DROP TYPE "IngredientUnitOfMeasure_old";
COMMIT;

-- AlterTable
ALTER TABLE "ingredients" ALTER COLUMN "unit" DROP NOT NULL;
