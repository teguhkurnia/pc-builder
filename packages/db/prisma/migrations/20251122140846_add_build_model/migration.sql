-- CreateTable
CREATE TABLE `Build` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `status` ENUM('DRAFT', 'COMPLETED', 'SAVED') NOT NULL DEFAULT 'DRAFT',
    `totalPrice` DOUBLE NOT NULL DEFAULT 0,
    `cpuId` INTEGER NULL,
    `motherboardId` INTEGER NULL,
    `ramId` INTEGER NULL,
    `storageId` INTEGER NULL,
    `gpuId` INTEGER NULL,
    `psuId` INTEGER NULL,
    `caseId` INTEGER NULL,
    `coolingId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Build_status_idx`(`status`),
    INDEX `Build_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Build` ADD CONSTRAINT `Build_cpuId_fkey` FOREIGN KEY (`cpuId`) REFERENCES `Component`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Build` ADD CONSTRAINT `Build_motherboardId_fkey` FOREIGN KEY (`motherboardId`) REFERENCES `Component`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Build` ADD CONSTRAINT `Build_ramId_fkey` FOREIGN KEY (`ramId`) REFERENCES `Component`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Build` ADD CONSTRAINT `Build_storageId_fkey` FOREIGN KEY (`storageId`) REFERENCES `Component`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Build` ADD CONSTRAINT `Build_gpuId_fkey` FOREIGN KEY (`gpuId`) REFERENCES `Component`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Build` ADD CONSTRAINT `Build_psuId_fkey` FOREIGN KEY (`psuId`) REFERENCES `Component`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Build` ADD CONSTRAINT `Build_caseId_fkey` FOREIGN KEY (`caseId`) REFERENCES `Component`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Build` ADD CONSTRAINT `Build_coolingId_fkey` FOREIGN KEY (`coolingId`) REFERENCES `Component`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
