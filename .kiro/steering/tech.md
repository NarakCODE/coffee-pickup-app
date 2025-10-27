# Technology Stack

## Backend

- **Runtime**: Node.js (ES modules)
- **Framework**: Express 5.x
- **Language**: TypeScript 5.x (strict mode)
- **Database**: MongoDB with Mongoose 8.x
- **Authentication**: JWT

## Key Libraries

- `helmet` - Security headers
- `cors` - CORS handling
- `express-rate-limit` - Rate limiting
- `compression` - Response compression
- `morgan` - HTTP logging
- `dotenv` - Environment variables
- `bcrypt` - Password hashing (implied)

## TypeScript Configuration

- Module system: `nodenext`
- Target: `esnext`
- Strict mode enabled with additional checks:
  - `noUncheckedIndexedAccess`
  - `exactOptionalPropertyTypes`
- Source: `src/`, Output: `dist/`
- File extensions: Use `.js` in imports (TypeScript ES modules)

## Code Style

- **Formatter**: Prettier
  - Single quotes
  - Semicolons required
  - 2-space indentation
  - 80 character line width
  - Trailing commas (ES5)
- **Linter**: ESLint with TypeScript
  - Unused vars prefixed with `_` are ignored
  - `any` type triggers warnings

## Common Commands

```bash
# Development
npm run dev              # Start dev server with hot reload (tsx watch)

# Building
npm run build            # Compile TypeScript to dist/
npm start                # Run production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format with Prettier
npm run format:check     # Check formatting
npm run type-check       # TypeScript type checking without emit

# Testing
npm test                 # Not yet implemented
```

## Environment Setup

1. Copy `.env.example` to `.env`
2. Configure `MONGODB_URI`, `PORT`, `JWT_SECRET`, `NODE_ENV`
3. Run `npm install`
4. Run `npm run dev`
