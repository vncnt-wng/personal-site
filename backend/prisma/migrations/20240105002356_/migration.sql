/*
  Warnings:

  - You are about to drop the `SheetStickers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StickerSheets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `SheetStickers`;

-- DropTable
DROP TABLE `StickerSheets`;

-- CreateTable
CREATE TABLE `StickerSheet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SheetSticker` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `x` DOUBLE NOT NULL,
    `y` DOUBLE NOT NULL,
    `rotation` DOUBLE NOT NULL,
    `scaleX` DOUBLE NOT NULL,
    `scaleY` DOUBLE NOT NULL,
    `editable` BOOLEAN NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `stickerBorderEnabled` BOOLEAN NOT NULL,
    `stickerBorderWidth` DOUBLE NOT NULL,
    `sheetId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SheetSticker` ADD CONSTRAINT `SheetSticker_sheetId_fkey` FOREIGN KEY (`sheetId`) REFERENCES `StickerSheet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
