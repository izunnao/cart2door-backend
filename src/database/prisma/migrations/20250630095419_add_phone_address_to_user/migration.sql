-- Step 1: Add columns as nullable
ALTER TABLE "User" 
ADD COLUMN "address" TEXT,
ADD COLUMN "phone" TEXT;

-- Step 2: Update existing rows with appropriate values
UPDATE "User" 
SET "address" = 'Unknown', 
    "phone" = 'Unknown'
WHERE "address" IS NULL OR "phone" IS NULL;

-- Step 3: Alter columns to be NOT NULL
ALTER TABLE "User" 
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;
