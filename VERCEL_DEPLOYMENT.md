# Vercel Deployment Guide

This document provides step-by-step instructions for deploying the e-commerce API to Vercel with MongoDB Atlas integration.

## 1. Set Up MongoDB Atlas

1. Sign up for MongoDB Atlas: https://www.mongodb.com/cloud/atlas/register
2. Create a new cluster (the free tier is sufficient for starting)
3. Set up database access:
   - Create a database user with read/write permissions
   - Remember the username and password
4. Set up network access:
   - Add 0.0.0.0/0 to allow access from anywhere (for Vercel deployment)
   - Or set up a more secure IP allowlist if preferred
5. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string which looks like:
     `mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority`
   - Replace `<username>`, `<password>`, `<cluster-name>`, and `<database-name>` with your actual values

## 2. Set Up Vercel

1. Sign up for Vercel: https://vercel.com/signup
2. Install Vercel CLI (if not already installed):
   ```bash
   npm install -g vercel
   ```
3. Login to Vercel:
   ```bash
   vercel login
   ```

## 3. Configure Environment Variables in Vercel

1. Create a new project in Vercel dashboard
2. Go to "Settings" > "Environment Variables"
3. Add the following environment variables:
   - `DATABASE_URL`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string for JWT token generation
   - `JWT_EXPIRES_IN`: "30d" (or your preferred expiration time)
   - `COOKIE_EXPIRES_IN`: "30" (or your preferred expiration in days)
   - `NODE_ENV`: "production"
   - `PORT`: "3000" (or your preferred port)
   - `UPLOAD_PATH`: "uploads/"

## 4. Deploy to Vercel

### Option 1: Using the deployment script

```bash
./deploy.sh
```

### Option 2: Manual deployment

1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

## 5. Seed the Database (After Deployment)

After successful deployment, you can seed the database with Persian products:

1. Make sure your local .env file has the same MongoDB Atlas connection string as Vercel
2. Run the seed script:
   ```bash
   npm run seed
   ```

## 6. Verify Deployment

1. Check the deployment URL provided by Vercel
2. Test an endpoint: `<your-vercel-url>/api/test`
3. If successful, you should see: `{"message":"API is working!"}`

## Troubleshooting

- **Database Connection Issues**: Verify your MongoDB Atlas connection string and make sure network access is properly configured.
- **Deployment Failures**: Check Vercel logs for details about any deployment errors.
- **Runtime Errors**: Check the function logs in Vercel dashboard.

## Updating the Deployment

When you make changes to your code:

1. Commit changes to your repository
2. Run the deployment script or manual deployment commands again
3. Vercel will automatically rebuild and redeploy your application
