const { Client, GuildMember, AttachmentBuilder, UserFlags } = require("discord.js");
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const Canvas = require('@napi-rs/canvas');
const { botBadge } = require("./image-assets.json");
const { join } = require("path");

// Damit man unten rechnen kann
const bWidth = 885;
const bHeight = 303;
const bAvatarDiameter = 225;

// Optionen für das Welcome System
const options = {
    // Canvas Größe
    width: bWidth,
    height: bHeight,
    edgeRadius: 35,

    // Background
    blurFilterBackground: "blur(3px)",
    transperentenBackgroundColor: '#18191c',
    alphaBackground: 0.2,
    alphaBackgroundColor: '#2a2d33',


    // Border
    borderColor: 'rgba(0,0,0,1)',
    borderAlpha: 0.4,
    borderX: 9,
    borderY: 9,
    borderW: 867,
    borderH: 285,
    borderR: [25], // Radius

    // Avatar
    avatarDiameter: bAvatarDiameter,
    avatarX: 47,
    avatarY: 39, // Vorher: (bHeight - bAvatarDiameter) / 2, kommt auf das selbe hinaus
    avatarRadius: 225,
    avatarTransparent: '#292b2f',
    
    shadowAlpha: 0.4,
    shadowFilter: 'drop-shadow(0px 4px 4px #000)',

    font: 'Helvetica Bold',
    fontSize: '80',
    usernameTxtColor: "FFFFFF",
    usernameTxtX: 300,
    usernameTxtY: 155,

    tagFont: 'Helvetica',
    tagFontColor: '#dadada',
    tagFontSize: 60,
    tagX: 300, 
    tagY: 215,

    dateFont: 'Helvetica',
    dateFontSize: 23,
    dateColor: '#dadada'
}

/**
 * Erstellt das Willkomensbild
 * @param {Client} client 
 * @param {GuildMember} member 
 * @returns Discord Attachment welcome.png
 */
async function genWelcomeCard(client, member) {
    // Basis Leinwand erstellen
    // Mit dem context kann man die Leinwand/Bild modifizieren
    const userCard = createCanvas(options.width, options.height);
    const context = userCard.getContext('2d');

    // Erstellt Maske mit abgerundeten Ecken
    await applyRoundedCornersMask(context, options.width, options.height, options.edgeRadius)

    // Erstellt die einzelnen Bestandteile der Welcome Card
    const background = await genBackground(member);
    const border = await genBorder();
    const avatar = await genAvatar(member);
    const avatarShadow = await addShadow(avatar);
    const username = await genUsername(member);
    const usernameShadow = await addShadow(username);
    const tag = await genTag(member);
    const tagShadow = await addShadow(tag);
    const badgeBot = await genBotBadge(member);
    const badgeBotShadow = await addShadow(badgeBot);
    const joinDate = await genDate(member);
    const joinDateShadow = await addShadow(joinDate);


    // Fügt die einzelnen Bestandteile dem Bild hinzu
    context.drawImage(background, 0, 0);
    context.drawImage(border, 0, 0);
    context.drawImage(avatarShadow, 0, 0);
    context.drawImage(avatar, 0, 0);
    context.drawImage(usernameShadow, 0, 0);
    context.drawImage(username, 0, 0);
    context.drawImage(tagShadow, 0, 0);
    context.drawImage(tag, 0, 0);
    context.drawImage(badgeBotShadow, 0, 0);
    context.drawImage(badgeBot, 0, 0);
    context.drawImage(joinDateShadow, 0, 0)
    context.drawImage(joinDate, 0, 0)

    // Wandelt das Bild in ein Discord Attachment um
    const attachment = new AttachmentBuilder(await userCard.encode('png'), { name: "welcome.png" });

    return attachment;

    // WEITERE IDEEN
    /*
        Oben Rechts sollen dann noch alle möglichen Discord Badges hin, das kann anstrengend werden, da soll man auch wieder ein durchgehenden mit abgrundeten Ecken Hintergrund im dunkel blur geben wie das Datum unten rechts
            viel arbeit, alles Sachen downloaden und so implementieren, dass man diese bei bedarf einfach durch ein neues icon per github push ziehen kann
            oder durch einer lib evetl. direkt über discord js einfach das icon von der badge bekommen
        
        Es gibt ja jetzt auch Tags wie MEOW, die eventuell auch einbinden
    */
}


// ******************************************************
//          Alle Funktion für Bestandteile der Bilder
// ******************************************************


/**
 * Setzt eine Maske mit abgerundeten Ecken auf den Canvas-Kontext.
 * Danach werden nur noch die Bereiche innerhalb der abgerundeten Rechtecks sichtbar.
 * @param {CanvasRenderingContext2D} ctx - Canvas-Kontext
 * @param {number} width - Breite des Bereichs
 * @param {number} height - Höhe des Bereichs
 * @param {number} radius - Radius der Ecken
 */
function applyRoundedCornersMask(ctx, width, height, radius) {
  ctx.save();            // Zustand speichern

  ctx.beginPath();
  // Rechteck mit abgerundeten Ecken erstellen
  ctx.roundRect(0, 0, width, height, [radius]);
  ctx.clip();            // Alles außerhalb des Pfades wird abgeschnitten (unsichtbar)
}

/**
 * Gibt die Basis für den Hintergrund
 * @param {Client} client 
 * @param {GuildMember} member 
 * @returns imgUrl und type (costum/default)
 */
async function getUserBanner(member) {
    // User Avatar holen, als Fallback, wenn kein Banner vorhanden
    const user = await member.client.users.fetch(member.id, { force: true });
    const defaultBanner = user.displayAvatarURL({ extension: 'png', size: 4096 });

    try {
        const user = await member.client.users.fetch(member.id, { force: true });
        const banner = user.bannerURL({ size: 4096 });
        return banner ? {imgUrl: banner, type: "costum"} : {imgUrl: defaultBanner, type: "default"};
    } catch(error) {
        console.error('Fehler beim Abrufen des Banners:', error);
        return {imgUrl: defaultBanner, type: "default"};
    }
}

/**
 * Erstellt ein Canvas mit dem Hintergrund Bild drauf
 * @param { GuildMember } member 
 * @returns Hintergrund als Canvas
 */
async function genBackground(member) {
    const x = 0;
    const y = 0;
    const w = options.width;
    const h = options.height;

    const canvas = createCanvas(options.width, options.height)
    const ctx = canvas.getContext('2d');

    // Entnimmt das passende Bild für den Hintergrund
    const { imgUrl, type } = await getUserBanner(member);
    const img = await loadImage(imgUrl).catch(() => {});;

    // Transperenten Hintergrund füllen
    ctx.fillStyle = options.transperentenBackgroundColor;
    ctx.beginPath();
    ctx.fillRect(x, y, w, h);
    ctx.fill();

    // Fügt den Blur Effekt hinzu
    ctx.filter = options.blurFilterBackground;

    // Berechnet die Positionierung
    const condImage = type === "costum";
    const wX = condImage ? 885 : 900;
    const wY = condImage ? 303 : wX;
    const cY = condImage ? 0 : -345;

    // Zeichnet den Hintergrund Bild auf die Leinwand
    ctx.drawImage(img, 0, cY, wX, wY);

    // Duneklt das Hintergrundbild ab
    ctx.globalAlpha = options.alphaBackground;
    ctx.fillStyle = options.alphaBackgroundColor;
    ctx.beginPath();
    ctx.fillRect(x, y, w, h);
    ctx.fill();

    // Setzt angepasste werde zurück
    ctx.globalAlpha = 1;
    ctx.filter = 'none';

    // Gibt das fertige Hintergrund Canvas zurück
    return canvas;
}

/**
 * Erstellt ein Cavas mit der passenden Border für den Hintergrund
 * @returns Border als Canvas
 */
async function genBorder() {
    const canvas = createCanvas(options.width, options.height)
    const ctx = canvas.getContext('2d');

    // Füllt die volle Flächte
    ctx.fillStyle = options.borderColor;
    ctx.beginPath();
    ctx.fillRect(0, 0, options.width, options.height);

    // Loch in die Mitte als abgerundetes Rechteck, damit Rand bleibt
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.roundRect(options.borderX, options.borderY, options.borderW, options.borderH, options.borderR);
    ctx.fill();

    // Macht die Farbe Transparent
    const alphaBorder = await makeTransparent(canvas, options.borderAlpha);

    return alphaBorder;
}

/**
 * @param {Canvas} editCanvas Canvas was Transperent gemacht werden soll
 * @param {number} alpha zwischen 0 und 1
 * @returns 
 */
async function makeTransparent(editCanvas, alpha) {
    const canvas = createCanvas(editCanvas.width, editCanvas.height);
    const ctx = canvas.getContext('2d');

    // Mahlt das was Transparent sein soll auf eine neue Leinwand
    ctx.globalAlpha = alpha;
    ctx.drawImage(editCanvas, 0, 0);
    ctx.globalAlpha = 1;

    return canvas;
}

/**
 * Erstellt ein Cavas mit den Avatar drauf
 * @param {GuildMember} member Discord Member
 * @returns {Canvas} Avatar Canvas
 */
async function genAvatar(member) {
    const canvas = createCanvas(options.width, options.height);
    const ctx = canvas.getContext('2d');

    // User Avatar holen
    const user = await member.client.users.fetch(member.id, { force: true });
    const avatarURL = user.displayAvatarURL({ extension: 'png', size: 512 });
    const avatarImg = await Canvas.loadImage(avatarURL).catch(() => {});;

    // Rundet das Bild ab
    ctx.beginPath();
    ctx.roundRect(options.avatarX, options.avatarY, options.avatarDiameter, options.avatarDiameter, [options.avatarRadius])
    ctx.clip();

    // Füllt den Transperenten Hintergrund
    ctx.fillStyle = options.avatarTransparent;
    ctx.beginPath();
    ctx.roundRect(options.avatarX, options.avatarY, options.avatarDiameter, options.avatarDiameter, [options.avatarRadius])
    ctx.fill();
    ctx.closePath();

    // Mahlt das fertige Avatar auf die Leinwand
    ctx.drawImage(avatarImg, options.avatarX, options.avatarY, options.avatarDiameter, options.avatarDiameter);
    
    return canvas;
}

/**
 * Fügt Schadden hinzu
 * @param {Canvas} toApplyCanvas 
 * @returns Canvas with Shadows on the Avatar
 */
async function addShadow(canvasToEdit) {
  const canvas = Canvas.createCanvas(options.width, options.height);
  const ctx = canvas.getContext('2d');

  // Schatten als CSS-Filter setzen: x-Versatz 0, y-Versatz 4, Blur 4, Farbe schwarz
  ctx.filter = options.shadowFilter;
  // Macht den Schatten transperent
  ctx.globalAlpha = options.shadowAlpha;

  // Ursprüngliches Canvas auf die neue Canvas zeichnen, dabei Schatten angewendet
  ctx.drawImage(canvasToEdit, 0, 0);

  // Neue Canvas mit Schatten zurückgeben
  return canvas;
}

/**
 * Erstellt den Canvas von dem Membernamen drauf
 * @param {GuildMember} member 
 */
async function genUsername(member) {
    const canvas = createCanvas(options.width, options.height);
    const ctx = canvas.getContext('2d');

    // Entnimmt den Member bezogene Daten
    const fixedUsername = member.user.globalName ?? member.nickname ?? member.displayName;
    const isBot = member.user.bot ?? false;

    const pixelLength = isBot ? 470 : 555;

    const { username, newSize } = await parseUsername(
        fixedUsername,
        ctx,
        options.font,
        options.fontSize,
        pixelLength
    );

    // Schreibt den Text auf die Karte
    ctx.font = `${newSize}px ${options.font}`;
    ctx.textAlign = 'left';
    ctx.fillStyle = options.usernameTxtColor;
    ctx.fillText(username, options.usernameTxtX, options.usernameTxtY);


    return canvas;
}

/**
 * Erstellt ein Canvas mit dem Usertag drauf
 * @param {GuildMember} member 
 */
async function genTag(member) {
    const canvas = createCanvas(options.width, options.height);
    const ctx = canvas.getContext('2d');

    const discriminator = member.user.discriminator;
    const rawUsername = member.user.username;

    const isBot = member.user.bot ?? false;
    const isHusky = member.user.id == "1123275593350402190";
    const pixelLength = isBot ? 470 : 555;

    // Speichert den richtigen Tag
    let tag;
    if(isHusky) tag = `@Husky`;
    else if(discriminator != 0) tag = `#${discriminator}`
    else tag = `@${rawUsername}`

    // Schreibt den Text aus
    const { username, newSize } = await parseUsername(
        tag,
        ctx,
        options.tagFont,
        options.tagFontSize,
        pixelLength
    );
    // Übernimmt mögliche formatierungen von der paseUsername function
    tag = username;

    // Schreibt den Text auf das Canvas
    ctx.font = `${newSize}px ${options.tagFont}`;
    ctx.textAlign = 'left';
    ctx.fillStyle = options.tagFontColor;
    ctx.fillText(username, options.tagX, options.tagY);

    return canvas
}

/**
 * Erstellt die Badge für Bots
 * @param {GuildMember} member 
 */
async function genBotBadge(member) {
    const canvas = createCanvas(options.width, options.height);
    const ctx = canvas.getContext('2d');

    // Kein Bot also auch keine Badge
    const isBot = member.user.bot ?? false;
    if (!isBot ?? true) return canvas;

    const isVerified = await member.user.flags.has(UserFlags.VerifiedBot) ?? false;
    const badgeName = isVerified ? 'botVerif' : 'botNoVerif';

    const botBadgeBase64 = botBadge[badgeName];
    const botBadgeImg = await loadImage(Buffer.from(botBadgeBase64, 'base64')).catch(() => {});

    const fixedUsername = member.user.globalName ?? member.nickname ?? member.displayName;
    const pixelLength = isBot ? 470 : 555;

    const { textLength } = await parseUsername(
        fixedUsername,
        ctx,
        options.font,
        options.fontSize,
        pixelLength
    );

    ctx.drawImage(botBadgeImg, textLength + 310, 110);

    return canvas;
}

async function genDate(member) {
    const canvas = createCanvas(options.width, options.height);
    const ctx = canvas.getContext('2d');

    const date = await getJoinDate(member);

    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.roundRect(696, 248, 165, 33, [12]);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.font = `${options.dateFontSize}px ${options.dateFont}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = options.dateColor;
    ctx.fillText(date, 778.5, 267.2);

    return canvas;
}

/**
 * Gibt das Datum als String zurpck
 * @param {GuildMember} member 
 * @returns Datum als String (DD.MM.YYYY)
 */
async function getJoinDate(member) {
    const joinedAt = member.joinedAt;
    if(!joinedAt) return 'Unbekannt';
    const date = joinedAt.toLocaleDateString('de-DE');
    return date;
}

/**
 * Hilfsfunktion, um den Username richtig zu formatieren
 * @param {String} username 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {String} font 
 * @param {Number} size 
 * @param {Number} maxLength 
 * @returns 
 */
async function parseUsername(username, ctx, font, size, maxLength) {
    username = username && username.replace(/\s/g, '') ? username : '?????';
    let usernameChars = username.split('');
    let editableUsername = '';
    let finalUsername = '';

    let newSize = +size;
    let textLength;

    let finalized = false;

    while(!finalized) {
        editableUsername = usernameChars.join('');

        ctx.font = `${newSize}px ${font}`;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#FFFFFF';

        const actualLength = ctx.measureText(editableUsername).width;

        if (actualLength >= maxLength) {
            if (newSize > 60) newSize -= 1;
            else usernameChars.pop();
        }

        if (actualLength <= maxLength) {
            finalUsername = usernameChars.join('');
            textLength = actualLength;
            finalized = true;
        }
    }

    return {
        username: finalUsername,
        newSize,
        textLength
    };
}

module.exports = { genWelcomeCard }