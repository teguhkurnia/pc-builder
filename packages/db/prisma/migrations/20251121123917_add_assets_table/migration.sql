-- AlterTable
ALTER TABLE `Component` ADD COLUMN `imageUrl` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Asset` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `filename` VARCHAR(191) NOT NULL,
    `originalFilename` VARCHAR(191) NOT NULL,
    `mimetype` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `type` ENUM('IMAGE', 'DOCUMENT', 'OTHER') NOT NULL DEFAULT 'IMAGE',
    `url` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Asset_filename_key`(`filename`),
    INDEX `Asset_type_idx`(`type`),
    INDEX `Asset_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
