/*
  Warnings:

  - You are about to drop the column `fecha` on the `movimientoinventario` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `venta` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `MovimientoInventario_fecha_idx` ON `movimientoinventario`;

-- DropIndex
DROP INDEX `Venta_fecha_idx` ON `venta`;

-- AlterTable
ALTER TABLE `movimientoinventario` DROP COLUMN `fecha`;

-- AlterTable
ALTER TABLE `venta` DROP COLUMN `fecha`;

-- CreateIndex
CREATE INDEX `MovimientoInventario_created_at_idx` ON `MovimientoInventario`(`created_at`);

-- CreateIndex
CREATE INDEX `Venta_created_at_idx` ON `Venta`(`created_at`);
