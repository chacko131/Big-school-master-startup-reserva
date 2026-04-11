-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'WAITLISTED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "ReservationApprovalMode" AS ENUM ('AUTO', 'MANUAL');

-- CreateEnum
CREATE TYPE "WaitlistMode" AS ENUM ('MANUAL', 'AUTO');

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Madrid',
    "phone" TEXT,
    "email" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantSettings" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "reservationApprovalMode" "ReservationApprovalMode" NOT NULL DEFAULT 'AUTO',
    "waitlistMode" "WaitlistMode" NOT NULL DEFAULT 'MANUAL',
    "defaultReservationDurationMinutes" INTEGER NOT NULL DEFAULT 90,
    "reservationBufferMinutes" INTEGER NOT NULL DEFAULT 15,
    "cancellationWindowHours" INTEGER NOT NULL DEFAULT 24,
    "allowTableCombination" BOOLEAN NOT NULL DEFAULT true,
    "enableAutoTableAssignment" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiningTable" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 4,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isCombinable" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiningTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "notes" TEXT,
    "noShowCount" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "partySize" INTEGER NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "cancellationDeadlineAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "checkedInAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "noShowMarkedAt" TIMESTAMP(3),
    "specialRequests" TEXT,
    "internalNotes" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservationTable" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "assignedSeats" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 1,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReservationTable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_slug_key" ON "Restaurant"("slug");

-- CreateIndex
CREATE INDEX "Restaurant_isActive_idx" ON "Restaurant"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantSettings_restaurantId_key" ON "RestaurantSettings"("restaurantId");

-- CreateIndex
CREATE INDEX "DiningTable_restaurantId_isActive_idx" ON "DiningTable"("restaurantId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "DiningTable_restaurantId_name_key" ON "DiningTable"("restaurantId", "name");

-- CreateIndex
CREATE INDEX "Guest_restaurantId_fullName_idx" ON "Guest"("restaurantId", "fullName");

-- CreateIndex
CREATE INDEX "Guest_restaurantId_email_idx" ON "Guest"("restaurantId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Guest_restaurantId_phone_key" ON "Guest"("restaurantId", "phone");

-- CreateIndex
CREATE INDEX "Reservation_restaurantId_status_startAt_idx" ON "Reservation"("restaurantId", "status", "startAt");

-- CreateIndex
CREATE INDEX "Reservation_restaurantId_startAt_endAt_idx" ON "Reservation"("restaurantId", "startAt", "endAt");

-- CreateIndex
CREATE INDEX "Reservation_restaurantId_guestId_idx" ON "Reservation"("restaurantId", "guestId");

-- CreateIndex
CREATE INDEX "ReservationTable_tableId_assignedAt_idx" ON "ReservationTable"("tableId", "assignedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReservationTable_reservationId_tableId_key" ON "ReservationTable"("reservationId", "tableId");

-- AddForeignKey
ALTER TABLE "RestaurantSettings" ADD CONSTRAINT "RestaurantSettings_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiningTable" ADD CONSTRAINT "DiningTable_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationTable" ADD CONSTRAINT "ReservationTable_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationTable" ADD CONSTRAINT "ReservationTable_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "DiningTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
