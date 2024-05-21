/*
  Warnings:

  - The values [MALE,FEMALE] on the enum `Person_gender` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `person` MODIFY `gender` ENUM('Male', 'Female') NULL;
