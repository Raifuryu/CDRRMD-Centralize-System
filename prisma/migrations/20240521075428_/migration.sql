/*
  Warnings:

  - Added the required column `updatedAt` to the `Training` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `person` ADD COLUMN `gender` ENUM('MALE', 'FEMALE') NULL;

-- AlterTable
ALTER TABLE `training` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `PersonCategory` (
    `id` INTEGER NOT NULL,
    `category` ENUM('Personnel') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PersonCategory_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonnelTraining` (
    `id` INTEGER NOT NULL,
    `host` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `dateOfTraining` DATETIME(3) NOT NULL,
    `trainingHours` INTEGER NOT NULL,
    `certificateName` VARCHAR(191) NOT NULL,
    `certificateStatus` ENUM('Completion', 'Participation', 'Attendance') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PersonnelTraining_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Division` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Unit` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Section` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonAddress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cityId` INTEGER NOT NULL,
    `barangayId` INTEGER NOT NULL,
    `street` VARCHAR(191) NULL,
    `longitude` DOUBLE NULL,
    `latitude` DOUBLE NULL,
    `type` ENUM('Permanent', 'Temporary') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PersonCategory` ADD CONSTRAINT `PersonCategory_id_fkey` FOREIGN KEY (`id`) REFERENCES `Person`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonnelTraining` ADD CONSTRAINT `PersonnelTraining_id_fkey` FOREIGN KEY (`id`) REFERENCES `Person`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonAddress` ADD CONSTRAINT `PersonAddress_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonAddress` ADD CONSTRAINT `PersonAddress_barangayId_fkey` FOREIGN KEY (`barangayId`) REFERENCES `Barangay`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
