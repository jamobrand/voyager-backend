"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("./config"));
const prismaClient = new client_1.PrismaClient();
if (config_1.default.node_env !== 'production')
    globalThis.prisma = prismaClient;
exports.default = prismaClient;
//# sourceMappingURL=prisma.js.map