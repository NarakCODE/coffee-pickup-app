# Backend API

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # MongoDB connection
│   │   └── env.ts       # Environment variables
│   ├── controllers/     # Request handlers
│   │   └── userController.ts
│   ├── middlewares/     # Express middlewares
│   │   ├── errorHandler.ts
│   │   ├── notFound.ts
│   │   └── validateRequest.ts
│   ├── models/          # Mongoose models
│   │   └── User.ts
│   ├── routes/          # API routes
│   │   ├── index.ts
│   │   └── userRoutes.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   └── logger.ts
│   └── index.ts         # Entry point
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
└── tsconfig.json
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI

4. Run development server:
```bash
npm run dev
```

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Lint code
- `npm run format` - Format code
