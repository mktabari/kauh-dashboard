/*
  Warnings:

  - You are about to drop the column `t5` on the `DbSize` table. All the data in the column will be lost.
  - You are about to drop the column `test` on the `DbSize` table. All the data in the column will be lost.
  - You are about to drop the column `test2` on the `DbSize` table. All the data in the column will be lost.
  - You are about to drop the column `test3` on the `DbSize` table. All the data in the column will be lost.
  - You are about to drop the column `test4` on the `DbSize` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DbSize" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dbName" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dbSizeGroup" TEXT NOT NULL
);
INSERT INTO "new_DbSize" ("date", "dbName", "dbSizeGroup", "id", "size") SELECT "date", "dbName", "dbSizeGroup", "id", "size" FROM "DbSize";
DROP TABLE "DbSize";
ALTER TABLE "new_DbSize" RENAME TO "DbSize";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
