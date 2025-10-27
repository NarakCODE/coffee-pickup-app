# Project Structure

## Directory Layout

```
backend/
├── src/
│   ├── config/          # Configuration (database, env)
│   ├── controllers/     # Request handlers (thin layer)
│   ├── middlewares/     # Express middlewares
│   ├── models/          # Mongoose models
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic layer
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions and helpers
│   └── index.ts         # Application entry point
├── dist/                # Compiled JavaScript output
└── node_modules/
```

## Architecture Patterns

### Layered Architecture

1. **Routes** - Define endpoints and attach middlewares
2. **Controllers** - Handle HTTP requests/responses, delegate to services
3. **Services** - Contain business logic, interact with models
4. **Models** - Mongoose schemas and database interaction
5. **Middlewares** - Cross-cutting concerns (auth, validation, errors)

### Error Handling

- Use custom `AppError` class and subclasses (`NotFoundError`, `BadRequestError`, `UnauthorizedError`, `ForbiddenError`)
- Wrap async route handlers with `asyncHandler` utility
- Centralized error handling in `errorHandler` middleware
- All errors include stack traces in development mode only

### Controller Pattern

- Controllers are thin - they parse requests and format responses
- Business logic lives in services
- Use `asyncHandler` to catch async errors
- Return appropriate HTTP status codes

### Validation

- Use `validateRequest` middleware for input validation
- Validate at the route level before reaching controllers

### Security Middleware Stack

Applied in order:
1. `securityMiddleware` (helmet)
2. `corsMiddleware`
3. `limiter` (rate limiting)
4. `compression`

### API Structure

- Base path: `/api`
- Versioning: Not yet implemented
- RESTful conventions for resource endpoints

## File Naming

- Use camelCase for files: `userController.ts`, `asyncHandler.ts`
- Models use PascalCase: `User.ts`
- Index files aggregate exports: `routes/index.ts`

## Import Conventions

- Always use `.js` extension in imports (TypeScript ES modules requirement)
- Use named exports over default exports where possible
- Group imports: external libraries, then internal modules
