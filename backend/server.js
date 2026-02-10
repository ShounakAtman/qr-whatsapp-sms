require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Configuration
const WHATSAPP_API_URL = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;
const PORTFOLIO_PDF_URL = process.env.PORTFOLIO_PDF_URL;
const REPLY_MESSAGE = process.env.REPLY_MESSAGE || 'Thank you for your interest! Here\'s my portfolio.';

// Webhook verification endpoint (required by Meta)
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
            console.log('✅ Webhook verified successfully!');
            res.status(200).send(challenge);
        } else {
            console.log('❌ Webhook verification failed - token mismatch');
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(400);
    }
});

// Webhook endpoint to receive messages
app.post('/webhook', async (req, res) => {
    try {
        const body = req.body;

        // Check if this is a WhatsApp message event
        if (body.object === 'whatsapp_business_account') {
            // Extract message details
            const entry = body.entry?.[0];
            const changes = entry?.changes?.[0];
            const value = changes?.value;
            const messages = value?.messages;

            if (messages && messages.length > 0) {
                const message = messages[0];
                const from = message.from; // Customer's phone number
                const messageText = message.text?.body?.toLowerCase().trim();
                const messageId = message.id;

                console.log(`📩 Received message from ${from}: "${messageText}"`);

                // Check if message contains the keyword "atman_portfolio"
                if (messageText && messageText.includes('atman_portfolio')) {
                    console.log('🎯 Keyword detected! Sending portfolio...');

                    // Send automated reply with PDF
                    await sendPortfolioPDF(from);

                    console.log(`✅ Portfolio sent to ${from}`);
                } else {
                    console.log('ℹ️ Message does not contain keyword, ignoring.');
                }
            }
        }

        // Always respond with 200 OK to acknowledge receipt
        res.sendStatus(200);
    } catch (error) {
        console.error('❌ Error processing webhook:', error.message);
        res.sendStatus(500);
    }
});

// Function to send portfolio PDF via WhatsApp
async function sendPortfolioPDF(recipientPhone) {
    try {
        // First, send the text message
        await axios.post(
            WHATSAPP_API_URL,
            {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: recipientPhone,
                type: 'text',
                text: {
                    body: REPLY_MESSAGE
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('📝 Text message sent');

        // Then, send the PDF document
        await axios.post(
            WHATSAPP_API_URL,
            {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: recipientPhone,
                type: 'document',
                document: {
                    link: PORTFOLIO_PDF_URL,
                    filename: 'Atman_Portfolio.pdf',
                    caption: 'Portfolio Document'
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('📄 PDF document sent');
        return true;
    } catch (error) {
        console.error('❌ Error sending portfolio:', error.response?.data || error.message);
        throw error;
    }
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        config: {
            phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID ? '✅ Set' : '❌ Missing',
            accessToken: process.env.WHATSAPP_ACCESS_TOKEN ? '✅ Set' : '❌ Missing',
            verifyToken: process.env.WEBHOOK_VERIFY_TOKEN ? '✅ Set' : '❌ Missing',
            pdfUrl: process.env.PORTFOLIO_PDF_URL ? '✅ Set' : '❌ Missing'
        }
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'WhatsApp Portfolio Bot API',
        version: '1.0.0',
        endpoints: {
            webhook: '/webhook',
            health: '/health'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 WhatsApp Portfolio Bot Server Started');
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🔗 Webhook URL: http://localhost:${PORT}/webhook`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
    console.log('\n⚙️  Configuration Status:');
    console.log(`   Phone Number ID: ${process.env.WHATSAPP_PHONE_NUMBER_ID ? '✅' : '❌'}`);
    console.log(`   Access Token: ${process.env.WHATSAPP_ACCESS_TOKEN ? '✅' : '❌'}`);
    console.log(`   Verify Token: ${process.env.WEBHOOK_VERIFY_TOKEN ? '✅' : '❌'}`);
    console.log(`   PDF URL: ${process.env.PORTFOLIO_PDF_URL ? '✅' : '❌'}`);
    console.log('\n📝 Waiting for messages...\n');
});
