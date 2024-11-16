import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import prismaClient from "../config/prisma";
import httpStatus from "http-status";
import handleErrorResponse from "../utils/controller.helper";
import { DeepPartial } from "utility-types";

export const chaletRouter = express.Router();

chaletRouter.post(
  "/add-chalet",
  asyncHandler(async (req: Request, res: Response) => {
    const { name, chaletType, capacity, price, description, available, chaletImage } = req.body;

    try {
      const newChalet = await prismaClient.chalet.create({
        data: {
          name,
          chaletType,
          capacity,
          price,
          available,
          description,
          chaletImage
        },
      });

      if (!newChalet) {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Chalet creation Failed" });
        return;
      }

      res
          .status(httpStatus.CREATED)
          .json({ message: "Chalet created successfully" });
    } catch (error) {
      handleErrorResponse(error, res);
    }
  })
);

chaletRouter.get(
  "/get-chalets",
  asyncHandler(async (_req: Request, res: Response) => {
    try {
      const chalets = await prismaClient.chalet.findMany();
      res.status(httpStatus.OK).json(chalets);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  })
);

chaletRouter.get(
  "/get-chalet/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Invalid chalet ID" });
      return;
    }

    try {
      const chalet = await prismaClient.chalet.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!chalet) {
        res.status(404).json({ error: "Chalet not found" });
        return;
      }

      res.json(chalet);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  })
);

chaletRouter.patch(
    "/update-chalet/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Invalid chalet ID" });
      return;
    }

    const updatedCalet: DeepPartial<typeof req.body> = req.body;

    try {
      const chalet = await prismaClient.chalet.update({
        where: {
          id: Number(id),
        },
        data: updatedCalet,
      });

      if (!chalet) {
        res.status(404).json({ error: "Chalet not found" });
        return;
      }

      res.json(chalet);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  })
)

chaletRouter.delete(
  "/delete-chalet/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Invalid chalet ID" });
      return;
    }

    try {
      const chalet = await prismaClient.chalet.delete({
        where: {
          id: Number(id),
        },
      });

      if (!chalet) {
        res.status(404).json({ error: "Chalet not found" });
        return;
      }

      res.json({ message: "Chalet deleted successfully" });
  } catch (error) {
      handleErrorResponse(error, res);
    }
  })    
)

chaletRouter.get(
  "/search",
  asyncHandler(async (req: Request, res: Response) => {
    // const { checkIn, checkOut, adults, children } = req.query;
    const { adults, children } = req.query;
    try {
      // For now, just return all chalets
      // You can implement actual availability checking later
      const chalets = await prismaClient.chalet.findMany({
        where: {
          available: true,
          capacity: {
            gte: Number(adults) + Number(children)
          }
        }
      });
      
      res.status(httpStatus.OK).json(chalets);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  })
);