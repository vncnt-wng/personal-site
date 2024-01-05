/*
  Warnings:

  - Made the column `stickerBorderWidth` on table `SheetSticker` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `SheetSticker` MODIFY `scaleX` DOUBLE NOT NULL DEFAULT 1.0,
    MODIFY `scaleY` DOUBLE NOT NULL DEFAULT 1.0,
    MODIFY `editable` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `stickerBorderEnabled` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `stickerBorderWidth` INTEGER NOT NULL DEFAULT 3;
