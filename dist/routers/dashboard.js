"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = __importDefault(require("../config/prisma"));
const http_status_1 = __importDefault(require("http-status"));
const controller_helper_1 = __importDefault(require("../utils/controller.helper"));
exports.dashboardRouter = express_1.default.Router();
exports.dashboardRouter.get("/metrics/revenue", (0, express_async_handler_1.default)(async (_req, res) => {
    try {
        const today = new Date();
        const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
        const revenueMetrics = await prisma_1.default.payment.groupBy({
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
        res.status(http_status_1.default.OK).json(revenueMetrics);
    }
    catch (error) {
        (0, controller_helper_1.default)(error, res);
    }
}));
exports.dashboardRouter.get("/metrics/reservations", (0, express_async_handler_1.default)(async (_req, res) => {
    try {
        const reservationStats = await prisma_1.default.reservation.groupBy({
            by: ['status'],
            _count: true,
        });
        res.status(http_status_1.default.OK).json(reservationStats);
    }
    catch (error) {
        (0, controller_helper_1.default)(error, res);
    }
}));
exports.dashboardRouter.get("/metrics/occupancy", (0, express_async_handler_1.default)(async (_req, res) => {
    try {
        const today = new Date();
        const occupancyData = await prisma_1.default.chalet.groupBy({
            by: ['chaletType'],
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
        res.status(http_status_1.default.OK).json(occupancyData);
    }
    catch (error) {
        (0, controller_helper_1.default)(error, res);
    }
}));
exports.dashboardRouter.get("/metrics/upcoming-stays", (0, express_async_handler_1.default)(async (_req, res) => {
    try {
        const today = new Date();
        const weekFromNow = new Date(today.setDate(today.getDate() + 7));
        const upcomingStays = await prisma_1.default.reservation.findMany({
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
        res.status(http_status_1.default.OK).json(upcomingStays);
    }
    catch (error) {
        (0, controller_helper_1.default)(error, res);
    }
}));
//# sourceMappingURL=dashboard.js.map