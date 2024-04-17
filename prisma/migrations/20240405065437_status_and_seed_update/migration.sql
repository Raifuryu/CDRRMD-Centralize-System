/*
  Warnings:

  - Made the column `statusId` on table `EmailAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `statusId` on table `PhoneNumber` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `EmailAddress` DROP FOREIGN KEY `EmailAddress_statusId_fkey`;

-- DropForeignKey
ALTER TABLE `PhoneNumber` DROP FOREIGN KEY `PhoneNumber_statusId_fkey`;

-- AlterTable
ALTER TABLE `EmailAddress` MODIFY `statusId` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `PhoneNumber` MODIFY `statusId` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `PhoneNumber` ADD CONSTRAINT `PhoneNumber_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `Status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmailAddress` ADD CONSTRAINT `EmailAddress_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `Status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
