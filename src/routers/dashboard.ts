import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import prismaClient from "../config/prisma";
import httpStatus from "http-status";
import handleErrorResponse from "../utils/controller.helper";

export const dashboardRouter = express.Router();

// Get revenue metrics
dashboardRouter.get(
  "/metrics/revenue",
  asyncHandler(async (_req: Request, res: Response) => {
    try {
      const today = new Date();
      const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));

      const revenueMetrics = await prismaClient.payment.groupBy({
        by: ['status'],
        _sum: {
          amount: true,
        },
        where: {
          date: {
            gte: thirtyDaysAgo,
          },
        },
      });

      res.status(httpStatus.OK).json(revenueMetrics);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  })
);

// Get reservation statistics
dashboardRouter.get(
  "/metrics/reservations",
  asyncHandler(async (_req: Request, res: Response) => {
    try {
      const reservationStats = await prismaClient.reservation.groupBy({
        by: ['status'],
        _count: true,
      });

      res.status(httpStatus.OK).json(reservationStats);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  })
);

// Get occupancy metrics for chalets
dashboardRouter.get(
    "/metrics/occupancy",
    asyncHandler(async (_req: Request, res: Response) => {
      try {
        const today = new Date();
        const occupancyData = await prismaClient.chalet.groupBy({
          by: ['chaletType'],  // Correctly use 'by' to group
          _count: {
            _all: true,
          },
          where: {
            reservations: {
              some: {
                checkIn: {
                  lte: today,
                },
                checkOut: {
                  gte: today,
                },
              },
            },
          },
        });

        res.status(httpStatus.OK).json(occupancyData);
      } catch (error) {
        handleErrorResponse(error, res);
      }
    })
);
  
// Get upcoming check-ins/check-outs
dashboardRouter.get(
  "/metrics/upcoming-stays",
  asyncHandler(async (_req: Request, res: Response) => {
    try {
      const today = new Date();
      const weekFromNow = new Date(today.setDate(today.getDate() + 7));

      const upcomingStays = await prismaClient.reservation.findMany({
        where: {
          OR: [
            {
              checkIn: {
                gte: today,
                lte: weekFromNow,
              },
            },
            {
              checkOut: {
                gte: today,
                lte: weekFromNow,
              },
            },
          ],
        },
        include: {
          customer: true,
          chalet: true,
        },
      });

      res.status(httpStatus.OK).json(upcomingStays);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  })
);