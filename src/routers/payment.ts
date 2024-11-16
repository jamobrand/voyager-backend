import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import prismaClient from "../config/prisma";
import httpStatus from "http-status";
import handleErrorResponse from "../utils/controller.helper";

export const paymentRouter = express.Router();

paymentRouter.get(
    "/get-payments",
    asyncHandler(async (_req: Request, res: Response) => {
      try {
        const paymernts = await prismaClient.payment.findMany();
        res.status(httpStatus.OK).json(paymernts);
      } catch (error) {
        handleErrorResponse(error, res);
      }
    })
  );

  paymentRouter.get(
    "/get-payment/:id",
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
  
      if (!id) {
        res.status(400).json({ error: "Invalid payment ID" });
        return;
      }
  
      try {
        const payment = await prismaClient.payment.findUnique({
          where: {
            id: Number(id),
          },
        });
  
        if (!payment) {
          res.status(404).json({ error: "Payment not found" });
          return;
        }
  
        res.json(payment);
      } catch (error) {
        handleErrorResponse(error, res);
      }
    })
  );
  