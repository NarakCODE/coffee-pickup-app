# Database Seeders

This directory contains database seeder scripts for populating the database with test data.

## Available Seeders

### Category Seeder

Seeds the database with initial product categories.

**Usage:**

```bash
npm run seed:categories
```

**Categories included:**

- Hot Coffee
- Iced Coffee
- Espresso
- Specialty Drinks
- Tea
- Smoothies
- Pastries
- Sandwiches

**Note:** This seeder will clear all existing categories before inserting new ones.

## Creating New Seeders

1. Create a new file in `src/seeders/` (e.g., `productSeeder.ts`)
2. Import required models and database connection
3. Load environment variables with `dotenv.config()`
4. Create your seed data array
5. Implement the seeder function
6. Add a script to `package.json`

**Example:**

```typescript
import dotenv from 'dotenv';
import { YourModel } from '../models/YourModel.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const data = [
  // your seed data
];

const seedData = async () => {
  try {
    await connectDB();
    await YourModel.deleteMany({});
    const created = await YourModel.create(data);
    console.log(`✅ Successfully seeded ${created.length} items`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding:', error);
    process.exit(1);
  }
};

seedData();
```
