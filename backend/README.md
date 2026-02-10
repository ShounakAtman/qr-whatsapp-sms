# WhatsApp Portfolio Bot - Backend

Automated WhatsApp Business API backend that sends your portfolio PDF when customers send the keyword "Atman_portfolio".

## Features

- ✅ Automatic keyword detection ("Atman_portfolio")
- ✅ Sends personalized message + PDF attachment
- ✅ Webhook verification for Meta Business API
- ✅ Health check endpoint
- ✅ Easy deployment to free hosting platforms

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `WHATSAPP_PHONE_NUMBER_ID` - From Meta Business API
- `WHATSAPP_ACCESS_TOKEN` - From Meta Business API
- `WEBHOOK_VERIFY_TOKEN` - Any random string you create
- `PORTFOLIO_PDF_URL` - Public URL to your PDF
- `REPLY_MESSAGE` - Custom message to send with PDF

### 3. Run Locally

```bash
npm start
```

Server will start on `http://localhost:3000`

### 4. Test Health Check

Visit: `http://localhost:3000/health`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API information |
| `/health` | GET | Health check and config status |
| `/webhook` | GET | Webhook verification (Meta) |
| `/webhook` | POST | Receive WhatsApp messages |

## How It Works

1. Customer scans QR code → WhatsApp opens with "Atman_portfolio" pre-filled
2. Customer sends the message
3. Meta sends webhook POST to `/webhook`
4. Backend detects keyword "atman_portfolio"
5. Backend automatically replies with message + PDF

## Deployment

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed deployment instructions.

### Quick Deploy Options

- **Render:** Free tier, easy setup
- **Railway:** Free tier, GitHub integration
- **Heroku:** Free tier available

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `WHATSAPP_PHONE_NUMBER_ID` | Your WhatsApp Business Phone Number ID | `123456789012345` |
| `WHATSAPP_ACCESS_TOKEN` | Permanent access token from Meta | `EAAxxxxx...` |
| `WEBHOOK_VERIFY_TOKEN` | Custom token for webhook verification | `my_secret_token_123` |
| `PORT` | Server port | `3000` |
| `PORTFOLIO_PDF_URL` | Public URL to your PDF | `https://example.com/portfolio.pdf` |
| `REPLY_MESSAGE` | Custom reply message | `Thank you for your interest!` |

## Logs

The server provides detailed console logs:
- 📩 Incoming messages
- 🎯 Keyword detection
- 📝 Message sending status
- ✅ Success confirmations
- ❌ Error messages

## Security

- Never commit `.env` file
- Keep access tokens secure
- Use HTTPS for production webhook URL
- Regularly rotate access tokens

## Troubleshooting

### Webhook verification fails
- Check `WEBHOOK_VERIFY_TOKEN` matches Meta configuration
- Ensure backend is publicly accessible

### Messages not received
- Verify webhook subscription in Meta dashboard
- Check backend logs for errors
- Ensure phone number is properly configured

### PDF not sending
- Verify PDF URL is publicly accessible
- Check URL doesn't require authentication
- Review backend logs for API errors

## License

MIT
