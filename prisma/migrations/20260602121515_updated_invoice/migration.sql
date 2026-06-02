-- AlterTable
ALTER TABLE `Invoice` ADD COLUMN `paidAt` DATETIME(3) NULL,
    ADD COLUMN `paymentNotes` TEXT NULL;
