-- CreateTable
CREATE TABLE `Component` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('CPU', 'MOTHERBOARD', 'RAM', 'STORAGE', 'GPU', 'PSU', 'CASE', 'COOLING') NOT NULL,
    `price` DOUBLE NOT NULL,
    `specifications` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
