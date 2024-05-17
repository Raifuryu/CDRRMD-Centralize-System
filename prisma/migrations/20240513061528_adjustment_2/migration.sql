-- DropForeignKey
ALTER TABLE `training` DROP FOREIGN KEY `Training_trainerId_fkey`;

-- AddForeignKey
ALTER TABLE `Training` ADD CONSTRAINT `Training_trainerId_fkey` FOREIGN KEY (`trainerId`) REFERENCES `Office`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
