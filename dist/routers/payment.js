"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = __importDefault(require("../config/prisma"));
const http_status_1 = __importDefault(require("http-status"));
const controller_helper_1 = __importDefault(require("../utils/controller.helper"));
exports.paymentRouter = express_1.default.Router();
exports.paymentRouter.get("/get-payments", (0, express_async_handler_1.default)(async (_req, res) => {
    try {
        const paymernts = await prisma_1.default.payment.findMany();
        res.status(http_status_1.default.OK).json(paymernts);
    }
    catch (error) {
        (0, controller_helper_1.default)(error, res);
    }
}));
exports.paymentRouter.get("/get-payment/:id", (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "Invalid payment ID" });
        return;
    }
    try {
        const payment = await prisma_1.default.payment.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!payment) {
            res.status(404).json({ error: "Payment not found" });
            return;
        }
        res.json(payment);
    }
    catch (error) {
        (0, controller_helper_1.default)(error, res);
    }
}));
//# sourceMappingURL=payment.js.map