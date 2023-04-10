/*
  Warnings:

  - You are about to drop the column `img` on the `recipes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "img",
ADD COLUMN     "image" TEXT;
