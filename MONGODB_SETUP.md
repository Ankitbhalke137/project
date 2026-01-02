# MongoDB Setup Instructions

Since MongoDB is not installed locally, you have two options:

## Option 1: Install MongoDB Locally (Recommended for Development)

```bash
# Install MongoDB using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify it's running
mongosh --eval "db.version()"
```

## Option 2: Use MongoDB Atlas (Cloud - No Installation Required)

1. **Create a Free Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for a free account

2. **Create a Free Cluster**
   - Choose "Create a FREE cluster"
   - Select a cloud provider and region (closest to you)
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Configure Database Access**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Select "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Confirm

5. **Get Connection String**
   - Go back to "Clusters"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/`)

6. **Update Your .env File**
   ```bash
   # Replace this line in server/.env:
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/student-directory
   ```

## After MongoDB is Running

Once you've set up MongoDB (either option), run these commands:

```bash
# 1. Seed the database with student data
cd server
npm run seed

# 2. Start the backend server  
npm start

# 3. In a new terminal, start the frontend
cd ..
npm run dev
```

The application will be available at http://localhost:5173
