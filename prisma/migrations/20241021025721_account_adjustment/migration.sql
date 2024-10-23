/*
  Warnings:

  - You are about to drop the `personaccountrole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `personaccountrole` DROP FOREIGN KEY `PersonAccountRole_AccountId_fkey`;

-- DropForeignKey
ALTER TABLE `personaccountrole` DROP FOREIGN KEY `PersonAccountRole_roleId_fkey`;

-- DropTable
DROP TABLE `personaccountrole`;

-- DropTable
DROP TABLE `role`;

-- CreateTable
CREATE TABLE `AccountModules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `AccountId` INTEGER NOT NULL,
    `moduleId` INTEGER NOT NULL,
    `access` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Modules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `moduleId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AccountModules` ADD CONSTRAINT `AccountModules_AccountId_fkey` FOREIGN KEY (`AccountId`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccountModules` ADD CONSTRAINT `AccountModules_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `Modules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
