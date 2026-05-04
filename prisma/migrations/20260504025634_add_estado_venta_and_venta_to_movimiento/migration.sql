-- AlterTable
ALTER TABLE `movimientoinventario` ADD COLUMN `venta_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `venta` ADD COLUMN `estado` ENUM('ACTIVA', 'CANCELADA') NOT NULL DEFAULT 'ACTIVA';

-- CreateIndex
CREATE INDEX `MovimientoInventario_venta_id_idx` ON `MovimientoInventario`(`venta_id`);

-- AddForeignKey
ALTER TABLE `MovimientoInventario` ADD CONSTRAINT `MovimientoInventario_venta_id_fkey` FOREIGN KEY (`venta_id`) REFERENCES `Venta`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
