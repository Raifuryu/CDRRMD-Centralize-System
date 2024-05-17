/*
  Warnings:

  - Added the required column `trainerId` to the `Training` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `training` ADD COLUMN `trainerId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Training` ADD CONSTRAINT `Training_trainerId_fkey` FOREIGN KEY (`trainerId`) REFERENCES `Person`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
