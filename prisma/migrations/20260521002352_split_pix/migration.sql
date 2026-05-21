/*
  Warnings:

  - You are about to drop the column `parcelas` on the `Pagamento` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Pagamento_pedidoId_key";

-- AlterTable
ALTER TABLE "Pagamento" DROP COLUMN "parcelas",
ADD COLUMN     "checkoutUrl" TEXT,
ADD COLUMN     "numeroParcela" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "totalParcelas" INTEGER NOT NULL DEFAULT 1;
