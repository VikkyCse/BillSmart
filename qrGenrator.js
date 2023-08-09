const qr = require('qrcode');
const fs = require('fs');

function generateQRCode(data, filename) {
    qr.toDataURL(data, (err, qrDataURL) => {
        if (err) {
            console.error(err);
            return;
        }

        // Save QR code image to a file
        fs.writeFileSync(filename, qrDataURL.split(',')[1], 'base64');
        console.log(`QR code generated and saved as ${filename}`);
    });
}

// Information you want to encode in the QR code
const qrData = "Hello, this is a QR code example.";

// Call the function to generate QR code
generateQRCode(qrData, 'qrcode.png');
