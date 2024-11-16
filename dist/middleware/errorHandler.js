"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = __importDefault(require("./logger"));
const errorHandler = (err, _req, res) => {
    logger_1.default.error(err);
    res.status(500).json({ message: err.message });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map