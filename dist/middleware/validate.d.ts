import type { RequireAtLeastOne } from '../types/types';
import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
type RequestValidationSchema = RequireAtLeastOne<Record<'body' | 'query' | 'params', ObjectSchema>>;
declare const validate: (schema: RequestValidationSchema) => (req: Request, res: Response, next: NextFunction) => void;
export default validate;
