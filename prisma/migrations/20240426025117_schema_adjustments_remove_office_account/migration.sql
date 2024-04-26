/*
  Warnings:

  - You are about to drop the `OfficeAccountRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `OfficeAccountRole` DROP FOREIGN KEY `OfficeAccountRole_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `OfficeAccountRole` DROP FOREIGN KEY `OfficeAccountRole_roleId_fkey`;

-- DropTable
DROP TABLE `OfficeAccountRole`;

-- CreateTable
CREATE TABLE `PersonAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `personId` INTEGER NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonAccountRole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `personAccountId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PersonAccount` ADD CONSTRAINT `PersonAccount_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonAccountRole` ADD CONSTRAINT `PersonAccountRole_personAccountId_fkey` FOREIGN KEY (`personAccountId`) REFERENCES `PersonAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonAccountRole` ADD CONSTRAINT `PersonAccountRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
