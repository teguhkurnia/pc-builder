# API Utils - Logger

This directory contains utility functions for the API package, including the Winston logger configuration.

## Winston Logger

Winston is a versatile logging library for Node.js that provides multiple transport options and log levels.

### Installation

Winston has already been installed in this package:

```bash
pnpm --filter @repo/api add winston
```

### Usage

Import the logger in your files:

```typescript
import logger from './utils/logger';

// Log messages at different levels
logger.error('Critical error occurred');
logger.warn('Warning message');
logger.info('Informational message');
logger.http('HTTP request logged');
logger.debug('Debug information');
```

### Log Levels

The logger supports the following levels (in order of priority):

1. **error** (0) - Critical errors that need immediate attention
2. **warn** (1) - Warning messages for potential issues
3. **info** (2) - General informational messages
4. **http** (3) - HTTP request/response logging
5. **debug** (4) - Detailed debugging information

### Environment Configuration

The logger automatically adjusts based on `NODE_ENV`:

- **Production** (`NODE_ENV=production`): Logs only `warn` and `error` levels
- **Development** (default): Logs all levels including `debug`

### Output Locations

Logs are written to multiple destinations:

1. **Console**: All logs are displayed in the terminal with colored output
2. **logs/error.log**: Only error-level logs
3. **logs/all.log**: All log levels combined

> **Note**: The `logs/` directory is automatically ignored by git.

### Example: Using in tRPC Procedures

```typescript
import { createTRPCRouter, publicProcedure } from '../trpc';
import logger from '../utils/logger';
import { z } from 'zod';

export const productRouter = createTRPCRouter({
  getProduct: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      logger.info(`Fetching product: ${input.id}`);

      try {
        const product = await ctx.db.product.findUnique({
          where: { id: input.id },
        });

        if (!product) {
          logger.warn(`Product not found: ${input.id}`);
          throw new Error('Product not found');
        }

        logger.debug(`Product retrieved: ${input.id}`);
        return product;
      } catch (error) {
        logger.error(`Error fetching product ${input.id}: ${error.message}`);
        throw error;
      }
    }),
});
```

### Example: Logging with Metadata

You can include structured metadata with your logs:

```typescript
logger.info('User registered', {
  userId: '123',
  email: 'user@example.com',
  timestamp: new Date(),
});

logger.error('Payment failed', {
  orderId: 'ord_456',
  amount: 99.99,
  errorCode: 'CARD_DECLINED',
});
```

### Example: Creating a Logging Middleware

```typescript
import { t } from './trpc';
import logger from './utils/logger';

const loggingMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();
  logger.http(`${type} ${path} - started`);

  try {
    const result = await next();
    const duration = Date.now() - start;
    logger.http(`${type} ${path} - completed in ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error(`${type} ${path} - failed in ${duration}ms: ${error.message}`);
    throw error;
  }
});

// Use the middleware
export const loggedProcedure = publicProcedure.use(loggingMiddleware);
```

### Best Practices

1. **Use appropriate log levels**: Don't log everything as `info` or `error`
2. **Include context**: Add relevant IDs, timestamps, and metadata
3. **Avoid sensitive data**: Never log passwords, tokens, or personal information
4. **Be consistent**: Use similar message formats across your application
5. **Log errors with stack traces**: Include full error context for debugging

### Configuration

You can customize the logger in `src/utils/logger.ts`:

- **Log format**: Modify the `format` configuration
- **Transports**: Add/remove file or console transports
- **Log levels**: Adjust which levels are logged in different environments
- **File paths**: Change where log files are saved

### Additional Resources

- [Winston Documentation](https://github.com/winstonjs/winston)
- [Winston Transports](https://github.com/winstonjs/winston/blob/master/docs/transports.md)
- [Winston Formats](https://github.com/winstonjs/winston#formats)