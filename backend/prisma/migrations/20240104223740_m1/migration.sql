/*
  Warnings:

  - You are about to drop the `SheetSticker` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StickerSheet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `SheetSticker`;

-- DropTable
DROP TABLE `StickerSheet`;

-- CreateTable
CREATE TABLE `StickerSheets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SheetStickers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
