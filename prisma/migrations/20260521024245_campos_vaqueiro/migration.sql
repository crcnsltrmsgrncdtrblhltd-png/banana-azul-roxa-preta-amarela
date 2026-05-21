-- AlterTable
ALTER TABLE "Senha" ADD COLUMN     "boiNaTv" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cavaloEsteireiro" TEXT,
ADD COLUMN     "cavaloPuxador" TEXT,
ADD COLUMN     "esteireiro" TEXT,
ADD COLUMN     "representacao" TEXT,
ADD COLUMN     "valorBoiNaTv" DECIMAL(10,2);
