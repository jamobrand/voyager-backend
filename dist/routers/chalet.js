"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chaletRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = __importDefault(require("../config/prisma"));
const http_status_1 = __importDefault(require("http-status"));
const controller_helper_1 = __importDefault(require("../utils/controller.helper"));
exports.chaletRouter = express_1.default.Router();
exports.chaletRouter.post("/add-chalet", (0, express_async_handler_1.default)(async (req, res) => {
    const { name, chaletType, capacity, price, description, available, chaletImage } = req.body;
    try {
        const newChalet = await prisma_1.default.chalet.create({
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
                .status(http_status_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "Chalet creation Failed" });
            return;
        }
        res
            .status(http_status_1.default.CREATED)
            .json({ message: "Chalet created successfully" });
    }
    catch (error) {
        (0, controller_helper_1.default)(error, res);
    }
}));
exports.chaletRouter.get("/get-chalets", (0, express_async_handler_1.default)(async (_req, res) => {
    try {
        const chalets = await prisma_1.default.chalet.findMany();
        res.status(http_status_1.default.OK).json(chalets);
    }
    catch (error) {
        (0, controller_helper_1.default)(error, res);
    }
}));
exports.chaletRouter.get("/get-chalet/:id", (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "Invalid chalet ID" });
        return;
    }
    try {
        const chalet = await prisma_1.default.chalet.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!chalet) {
            res.status(404).json({ error: "Chalet not found" });
            return;
        }
        res.json(chalet);
    }
    catch (error) {
        (0, controller_helper_1.default)(error, res);
    }
}));
exports.chaletRouter.patch("/update-chalet/:id", (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "Invalid chalet ID" });
        return;
    }
    const updatedCalet = req.body;
    try {
        const chalet = await prisma_1.default.chalet.update({
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
    }
    catch (error) {
        (0, controller_helper_1.default)(error, res);
    }
}));
exports.chaletRouter.delete("/delete-chalet/:id", (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "Invalid chalet ID" });
        return;
    }
    try {
        const chalet = await prisma_1.default.chalet.delete({
            where: {
                id: Number(id),
            },
        });
        if (!chalet) {
            res.status(404).json({ error: "Chalet not found" });
            return;
        }
        res.json({ message: "Chalet deleted successfully" });
    }
    catch (error) {
        (0, controller_helper_1.default)(error, res);
    }
}));
exports.chaletRouter.get("/search", (0, express_async_handler_1.default)(async (req, res) => {
    const { adults, children } = req.query;
    try {
        const chalets = await prisma_1.default.chalet.findMany({
            where: {
                available: true,
                capacity: {
                    gte: Number(adults) + Number(children)
                }
            }
        });
        res.status(http_status_1.default.OK).json(chalets);
    }
    catch (error) {
        (0, controller_helper_1.default)(error, res);
    }
}));
//# sourceMappingURL=chalet.js.map