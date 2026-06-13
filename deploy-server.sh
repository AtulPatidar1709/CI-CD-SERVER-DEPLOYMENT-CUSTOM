set -e

NEED_INSTALL=$1

echo "----------------------------------------------"
echo "Starting server deployment"
echo "----------------------------------------------"

echo "Navigating to server directory..."
cd "$SERVER_PROJECT_DIR"   

#step 1 - Pull latest code from repository
echo "Pulling latest code from repository..."
git pull origin main
echo "Latest code pulled successfully."

#step 2 - Install dependencies if needed
if [ "$NEED_INSTALL" = "true" ]; then
      echo "Installing server dependencies..."
      npm ci --no-audit --no-fund
      echo "Server dependencies installed successfully."
else
      echo "Skipping server dependencies installation..."
fi

#step 3 - Reload Backend service with PM2
echo "Reloading Backend service with PM2..."
pm2 reload VisionSpace
echo "Server is live with the latest code and dependencies."

echo "------------------------------------------------"
echo "Server deployment completed successfully."
echo "-----------------------------------------------"