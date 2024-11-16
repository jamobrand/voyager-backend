"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = __importDefault(require("../config/prisma"));
const http_status_1 = __importDefault(require("http-status"));
const controller_helper_1 = __importDefault(require("../utils/controller.helper"));
exports.customerRouter = express_1.default.Router();
exports.customerRouter.get("/get-customers", (0, express_async_handler_1.default)(async (_req, res) => {
    try {
        const customers = await prisma_1.default.customer.findMany();
        res.status(http_status_1.default.OK).json(customers);
    }
    catch (error) {
        (0, controller_helper_1.default)(error, res);
    }
}));
exports.customerRouter.get("/get-customer/:id", (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "Invalid customer ID" });
        return;
    }
    try {
        const customer = await prisma_1.default.customer.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!customer) {
            res.status(404).json({ error: "Customer not found" });
            return;
        }
        res.json(customer);
    }
    catch (error) {
        (0, controller_helper_1.default)(error, res);
    }
}));
//# sourceMappingURL=customer.js.map