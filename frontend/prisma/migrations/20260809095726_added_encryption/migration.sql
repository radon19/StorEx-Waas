/*
  Warnings:

  - You are about to drop the column `privateKey` on the `solWallet` table. All the data in the column will be lost.
  - Added the required column `authTag` to the `solWallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encryptedPrivateKey` to the `solWallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iv` to the `solWallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "solWallet" DROP COLUMN "privateKey",
ADD COLUMN     "authTag" TEXT NOT NULL,
ADD COLUMN     "encryptedPrivateKey" TEXT NOT NULL,
ADD COLUMN     "iv" TEXT NOT NULL;
