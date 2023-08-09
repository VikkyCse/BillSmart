const qr = require('qrcode');
const fs = require('fs');
const path = require('path');
function generateQRCode(data) {
    const writepath = path.join(__dirname, 'images', `${data}.png`)
    qr.toDataURL(data, (err, qrDataURL) => {
        if (err) {
            console.error(err);
            return;
        }


        // Save QR code image to a file
        fs.writeFileSync(writepath, qrDataURL.split(',')[1], 'base64');
        console.log(`QR code generated and saved as ${writepath}`);
        return writepath;
    });
}
module.exports = generateQRCode