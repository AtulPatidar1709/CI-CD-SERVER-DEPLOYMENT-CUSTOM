set -e

NEED_INSTALL=$1

echo "----------------------------------------------"
echo "Starting client deployment"
echo "----------------------------------------------"

PROJECT_DIR="$CLIENT_PROJECT_DIR"
DIST_DIR="$PROJECT_DIR/dist"

echo "Navigating to client directory..."
cd "$PROJECT_DIR"

#step 1 - Install dependencies if needed
if [ "$NEED_INSTALL" = "true" ]; then
      echo "Installing client dependencies..."
      npm ci --no-audit --no-fund
else
      echo "Skipping client dependencies installation..."
fi

#step 2 - Build the client
echo "Building client aplication..."
npm run build
echo "Client build completed successfully."

#step 3 - Sync build to S3
echo "Syncing client build to S3... $S3_BUCKET"
aws s3 sync "$DIST_DIR" "s3://$S3_BUCKET" --delete
echo "Client deployment to S3 completed successfully."

#Step 4 - Invalidate CloudFront cache
echo "Invalidating CloudFront cache... $CLOUDFRONT_DISTRIBUTION_ID"
aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" --paths "/index.html"
echo "CloudFront cache invalidation request submitted successfully."

echo "------------------------------------------------"
echo "Client deployment completed successfully."
echo "-----------------------------------------------"