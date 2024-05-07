/*
  Warnings:

  - Added the required column `pax` to the `Training` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `training` ADD COLUMN `pax` INTEGER NOT NULL;
