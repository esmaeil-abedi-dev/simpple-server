# PostgreSQL Deployment with Prisma on Vercel

This guide provides instructions on deploying the e-commerce API with PostgreSQL on Vercel.

## 1. PostgreSQL Setup

The project is configured to use PostgreSQL via Prisma with the following connection details:

```
POSTGRES_URL="postgres://50108e9aa6aff19c9b8d3f58c744ab68fd0dc1c62dbd3bcb4c0f98efe6887b6a:sk__syfVRCu-Nllzl99i_bzY@db.prisma.io:5432/?sslmode=require"
PRISMA_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19fc3lmVlJDdS1ObGx6bDk5aV9ielkiLCJhcGlfa2V5IjoiMDFLMEFKMzBXSzlDQzM4NkJaNDJaWDM4TUgiLCJ0ZW5hbnRfaWQiOiI1MDEwOGU5YWE2YWZmMTljOWI4ZDNmNThjNzQ0YWI2OGZkMGRjMWM2MmRiZDNiY2I0YzBmOThlZmU2ODg3YjZhIiwiaW50ZXJuYWxfc2VjcmV0IjoiNWQzMjQzZTItYTZkZi00MDE3LTkyMjAtMTAzZWY1YTVjYWI1In0.BiOlI_cmjzzkGWJvDslckmOzC3GyzNCNI6Qi-1LxjWI"
```

## 2. Key Changes

The following changes were made to migrate from MongoDB to PostgreSQL:

1. **Prisma Schema**: Updated to use PostgreSQL
   - Changed ID fields to use UUID instead of MongoDB ObjectId
   - Updated relationship fields
   - Changed the embedded `Address` type to a JSON field

2. **Environment Variables**: Added PostgreSQL connection settings
   - Set up both standard PostgreSQL connection
   - Added Prisma Accelerate connection for improved performance

3. **Prisma Client**: Updated initialization to support both environments
   - Added support for Prisma Accelerate in production
   - Maintained backward compatibility for development

4. **Seed Script**: Updated to work with PostgreSQL
   - Creates users, categories, and 50 products with Persian names/descriptions
   - Properly handles PostgreSQL-specific data requirements

## 3. Vercel Deployment

To deploy to Vercel:

1. **Set Up Environment Variables**
   - Go to the Vercel project settings
   - Add all required environment variables:
     ```
     POSTGRES_URL="postgres://50108e9aa6aff19c9b8d3f58c744ab68fd0dc1c62dbd3bcb4c0f98efe6887b6a:sk__syfVRCu-Nllzl99i_bzY@db.prisma.io:5432/?sslmode=require"
     PRISMA_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19fc3lmVlJDdS1ObGx6bDk5aV9ielkiLCJhcGlfa2V5IjoiMDFLMEFKMzBXSzlDQzM4NkJaNDJaWDM4TUgiLCJ0ZW5hbnRfaWQiOiI1MDEwOGU5YWE2YWZmMTljOWI4ZDNmNThjNzQ0YWI2OGZkMGRjMWM2MmRiZDNiY2I0YzBmOThlZmU2ODg3YjZhIiwiaW50ZXJuYWxfc2VjcmV0IjoiNWQzMjQzZTItYTZkZi00MDE3LTkyMjAtMTAzZWY1YTVjYWI1In0.BiOlI_cmjzzkGWJvDslckmOzC3GyzNCNI6Qi-1LxjWI"
     JWT_SECRET=your_jwt_secret_key
     JWT_EXPIRES_IN=30d
     COOKIE_EXPIRES_IN=30
     NODE_ENV=production
     ```

2. **Deploy the Project**
   ```bash
   # Run the deployment script
   ./deploy.sh
   
   # Or deploy manually
   npm run build
   vercel --prod
   ```

3. **Run Migrations and Seed** (if needed)
   ```bash
   # Push schema changes to the database
   npx prisma db push
   
   # Seed the database with Persian products
   npx prisma db seed
   ```

## 4. Testing the API

After deployment, test the API endpoints:

1. Register a user:
   ```
   POST /api/users
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. Login:
   ```
   POST /api/users/auth
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

3. Get products:
   ```
   GET /api/products
   ```

## 5. PostgreSQL Advantages

- **Relational Structure**: Better support for complex relationships and queries
- **ACID Compliance**: Ensures data integrity
- **Performance**: Better for complex joins and transactions
- **Scalability**: Proven scalability for enterprise applications
- **Advanced Features**: Rich set of features, extensions, and data types
