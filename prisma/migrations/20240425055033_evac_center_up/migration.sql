-- CreateTable
CREATE TABLE `EvacuationCenter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `barangay` VARCHAR(191) NOT NULL,
    `sitio` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `isAssessed` VARCHAR(191) NOT NULL,
    `haveMOA` VARCHAR(191) NOT NULL,
    `onCMP` VARCHAR(191) NOT NULL,
    `governmentOwned` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `individualCapacity` INTEGER NOT NULL,
    `familyCapacity` INTEGER NOT NULL,
    `latitude` VARCHAR(191) NOT NULL,
    `longitude` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
