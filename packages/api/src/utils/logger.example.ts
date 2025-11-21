/**
 * Winston Logger Usage Examples
 *
 * This file demonstrates how to use the Winston logger in your API.
 * You can delete this file after reviewing the examples.
 */

import logger from './logger';

// Basic logging examples
export function basicLoggingExamples() {
  // Error level - Critical errors that need immediate attention
  logger.error('Database connection failed');
  logger.error('User authentication failed for user ID: 12345');

  // Warn level - Warning messages for potential issues
  logger.warn('API rate limit approaching threshold');
  logger.warn('Deprecated function called');

  // Info level - General informational messages
  logger.info('Server started successfully');
  logger.info('User logged in: john@example.com');

  // HTTP level - HTTP request logging
  logger.http('GET /api/products - 200 OK - 45ms');
  logger.http('POST /api/users - 201 Created');

  // Debug level - Detailed debugging information
  logger.debug('Cache hit for key: user_123');
  logger.debug('Processing order with ID: ord_456');
}

// Using logger in tRPC procedures
export function trpcProcedureExample() {
  // Example: In a tRPC router
  /*
  import logger from '../utils/logger';

  export const userRouter = createTRPCRouter({
    getUser: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input, ctx }) => {
        logger.info(`Fetching user with ID: ${input.id}`);

        try {
          const user = await ctx.db.user.findUnique({
            where: { id: input.id },
          });

          if (!user) {
            logger.warn(`User not found: ${input.id}`);
            throw new Error('User not found');
          }

          logger.debug(`User retrieved successfully: ${input.id}`);
          return user;
        } catch (error) {
          logger.error(`Error fetching user ${input.id}: ${error.message}`);
          throw error;
        }
      }),
  });
  */
}

// Logging with structured data
export function structuredLoggingExample() {
  // You can also pass metadata objects
  logger.info('User action completed', {
    userId: '123',
    action: 'purchase',
    amount: 99.99,
  });

  logger.error('Payment processing failed', {
    orderId: 'ord_789',
    errorCode: 'INSUFFICIENT_FUNDS',
    userId: '123',
  });
}

// Middleware logging example
export function middlewareExample() {
  /*
  import logger from './utils/logger';

  // Create a logging middleware for tRPC
  const loggingMiddleware = t.middleware(async ({ path, type, next }) => {
    const start = Date.now();

    logger.http(`${type} ${path} - started`);

    const result = await next();

    const duration = Date.now() - start;
    logger.http(`${type} ${path} - completed in ${duration}ms`);

    return result;
  });

  // Use it in procedures
  export const loggedProcedure = publicProcedure.use(loggingMiddleware);
  */
}

// Environment-based logging
export function environmentExample() {
  /*
  The logger automatically adjusts based on NODE_ENV:

  - Production (NODE_ENV=production): Only logs 'warn' and 'error' levels
  - Development (default): Logs all levels including 'debug'

  This helps reduce noise in production while providing detailed logs in development.
  */
}

// Best Practices
export function bestPractices() {
  /*
  1. Use appropriate log levels:
     - error: System errors, critical failures
     - warn: Warnings, deprecated features, non-critical issues
     - info: Important business events (user login, order created)
     - http: HTTP requests and responses
     - debug: Detailed debugging information

  2. Include context in log messages:
     - Good: logger.info('User login successful', { userId: '123', email: 'user@example.com' })
     - Bad: logger.info('Login successful')

  3. Don't log sensitive information:
     - Avoid: passwords, tokens, credit card numbers, personal data
     - Use: user IDs, request IDs, timestamps

  4. Use consistent message formats:
     - Be descriptive and actionable
     - Include relevant identifiers (IDs, timestamps)

  5. Log errors with full context:
     logger.error(`Failed to process order: ${error.message}`, {
       orderId,
       userId,
       error: error.stack,
     });
  */
}
