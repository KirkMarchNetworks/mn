-- CreateEnum
CREATE TYPE "GenerativeModelEnum" AS ENUM ('AmazonTitanEmbedImageV1', 'GeminiOnePointFivePro');

-- CreateTable
CREATE TABLE "IntelligentRetrievalSettings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "generativeModel" "GenerativeModelEnum" NOT NULL DEFAULT 'AmazonTitanEmbedImageV1',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntelligentRetrievalSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IntelligentRetrievalSettings_tenantId_key" ON "IntelligentRetrievalSettings"("tenantId");

-- AddForeignKey
ALTER TABLE "IntelligentRetrievalSettings" ADD CONSTRAINT "IntelligentRetrievalSettings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
