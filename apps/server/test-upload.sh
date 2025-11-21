#!/bin/bash

# Test script for upload API endpoints
# Make sure the server is running on http://localhost:4000

BASE_URL="http://localhost:4000"
TEST_IMAGE="test-image.jpg"

echo "======================================"
echo "PC Builder Upload API Test Script"
echo "======================================"
echo ""

# Check if server is running
echo "1. Checking server health..."
curl -s "${BASE_URL}/api/health" | grep -q "ok"
if [ $? -eq 0 ]; then
    echo "✅ Server is running"
else
    echo "❌ Server is not running. Please start the server first."
    exit 1
fi
echo ""

# Create a test image if it doesn't exist
if [ ! -f "$TEST_IMAGE" ]; then
    echo "2. Creating test image..."
    # Create a simple 1x1 pixel PNG image
    printf '\x89\x50\x4e\x47\x0d\x0a\x1a\x0a\x00\x00\x00\x0d\x49\x48\x44\x52\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\x0a\x49\x44\x41\x54\x78\x9c\x63\x00\x01\x00\x00\x05\x00\x01\x0d\x0a\x2d\xb4\x00\x00\x00\x00\x49\x45\x4e\x44\xae\x42\x60\x82' > "$TEST_IMAGE"
    echo "✅ Test image created: $TEST_IMAGE"
else
    echo "2. Using existing test image: $TEST_IMAGE"
fi
echo ""

# Test upload
echo "3. Testing image upload..."
UPLOAD_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/upload/image" \
    -F "file=@${TEST_IMAGE}")

echo "$UPLOAD_RESPONSE" | grep -q '"success":true'
if [ $? -eq 0 ]; then
    echo "✅ Upload successful"
    echo "Response: $UPLOAD_RESPONSE"

    # Extract the filename from response
    FILENAME=$(echo "$UPLOAD_RESPONSE" | grep -o '"filename":"[^"]*"' | head -1 | cut -d'"' -f4)
    IMAGE_URL=$(echo "$UPLOAD_RESPONSE" | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "Uploaded filename: $FILENAME"
    echo "Image URL: $IMAGE_URL"
else
    echo "❌ Upload failed"
    echo "Response: $UPLOAD_RESPONSE"
fi
echo ""

# Test list images
echo "4. Testing list images..."
LIST_RESPONSE=$(curl -s "${BASE_URL}/api/upload/images")
echo "$LIST_RESPONSE" | grep -q '"success":true'
if [ $? -eq 0 ]; then
    echo "✅ List images successful"
    TOTAL=$(echo "$LIST_RESPONSE" | grep -o '"total":[0-9]*' | cut -d':' -f2)
    echo "Total images: $TOTAL"
else
    echo "❌ List images failed"
    echo "Response: $LIST_RESPONSE"
fi
echo ""

# Test access static file
if [ ! -z "$IMAGE_URL" ]; then
    echo "5. Testing static file access..."
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$IMAGE_URL")
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ Static file accessible (HTTP $HTTP_CODE)"
    else
        echo "❌ Static file not accessible (HTTP $HTTP_CODE)"
    fi
    echo ""
fi

# Test delete image
if [ ! -z "$FILENAME" ]; then
    echo "6. Testing delete image..."
    DELETE_RESPONSE=$(curl -s -X DELETE "${BASE_URL}/api/upload/image/${FILENAME}")
    echo "$DELETE_RESPONSE" | grep -q '"success":true'
    if [ $? -eq 0 ]; then
        echo "✅ Delete successful"
        echo "Response: $DELETE_RESPONSE"
    else
        echo "❌ Delete failed"
        echo "Response: $DELETE_RESPONSE"
    fi
    echo ""
fi

echo "======================================"
echo "Test completed!"
echo "======================================"

# Cleanup test image
rm -f "$TEST_IMAGE"
