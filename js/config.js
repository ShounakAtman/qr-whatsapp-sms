// ============================================
// CONFIGURATION - EDIT YOUR DETAILS HERE
// ============================================

const CONFIG = {
    // Your phone number (include country code, e.g., +1234567890)
    phoneNumber: '+917038429540',

    // Message that will be pre-filled in WhatsApp/SMS
    message: 'Hi! I scanned your QR code and would like to connect.',

    // PDF link that will be sent with the message
    // You can host your PDF on Google Drive, Dropbox, or any file hosting service
    // Make sure the link is a direct download or view link
    pdfLink: 'https://atmanconsultant-my.sharepoint.com/:b:/g/personal/varad_choudhari_atmanconsultants_com/IQC1PoNHJT-aQ6yjcIRMp0HdAdGhNDgtAaiLD1gDR-H8fNM?e=wUgG9V',

    // Optional: Custom PDF name/description
    pdfName: 'Brochure.pdf',

    // Countdown timer (in seconds) before switching from WhatsApp to SMS
    countdownSeconds: 10
};

// ============================================
// HOW TO GET YOUR PDF LINK:
// ============================================
//
// GOOGLE DRIVE:
// 1. Upload PDF to Google Drive
// 2. Right-click → Get link
// 3. Change to "Anyone with the link can view"
// 4. Copy the link (format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing)
// 5. Use as is, or convert to direct download:
//    https://drive.google.com/uc?export=download&id=FILE_ID
//
// DROPBOX:
// 1. Upload PDF to Dropbox
// 2. Click Share → Create link
// 3. Copy link and change ?dl=0 to ?dl=1 at the end
//
// YOUR OWN WEBSITE:
// 1. Upload PDF to your website's folder
// 2. Use full URL: https://yourwebsite.com/folder/file.pdf
//
// ============================================