// ============================================
// CONFIGURATION - EDIT YOUR DETAILS HERE
// ============================================

const CONFIG = {
    // Your phone number (include country code, e.g., +1234567890)
    phoneNumber: '+15551837698',

    // Keyword message that triggers automated portfolio delivery
    // When customer sends this, the backend automatically replies with your portfolio PDF
    message: 'Atman_portfolio',

    // Countdown timer (in seconds) before switching from WhatsApp to SMS
    countdownSeconds: 10
};

// ============================================
// HOW THIS WORKS:
// ============================================
//
// 1. Customer scans QR code
// 2. WhatsApp opens with "Atman_portfolio" pre-filled
// 3. Customer sends the message
// 4. Your WhatsApp Business API backend automatically replies
//    with your custom message + portfolio PDF
//
// SETUP REQUIRED:
// - Configure WhatsApp Business API (see backend/SETUP_GUIDE.md)
// - Deploy the backend server (see backend/README.md)
// - Set up webhook in Meta Business Suite
//

// ============================================
