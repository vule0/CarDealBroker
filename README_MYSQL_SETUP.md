# Setting Up MySQL with Railway and Netlify for CarDealBroker

This guide explains how to set up a MySQL database on Railway and connect it to your FastAPI backend.

## Local Development Setup

For local development, the application is configured to use SQLite by default if no MySQL connection is available:

1. Ensure your .env file has the SQLite connection string:
   ```
   DATABASE_URL=sqlite:///./cardealbroker.db
   ```
2. This will create a local SQLite database file when you run the application
3. No additional database setup is required for local development

To run the application locally:
```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Production Setup with MySQL on Railway

### 1. Create a MySQL Database on Railway

1. Log in to your [Railway](https://railway.app/) account
2. Click on "New Project" or open your existing project
3. Click on "New" → "Database" → "MySQL"
4. Wait for Railway to provision your MySQL database (this may take a few minutes)

### 2. Get the Database Connection Details

1. Once your MySQL database is provisioned, click on it in the Railway dashboard
2. Go to the "Connect" tab
3. You'll find the connection information including the connection string
4. **Important**: Railway provides a MySQL connection string in this format:
   ```
   mysql://username:password@hostname:port/database_name
   ```

### 3. Configure Environment Variables in Railway

1. Go to your backend service (not the MySQL service)
2. Click on the "Variables" tab
3. Add a new environment variable with exactly this name: `DATABASE_URL`
4. Use the connection string from step 2 as the value (Railway may have already done this)
5. **You do not need to modify the connection string** - our code will convert it to the proper format automatically

### 4. Deploy Your Backend 

1. Ensure your code is committed and pushed to your GitHub repository
2. In Railway, connect your repository if you haven't already
3. Railway should detect changes and deploy automatically
4. If not, you can trigger a deployment manually

### 5. Monitor the Deployment

1. During deployment, watch the logs for any errors
2. Look for the message "Connected to MySQL database" to confirm successful connection
3. If you see errors, check the Troubleshooting section below

### 6. Testing Your Database Connection

1. Once deployed, submit a form through your frontend
2. Verify that the data appears in your MySQL database:
   - Go to your MySQL service in Railway
   - Click on the "Data" tab
   - You should see tables for `lease_form_submissions` and `sell_form_submissions`
   - Run a query: `SELECT * FROM lease_form_submissions;` to see the data

### 7. Accessing Your Form Submissions API Endpoints

New API endpoints have been added to access the form submissions:

- `GET /lease_submissions/` - Get all lease form submissions
- `GET /sell_submissions/` - Get all sell form submissions

You can test these endpoints using your API URL, for example:
```
https://your-railway-url.up.railway.app/lease_submissions/
```

### 8. Updating Frontend (Optional)

If you'd like to display the submitted data on your frontend:

1. Create a new page or component in your frontend application
2. Fetch data from the new API endpoints
3. Display the submissions in a table or list

### 9. Backup and Migration (Recommended)

It's recommended to:

1. Set up regular backups of your database (Railway provides automatic backups)
2. Create a migration strategy for schema changes if you plan to modify the database structure in the future

## Troubleshooting

### Railway Deployment Issues

1. **Database Connection Errors**:
   - Verify the `DATABASE_URL` variable is set correctly in Railway
   - Check if it's using the format `mysql://username:password@hostname:port/database_name`
   - Our code will automatically convert this to the PyMySQL format

2. **Missing Tables**:
   - If the tables aren't being created, check if the init_db() function is being called
   - The application should print "Connected to MySQL database" in the logs if successful

3. **Deployment Failures**:
   - Check if all necessary packages are in requirements.txt
   - Verify your Railway configuration in railway.json
   - Make sure your start command in Railway is set to `python server.py`

4. **Import Errors**:
   - If you see import errors during deployment, check if all dependencies are installed
   - The error logs will indicate which packages are missing

### Local Development Issues:

1. **Missing DATABASE_URL**: If you see a warning about missing DATABASE_URL, make sure your .env file is in the correct location and properly formatted
2. **Database Errors**: For SQLite, ensure the application has write permissions to the directory
3. **Module Import Errors**: Make sure all required packages are installed via `pip install -r requirements.txt`

### Getting Railway Logs

To better troubleshoot issues, you can view detailed logs:

1. Go to your backend service in Railway
2. Click on the "Deployments" tab
3. Select the latest deployment
4. Click on "View Logs"
5. Look for any error messages or warnings 