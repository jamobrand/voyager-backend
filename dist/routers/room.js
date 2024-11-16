"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = __importDefault(require("../config/prisma"));
const http_status_1 = __importDefault(require("http-status"));
const controller_helper_1 = __importDefault(require("../utils/controller.helper"));
exports.roomRouter = express_1.default.Router();
exports.roomRouter.post("/add-room", (0, express_async_handler_1.default)(async (req, res) => {
    const { number, type, capacity, price, available, floor, description, amenities } = req.body;
    if (!number || !type || !capacity || !price) {
        res.status(http_status_1.default.BAD_REQUEST).json({
            message: "Missing required fields",
        });
        return;
    }
    try {
        const existingRoom = await prisma_1.default.room.findUnique({
            where: { number },
        });
        if (existingRoom) {
            res.status(http_status_1.default.CONFLICT).json({
                message: "Room number already exists",
            });
            return;
        }
        const newRoom = await prisma_1.default.room.create({
            data: {
                number,
                type,
                capacity,
                price,
                available,
                floor,
                description,
                amenities,
            },
        });
        if (!newRoom) {
            res
                .status(http_status_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "Room creation Failed" });
            return;
        }
        res.status(http_status_1.default.CREATED).json(newRoom);
    }
    catch (error) {
        (0, controller_helper_1.default)(error, res);
    }
}));
exports.roomRouter.get("/get-rooms", (0, express_async_handler_1.default)(async (_req, res) => {
    try {
        const rooms = await prisma_1.default.room.findMany();
        res.status(http_status_1.default.OK).json(rooms);
    }
    catch (error) {
        (0, controller_helper_1.default)(error, res);
    }
}));
exports.roomRouter.get("/get-room/:id", (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "Invalid room ID" });
        return;
    }
    try {
        const room = await prisma_1.default.room.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!room) {
            res.status(404).json({ error: "Room not found" });
            return;
        }
        res.json(room);
    }
    catch (error) {
        (0, controller_helper_1.default)(error, res);
    }
}));
exports.roomRouter.patch("/update-room/:id", (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "Invalid room ID" });
        return;
    }
    const updatedRoom = req.body;
    try {
        const room = await prisma_1.default.room.update({
            where: {
                id: Number(id),
            },
            data: updatedRoom,
        });
        if (!room) {
            res.status(404).json({ error: "Room not found" });
            return;
        }
        res.json(room);
    }
    catch (error) {
        (0, controller_helper_1.default)(error, res);
    }
}));
exports.roomRouter.delete("/delete-room/:id", (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "Invalid room ID" });
        return;
    }
    try {
        const room = await prisma_1.default.room.delete({
            where: {
                id: Number(id),
            },
        });
        if (!room) {
            res.status(404).json({ error: "Room not found" });
            return;
        }
        res.json({ message: "Room deleted successfully" });
    }
    catch (error) {
        (0, controller_helper_1.default)(error, res);
    }
}));
//# sourceMappingURL=room.js.map