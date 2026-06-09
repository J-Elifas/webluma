-- AlterTable
ALTER TABLE `User` ADD COLUMN `remindersEnabled` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `reminderDaysBefore` INTEGER NOT NULL DEFAULT 3;
