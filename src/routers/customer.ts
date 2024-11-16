import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import prismaClient from "../config/prisma";
import httpStatus from "http-status";
import handleErrorResponse from "../utils/controller.helper";

export const customerRouter = express.Router();

customerRouter.get(
    "/get-customers",
    asyncHandler(async (_req: Request, res: Response) => {
      try {
        const customers = await prismaClient.customer.findMany();
        res.status(httpStatus.OK).json(customers);
      } catch (error) {
        handleErrorResponse(error, res);
      }
    })
  );

  customerRouter.get(
    "/get-customer/:id",
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
  
      if (!id) {
        res.status(400).json({ error: "Invalid customer ID" });
        return;
      }
  
      try {
        const customer = await prismaClient.customer.findUnique({
          where: {
            id: Number(id),
          },
        });
  
        if (!customer) {
          res.status(404).json({ error: "Customer not found" });
          return;
        }
  
        res.json(customer);
      } catch (error) {
        handleErrorResponse(error, res);
      }
    })
  );
  