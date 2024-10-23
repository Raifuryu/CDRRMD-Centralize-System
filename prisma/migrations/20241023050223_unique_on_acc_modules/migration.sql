/*
  Warnings:

  - A unique constraint covering the columns `[accountId,moduleId]` on the table `AccountModules` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `AccountModules_accountId_moduleId_key` ON `AccountModules`(`accountId`, `moduleId`);
