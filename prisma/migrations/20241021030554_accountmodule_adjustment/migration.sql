/*
  Warnings:

  - You are about to drop the column `AccountId` on the `accountmodules` table. All the data in the column will be lost.
  - Added the required column `accountId` to the `AccountModules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `accountmodules` DROP FOREIGN KEY `AccountModules_AccountId_fkey`;

-- AlterTable
ALTER TABLE `accountmodules` DROP COLUMN `AccountId`,
    ADD COLUMN `accountId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `AccountModules` ADD CONSTRAINT `AccountModules_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
