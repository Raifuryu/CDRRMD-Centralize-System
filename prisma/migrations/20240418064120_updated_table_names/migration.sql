/*
  Warnings:

  - You are about to drop the `EmailAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PhoneNumber` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `EmailAddress` DROP FOREIGN KEY `EmailAddress_personId_fkey`;

-- DropForeignKey
ALTER TABLE `EmailAddress` DROP FOREIGN KEY `EmailAddress_statusId_fkey`;

-- DropForeignKey
ALTER TABLE `PhoneNumber` DROP FOREIGN KEY `PhoneNumber_personId_fkey`;

-- DropForeignKey
ALTER TABLE `PhoneNumber` DROP FOREIGN KEY `PhoneNumber_statusId_fkey`;

-- DropTable
DROP TABLE `EmailAddress`;

-- DropTable
DROP TABLE `PhoneNumber`;

-- CreateTable
CREATE TABLE `PersonPhoneNumber` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `personId` INTEGER NOT NULL,
    `number` VARCHAR(255) NOT NULL,
    `statusId` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonEmailAddress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `personId` INTEGER NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `statusId` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PersonPhoneNumber` ADD CONSTRAINT `PersonPhoneNumber_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonPhoneNumber` ADD CONSTRAINT `PersonPhoneNumber_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `Status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonEmailAddress` ADD CONSTRAINT `PersonEmailAddress_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonEmailAddress` ADD CONSTRAINT `PersonEmailAddress_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `Status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
