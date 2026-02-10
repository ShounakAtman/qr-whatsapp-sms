// Main application logic
let countdownInterval;
let hasRedirected = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    // Display phone number in fallback UI
    document.getElementById('phoneNumber').textContent = CONFIG.phoneNumber;

    // Automatically attempt WhatsApp redirect on load
    attemptWhatsAppRedirect();
});

// Attempt to open WhatsApp automatically
function attemptWhatsAppRedirect() {
    const loader = document.getElementById('loader');
    const fallback = document.getElementById('fallback');

    // Start countdown
    startCountdown();

    // Try to open WhatsApp
    openWhatsApp();

    // After countdown expires, show fallback options
    setTimeout(() => {
        if (!hasRedirected) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.classList.add('hidden');
                fallback.classList.remove('hidden');
                fallback.classList.add('fade-in');
            }, 500);
        }
    }, CONFIG.countdownSeconds * 1000);
}

// Start countdown timer
function startCountdown() {
    let timeLeft = CONFIG.countdownSeconds;
    const countdownElement = document.getElementById('countdown');

    countdownInterval = setInterval(() => {
        timeLeft--;
        countdownElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            // Automatically try SMS if WhatsApp didn't work
            if (!hasRedirected) {
                openSMS();
            }
        }
    }, 1000);
}

// Open WhatsApp with message and PDF link
function openWhatsApp() {
    const message = createMessage();
    const phoneNumber = CONFIG.phoneNumber.replace(/[^\d+]/g, ''); // Clean phone number

    // WhatsApp URL scheme
    // Use api.whatsapp.com for better compatibility across devices
    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    // Try to open WhatsApp
    try {
        window.location.href = whatsappURL;
        hasRedirected = true;

        // Clear countdown if successful
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
    } catch (error) {
        console.log('WhatsApp redirect failed:', error);
    }
}

// Open SMS with message and PDF link
function openSMS() {
    const message = createMessage();
    const phoneNumber = CONFIG.phoneNumber.replace(/[^\d+]/g, ''); // Clean phone number

    // SMS URL scheme
    // iOS uses '?' and Android can use '?' or '&' - we'll use '?body=' for best compatibility
    let smsURL;

    // Detect iOS vs Android
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);

    if (isIOS) {
        smsURL = `sms:${phoneNumber}&body=${encodeURIComponent(message)}`;
    } else {
        // Android and others
        smsURL = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    }

    // Open SMS app
    try {
        window.location.href = smsURL;
        hasRedirected = true;

        // Clear countdown if successful
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
    } catch (error) {
        console.log('SMS redirect failed:', error);
    }
}

// Create the complete message with PDF link
function createMessage() {
    let fullMessage = CONFIG.message;

    // Add PDF link to message
    if (CONFIG.pdfLink) {
        fullMessage += `\n\n📄 ${CONFIG.pdfName}: ${CONFIG.pdfLink}`;
    }

    return fullMessage;
}

// Detect if user returns to page (WhatsApp/SMS app didn't open)
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && hasRedirected) {
        // User came back - likely the app didn't open
        // Show fallback options
        const loader = document.getElementById('loader');
        const fallback = document.getElementById('fallback');

        loader.classList.add('hidden');
        fallback.classList.remove('hidden');
    }
});

// Prevent multiple redirects
window.addEventListener('beforeunload', function () {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
});