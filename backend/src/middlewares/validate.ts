import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodIssue, type z } from 'zod';
import { logger } from '../utils/logger.js';

/**
 * Formatted validation error structure
 */
interface FormattedValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * Format Zod validation errors into a user-friendly structure
 * @param issues - Array of Zod validation issues
 * @returns Formatted error array
 */
const formatZodErrors = (issues: ZodIssue[]): FormattedValidationError[] => {
  return issues.map((issue) => ({
    field: issue.path.join('.') || 'root',
    message: issue.message,
    code: issue.code,
  }));
};

/**
 * Middleware factory for validating requests against Zod schemas
 *
 * Validates request body, query parameters, and route params against a Zod schema.
 * Returns 400 Bad Request with detailed error messages on validation failure.
 *
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 *
 * @example
 * ```typescript
 * import { validate } from '../middlewares/validate.js';
 * import { createUserSchema } from '../schemas/user.schema.js';
 *
 * router.post('/users', validate(createUserSchema), createUser);
 * ```
 */
export const validate = (schema: z.ZodTypeAny) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validate request data against schema
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Validation passed, proceed to next middleware
      next();
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: formatZodErrors(error.issues),
        });
        return;
      }

      // Handle unexpected errors
      logger.error('Unexpected validation error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal validation error',
      });
    }
  };
};

export default validate;
