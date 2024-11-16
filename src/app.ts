import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import compressFilter from "./utils/compressFilter.util";
import { errorHandler } from "./middleware/errorHandler";
import config from "./config/config";
import { chaletRouter } from "./routers/chalet";
import { reservationRouter } from "./routers/reservation";
import { customerRouter } from "./routers/customer";
import { paymentRouter } from "./routers/payment";
import { dashboardRouter } from "./routers/dashboard";

const app = express();

// Helmet is used to secure this app by configuring the http-header
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Compression is used to reduce the size of the response body
app.use(compression({ filter: compressFilter }));

app.use(
  cors({
    // origin is given a array if we want to have multiple origins later
    origin: String(config.cors.cors_origin).split("|"),
    credentials: true,
  })
);

app.use("/api/v1/chalets", chaletRouter);
app.use("/api/v1/reservations", reservationRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/dashboard", dashboardRouter);

app.use(errorHandler);

export default app;
