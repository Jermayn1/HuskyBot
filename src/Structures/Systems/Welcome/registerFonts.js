const { GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');

async function registerFonts() {
    // Schriftarten registrieren
    GlobalFonts.registerFromPath(`${path.join(__dirname, 'fonts')}/HelveticaBold.ttf`, `Helvetica Bold`);
    GlobalFonts.registerFromPath(`${path.join(__dirname, 'fonts')}/Helvetica.ttf`, `Helvetica`);
}

module.exports = { registerFonts }