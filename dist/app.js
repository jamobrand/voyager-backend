"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const compressFilter_util_1 = __importDefault(require("./utils/compressFilter.util"));
const config_1 = __importDefault(require("./config/config"));
const chalet_1 = require("./routers/chalet");
const reservation_1 = require("./routers/reservation");
const customer_1 = require("./routers/customer");
const payment_1 = require("./routers/payment");
const dashboard_1 = require("./routers/dashboard");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, compression_1.default)({ filter: compressFilter_util_1.default }));
app.use((0, cors_1.default)({
    origin: String(config_1.default.cors.cors_origin).split("|"),
    credentials: true,
}));
app.use("/api/v1/chalets", chalet_1.chaletRouter);
app.use("/api/v1/reservations", reservation_1.reservationRouter);
app.use("/api/v1/customers", customer_1.customerRouter);
app.use("/api/v1/payments", payment_1.paymentRouter);
app.use("/api/v1/dashboard", dashboard_1.dashboardRouter);
exports.default = app;
//# sourceMappingURL=app.js.map