/*
  Warnings:

  - A unique constraint covering the columns `[userId,itemId]` on the table `UserInteraction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserInteraction_userId_itemId_key" ON "UserInteraction"("userId", "itemId");
