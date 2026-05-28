/*
  Warnings:

  - The values [CUSTOM] on the enum `Client_plan` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Client` MODIFY `plan` ENUM('STARTER', 'PRO', 'ENTERPRISE') NOT NULL;
