/*
  Warnings:

  - You are about to alter the column `moduleId` on the `modules` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `modules` MODIFY `moduleId` INTEGER NOT NULL;
