# WhatsApp Business API Setup Guide

This guide will walk you through setting up the WhatsApp Business API to enable automated portfolio delivery.

## Prerequisites

- A Facebook Business Account
- A WhatsApp Business Account
- A phone number to use with WhatsApp Business (can be your existing number)

---

## Step 1: Create Meta Business Account

1. Go to [Meta Business Suite](https://business.facebook.com/)
2. Click **Create Account**
3. Follow the prompts to set up your business account

---

## Step 2: Set Up WhatsApp Business API

### 2.1 Access the App Dashboard

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click **My Apps** → **Create App**
3. Select **Business** as the app type
4. Fill in your app details and create the app

### 2.2 Add WhatsApp Product

1. In your app dashboard, find **WhatsApp** in the products list
2. Click **Set up** on the WhatsApp card
3. Follow the setup wizard

### 2.3 Get Your Phone Number ID

1. In the WhatsApp section, go to **API Setup**
2. You'll see a **Phone number ID** - copy this (you'll need it for `.env`)
3. You'll also see a temporary **Access Token** - copy this too

### 2.4 Get a Permanent Access Token

The temporary token expires in 24 hours. To get a permanent one:

1. Go to **System Users** in your Business Settings
2. Create a new system user or select an existing one
3. Click **Generate New Token**
4. Select your app and grant these permissions:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
5. Copy the permanent access token

---

## Step 3: Configure Your Backend

1. Navigate to the `backend` folder
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and fill in your credentials:
   ```env
   WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
   WHATSAPP_ACCESS_TOKEN=your_permanent_access_token_here
   WEBHOOK_VERIFY_TOKEN=any_random_string_you_create
   PORT=3000
   PORTFOLIO_PDF_URL=your_pdf_url_here
   REPLY_MESSAGE=Your custom message here
   ```

   > **Note:** The `WEBHOOK_VERIFY_TOKEN` can be any random string you create (e.g., `my_secure_token_12345`). You'll use this same token when configuring the webhook in Meta.

---

## Step 4: Deploy Your Backend

You need to host your backend on a platform with a public URL. Here are free options:

### Option A: Render (Recommended - Free Tier)

1. Go to [Render](https://render.com/)
2. Sign up and create a new **Web Service**
3. Connect your GitHub repository (or upload the `backend` folder)
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:** Add all variables from your `.env` file
5. Deploy and copy your service URL (e.g., `https://your-app.onrender.com`)

### Option B: Railway (Free Tier)

1. Go to [Railway](https://railway.app/)
2. Create a new project from GitHub or upload your code
3. Add environment variables
4. Deploy and get your public URL

### Option C: Heroku (Free Tier Available)

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Run:
   ```bash
   cd backend
   heroku login
   heroku create your-app-name
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   heroku config:set WHATSAPP_PHONE_NUMBER_ID=your_value
   heroku config:set WHATSAPP_ACCESS_TOKEN=your_value
   # ... add all other env vars
   ```

---

## Step 5: Configure Webhook in Meta

1. Go back to your app in [Meta for Developers](https://developers.facebook.com/)
2. Navigate to **WhatsApp** → **Configuration**
3. In the **Webhook** section, click **Edit**
4. Enter your webhook details:
   - **Callback URL:** `https://your-deployed-url.com/webhook`
   - **Verify Token:** The same token you set in `WEBHOOK_VERIFY_TOKEN`
5. Click **Verify and Save**
6. Subscribe to webhook fields:
   - Check **messages**
7. Click **Save**

---

## Step 6: Test Your Setup

### 6.1 Check Backend Health

Visit `https://your-deployed-url.com/health` in your browser. You should see:
```json
{
  "status": "healthy",
  "config": {
    "phoneNumberId": "✅ Set",
    "accessToken": "✅ Set",
    "verifyToken": "✅ Set",
    "pdfUrl": "✅ Set"
  }
}
```

### 6.2 Send a Test Message

1. Send a WhatsApp message to your business number with the text: **Atman_portfolio**
2. You should receive an automated reply with your portfolio PDF!

---

## Step 7: Update Your QR Code

1. Make sure your frontend is hosted (GitHub Pages, Netlify, etc.)
2. Use the QR code generator to create a QR code pointing to your hosted page
3. When users scan it, they'll send "Atman_portfolio" and get your PDF automatically!

---

## Troubleshooting

### Webhook Verification Fails
- Make sure your `WEBHOOK_VERIFY_TOKEN` in `.env` matches exactly what you entered in Meta
- Check that your backend is publicly accessible
- Look at your backend logs for error messages

### Messages Not Being Received
- Check that you've subscribed to the `messages` webhook field
- Verify your phone number is properly configured in Meta
- Check backend logs: `heroku logs --tail` or view logs in Render/Railway dashboard

### PDF Not Sending
- Ensure your PDF URL is publicly accessible
- Test the PDF URL in a browser to make sure it downloads
- Check that the URL doesn't require authentication

### Backend Crashes
- Check environment variables are set correctly
- Review logs for specific error messages
- Make sure all dependencies are installed: `npm install`

---

## Security Notes

- **Never commit your `.env` file** to version control
- Keep your access token secret
- Regularly rotate your access tokens
- Use HTTPS for your webhook URL (required by Meta)

---

## Support

If you encounter issues:
1. Check the [Meta WhatsApp Business API Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api)
2. Review your backend logs for error messages
3. Test the `/health` endpoint to verify configuration
