import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import prismaClient from "../config/prisma";
import httpStatus from "http-status";
import handleErrorResponse from "../utils/controller.helper";
import { nanoid } from 'nanoid';
import { Prisma } from "@prisma/client";

export const reservationRouter = express.Router();

reservationRouter.post(
  "/reserve-chalet",
  asyncHandler(async (req: Request, res: Response) => {
    const {
      customer,
      chaletId,
      checkIn,
      checkOut,
      adults = 1,
      children = 0,
      totalCost,
      status = "PENDING",
      paymentStatus = "UNPAID",
      payment,
      specialRequests,
    } = req.body;

    const bookingReference = `BK-${nanoid(8).toUpperCase()}`;

    try {
      // Open a transaction with timeout
      const newChaletReservation = await prismaClient.$transaction(
        async (prisma) => {
          // 1. Upsert Customer (create if not exists)
          const customerRecord = await prismaClient.customer.create({
            data: {
              firstName: customer.firstName,
              lastName: customer.lastName,
              email: customer.email,
              phone: customer.phone,
              address: customer.address,
              nationality: customer.nationality,
              nationalIdNumber: customer.nationalIdNumber,
            },
          });

          // 2. Create Reservation
          const reservation = await prisma.reservation.create({
            data: {
              customerId: customerRecord.id,
              chaletId,
              checkIn: new Date(checkIn),
              checkOut: new Date(checkOut),
              adults,
              children,
              totalCost,
              status,
              paymentStatus,
              specialRequests,
              bookingRefNumber: bookingReference,
              bookingSource: "WEBSITE",
              earlyCheckinRequest: false,
              lateCheckoutRequest: false,
              discountApplied: 0,
              refundedAmount: 0,
            },
          });

          // 3. Create Payment Record
          if (payment) {
            await prisma.payment.create({
              data: {
                reservationId: reservation.id,
                amount: payment.amount,
                paymentMethod: payment.paymentMethod,
                transactionId: payment.transactionId || null,
                date: payment.date || new Date(),
                status: payment.status,
                notes: payment.notes || null,
              },
            });
          }

          // 4. Update Chalet Availability
          const chalet = await prisma.chalet.update({
            where: { id: chaletId },
            data: { available: false },
            select: {
              name: true,
              chaletType: true,
              chaletImage: true,
            },
          });

          return { ...reservation, customer: customerRecord, chalet };
        },
        { timeout: 60000 } // Set transaction timeout to 60 seconds
      );

      res.status(httpStatus.CREATED).json(newChaletReservation);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2028") {
        res.status(httpStatus.REQUEST_TIMEOUT).json({
          error: "Transaction timed out. Please try again later.",
        });
      } else {
        handleErrorResponse(error, res);
      }
    }
  })
);

reservationRouter.get(
  "/get-reservations",
  asyncHandler(async (_req: Request, res: Response) => {
    try {
      const reservations = await prismaClient.reservation.findMany({
        include: {
          customer: true,
          chalet: true,
          payments: true,
        },
      });
      res.status(httpStatus.OK).json(reservations);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  })
);

reservationRouter.get(
  "/get-reservation/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Invalid reservation ID" });
      return;
    }

    try {
      const reservation = await prismaClient.reservation.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          chalet: true,
          customer: true,
          payments: true,
        },
      });

      if (!reservation) {
        res.status(404).json({ error: "Reservation not found" });
        return;
      }

      res.json(reservation);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  })
);
