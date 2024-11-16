import { config as dotenvConfig } from 'dotenv';
import Joi from 'joi';

dotenvConfig({
    path: ['.env'],
  });

  const envSchema = Joi.object().keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.string().required().default('5050'),
    SERVER_URL: Joi.string().required(),
    CORS_ORIGIN: Joi.string().required().default('*'),
    // DATABASE_URL: Joi.string().required(),
  })

  const { value: validatedEnv, error } = envSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env, { abortEarly: false, stripUnknown: true });

if (error) {
  throw new Error(
    `Environment variable validation error: \n${error.details
      .map((detail) => detail.message)
      .join('\n')}`,
  );
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
} as const;

export default config;
