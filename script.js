const canvas = document.querySelector("#posterCanvas");
const ctx = canvas.getContext("2d");
const form = document.querySelector("#posterForm");
const imageInput = document.querySelector("#imageInput");
const eventCharacterInput = document.querySelector("#eventCharacterInput");
const eventPanelInput = document.querySelector("#eventPanelInput");
const starlightCharacterInput = document.querySelector("#starlightCharacterInput");
const starlightPreviewInput = document.querySelector("#starlightPreviewInput");
const starlightSkinLeftInput = document.querySelector("#starlightSkinLeftInput");
const starlightSkinRightInput = document.querySelector("#starlightSkinRightInput");
const adjustLayerInput = document.querySelector("#adjustLayer");
const adjustXInput = document.querySelector("#adjustX");
const adjustYInput = document.querySelector("#adjustY");
const adjustZoomInput = document.querySelector("#adjustZoom");
const resetAdjustButton = document.querySelector("#resetAdjustButton");
const videoInput = document.querySelector("#videoInput");
const downloadButton = document.querySelector("#downloadButton");
const playVideoButton = document.querySelector("#playVideoButton");
const exportVideoButton = document.querySelector("#exportVideoButton");
const sourceVideo = document.querySelector("#sourceVideo");
const videoStatus = document.querySelector("#videoStatus");
const captionOutput = document.querySelector("#captionOutput");

let heroImage = null;
let eventCharacterImage = null;
let eventPanelImage = null;
let starlightCharacterImage = null;
let starlightPreviewImage = null;
let starlightSkinLeftImage = null;
let starlightSkinRightImage = null;
let animationFrame = null;
let videoObjectUrl = "";
const kgoLogo = new Image();
kgoLogo.src = "assets/kgo-logo.png";
kgoLogo.onload = drawPoster;
const kgoLogoCrop = { x: 31, y: 545, width: 2438, height: 1410 };
const starlightLogo = new Image();
starlightLogo.src = "assets/starlight-logo.png";
starlightLogo.onload = drawPoster;

const imageAdjustments = {
  main: { x: 0, y: 0, zoom: 1 },
  eventCharacter: { x: 0, y: 0, zoom: 1 },
  eventPanel: { x: 0, y: 0, zoom: 1 },
  starlightCharacter: { x: 0, y: 0, zoom: 1 },
  starlightPreview: { x: 0, y: 0, zoom: 1 },
  starlightSkinLeft: { x: 0, y: 0, zoom: 1 },
  starlightSkinRight: { x: 0, y: 0, zoom: 1 },
  videoMain: { x: 0, y: 0, zoom: 1 }
};

const fields = {
  outputMode: document.querySelector("#outputMode"),
  headline: document.querySelector("#headline"),
  kicker: document.querySelector("#kicker"),
  swipeText: document.querySelector("#swipeText"),
  badgeText: document.querySelector("#badgeText"),
  website: document.querySelector("#website"),
  sourceText: document.querySelector("#sourceText"),
  topTagline: document.querySelector("#topTagline"),
  theme: document.querySelector("#theme")
};

function drawPoster() {
  const data = getData();
  setCanvasMode(data.outputMode);
  document.body.classList.toggle("is-event-mode", data.theme === "event");
  document.body.classList.toggle("is-starlight-mode", data.theme === "starlight");
  if (data.outputMode === "video") {
    drawVideoTemplate(data);
  } else {
    drawImageTemplate(data);
  }
  updateCaption(data);
}

function getData() {
  return Object.fromEntries(
    Object.entries(fields).map(([key, field]) => [key, field.value.trim()])
  );
}

function setCanvasMode(mode) {
  document.body.classList.toggle("is-video-mode", mode === "video");
  const nextWidth = 1080;
  const nextHeight = mode === "video" ? 1920 : 1350;
  if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
    canvas.width = nextWidth;
    canvas.height = nextHeight;
  }
}

function drawImageTemplate(data) {
  if (data.theme === "starlight") {
    drawStarlightTemplate(data);
    return;
  }

  if (data.theme === "event") {
    drawRechargeTemplate(data);
    return;
  }

  if (data.theme === "collage") {
    drawCollageTemplate(data);
    return;
  }

  clearCanvas();
  drawBackground(data.theme, 500, 1260);
  drawHero(heroImage, data.theme);
  drawImageOverlay();
  drawDecorations(1350);
  drawBrandBadge(data.badgeText, 52, 742, -0.08);
  drawKicker(data.kicker);
  drawSwipe(data.swipeText, 1005, 690, 55);
  drawHeadline(data.headline, 895, 76, 63, 860, 5);
  drawSource(data.sourceText, 1170, 1210);
  drawWebsite(data.website, 1236);
  drawSideText(965, 1130);
}

function drawRechargeTemplate(data) {
  clearCanvas();
  drawBackground(data.theme, 360, 1230);
  drawRechargeCharacter(eventCharacterImage || heroImage);
  drawRechargeMissionPanel(eventPanelImage);
  drawRechargeBottomShade();
  drawDecorations(1350);
  drawTopLogoForImage(data.badgeText);
  drawRechargeTitle(data.kicker, data.headline, data.swipeText);
  drawWebsite(data.website, 1246);
}

function drawStarlightTemplate(data) {
  clearCanvas();
  drawBackground(data.theme, 360, 1240);
  drawStarlightCharacter(starlightCharacterImage || heroImage);
  drawStarlightPreview(starlightPreviewImage);
  drawStarlightThumbs(starlightSkinLeftImage, starlightSkinRightImage);
  drawStarlightPrice(data.sourceText);
  drawStarlightBadge();
  drawRechargeBottomShade();
  drawDecorations(1350);
  drawTopLogoForImage(data.badgeText);
  drawStarlightTitle(data.kicker, data.headline, data.swipeText);
  drawWebsite(data.website, 1246);
}

function drawCollageTemplate(data) {
  clearCanvas();
  drawBackground(data.theme, 115, 1260);
  drawDecorations(1350);
  drawCollagePanel(heroImage);
  drawTopLogoForImage(data.badgeText);
  drawWebsite(data.website, 1246);
}

function drawRechargeCharacter(image) {
  const area = { x: -55, y: 330, width: 650, height: 850 };

  ctx.save();
  ctx.beginPath();
  ctx.rect(-80, 270, 760, 965);
  ctx.clip();

  if (image) {
    drawAdjustedImage(image, area.x, area.y, area.width, area.height, "contain", "eventCharacter");
  } else {
    drawEventPlaceholder(area, "UPLOAD PNG KIRI");
  }
  ctx.restore();
}

function drawRechargeMissionPanel(image) {
  const panel = { x: 565, y: 455, width: 440, height: 715 };

  ctx.save();
  ctx.shadowColor = "rgba(0, 216, 255, 0.55)";
  ctx.shadowBlur = 12;
  ctx.fillStyle = "rgba(9, 26, 65, 0.72)";
  ctx.strokeStyle = "#14dfff";
  ctx.lineWidth = 3;
  roundedRect(panel.x, panel.y, panel.width, panel.height, 8);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.save();
  roundedRect(panel.x + 4, panel.y + 4, panel.width - 8, panel.height - 8, 6);
  ctx.clip();
  if (image) {
    ctx.fillStyle = "rgba(9, 26, 65, 0.82)";
    ctx.fillRect(panel.x + 4, panel.y + 4, panel.width - 8, panel.height - 8);
    drawAdjustedImage(image, panel.x + 4, panel.y + 4, panel.width - 8, panel.height - 8, "contain", "eventPanel");
  } else {
    drawEventPlaceholder({ x: panel.x + 4, y: panel.y + 4, width: panel.width - 8, height: panel.height - 8 }, "UPLOAD PANEL MISI");
  }
  ctx.restore();
}

function drawRechargeBottomShade() {
  const bottomFade = ctx.createLinearGradient(0, 1010, 0, 1250);
  bottomFade.addColorStop(0, "rgba(0, 20, 80, 0)");
  bottomFade.addColorStop(1, "rgba(0, 20, 80, 0.86)");
  ctx.fillStyle = bottomFade;
  ctx.fillRect(0, 1010, canvas.width, 240);
}

function drawEventPlaceholder(area, text) {
  const grad = ctx.createLinearGradient(area.x, area.y, area.x + area.width, area.y + area.height);
  grad.addColorStop(0, "rgba(22, 216, 255, 0.28)");
  grad.addColorStop(1, "rgba(7, 26, 98, 0.44)");
  ctx.fillStyle = grad;
  ctx.fillRect(area.x, area.y, area.width, area.height);
  ctx.textAlign = "center";
  strokeText(text, area.x + area.width / 2, area.y + area.height / 2, 34, 7);
}

function drawStarlightCharacter(image) {
  const area = { x: -80, y: 405, width: 660, height: 820 };
  ctx.save();
  ctx.beginPath();
  ctx.rect(-90, 360, 700, 900);
  ctx.clip();
  if (image) {
    drawAdjustedImage(image, area.x, area.y, area.width, area.height, "contain", "starlightCharacter");
  } else {
    drawEventPlaceholder(area, "UPLOAD KARAKTER");
  }
  ctx.restore();
}

function drawStarlightPreview(image) {
  const panel = { x: 505, y: 485, width: 520, height: 270 };
  ctx.save();
  ctx.shadowColor = "rgba(0, 216, 255, 0.55)";
  ctx.shadowBlur = 12;
  ctx.fillStyle = "rgba(9, 26, 65, 0.72)";
  ctx.strokeStyle = "#14dfff";
  ctx.lineWidth = 3;
  roundedRect(panel.x, panel.y, panel.width, panel.height, 18);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.save();
  roundedRect(panel.x + 4, panel.y + 4, panel.width - 8, panel.height - 8, 15);
  ctx.clip();
  if (image) {
    drawAdjustedImage(image, panel.x + 4, panel.y + 4, panel.width - 8, panel.height - 8, "cover", "starlightPreview");
  } else {
    drawEventPlaceholder({ x: panel.x + 4, y: panel.y + 4, width: panel.width - 8, height: panel.height - 8 }, "UPLOAD PREVIEW");
  }
  const shade = ctx.createLinearGradient(0, panel.y, 0, panel.y + panel.height);
  shade.addColorStop(0, "rgba(0,0,0,0)");
  shade.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = shade;
  ctx.fillRect(panel.x + 4, panel.y + 4, panel.width - 8, panel.height - 8);
  drawPlayerControls(panel.x, panel.y, panel.width, panel.height);
  ctx.restore();
}

function drawStarlightThumbs(leftImage, rightImage) {
  const topCards = [
    { x: 600, y: 795, width: 125, height: 205 },
    { x: 807, y: 795, width: 125, height: 205 }
  ];
  drawStarlightCard(topCards[0], leftImage, "LEFT");
  drawStarlightCard(topCards[1], rightImage, "RIGHT");
}

function drawStarlightCard(card, image, label) {
  ctx.save();
  ctx.fillStyle = "rgba(10, 42, 98, 0.82)";
  ctx.strokeStyle = "#14dfff";
  ctx.lineWidth = 3;
  roundedRect(card.x, card.y, card.width, card.height, 8);
  ctx.fill();
  ctx.stroke();
  roundedRect(card.x + 4, card.y + 4, card.width - 8, card.height - 8, 6);
  ctx.clip();
  if (image) {
    const layer = label === "LEFT" ? "starlightSkinLeft" : label === "RIGHT" ? "starlightSkinRight" : null;
    drawAdjustedImage(image, card.x + 4, card.y + 4, card.width - 8, card.height - 8, "cover", layer);
  } else {
    drawEventPlaceholder({ x: card.x + 4, y: card.y + 4, width: card.width - 8, height: card.height - 8 }, "SKIN");
  }
  ctx.restore();
}

function drawStarlightPrice(text) {
  const value = (text || "300 KADITA").toUpperCase();
  const parts = value.split(/\s+/);
  const number = parts[0] || "300";
  const hero = parts.slice(1).join(" ") || "KADITA";

  ctx.save();
  ctx.textAlign = "center";
  strokeText(number, 155, 515, 72, 9, "#ffffff", "#000000");
  ctx.fillStyle = "#ffffff";
  roundedRect(75, 540, 175, 42, 4);
  ctx.fill();
  ctx.fillStyle = "#000000";
  ctx.font = "900 italic 29px Inter, sans-serif";
  ctx.fillText(hero, 162, 570);
  ctx.restore();
}

function drawStarlightBadge() {
  ctx.save();
  ctx.translate(725, 1138);
  ctx.rotate(-0.08);
  if (starlightLogo.complete && starlightLogo.naturalWidth) {
    drawImageContain(starlightLogo, 0, 0, 255, 100);
  } else {
    ctx.fillStyle = "#f12bd6";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 5;
    roundedRect(0, 0, 190, 70, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 italic 46px Inter, sans-serif";
    ctx.fillText("STAR", 52, 49);
  }
  ctx.restore();
}

function drawPlayerControls(x, y, width, height) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.82)";
  ctx.lineWidth = 4;
  line(x + 68, y + height - 92, x + width - 68, y + height - 92);
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 48px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("II", x + width / 2, y + height - 42);
  ctx.font = "900 30px Inter, sans-serif";
  ctx.fillText("<<", x + width / 2 - 85, y + height - 45);
  ctx.fillText(">>", x + width / 2 + 85, y + height - 45);
  ctx.restore();
}

function drawStarlightTitle(kickerText, titleText, skinText) {
  const kicker = (kickerText || "NEW SKIN").toUpperCase();
  const title = (titleText || "STARLIGHT AGUSTUS").toUpperCase();
  const skin = (skinText || "KADITA - MAIDEN OF TIDE").toUpperCase();

  ctx.save();
  ctx.textAlign = "center";
  strokeText(kicker, 540, 192, 52, 10, "#ffffff", "#000000");

  const words = title.split(" ");
  const last = words.pop() || "AGUSTUS";
  const first = words.join(" ") || "STARLIGHT";
  let titleSize = 90;
  const maxTitleWidth = 960;
  const gap = 10;
  ctx.font = `400 ${titleSize}px Anton, Impact, sans-serif`;
  while (ctx.measureText(first).width + ctx.measureText(last).width + gap > maxTitleWidth && titleSize > 58) {
    titleSize -= 2;
    ctx.font = `400 ${titleSize}px Anton, Impact, sans-serif`;
  }

  const firstWidth = ctx.measureText(first).width;
  const totalWidth = firstWidth + ctx.measureText(last).width + gap;
  const titleX = (canvas.width - totalWidth) / 2;
  const titleY = 300;

  ctx.lineJoin = "round";
  ctx.lineWidth = 12;
  ctx.textAlign = "left";
  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#092067";
  ctx.strokeText(first, titleX, titleY);
  ctx.fillText(first, titleX, titleY);
  ctx.fillStyle = "#19dfff";
  ctx.strokeText(last, titleX + firstWidth + gap, titleY);
  ctx.fillText(last, titleX + firstWidth + gap, titleY);

  ctx.font = "900 italic 32px Inter, sans-serif";
  ctx.textAlign = "center";
  const pillWidth = Math.min(600, Math.max(380, ctx.measureText(skin).width + 86));
  const pillX = (canvas.width - pillWidth) / 2;
  const pillY = 338;
  ctx.fillStyle = "#ffd216";
  ctx.strokeStyle = "#8a6b00";
  ctx.lineWidth = 3;
  roundedRect(pillX, pillY, pillWidth, 58, 29);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 2;
  ctx.fillText(skin, 540, pillY + 39);
  ctx.restore();
}

function drawRechargeTitle(phaseText, titleText, eventText) {
  const phase = (phaseText || "PHASE 1").toUpperCase();
  const title = (titleText || "RECHARGE EVENT").toUpperCase();
  const event = (eventText || "SANRIO X MLBB").toUpperCase();

  ctx.save();
  ctx.textAlign = "center";
  strokeText(phase, 540, 190, 52, 10, "#ffffff", "#000000");

  const titleParts = title.includes("RECHARGE EVENT")
    ? ["RECHARGE", "EVENT"]
    : title.split(" ");
  const first = titleParts.slice(0, -1).join(" ") || "RECHARGE";
  const last = titleParts[titleParts.length - 1] || "EVENT";

  ctx.font = "400 98px Anton, Impact, sans-serif";
  ctx.lineJoin = "round";
  ctx.lineWidth = 12;
  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#092067";
  ctx.strokeText(first, 420, 295);
  ctx.fillText(first, 420, 295);

  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#19dfff";
  ctx.strokeText(last, 760, 295);
  ctx.fillText(last, 760, 295);

  ctx.font = "900 italic 32px Inter, sans-serif";
  const pillWidth = Math.min(520, Math.max(310, ctx.measureText(event).width + 86));
  const pillX = (canvas.width - pillWidth) / 2;
  const pillY = 326;
  ctx.fillStyle = "#ffd216";
  ctx.strokeStyle = "#8a6b00";
  ctx.lineWidth = 3;
  roundedRect(pillX, pillY, pillWidth, 58, 29);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 2;
  ctx.fillText(event, 540, pillY + 39);
  ctx.restore();
}

function drawVideoTemplate(data) {
  clearCanvas();
  drawBackground(data.theme, 150, 1810);
  drawDecorations(1920);
  drawTopLogo(data.badgeText);
  drawVideoTopTagline(data.topTagline);
  drawVideoSlot();
  drawHeadline(data.headline, 1330, 106, 86, 940, 3);
  drawSource(data.sourceText, 1660, 1700);
  drawWebsite(data.website, 1740);
  drawSideText(1560, 360);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBackground(theme, gridTop, gridBottom) {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, theme === "event" ? "#0040a8" : "#06145f");
  gradient.addColorStop(0.48, "#003f9f");
  gradient.addColorStop(1, "#031a64");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.strokeStyle = "#16d8ff";
  ctx.lineWidth = 2;
  for (let x = 110; x < canvas.width; x += 360) {
    line(x, 0, x, canvas.height);
  }
  for (let x = 110; x < canvas.width; x += 100) {
    line(x, gridTop, x, gridBottom);
  }
  for (let y = gridTop; y < gridBottom; y += 88) {
    line(0, y, canvas.width, y);
  }
  ctx.restore();

  drawGlow(820, 180, 330, "rgba(0,216,255,0.34)");
  drawGlow(190, 260, 280, "rgba(88,130,255,0.28)");
  drawCloud(90, canvas.height * 0.64, 1.15);
  drawCloud(935, canvas.height * 0.48, 0.82);
  drawCloud(930, 92, 0.65);
}

function drawHero(image, theme) {
  const heroHeight = theme === "event" ? 880 : 760;
  if (image) {
    drawAdjustedImage(image, 0, 0, canvas.width, heroHeight, "cover", "main");
  } else {
    const grad = ctx.createLinearGradient(0, 0, canvas.width, heroHeight);
    grad.addColorStop(0, "#273e9f");
    grad.addColorStop(0.5, "#38d8ff");
    grad.addColorStop(1, "#090d3d");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, heroHeight);

    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.ellipse(540, 350, 260, 330, -0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = "center";
    strokeText("UPLOAD GAMBAR HERO", 540, 350, 58, 8);
  }

  const dark = ctx.createLinearGradient(0, 480, 0, 850);
  dark.addColorStop(0, "rgba(0,0,0,0)");
  dark.addColorStop(0.65, "rgba(0,0,0,0.62)");
  dark.addColorStop(1, "rgba(0,0,0,0.78)");
  ctx.fillStyle = dark;
  ctx.fillRect(0, 450, canvas.width, 380);
}

function drawCollagePanel(image) {
  const panel = { x: 100, y: 98, width: 880, height: 1162 };

  ctx.save();
  ctx.shadowColor = "rgba(0, 216, 255, 0.5)";
  ctx.shadowBlur = 12;
  ctx.strokeStyle = "#14dfff";
  ctx.lineWidth = 3;
  ctx.fillStyle = "rgba(5, 18, 70, 0.36)";
  roundedRect(panel.x, panel.y, panel.width, panel.height, 0);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.rect(panel.x + 3, panel.y + 3, panel.width - 6, panel.height - 6);
  ctx.clip();
  if (image) {
    drawAdjustedImage(image, panel.x + 3, panel.y + 3, panel.width - 6, panel.height - 6, "cover", "main");
  } else {
    const grad = ctx.createLinearGradient(0, panel.y, 0, panel.y + panel.height);
    grad.addColorStop(0, "#2a88d4");
    grad.addColorStop(1, "#11215d");
    ctx.fillStyle = grad;
    ctx.fillRect(panel.x, panel.y, panel.width, panel.height);
    ctx.textAlign = "center";
    strokeText("UPLOAD GAMBAR GRID", 540, 650, 64, 9);
  }
  ctx.restore();

  const fade = ctx.createLinearGradient(0, panel.y + panel.height - 180, 0, panel.y + panel.height);
  fade.addColorStop(0, "rgba(0,0,0,0)");
  fade.addColorStop(1, "rgba(0,0,0,0.28)");
  ctx.fillStyle = fade;
  ctx.fillRect(panel.x + 3, panel.y + panel.height - 180, panel.width - 6, 177);
}

function drawImageOverlay() {
  ctx.fillStyle = "#00419e";
  roundedRect(0, 760, canvas.width, 590, 0);
  ctx.fill();

  const topLine = ctx.createLinearGradient(0, 760, canvas.width, 760);
  topLine.addColorStop(0, "#ffffff");
  topLine.addColorStop(0.5, "#16d8ff");
  topLine.addColorStop(1, "#ffffff");
  ctx.fillStyle = topLine;
  ctx.fillRect(0, 758, canvas.width, 4);

  const glow = ctx.createLinearGradient(0, 760, canvas.width, 1350);
  glow.addColorStop(0, "rgba(0,216,255,0.2)");
  glow.addColorStop(1, "rgba(0,0,80,0.35)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 760, canvas.width, 590);
}

function drawVideoSlot() {
  const slot = { x: 0, y: 430, width: 1080, height: 650 };
  ctx.save();
  ctx.fillStyle = "#06124a";
  ctx.fillRect(slot.x, slot.y, slot.width, slot.height);

  if (sourceVideo.readyState >= 2) {
    drawAdjustedImage(sourceVideo, slot.x, slot.y, slot.width, slot.height, "cover", "videoMain");
  } else {
    const grad = ctx.createLinearGradient(0, slot.y, 0, slot.y + slot.height);
    grad.addColorStop(0, "#1f7fab");
    grad.addColorStop(1, "#0c305e");
    ctx.fillStyle = grad;
    ctx.fillRect(slot.x, slot.y, slot.width, slot.height);
    ctx.textAlign = "center";
    strokeText("UPLOAD VIDEO", 540, slot.y + 320, 72, 9);
  }

  const shade = ctx.createLinearGradient(0, slot.y, 0, slot.y + slot.height);
  shade.addColorStop(0, "rgba(0,0,0,0.12)");
  shade.addColorStop(1, "rgba(0,0,0,0.26)");
  ctx.fillStyle = shade;
  ctx.fillRect(slot.x, slot.y, slot.width, slot.height);
  ctx.restore();
}

function drawTopLogo(text) {
  ctx.save();
  ctx.translate(420, 68);
  ctx.rotate(-0.04);
  drawLogoBadge(0, 0, 240, 120, text, 18);
  ctx.restore();
}

function drawTopLogoForImage(text) {
  ctx.save();
  ctx.translate(455, 26);
  ctx.rotate(-0.04);
  drawLogoBadge(0, 0, 170, 100, text, 13);
  ctx.restore();
}

function drawVideoTopTagline(text) {
  const lines = wrapText(text.toUpperCase(), 820, "Inter", 44);
  ctx.save();
  ctx.textAlign = "center";
  lines.slice(0, 2).forEach((lineText, index) => {
    strokeText(lineText, 540, 310 + index * 48, 44, 9);
  });
  ctx.restore();
}

function drawDecorations(height) {
  ctx.save();
  ctx.strokeStyle = "#21dcff";
  ctx.lineWidth = 8;
  ctx.globalAlpha = 0.95;
  circle(72, height * 0.72, 18);
  circle(1000, height * 0.83, 11);
  circle(755, height * 0.62, 10);
  circle(350, 18, 14);
  ctx.restore();

  drawSquares(64, 110);
  drawSquares(1000, 110);
  drawSquares(64, height - 84);
  drawSquares(1000, height - 84);

}

function drawBrandBadge(text, x, y, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  drawLogoBadge(0, 0, 175, 90, text, 12);
  ctx.restore();
}

function drawLogoBadge(x, y, width, height, text, padding) {
  ctx.fillStyle = "#08205f";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = Math.max(3, width * 0.012);
  roundedRect(x, y, width, height, 12);
  ctx.fill();
  ctx.stroke();

  if (kgoLogo.complete && kgoLogo.naturalWidth) {
    const subtitleSize = Math.max(13, width * 0.085);
    const subtitleGap = Math.max(8, height * 0.08);
    const logoHeight = height - padding * 2 - subtitleSize - subtitleGap;
    drawImageContainCrop(
      kgoLogo,
      kgoLogoCrop.x,
      kgoLogoCrop.y,
      kgoLogoCrop.width,
      kgoLogoCrop.height,
      x + padding,
      y + padding,
      width - padding * 2,
      logoHeight
    );
    ctx.fillStyle = "#ffffff";
    ctx.font = `900 ${subtitleSize}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(text.toUpperCase().slice(0, 18), x + width / 2, y + height - padding * 1.1);
    return;
  }

  drawLogoFallback(x, y, width, height, width * 0.23, width * 0.086);
}

function drawLogoFallback(x, y, width, height, titleSize, subtitleSize) {
  ctx.fillStyle = "#08205f";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = Math.max(3, width * 0.012);
  roundedRect(x, y, width, height, 12);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${titleSize}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("KGO", x + width / 2, y + height * 0.57);
  ctx.font = `800 ${subtitleSize}px Inter, sans-serif`;
  ctx.fillText("KGO SHOP", x + width / 2, y + height * 0.82);
}

function drawKicker(text) {
  ctx.save();
  ctx.textAlign = "right";
  ctx.font = "900 italic 50px Inter, sans-serif";
  const parts = text.toUpperCase().split(" ");
  const last = parts.pop() || "";
  const first = parts.join(" ");
  strokeText(`${first} `, 856, 817, 50, 7, "#ffffff", "#08205f");
  ctx.fillStyle = "#25dfff";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 5;
  ctx.strokeText(last, 1012, 817);
  ctx.fillText(last, 1012, 817);
  ctx.restore();
}

function drawSwipe(text, x, y, size) {
  ctx.save();
  ctx.textAlign = "right";
  strokeText(text.toUpperCase(), x, y, size, 9, "#ffffff", "#000000");
  ctx.fillStyle = "#2ee6ff";
  ctx.font = `900 italic ${size}px Inter, sans-serif`;
  ctx.fillText(">>", x, y);
  ctx.restore();
}

function drawHeadline(text, startY, lineHeight, size, maxWidth, maxLines) {
  const lines = wrapText(text.toUpperCase(), maxWidth, "Anton", size);

  ctx.save();
  ctx.textAlign = "center";
  lines.slice(0, maxLines).forEach((lineText, index) => {
    const y = startY + index * lineHeight;
    const highlight = canvas.height === 1350 && index >= Math.max(1, lines.length - 3);
    if (highlight) {
      const width = ctx.measureText(lineText).width + 26;
      ctx.fillStyle = "#ffffff";
      roundedRect((canvas.width - width) / 2, y - size + 7, width, size - 5, 0);
      ctx.fill();
      ctx.fillStyle = "#06256e";
      ctx.fillText(lineText, canvas.width / 2, y);
    } else {
      strokeText(lineText, canvas.width / 2, y, size, 8, "#ffffff", "#06256e", "Anton");
    }
  });
  ctx.restore();
}

function drawSource(text, quoteY, textY) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.font = "900 25px Inter, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText('"', 540, quoteY);
  ctx.fillText(text.toUpperCase(), 540, textY);
  ctx.restore();
}

function drawWebsite(text, y) {
  ctx.save();
  const width = 470;
  const height = 70;
  const x = (canvas.width - width) / 2;
  const centerY = y + height / 2;
  const contentOffset = -7;
  const iconX = x + 58 + contentOffset;
  const iconRadius = 25;
  ctx.fillStyle = "#050505";
  ctx.strokeStyle = "#19e2ff";
  ctx.lineWidth = 2;
  roundedRect(x, y, width, height, height / 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#1fe8ff";
  ctx.beginPath();
  ctx.arc(iconX, centerY, iconRadius, 0, Math.PI * 2);
  ctx.fill();

  drawBrowserIcon(iconX, centerY, iconRadius);

  ctx.fillStyle = "#001b42";
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 33px Inter, sans-serif";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(text, x + 96 + contentOffset, centerY + 1);
  ctx.textBaseline = "alphabetic";
  ctx.restore();
}

function drawBrowserIcon(x, y, radius) {
  ctx.save();
  ctx.strokeStyle = "#001b42";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.arc(x, y, radius * 0.55, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(x, y, radius * 0.24, radius * 0.55, 0, 0, Math.PI * 2);
  ctx.stroke();

  line(x - radius * 0.5, y, x + radius * 0.5, y);
  line(x - radius * 0.42, y - radius * 0.26, x + radius * 0.42, y - radius * 0.26);
  line(x - radius * 0.42, y + radius * 0.26, x + radius * 0.42, y + radius * 0.26);
  ctx.restore();
}

function drawSideText(leftY, rightY) {
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 18px Inter, sans-serif";
  ctx.translate(38, leftY);
  ctx.rotate(Math.PI / 2);
  ctx.fillText("KGO_SHOP", 0, 0);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 18px Inter, sans-serif";
  ctx.translate(1042, rightY);
  ctx.rotate(Math.PI / 2);
  ctx.fillText("KGO_SHOP", 0, 0);
  ctx.restore();
}

function updateCaption(data) {
  captionOutput.textContent = `${data.headline}

Top up diamond murah, cepat, aman, dan terpercaya hanya di KGO Shop.

Cek info lengkapnya di ${data.website}

#kgoshop #kgogaming #mlbb #mobilelegends #topupdiamond #diamondmlbb #newsmlbb`;
}

function drawImageCover(image, x, y, width, height) {
  const sourceWidth = image.videoWidth || image.width;
  const sourceHeight = image.videoHeight || image.height;
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const sw = width / scale;
  const sh = height / scale;
  const sx = (sourceWidth - sw) / 2;
  const sy = (sourceHeight - sh) / 2;
  ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
}

function drawImageContain(image, x, y, width, height) {
  const sourceWidth = image.videoWidth || image.width;
  const sourceHeight = image.videoHeight || image.height;
  const scale = Math.min(width / sourceWidth, height / sourceHeight);
  const dw = sourceWidth * scale;
  const dh = sourceHeight * scale;
  const dx = x + (width - dw) / 2;
  const dy = y + (height - dh) / 2;
  ctx.drawImage(image, dx, dy, dw, dh);
}

function drawAdjustedImage(image, x, y, width, height, fit, layer) {
  const sourceWidth = image.videoWidth || image.width;
  const sourceHeight = image.videoHeight || image.height;
  const adjustment = layer ? imageAdjustments[layer] : null;
  const zoom = adjustment ? adjustment.zoom : 1;
  const baseScale = fit === "cover"
    ? Math.max(width / sourceWidth, height / sourceHeight)
    : Math.min(width / sourceWidth, height / sourceHeight);
  const scale = baseScale * zoom;
  const dw = sourceWidth * scale;
  const dh = sourceHeight * scale;
  const dx = x + (width - dw) / 2 + (adjustment ? adjustment.x : 0);
  const dy = y + (height - dh) / 2 + (adjustment ? adjustment.y : 0);
  ctx.drawImage(image, dx, dy, dw, dh);
}

function drawImageContainCrop(image, sx, sy, sw, sh, x, y, width, height) {
  const scale = Math.min(width / sw, height / sh);
  const dw = sw * scale;
  const dh = sh * scale;
  const dx = x + (width - dw) / 2;
  const dy = y + (height - dh) / 2;
  ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
}

function drawCloud(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.globalAlpha = 0.72;
  ctx.fillStyle = "#ffffff";
  for (const [cx, cy, r] of [[0, 12, 40], [42, 0, 52], [95, 16, 45], [134, 22, 34]]) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawGlow(x, y, radius, color) {
  const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
  glow.addColorStop(0, color);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

function drawSquares(x, y) {
  ctx.fillStyle = "#ffffff";
  const size = 18;
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 2; col += 1) {
      ctx.fillRect(x + col * 29, y + row * 29, size, size);
    }
  }
}

function wrapText(text, maxWidth, family, size) {
  ctx.font = family === "Anton"
    ? `400 ${size}px Anton, Impact, sans-serif`
    : `900 italic ${size}px Inter, sans-serif`;
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines = [];
  let lineText = "";

  words.forEach((word) => {
    const testLine = lineText ? `${lineText} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && lineText) {
      lines.push(lineText);
      lineText = word;
    } else {
      lineText = testLine;
    }
  });

  if (lineText) lines.push(lineText);
  return lines;
}

function strokeText(text, x, y, size, strokeWidth, fill = "#ffffff", stroke = "#071a62", family = "Inter") {
  ctx.font = family === "Anton"
    ? `400 ${size}px Anton, Impact, sans-serif`
    : `900 italic ${size}px Inter, sans-serif`;
  ctx.lineJoin = "round";
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = stroke;
  ctx.fillStyle = fill;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

function roundedRect(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

function circle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function line(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function renderVideoLoop() {
  drawPoster();
  if (!sourceVideo.paused && !sourceVideo.ended) {
    animationFrame = requestAnimationFrame(renderVideoLoop);
  }
}

async function exportVideo() {
  if (!sourceVideo.src) {
    videoStatus.textContent = "Upload video dulu sebelum export.";
    return;
  }
  if (!window.MediaRecorder || !canvas.captureStream) {
    videoStatus.textContent = "Browser ini belum mendukung export video canvas.";
    return;
  }

  const exportTypes = [
    { mimeType: "video/mp4;codecs=h264,aac", extension: "mp4" },
    { mimeType: "video/mp4", extension: "mp4" },
    { mimeType: "video/webm;codecs=vp9", extension: "webm" },
    { mimeType: "video/webm", extension: "webm" }
  ];
  const exportType = exportTypes.find((type) => MediaRecorder.isTypeSupported(type.mimeType)) || exportTypes[3];
  const stream = canvas.captureStream(30);
  const videoStream = sourceVideo.captureStream ? sourceVideo.captureStream() : null;
  if (videoStream) {
    videoStream.getAudioTracks().forEach((track) => stream.addTrack(track));
  }
  const chunks = [];
  const recorder = new MediaRecorder(stream, { mimeType: exportType.mimeType, videoBitsPerSecond: 9000000 });

  recorder.ondataavailable = (event) => {
    if (event.data.size) chunks.push(event.data);
  };
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: exportType.mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kgo-shop-video-template.${exportType.extension}`;
    link.click();
    URL.revokeObjectURL(url);
    videoStatus.textContent = "Export selesai. File WEBM sudah diunduh.";
    exportVideoButton.disabled = false;
  };

  exportVideoButton.disabled = true;
  videoStatus.textContent = "Export berjalan, tunggu sampai video selesai...";
  sourceVideo.currentTime = 0;
  sourceVideo.muted = true;
  await sourceVideo.play();
  renderVideoLoop();
  recorder.start();

  const stopRecording = () => {
    if (recorder.state !== "inactive") recorder.stop();
    sourceVideo.pause();
  };
  sourceVideo.addEventListener("ended", stopRecording, { once: true });

  const maxDuration = Number.isFinite(sourceVideo.duration) ? sourceVideo.duration : 20;
  window.setTimeout(stopRecording, Math.min(maxDuration * 1000 + 300, 60000));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  drawPoster();
});

Object.values(fields).forEach((field) => {
  field.addEventListener("input", drawPoster);
});

fields.theme.addEventListener("change", () => {
  if (fields.theme.value === "event") {
    if (fields.headline.value.includes("SKIN EPIC") || fields.headline.value.includes("SECARA GRATIS")) {
      fields.headline.value = "RECHARGE EVENT";
    }
    if (fields.kicker.value === "NEWS MLBB") fields.kicker.value = "PHASE 1";
    if (fields.swipeText.value === "SWIPE>>") fields.swipeText.value = "SANRIO X MLBB";
  }
  if (fields.theme.value === "starlight") {
    if (fields.headline.value.includes("SKIN EPIC") || fields.headline.value === "RECHARGE EVENT") {
      fields.headline.value = "STARLIGHT AGUSTUS";
    }
    if (fields.kicker.value === "NEWS MLBB" || fields.kicker.value.startsWith("PHASE")) {
      fields.kicker.value = "NEW SKIN";
    }
    if (fields.swipeText.value === "SWIPE>>" || fields.swipeText.value.includes("MLBB")) {
      fields.swipeText.value = "KADITA - MAIDEN OF TIDE";
    }
    if (fields.sourceText.value === "SC VT: VOLTA") fields.sourceText.value = "300 KADITA";
  }
  drawPoster();
});

adjustLayerInput.addEventListener("change", syncAdjustmentControls);

adjustXInput.addEventListener("input", () => {
  const adjustment = getActiveAdjustment();
  adjustment.x = Number(adjustXInput.value);
  drawPoster();
});

adjustYInput.addEventListener("input", () => {
  const adjustment = getActiveAdjustment();
  adjustment.y = Number(adjustYInput.value);
  drawPoster();
});

adjustZoomInput.addEventListener("input", () => {
  const adjustment = getActiveAdjustment();
  adjustment.zoom = Number(adjustZoomInput.value) / 100;
  drawPoster();
});

resetAdjustButton.addEventListener("click", () => {
  const adjustment = getActiveAdjustment();
  adjustment.x = 0;
  adjustment.y = 0;
  adjustment.zoom = 1;
  syncAdjustmentControls();
  drawPoster();
});

imageInput.addEventListener("change", () => {
  loadImageFromInput(imageInput, (image) => {
    heroImage = image;
  });
});

eventCharacterInput.addEventListener("change", () => {
  loadImageFromInput(eventCharacterInput, (image) => {
    eventCharacterImage = image;
    adjustLayerInput.value = "eventCharacter";
    syncAdjustmentControls();
  });
});

eventPanelInput.addEventListener("change", () => {
  loadImageFromInput(eventPanelInput, (image) => {
    eventPanelImage = image;
    adjustLayerInput.value = "eventPanel";
    syncAdjustmentControls();
  });
});

starlightCharacterInput.addEventListener("change", () => {
  loadImageFromInput(starlightCharacterInput, (image) => {
    starlightCharacterImage = image;
  });
});

starlightPreviewInput.addEventListener("change", () => {
  loadImageFromInput(starlightPreviewInput, (image) => {
    starlightPreviewImage = image;
  });
});

starlightSkinLeftInput.addEventListener("change", () => {
  loadImageFromInput(starlightSkinLeftInput, (image) => {
    starlightSkinLeftImage = image;
  });
});

starlightSkinRightInput.addEventListener("change", () => {
  loadImageFromInput(starlightSkinRightInput, (image) => {
    starlightSkinRightImage = image;
  });
});

videoInput.addEventListener("change", () => {
  const file = videoInput.files[0];
  if (!file) return;
  if (videoObjectUrl) URL.revokeObjectURL(videoObjectUrl);
  videoObjectUrl = URL.createObjectURL(file);
  sourceVideo.src = videoObjectUrl;
  sourceVideo.load();
  adjustLayerInput.value = "videoMain";
  syncAdjustmentControls();
  videoStatus.textContent = "Video siap. Klik Preview video atau Export WEBM.";
});

sourceVideo.addEventListener("loadedmetadata", drawPoster);
sourceVideo.addEventListener("play", renderVideoLoop);
sourceVideo.addEventListener("pause", () => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  drawPoster();
});

playVideoButton.addEventListener("click", async () => {
  if (!sourceVideo.src) {
    videoStatus.textContent = "Upload video dulu untuk preview.";
    return;
  }
  if (sourceVideo.paused) {
    sourceVideo.muted = true;
    await sourceVideo.play();
    playVideoButton.textContent = "Pause preview";
  } else {
    sourceVideo.pause();
    playVideoButton.textContent = "Preview video";
  }
});

sourceVideo.addEventListener("ended", () => {
  playVideoButton.textContent = "Preview video";
});

downloadButton.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "kgo-shop-poster.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

exportVideoButton.addEventListener("click", exportVideo);

drawPoster();
syncAdjustmentControls();

function loadImageFromInput(input, setImage) {
  const file = input.files[0];
  if (!file) return;

  const image = new Image();
  image.onload = () => {
    setImage(image);
    URL.revokeObjectURL(image.src);
    drawPoster();
  };
  image.src = URL.createObjectURL(file);
}

function getActiveAdjustment() {
  return imageAdjustments[adjustLayerInput.value] || imageAdjustments.main;
}

function syncAdjustmentControls() {
  const adjustment = getActiveAdjustment();
  adjustXInput.value = String(adjustment.x);
  adjustYInput.value = String(adjustment.y);
  adjustZoomInput.value = String(Math.round(adjustment.zoom * 100));
}
