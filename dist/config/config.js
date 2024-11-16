"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const joi_1 = __importDefault(require("joi"));
(0, dotenv_1.config)({
    path: ['.env'],
});
const envSchema = joi_1.default.object().keys({
    NODE_ENV: joi_1.default.string().valid('production', 'development', 'test').required(),
    PORT: joi_1.default.string().required().default('5050'),
    SERVER_URL: joi_1.default.string().required(),
    CORS_ORIGIN: joi_1.default.string().required().default('*'),
});
const { value: validatedEnv, error } = envSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env, { abortEarly: false, stripUnknown: true });
if (error) {
    throw new Error(`Environment variable validation error: \n${error.details
        .map((detail) => detail.message)
        .join('\n')}`);
}
const config = {
    node_env: validatedEnv.NODE_ENV,
    dbConnString: validatedEnv.DATABASE_URI,
    dbName: validatedEnv.DATABASE_NAME,
    server: {
        port: validatedEnv.PORT,
        url: validatedEnv.SERVER_URL,
    },
    cors: {
        cors_origin: validatedEnv.CORS_ORIGIN,
    },
};
exports.default = config;
//# sourceMappingURL=config.js.map