# Donation App - Google Sheets Integration

This project is a simple Donation App backend built with Google Apps Script. It accepts donation data through POST requests, including optional image uploads, and stores the information in a Google Sheet and Google Drive.

## Features

- Receives donation details (name, description, location) via HTTP POST.
- Accepts image uploads encoded in Base64 and saves them to a specified Google Drive folder.
- Stores donation records in a Google Sheet with a timestamp and clickable image link.
- Supports CORS for cross-origin requests.

## How It Works

1. The app receives JSON data via POST.
2. If an image is included, it's decoded and saved to Google Drive.
3. A new row is appended to the Google Sheet with donation details and a hyperlink to the uploaded image.
4. Returns a JSON response with status and image URL.

## Setup

1. Create a Google Sheet and note the sheet name.
2. Create a Google Drive folder for storing images.
3. Deploy this Apps Script as a Web App with appropriate permissions.
4. Update the script constants:
   - `DRIVE_FOLDER_ID` with your Google Drive folder ID.
   - `SHEET_NAME` with your Google Sheet name.

## Usage

Send a POST request with JSON body:

```json
{
  "name": "Donor Name",
  "description": "Donation details",
  "location": "Location info",
  "image": "Base64EncodedImageString"
}
```
