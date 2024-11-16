"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = __importDefault(require("../config/prisma"));
const http_status_1 = __importDefault(require("http-status"));
const controller_helper_1 = __importDefault(require("../utils/controller.helper"));
const nanoid_1 = require("nanoid");
const client_1 = require("@prisma/client");
exports.reservationRouter = express_1.default.Router();
exports.reservationRouter.post("/reserve-chalet", (0, express_async_handler_1.default)(async (req, res) => {
    const { customer, chaletId, checkIn, checkOut, adults = 1, children = 0, totalCost, status = "PENDING", paymentStatus = "UNPAID", payment, specialRequests, } = req.body;
    const bookingReference = `BK-${(0, nanoid_1.nanoid)(8).toUpperCase()}`;
    try {
        const newChaletReservation = await prisma_1.default.$transaction(async (prisma) => {
            const customerRecord = await prisma_1.default.customer.create({
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
        }, { timeout: 60000 });
        res.status(http_status_1.default.CREATED).json(newChaletReservation);
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === "P2028") {
            res.status(http_status_1.default.REQUEST_TIMEOUT).json({
                error: "Transaction timed out. Please try again later.",
            });
        }
        else {
            (0, controller_helper_1.default)(error, res);
        }
    }
}));
exports.reservationRouter.get("/get-reservations", (0, express_async_handler_1.default)(async (_req, res) => {
    try {
        const reservations = await prisma_1.default.reservation.findMany({
            include: {
                customer: true,
                chalet: true,
                payments: true,
            },
        });
        res.status(http_status_1.default.OK).json(reservations);
    }
    catch (error) {
        (0, controller_helper_1.default)(error, res);
    }
}));
exports.reservationRouter.get("/get-reservation/:id", (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "Invalid reservation ID" });
        return;
    }
    try {
        const reservation = await prisma_1.default.reservation.findUnique({
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
    }
    catch (error) {
        (0, controller_helper_1.default)(error, res);
    }
}));
//# sourceMappingURL=reservation.js.map