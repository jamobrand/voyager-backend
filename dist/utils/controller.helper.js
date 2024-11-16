"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handleErrorResponse = (error, res) => {
    console.error(error);
    if (error instanceof Error) {
        res
            .status(http_status_1.default.INTERNAL_SERVER_ERROR)
            .json({ message: error.message || 'Internal Server Error' });
    }
    else {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Unknown error occurred' });
    }
};
exports.default = handleErrorResponse;
//# sourceMappingURL=controller.helper.js.map