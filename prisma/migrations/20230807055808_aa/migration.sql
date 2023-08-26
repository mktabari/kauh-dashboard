-- CreateTable
CREATE TABLE "DbSize" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dbName" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dbSizeGroup" TEXT NOT NULL,
    "test" TEXT,
    "test2" TEXT,
    "test3" TEXT,
    "test4" TEXT
);
